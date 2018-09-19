const async = require('async')
const common = require('../lib/common')
const ballMovement = require('../lib/ballMovement')
const setPositions = require('../lib/setPositions')
const actions = require('../lib/actions')

function decideMovement(closestPlayer, team, opposition, matchDetails) {
  return new Promise(function(resolve, reject) {
    async.eachSeries(
      team.players,
      function eachPlayer(thisPlayer, thisPlayerCallback) {
        let ballToPlayerX = thisPlayer.startPOS[0] - matchDetails.ball.position[0]
        let ballToPlayerY = thisPlayer.startPOS[1] - matchDetails.ball.position[1]
        actions.findPossibleActions(thisPlayer, opposition, ballToPlayerX, ballToPlayerY, matchDetails).then(function(possibleActions) {
          actions.selectAction(possibleActions).then(function(action) {
            let providedAction = (thisPlayer.action) ? thisPlayer.action : 'unassigned'
            const allActions = ['shoot', 'throughBall', 'pass', 'cross', 'tackle', 'intercept', 'slide', 'run', 'sprint', 'cleared', 'boot']
            if (allActions.includes(providedAction)) {
              if (thisPlayer.name !== matchDetails.ball.Player) {
                if (providedAction === 'shoot' || providedAction === 'throughBall' || providedAction === 'pass' || providedAction === 'cross' || providedAction === 'cleared' || providedAction === 'boot') {
                  const notice = `${thisPlayer.name} doesnt have the ball so cannot ${providedAction} -action: run`
                  console.error(notice)
                  action = 'run'
                } else {
                  action = providedAction
                }
              } else if (providedAction === 'tackle' || providedAction === 'slide' || providedAction === 'intercept') {
                console.error('Player: ', thisPlayer.name, ' has the ball so cannot ', providedAction, ' player action now to run')
                const actions = ['shoot', 'throughBall', 'pass', 'cross', 'cleared', 'boot']
                action = actions[common.getRandomNumber(0, 5)]
              } else {
                action = providedAction
              }
            } else if (thisPlayer.action !== 'none') {
              const error = `Invalid player action for ${thisPlayer.name}`
              reject(error)
            } else if (matchDetails.ball.withTeam !== team.name) {
              if (closestPlayer.name === thisPlayer.name) {
                if (action !== 'tackle' && action !== 'slide' && action !== 'intercept') {
                  action = 'sprint'
                }
                if (common.isBetween(ballToPlayerX, -30, 30) === false) {
                  if (ballToPlayerX > 29) {
                    ballToPlayerX = 29
                  } else {
                    ballToPlayerX = -29
                  }
                }
                if (common.isBetween(ballToPlayerY, -30, 30) === false) {
                  if (ballToPlayerY > 29) {
                    ballToPlayerY = 29
                  } else {
                    ballToPlayerY = -29
                  }
                }
              }
            }
            makeMovement(thisPlayer, action, opposition, ballToPlayerX, ballToPlayerY, matchDetails).then(function(move) {
              //let output = `Player Name: ${thisPlayer.name}, Origin Position: ${thisPlayer.originPOS}, Ball Position: ${matchDetails.ball.position}, Player to ball X: ${ballToPlayerX}, Player to ball Y: ${ballToPlayerY}, \n Player Has Ball: ${thisPlayer.hasBall}, Action: ${action}, Movement: ${move}`
              let intendedMovementX = thisPlayer.startPOS[0] + move[0]
              let intendedMovementY = thisPlayer.startPOS[1] + move[1]
              if (intendedMovementX < matchDetails.pitchSize[0] + 1 && intendedMovementX > -1) {
                let newXpos = thisPlayer.startPOS[0] + move[0]
                thisPlayer.startPOS[0] = newXpos
              }
              if (intendedMovementY < matchDetails.pitchSize[1] + 1 && intendedMovementY > -1) {
                let newYpos = thisPlayer.startPOS[1] + move[1]
                thisPlayer.startPOS[1] = newYpos
              }
              if (common.isBetween(thisPlayer.startPOS[0], matchDetails.ball.position[0] - 3, matchDetails.ball.position[0] + 3) && common.isBetween(thisPlayer.startPOS[1], matchDetails.ball.position[1] - 3, matchDetails.ball.position[1] + 3) && matchDetails.ball.withTeam !== team.name) {
                if (thisPlayer.startPOS[0] === matchDetails.ball.position[0] && thisPlayer.startPOS[1] === matchDetails.ball.position[1]) {
                  if (matchDetails.ball.withPlayer === true && thisPlayer.hasBall === false && matchDetails.ball.withTeam !== team.name) {
                    if (action === 'tackle') {
                      actions.resolveTackle(thisPlayer, team, opposition, matchDetails).then(function(foul) {
                        if (foul) {
                          let intensity = actions.foulIntensity()
                          if (common.isBetween(intensity, 75, 90)) {
                            thisPlayer.cards.yellow++
                          } else if (common.isBetween(intensity, 90, 100)) {
                            thisPlayer.cards.red++
                          }
                          setPositions.setSetpiece(matchDetails, opposition, team).then(function() {
                            // do nothing
                          }).catch(function(err) {
                            const error = `Error whilst setting up the set piece: ${err}`
                            reject(error)
                          })
                        }
                      }).catch(function(err) {
                        const error = `Error whilst resolving possession: ${err}`
                        reject(error)
                      })
                    }
                  } else {
                    thisPlayer.hasBall = true
                    matchDetails.ball.ballOverIterations = []
                    matchDetails.ball.Player = thisPlayer.name
                    matchDetails.ball.withPlayer = true
                    matchDetails.ball.withTeam = team.name
                    team.intent = 'attack'
                    opposition.intent = 'defend'
                    if (thisPlayer.offside) {
                      matchDetails.iterationLog.push(thisPlayer.name, ' is offside ')
                      setPositions.setSetpiece(matchDetails, team, opposition).then(function() {
                        //do nothing
                      }).catch(function(err) {
                        const error = `Error whilst setting up the set piece: ${err}`
                        reject(error)
                      })
                    }
                  }
                } else if (matchDetails.ball.withPlayer === true && thisPlayer.hasBall === false && matchDetails.ball.withTeam !== team.name) {
                  if (action === 'slide') {
                    actions.resolveSlide(thisPlayer, team, opposition, matchDetails).then(function(foul) {
                      if (foul) {
                        let intensity = actions.foulIntensity()
                        if (common.isBetween(intensity, 65, 90)) {
                          thisPlayer.cards.yellow++
                        } else if (common.isBetween(intensity, 85, 100)) {
                          thisPlayer.cards.red++
                        }
                        setPositions.setSetpiece(matchDetails, opposition, team).then(function() {
                          // do nothing
                        }).catch(function(err) {
                          const error = `Error whilst setting up the set piece: ${err}`
                          reject(error)
                        })
                      }
                    }).catch(function(err) {
                      const error = `Error whilst resolving posession during slide: ${err}`
                      reject(error)
                    })
                  }
                } else {
                  thisPlayer.hasBall = true
                  matchDetails.ball.ballOverIterations = []
                  matchDetails.ball.Player = thisPlayer.name
                  matchDetails.ball.withPlayer = true
                  matchDetails.ball.withTeam = team.name
                  team.intent = 'attack'
                  opposition.intent = 'defend'
                  if (thisPlayer.offside) {
                    matchDetails.iterationLog.push(thisPlayer.name, ' is offside ')
                    setPositions.setSetpiece(matchDetails, team, opposition).then(function() {
                      //do nothing
                    }).catch(function(err) {
                      const error = `Error whilst setting up the set piece: ${err}`
                      reject(error)
                    })
                  }
                }
              }
              if (thisPlayer.hasBall === true) {
                ballMovement.getBallDirection(matchDetails, thisPlayer.startPOS).then(function() {
                  let tempArray = thisPlayer.startPOS
                  matchDetails.ball.position = tempArray.map(x => x)
                  matchDetails.ball.position[2] = 0
                  if (action === 'shoot' || action === 'pass' || action === 'cross' || action === 'throughBall' || action === 'cleared' || action === 'boot') {
                    thisPlayer.hasBall = false
                    matchDetails.ball.withPlayer = false
                    team.intent = 'attack'
                    opposition.intent = 'attack'
                    matchDetails.ball.Player = ''
                    matchDetails.ball.withTeam = ''
                    if (action === 'cleared' || action === 'boot') {
                      ballMovement.ballKicked(matchDetails, thisPlayer).then(function(newPosition) {
                        let tempPosition = newPosition.map(x => x)
                        matchDetails.ball.position = tempPosition
                        matchDetails.ball.position[2] = 0
                        thisPlayerCallback()
                      }).catch(function(err) {
                        const error = `Error calling ball kicked: ${err}`
                        reject(error)
                      })
                    } else if (action === 'pass' || action === 'cross') {
                      ballMovement.ballPassed(matchDetails, team, thisPlayer).then(function(newPosition) {
                        matchDetails.iterationLog.push(`passed to new position: ${newPosition}`)
                        let tempPosition = newPosition.map(x => x)
                        matchDetails.ball.position = tempPosition
                        matchDetails.ball.position[2] = 0
                        thisPlayerCallback()
                      }).catch(function(err) {
                        const error = `Error calling ball passed: ${err}`
                        reject(error)
                      })
                    } else if (action === 'throughBall') {
                      ballMovement.throughBall(matchDetails, team, thisPlayer).then(function(newPosition) {
                        let tempPosition = newPosition.map(x => x)
                        matchDetails.ball.position = tempPosition
                        matchDetails.ball.position[2] = 0
                        thisPlayerCallback()
                      }).catch(function(err) {
                        const error = `Error calling through ball: ${err}`
                        reject(error)
                      })
                    } else if (action === 'shoot') {
                      ballMovement.shotMade(matchDetails, team, opposition, thisPlayer).then(function(newPosition) {
                        let tempPosition = newPosition.map(x => x)
                        matchDetails.ball.position = tempPosition
                        matchDetails.ball.position[2] = 0
                        thisPlayerCallback()
                      }).catch(function(err) {
                        const error = `Error calling shot made: ${err}`
                        reject(error)
                      })
                    }
                  } else {
                    thisPlayerCallback()
                  }
                }).catch(function(err) {
                  const error = `Error getting the ball direction: ${err}`
                  reject(error)
                })
              } else {
                thisPlayerCallback()
              }
              //output += `, Injured?: ${thisPlayer.injured}, Relative Position: ${thisPlayer.relativePOS}, Final Position: ${thisPlayer.startPOS}, Intent: ${team.intent}`
              //iterationLog.push(output);
            }).catch(function(err) {
              const error = `Error calling ball movement: ${err}`
              reject(error)
            })
          }).catch(function(err) {
            const error = `Error calling select action: ${err}`
            reject(error)
          })
        }).catch(function(err) {
          const error = `Error finding possible actions: ${err}`
          reject(error)
        })
      },
      function afterAllPlayers() {
        return resolve(team)
      }
    )
  })
}

