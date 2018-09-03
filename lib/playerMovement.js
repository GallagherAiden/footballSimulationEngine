var async = require('async')
var common = require('../lib/common')
var ballMovement = require('../lib/ballMovement')
var setPositions = require('../lib/setPositions')
var actions = require('../lib/actions')

function decideMovement(closestPlayer, team, opposition, matchDetails) {
  return new Promise(function(resolve, reject) {
    async.eachSeries(
      team.players, function eachPlayer(thisPlayer, thisPlayerCallback) {
      //console.log("new player")
        var ballToPlayerX = thisPlayer.startPOS[0] - matchDetails.ball.position[0]
        var ballToPlayerY = thisPlayer.startPOS[1] - matchDetails.ball.position[1]
        actions.findPossibleActions(thisPlayer, opposition, ballToPlayerX, ballToPlayerY, matchDetails).then(function(possibleActions) {
          actions.selectAction(possibleActions).then(function(action) {
            if (matchDetails.ball.withTeam !== team.name) {
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
              var output = `Player Name: ${thisPlayer.name}, Origin Position: ${thisPlayer.originPOS}, Ball Position: ${matchDetails.ball.position}, Player to ball X: ${ballToPlayerX}, Player to ball Y: ${ballToPlayerY}, \n Player Has Ball: ${thisPlayer.hasBall}, Action: ${action}, Movement: ${move}`
              var intendedMovementX = thisPlayer.startPOS[0] + move[0]
              var intendedMovementY = thisPlayer.startPOS[1] + move[1]
              if (intendedMovementX < matchDetails.pitchSize[0] + 1 && intendedMovementX > -1) {
                thisPlayer.startPOS[0] = thisPlayer.startPOS[0] + move[0]
              }
              if (intendedMovementY < matchDetails.pitchSize[1] + 1 && intendedMovementY > -1) {
                thisPlayer.startPOS[1] = thisPlayer.startPOS[1] + move[1]
              }
              if (common.isBetween(thisPlayer.startPOS[0], matchDetails.ball.position[0] - 3, matchDetails.ball.position[0] + 3) && common.isBetween(thisPlayer.startPOS[1], matchDetails.ball.position[1] - 3, matchDetails.ball.position[1] + 3) && matchDetails.ball.withTeam !== team.name) {
                if (thisPlayer.startPOS[0] === matchDetails.ball.position[0] && thisPlayer.startPOS[1] === matchDetails.ball.position[1]) {
                  if (matchDetails.ball.withPlayer === true && thisPlayer.hasBall === false && matchDetails.ball.withTeam !== team.name) {
                    if (action === 'tackle') {
                      actions.resolveTackle(thisPlayer, team, opposition, matchDetails).then(function(foul) {
                        if (foul) {
                          setPositions.setSetpiece(matchDetails, opposition, team).then(function() {
                          // do nothing
                          }).catch(function(error) {
                            console.error('Error whilst setting up the set piece: ', error)
                            console.error(matchDetails.iterationLog)
                          })
                        }
                      }).catch(function(error) {
                        console.error('Error whilst resolving posession: ', error)
                        console.error(matchDetails.iterationLog)
                      })
                    }
                  } else {
                    thisPlayer.hasBall = true
                    matchDetails.ball.Player = thisPlayer.name
                    matchDetails.ball.withPlayer = true
                    matchDetails.ball.withTeam = team.name
                    team.intent = 'attack'
                    opposition.intent = 'defend'
                  }
                } else if (matchDetails.ball.withPlayer === true && thisPlayer.hasBall === false && matchDetails.ball.withTeam !== team.name) {
                  if (action === 'slide') {
                    actions.resolveSlide(thisPlayer, team, opposition, matchDetails).then(function(foul) {
                      if (foul) {
                        setPositions.setSetpiece(matchDetails, opposition, team).then(function() {
                          // do nothing
                        }).catch(function(error) {
                          console.error('Error whilst setting up the set piece: ', error)
                          console.error(matchDetails.iterationLog)
                        })
                      }
                    }).catch(function(error) {
                      console.error('Error whilst resolving posession during slide: ', error)
                      console.error(matchDetails.iterationLog)
                    })
                  }
                } else {
                  thisPlayer.hasBall = true
                  matchDetails.ball.Player = thisPlayer.name
                  matchDetails.ball.withPlayer = true
                  matchDetails.ball.withTeam = team.name
                  team.intent = 'attack'
                  opposition.intent = 'defend'
                }
              }
              if (thisPlayer.hasBall === true) {
                ballMovement.getBallDirection(matchDetails, thisPlayer.startPOS).then(function() {
                  var tempArray = thisPlayer.startPOS
                  matchDetails.ball.position = tempArray.map(x => x)
                  if (action === 'shoot' || action === 'pass' || action === 'cross' || action === 'throughBall' || action === 'cleared' || action === 'boot') {
                    thisPlayer.hasBall = false
                    matchDetails.ball.withPlayer = false
                    team.intent = 'attack'
                    opposition.intent = 'attack'
                    matchDetails.ball.Player = ''
                    matchDetails.ball.withTeam = ''
                    if (action === 'cleared' || action === 'boot') {
                    //console.log("at ball kicked")
                      ballMovement.ballKicked(matchDetails, thisPlayer).then(function(newPosition) {
                        var tempPosition = newPosition.map(x => x)
                        matchDetails.ball.position = tempPosition
                        thisPlayerCallback()
                      }).catch(function(error) {
                        console.error('Error calling ball kicked:', error)
                        console.error(matchDetails.iterationLog)
                      })
                    } else if (action === 'pass' || action === 'cross') {
                    //console.log("at ball passed");
                      ballMovement.ballPassed(matchDetails, team, thisPlayer).then(function(newPosition) {
                        matchDetails.iterationLog.push(`passed to new position: ${newPosition}`)
                        var tempPosition = newPosition.map(x => x)
                        matchDetails.ball.position = tempPosition
                        thisPlayerCallback()
                      }).catch(function(error) {
                        console.error('Error calling ball passed: ', error)
                        console.error(matchDetails.iterationLog)
                      })
                    } else if (action === 'throughBall') {
                    //console.log("at through ball");
                      ballMovement.throughBall(matchDetails, team, thisPlayer).then(function(newPosition) {
                        var tempPosition = newPosition.map(x => x)
                        matchDetails.ball.position = tempPosition
                        thisPlayerCallback()
                      }).catch(function(error) {
                        console.error('Error calling through ball: ', error)
                        console.error(matchDetails.iterationLog)
                      })
                    } else if (action === 'shoot') {
                    //console.log("at shot made");
                      ballMovement.shotMade(matchDetails, team, opposition, thisPlayer).then(function(newPosition) {
                        var tempPosition = newPosition.map(x => x)
                        matchDetails.ball.position = tempPosition
                        thisPlayerCallback()
                      }).catch(function(error) {
                        console.error('Error calling shot made: ', error)
                        console.error(matchDetails.iterationLog)
                      })
                    }
                  } else {
                    thisPlayerCallback()
                  }
                }).catch(function(error) {
                  console.error('Error getting the ball direction', error)
                  console.error(matchDetails.iterationLog)
                })
              } else {
                thisPlayerCallback()
              }
              output += `, Injured?: ${thisPlayer.injured}, Relative Position: ${thisPlayer.relativePOS}, Final Position: ${thisPlayer.startPOS}, Intent: ${team.intent}`
              //iterationLog.push(output);
            }).catch(function(error) {
              console.error('Error calling make movement: ', error)
              console.error(matchDetails.iterationLog)
            })
          }).catch(function(error) {
            console.error('Error calling select action: ', error)
            console.error(matchDetails.iterationLog)
          })
        }).catch(function(error) {
          console.error('Error finding possible actions: ', error)
          console.error(matchDetails.iterationLog)
        })
      },
      function afterAllPlayers() {
        resolve(team)
      }
    )
  })
}