function makeMovement(player, action, opposition, ballX, ballY, matchDetails) {
  return new Promise(function(resolve, reject) {
    let move = []
    if (action === 'wait') {
      move[0] = 0
      move[1] = 0
      return resolve(move)
    } else if (action === 'shoot' || action === 'pass' || action === 'cross' || action === 'throughBall' || action === 'cleared' || action === 'boot') {
      move[0] = 0
      move[1] = 0
      return resolve(move)
    } else if (action === 'tackle' || action === 'slide') {
      if (ballX > 0) {
        move[0] = -1
      } else if (ballX === 0) {
        move[0] = 0
      } else if (ballX < 0) {
        move[0] = 1
      }
      if (ballY > 0) {
        move[1] = -1
      } else if (ballY === 0) {
        move[1] = 0
      } else if (ballY < 0) {
        move[1] = 1
      }
      return resolve(move)
    } else if (action === 'intercept') {
      setPositions.closestPlayerToPosition('name', opposition, matchDetails.ball.position).then(function(playerInformation) {
        let interceptPlayer = playerInformation.thePlayer
        const [interceptX, interceptY] = interceptPlayer.startPOS
        let interceptionPosition = []
        let interceptPlayerToBallX = interceptX - matchDetails.ball.position[0]
        let interceptPlayerToBallY = interceptY - matchDetails.ball.position[1]
        if (interceptPlayerToBallX === 0) {
          if (interceptPlayerToBallY === 0) {
            move[0] = 0
            move[1] = 0
          } else if (interceptPlayerToBallY < 0) {
            interceptionPosition[0] = interceptX
            interceptionPosition[1] = interceptY + 1
          } else if (interceptPlayerToBallY > 0) {
            interceptionPosition[0] = interceptX
            interceptionPosition[1] = interceptY - 1
          }
        } else if (interceptPlayerToBallY === 0) {
          if (interceptPlayerToBallX < 0) {
            interceptionPosition[0] = interceptX + 1
            interceptionPosition[1] = interceptY
          } else if (interceptPlayerToBallX > 0) {
            interceptionPosition[0] = interceptX - 1
            interceptionPosition[1] = interceptY
          }
        } else if (interceptPlayerToBallX < 0 && interceptPlayerToBallY < 0) {
          interceptionPosition[0] = interceptX + 1
          interceptionPosition[1] = interceptY + 1
        } else if (interceptPlayerToBallX > 0 && interceptPlayerToBallY > 0) {
          interceptionPosition[0] = interceptX - 1
          interceptionPosition[1] = interceptY - 1
        } else if (interceptPlayerToBallX > 0 && interceptPlayerToBallY < 0) {
          interceptionPosition[0] = interceptX - 1
          interceptionPosition[1] = interceptY + 1
        } else if (interceptPlayerToBallX < 0 && interceptPlayerToBallY > 0) {
          interceptionPosition[0] = interceptX + 1
          interceptionPosition[1] = interceptY - 1
        }
        //set movement to the new interception position
        let interceptPositionX = player.startPOS[0] - interceptionPosition[0]
        let interceptPositionY = player.startPOS[1] - interceptionPosition[1]
        if (interceptPositionX === 0) {
          if (interceptPositionY === 0) {
            move[0] = 0
            move[1] = 0
          } else if (interceptPositionY < 0) {
            move[0] = 0
            move[1] = 1
          } else if (interceptPositionY > 0) {
            move[0] = 0
            move[1] = -1
          }
        } else if (interceptPositionY === 0) {
          if (interceptPositionX < 0) {
            move[0] = 1
            move[1] = 0
          } else if (interceptPositionX > 0) {
            move[0] = -1
            move[1] = 0
          }
        } else if (interceptPositionX < 0 && interceptPositionY < 0) {
          move[0] = 1
          move[1] = 1
        } else if (interceptPositionX > 0 && interceptPositionY > 0) {
          move[0] = -1
          move[1] = -1
        } else if (interceptPositionX > 0 && interceptPositionY < 0) {
          move[0] = -1
          move[1] = 1
        } else if (interceptPositionX < 0 && interceptPositionY > 0) {
          move[0] = 1
          move[1] = -1
        }
        return resolve(move)
      }).catch(function(err) {
        const error = `Error when getting the closest opposition player: ${err}`
        reject(error)
      })
    } else if (action === 'run') {
      if (player.fitness > 20) {
        player.fitness = common.round(player.fitness - 0.005, 6)
      }
      if (player.hasBall) {
        if (player.originPOS[1] > matchDetails.pitchSize[1] / 2) {
          move[0] = common.getRandomNumber(0, 2)
          move[1] = common.getRandomNumber(0, 2)
        } else {
          move[0] = common.getRandomNumber(-2, 0)
          move[1] = common.getRandomNumber(-2, 0)
        }
        return resolve(move)
      }
      let movementRun = [-1, 0, 1]
      if (common.isBetween(ballX, -30, 30) && common.isBetween(ballY, -30, 30)) {
        if (common.isBetween(ballX, -30, 1)) {
          move[0] = movementRun[common.getRandomNumber(1, 2)]
        } else if (common.isBetween(ballX, -1, 30)) {
          move[0] = movementRun[common.getRandomNumber(0, 1)]
        } else {
          move[0] = movementRun[common.getRandomNumber(1, 1)]
        }
        if (common.isBetween(ballY, -30, 1)) {
          move[1] = movementRun[common.getRandomNumber(1, 2)]
        } else if (common.isBetween(ballY, -1, 30)) {
          move[1] = movementRun[common.getRandomNumber(0, 1)]
        } else {
          move[1] = movementRun[common.getRandomNumber(1, 1)]
        }
        return resolve(move)
      }
      setPositions.formationCheck(player.relativePOS, player.startPOS).then(function(formationDirection) {
        if (formationDirection[0] === 0) {
          move[0] = movementRun[common.getRandomNumber(1, 1)]
        } else if (formationDirection[0] < 0) {
          move[0] = movementRun[common.getRandomNumber(0, 1)]
        } else if (formationDirection[0] > 0) {
          move[0] = movementRun[common.getRandomNumber(1, 2)]
        }
        if (formationDirection[1] === 0) {
          move[1] = movementRun[common.getRandomNumber(1, 1)]
        } else if (formationDirection[1] < 0) {
          move[1] = movementRun[common.getRandomNumber(0, 1)]
        } else if (formationDirection[1] > 0) {
          move[1] = movementRun[common.getRandomNumber(1, 2)]
        }
        return resolve(move)
      }).catch(function(err) {
        const error = `couldnt check formation when running${err}`
        reject(error)
      })
    } else if (action === 'sprint') {
      if (player.fitness > 30) {
        player.fitness = common.round(player.fitness - 0.01, 6)
      }
      let movementSprint = [-2, -1, 0, 1, 2]
      if (common.isBetween(ballX, -30, 30) && common.isBetween(ballY, -30, 30)) {
        if (common.isBetween(ballX, -30, 1)) {
          move[0] = movementSprint[common.getRandomNumber(2, 4)]
        } else if (common.isBetween(ballX, -1, 30)) {
          move[0] = movementSprint[common.getRandomNumber(0, 2)]
        } else {
          move[0] = movementSprint[common.getRandomNumber(2, 2)]
        }
        if (common.isBetween(ballY, -30, 1)) {
          move[1] = movementSprint[common.getRandomNumber(2, 4)]
        } else if (common.isBetween(ballY, -1, 30)) {
          move[1] = movementSprint[common.getRandomNumber(0, 2)]
        } else {
          move[1] = movementSprint[common.getRandomNumber(2, 2)]
        }
        return resolve(move)
      }
      setPositions.formationCheck(player.relativePOS, player.startPOS).then(function(formationDirection) {
        if (formationDirection[0] === 0) {
          move[0] = movementSprint[common.getRandomNumber(2, 2)]
        } else if (formationDirection[0] < 0) {
          move[0] = movementSprint[common.getRandomNumber(0, 2)]
        } else if (formationDirection[0] > 0) {
          move[0] = movementSprint[common.getRandomNumber(2, 4)]
        }
        if (formationDirection[1] === 0) {
          move[1] = movementSprint[common.getRandomNumber(2, 2)]
        } else if (formationDirection[1] < 0) {
          move[1] = movementSprint[common.getRandomNumber(0, 2)]
        } else if (formationDirection[1] > 0) {
          move[1] = movementSprint[common.getRandomNumber(2, 4)]
        }
        return resolve(move)
      }).catch(function(err) {
        const error = `error calling formation check when sprinting${err}`
        reject(error)
      })
    }
  })
}

function closestPlayerToBall(closestPlayer, team, matchDetails) {
  return new Promise(function(resolve, reject) {
    let closestPlayerDetails
    async.eachSeries(team.players, function eachPlayer(thisPlayer, thisPlayerACallback) {
      let ballToPlayerX = thisPlayer.startPOS[0] - matchDetails.ball.position[0]
      let ballToPlayerY = thisPlayer.startPOS[1] - matchDetails.ball.position[1]
      let proximityToBall = Math.abs(ballToPlayerX + ballToPlayerY)
      if (proximityToBall < closestPlayer.position) {
        closestPlayer.name = thisPlayer.name
        closestPlayer.position = proximityToBall
        closestPlayerDetails = thisPlayer
      }
      thisPlayerACallback()
    }, function afterAllAPlayers() {
      setPositions.setRelativePosition(closestPlayerDetails, team, matchDetails).then(function() {
        matchDetails.iterationLog.push(`Closest Player to ball: ${closestPlayerDetails.name}`)
        return resolve()
      }).catch(function(err) {
        const error = `Error when setting relative positions: ${err}`
        return reject(error)
      })
    })
  })
}

function checkOffside(team1, team2, matchDetails) {
  return new Promise(function(resolve) {
    const { ball } = matchDetails
    const { pitchSize } = matchDetails
    const team1side = (team1.players[0].originPOS[1] < (pitchSize[1] / 2)) ? 'top' : 'bottom'
    const team2side = (team2.players[0].originPOS[1] < (pitchSize[1] / 2)) ? 'top' : 'bottom'
    if (common.isBetween(ball.position[1], 0, (pitchSize[1] / 2))) {
      if (ball.withTeam == team1.name && team1side == 'top') {
        //do nothing. Team are in their own half
        return resolve()
      } else if (ball.withTeam == team1.name && team1side == 'bottom') {
        offsideYPOS(team2, 'top', pitchSize[1]).then(function(offsideYposition) {
          async.eachSeries(team1.players, function(thisPlayer, thisPlayerCallback) {
            thisPlayer.offside = false
            if (common.isBetween(thisPlayer.startPOS[1], offsideYposition.pos1, offsideYposition.pos2)) {
              if (thisPlayer.hasBall) {
                thisPlayerCallback()
              } else {
                thisPlayer.offside = true
                console.log(thisPlayer.name, ' is offside')
                thisPlayerCallback()
              }
            } else {
              thisPlayerCallback()
            }
          }, function afterAllPlayers() {
            return resolve()
          })
        })
      } else if (ball.withTeam == team2.name && team2side == 'top') {
        //do nothing. Team are in their own half
        return resolve()
      } else if (ball.withTeam == team2.name && team2side == 'bottom') {
        offsideYPOS(team2, 'top', pitchSize[1]).then(function(offsideYposition) {
          async.eachSeries(team1.players, function(thisPlayer, thisPlayerCallback) {
            thisPlayer.offside = false
            if (common.isBetween(thisPlayer.startPOS[1], offsideYposition.pos1, offsideYposition.pos2)) {
              if (thisPlayer.hasBall) {
                thisPlayerCallback()
              } else {
                thisPlayer.offside = true
                console.log(thisPlayer.name, ' is offside')
                thisPlayerCallback()
              }
            } else {
              thisPlayerCallback()
            }
          }, function afterAllPlayers() {
            return resolve()
          })
        })
      } else {
        //nobody has the ball
        return resolve()
      }
    } else if (ball.withTeam == team1.name && team1side == 'bottom') {
      //do nothing. Team are in their own half
      return resolve()
    } else if (ball.withTeam == team1.name && team1side == 'top') {
      offsideYPOS(team2, 'top', pitchSize[1]).then(function(offsideYposition) {
        async.eachSeries(team1.players, function(thisPlayer, thisPlayerCallback) {
          thisPlayer.offside = false
          if (common.isBetween(thisPlayer.startPOS[1], offsideYposition.pos1, offsideYposition.pos2)) {
            if (thisPlayer.hasBall) {
              thisPlayerCallback()
            } else {
              thisPlayer.offside = true
              console.log(thisPlayer.name, ' is offside')
              thisPlayerCallback()
            }
          } else {
            thisPlayerCallback()
          }
        }, function afterAllPlayers() {
          return resolve()
        })
      })
    } else if (ball.withTeam == team2.name && team2side == 'bottom') {
      //do nothing. Team are in their own half
      return resolve()
    } else if (ball.withTeam == team2.name && team2side == 'top') {
      offsideYPOS(team2, 'top', pitchSize[1]).then(function(offsideYposition) {
        async.eachSeries(team1.players, function(thisPlayer, thisPlayerCallback) {
          thisPlayer.offside = false
          if (common.isBetween(thisPlayer.startPOS[1], offsideYposition.pos1, offsideYposition.pos2)) {
            if (thisPlayer.hasBall) {
              thisPlayerCallback()
            } else {
              thisPlayer.offside = true
              console.log(thisPlayer.name, ' is offside')
              thisPlayerCallback()
            }
          } else {
            thisPlayerCallback()
          }
        }, function afterAllPlayers() {
          return resolve()
        })
      })
    }
    return resolve()
  })
}

function offsideYPOS(team, side, pitchHeight) {
  return new Promise(function(resolve) {
    let offsideYPOS = {
      'pos1': 0,
      'pos2': pitchHeight / 2
    }
    async.eachSeries(team.players, function eachPlayer(thisPlayer, thisPlayerCallback) {
      if (thisPlayer.position == 'GK') {
        let [, position1] = thisPlayer.startPOS
        offsideYPOS.pos1 = position1
        thisPlayerCallback()
      } else if (side == 'top') {
        if (thisPlayer.startPOS[1] < offsideYPOS.pos2) {
          let [, position2] = thisPlayer.startPOS
          offsideYPOS.pos2 = position2
          thisPlayerCallback()
        } else {
          thisPlayerCallback()
        }
      } else if (thisPlayer.startPOS[1] > offsideYPOS.pos2) {
        let [, position2] = thisPlayer.startPOS
        offsideYPOS.pos2 = position2
        thisPlayerCallback()
      } else {
        thisPlayerCallback()
      }
    }, function afterAllPlayers() {
      return resolve(offsideYPOS)
    })
  })
}

module.exports = {
  decideMovement,
  makeMovement,
  closestPlayerToBall,
  checkOffside
}