function makeMovement(player, action, opposition, ballX, ballY, matchDetails) {
  return new Promise(function(resolve, reject) {
    var move = []
    if (action === 'wait') {
      move[0] = 0
      move[1] = 0
      resolve(move)
    } else if (action === 'shoot' || action === 'pass' || action === 'cross' || action === 'throughBall' || action === 'cleared' || action === 'boot') {
      move[0] = 0
      move[1] = 0
      resolve(move)
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
      resolve(move)
    } else if (action === 'intercept') {
      setPositions.closestPlayerToPosition('name', opposition, matchDetails.ball.position).then(function(playerInformation) {
        var interceptPlayer = playerInformation.thePlayer
        var interceptionPosition = []
        var interceptPlayerToBallX = interceptPlayer.startPOS[0] - matchDetails.ball.position[0]
        var interceptPlayerToBallY = interceptPlayer.startPOS[1] - matchDetails.ball.position[1]
        if (interceptPlayerToBallX === 0) {
          if (interceptPlayerToBallY === 0) {
            move[0] = 0
            move[1] = 0
          } else if (interceptPlayerToBallY < 0) {
            interceptionPosition[0] = interceptPlayer.startPOS[0]
            interceptionPosition[1] = interceptPlayer.startPOS[1] + 1
          } else if (interceptPlayerToBallY > 0) {
            interceptionPosition[0] = interceptPlayer.startPOS[0]
            interceptionPosition[1] = interceptPlayer.startPOS[1] - 1
          }
        } else if (interceptPlayerToBallY === 0) {
          if (interceptPlayerToBallX < 0) {
            interceptionPosition[0] = interceptPlayer.startPOS[0] + 1
            interceptionPosition[1] = interceptPlayer.startPOS[1]
          } else if (interceptPlayerToBallX > 0) {
            interceptionPosition[0] = interceptPlayer.startPOS[0] - 1
            interceptionPosition[1] = interceptPlayer.startPOS[1]
          }
        } else if (interceptPlayerToBallX < 0 && interceptPlayerToBallY < 0) {
          interceptionPosition[0] = interceptPlayer.startPOS[0] + 1
          interceptionPosition[1] = interceptPlayer.startPOS[1] + 1
        } else if (interceptPlayerToBallX > 0 && interceptPlayerToBallY > 0) {
          interceptionPosition[0] = interceptPlayer.startPOS[0] - 1
          interceptionPosition[1] = interceptPlayer.startPOS[1] - 1
        } else if (interceptPlayerToBallX > 0 && interceptPlayerToBallY < 0) {
          interceptionPosition[0] = interceptPlayer.startPOS[0] - 1
          interceptionPosition[1] = interceptPlayer.startPOS[1] + 1
        } else if (interceptPlayerToBallX < 0 && interceptPlayerToBallY > 0) {
          interceptionPosition[0] = interceptPlayer.startPOS[0] + 1
          interceptionPosition[1] = interceptPlayer.startPOS[1] - 1
        }
        //set movement to the new interception position
        var interceptPositionX = player.startPOS[0] - interceptionPosition[0]
        var interceptPositionY = player.startPOS[1] - interceptionPosition[1]
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
        resolve(move)
      }).catch(function(error) {
        console.error('Error when getting the closest opposition player: ', error)
        console.error(matchDetails.iterationLog)
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
        resolve(move)
      } else {
        var movementRun = [-1, 0, 1]
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
          resolve(move)
        } else {
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
            resolve(move)
          }).catch(function(error) {
            console.error('couldn\'t check formation when running', error)
            console.error(matchDetails.iterationLog)
          })
        }
      }
    } else if (action === 'sprint') {
      if (player.fitness > 30) {
        player.fitness = common.round(player.fitness - 0.01, 6)
      }
      var movementSprint = [-2, -1, 0, 1, 2]
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
        resolve(move)
      } else {
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
          resolve(move)
        }).catch(function(error) {
          console.error('error calling formation check when sprinting', error)
          console.error(matchDetails.iterationLog)
        })
      }
    }
  })
}

function closestPlayerToBall(closestPlayer, team, matchDetails) {
  return new Promise(function(resolve, reject) {
    var closestPlayerDetails
    async.eachSeries(team.players, function eachPlayer(thisPlayer, thisPlayerACallback) {
      var ballToPlayerX = thisPlayer.startPOS[0] - matchDetails.ball.position[0]
      var ballToPlayerY = thisPlayer.startPOS[1] - matchDetails.ball.position[1]
      var proximityToBall = Math.abs(ballToPlayerX + ballToPlayerY)
      if (proximityToBall < closestPlayer.position) {
        closestPlayer.name = thisPlayer.name
        closestPlayer.position = proximityToBall
        closestPlayerDetails = thisPlayer
      }
      thisPlayerACallback()
    }, function afterAllAPlayers() {
      setPositions.setRelativePosition(closestPlayerDetails, team, matchDetails).then(function() {
        matchDetails.iterationLog.push(`Closest Player to ball: ${closestPlayerDetails.name}`)
        resolve()
      }).catch(function(error) {
        console.error('Error when setting relative positions: ', error)
        console.error(matchDetails.iterationLog)
      })
    })
  })
}

module.exports = {
  decideMovement,
  makeMovement,
  closestPlayerToBall
}
