var async = require('async')
var common = require('../lib/common')
var setPositions = require('../lib/setPositions')

function ballKicked(matchDetails, player) {
  const kickOffTeam = matchDetails.kickOffTeam
  const secondTeam = matchDetails.secondTeam

  return new Promise(function(resolve, reject) {
    var position = matchDetails.ball.position
    var direction = matchDetails.ball.direction
    matchDetails.iterationLog.push(`ball kicked by: ${player.name}`)
    var newPosition = [0, 0]
    var teamShootingToTop = ['wait', 'north', 'north', 'north', 'north', 'east', 'east', 'west', 'west', 'northeast', 'northeast', 'northeast', 'northwest', 'northwest', 'northwest']
    var teamShootingToBottom = ['wait', 'south', 'south', 'south', 'south', 'east', 'east', 'west', 'west', 'southeast', 'southeast', 'southeast', 'southwest', 'southwest', 'southwest']
    var power = common.calculatePower(player.skill.strength)
    if (player.originPOS[1] > (matchDetails.pitchSize[1] / 2)) {
      direction = teamShootingToTop[common.getRandomNumber(0, teamShootingToTop.length - 1)]
      if (direction === 'wait') {
        newPosition = [position[0] + common.getRandomNumber(0, (power / 2)), position[1] + common.getRandomNumber(0, (power / 2))]
      } else if (direction === 'north') {
        newPosition = [position[0] + common.getRandomNumber(-20, 20), position[1] + common.getRandomNumber(-power, -(power / 2))]
      } else if (direction === 'east') {
        newPosition = [position[0] + common.getRandomNumber((power / 2), power), position[1] + common.getRandomNumber(-20, 20)]
      } else if (direction === 'west') {
        newPosition = [position[0] + common.getRandomNumber(-power, -(power / 2)), position[1] + common.getRandomNumber(-20, 20)]
      } else if (direction === 'northeast') {
        newPosition = [position[0] + common.getRandomNumber(0, (power / 2)), position[1] + common.getRandomNumber(-power, -(power / 2))]
      } else if (direction === 'northwest') {
        newPosition = [position[0] + common.getRandomNumber(-(power / 2), 0), position[1] + common.getRandomNumber(-power, -(power / 2))]
      }
    } else {
      direction = teamShootingToBottom[common.getRandomNumber(0, teamShootingToBottom.length - 1)]
      if (direction === 'wait') {
        newPosition = [position[0] + common.getRandomNumber(0, (power / 2)), position[1] + common.getRandomNumber(0, (power / 2))]
      } else if (direction === 'east') {
        newPosition = [position[0] + common.getRandomNumber((power / 2), power), position[1] + common.getRandomNumber(-20, 20)]
      } else if (direction === 'west') {
        newPosition = [common.getRandomNumber(position[0] - 120, position[0]), common.getRandomNumber(position[1] - 30, position[1] + 30)]
      } else if (direction === 'south') {
        newPosition = [position[0] + common.getRandomNumber(-20, 20), position[1] + common.getRandomNumber((power / 2), power)]
      } else if (direction === 'southeast') {
        newPosition = [position[0] + common.getRandomNumber(0, (power / 2)), position[1] + common.getRandomNumber((power / 2), power)]
      } else if (direction === 'southwest') {
        newPosition = [position[0] + common.getRandomNumber(-(power / 2), 0), position[1] + common.getRandomNumber((power / 2), power)]
      }
    }
    resolveBallMovement(player, position, newPosition, power, kickOffTeam, secondTeam, matchDetails).then(function(endPosition) {
      matchDetails.iterationLog.push('resolving ball movement')
      matchDetails.iterationLog.push(`new ball position: ${endPosition}`)
      resolve(endPosition)
    }).catch(function(error) {
      console.error('Error when resolving the ball movement: ', error)
      console.error(matchDetails.iterationLog)
    })
  })
}

function shotMade(matchDetails, team, opposition, player) {
  return new Promise(function(resolve, reject) {
    var position = matchDetails.ball.position
    var direction = matchDetails.ball.direction
    matchDetails.iterationLog.push(`Shot Made by: ${player.name}`)
    var shotPosition = [0, 0]
    var distanceFromGoal
    var shotPower = common.calculatePower(player.skill.strength)
    if (player.originPOS[1] > matchDetails.pitchSize[1] / 2) {
      if (common.isEven(matchDetails.half)) {
        matchDetails.kickOffTeamStatistics.shots++
      } else if (common.isOdd(matchDetails.half)) {
        matchDetails.secondTeamStatistics.shots++
      } else {
        reject('You cannot supply 0 as a half')
      }
      distanceFromGoal = player.startPOS[1] - 0
      if (common.isBetween(shotPower, distanceFromGoal, distanceFromGoal + 50)) {
        if (player.skill.shooting > common.getRandomNumber(0, 20)) {
          matchDetails.iterationLog.push('Shot On Target')
          shotPosition[0] = common.getRandomNumber((matchDetails.pitchSize[0] / 2) - 20, (matchDetails.pitchSize[0] / 2) + 20)
          shotPosition[1] = 0
          resolveBallMovement(player, player.startPOS, shotPosition, shotPower, team, opposition, matchDetails).then(function(endPosition) {
            matchDetails.iterationLog.push('resolving ball movement whilst making a shot')
            if (shotPosition[0] !== endPosition[0] || shotPosition[1] !== endPosition[1]) {
              matchDetails.iterationLog.push(`Ball deflected to: ${endPosition}`)
            }
            if (common.isBetween(opposition.players[0].startPOS[0], endPosition[0] - 15, endPosition[0] + 15) && common.isBetween(opposition.players[0].startPOS[1], -1, 5)) {
              if (opposition.players[0].skill.saving > common.getRandomNumber(0, 100)) {
                matchDetails.iterationLog.push(`Shot Saved by: ${opposition.players[0].name}`)
                opposition.players[0].hasBall = true
                matchDetails.ball.Player = opposition.players[0].name
                var tempArray = opposition.players[0].startPOS
                matchDetails.ball.position = tempArray.map(x => x)
                opposition.intent = 'attack'
                team.intent = 'defend'
                resolve(endPosition)
              } else {
                setPositions.setGoalScored(team, opposition, matchDetails).then(function() {
                  matchDetails.iterationLog.push(`Goal Scored by: ${player.name}`)
                  if (common.isEven(matchDetails.half)) {
                    matchDetails.kickOffTeamStatistics.goals++
                    //console.log("goal 1: " + matchDetails.kickOffTeam.name + " " + matchDetails.kickOffTeamStatistics.goals);
                    resolve(endPosition)
                  } else if (common.isOdd(matchDetails.half)) {
                    matchDetails.secondTeamStatistics.goals++
                    //console.log("goal 2: " + matchDetails.secondTeam.name + " " + matchDetails.secondTeamStatistics.goals);
                    resolve(endPosition)
                  } else {
                    reject('You cannot supply 0 as a half')
                  }
                }).catch(function(error) {
                  console.error('Error when processing the goal: ', error)
                  console.error(matchDetails.iterationLog)
                })
              }
            } else {
              setPositions.setGoalScored(team, opposition, matchDetails).then(function() {
                matchDetails.iterationLog.push(`Goal Scored by: ${player.name}`)
                if (common.isEven(matchDetails.half)) {
                  matchDetails.kickOffTeamStatistics.goals++
                  //console.log("goal 3: " + matchDetails.kickOffTeam.name + " " + matchDetails.kickOffTeamStatistics.goals);
                  resolve(endPosition)
                } else if (common.isOdd(matchDetails.half)) {
                  matchDetails.secondTeamStatistics.goals++
                  //console.log("goal 4: " + matchDetails.secondTeam.name + " " + matchDetails.secondTeamStatistics.goals);
                  resolve(endPosition)
                } else {
                  reject('You cannot supply 0 as a half')
                }
              }).catch(function(error) {
                console.error('Error when processing the goal: ', error)
                console.error(matchDetails.iterationLog)
              })
            }
          }).catch(function(error) {
            console.error('Error when resolving ball movement during the shot: ', error)
            console.error(matchDetails.iterationLog)
          })
        } else {
          shotPosition[0] = common.getRandomNumber((matchDetails.pitchSize[0] / 2) - 30, (matchDetails.pitchSize[0] / 2) + 30)
          shotPosition[1] = common.getRandomNumber(1, 20)
          resolveBallMovement(player, player.startPOS, shotPosition, shotPower, team, opposition, matchDetails).then(function(endPosition) {
            matchDetails.iterationLog.push('Shot Off Target')
            matchDetails.iterationLog.push('resolving ball movement')
            if (shotPosition[0] !== endPosition[0] || shotPosition[1] !== endPosition[1]) {
              matchDetails.iterationLog.push(`Ball deflected to: ${endPosition}`)
              resolve(endPosition)
            } else {
              resolve(endPosition)
            }
          }).catch(function(error) {
            console.error('Error when resolving ball movement after a failed shot: ', error)
            console.error(matchDetails.iterationLog)
          })
        }
      } else if (shotPower > (distanceFromGoal + 49)) {
        setPositions.setGoalKick(opposition, team, matchDetails).then(function(endPosition) {
          matchDetails.iterationLog.push(`Shot Missed the goal, Goal Kick to: ${opposition.name}`)
          resolve(endPosition)
        }).catch(function(error) {
          console.error('Error when setting a goal kick after a shot has been made: ', error)
          console.error(matchDetails.iterationLog)
        })
      } else {
        matchDetails.iterationLog.push(`Shot not hard enough by: ${opposition.name}`)
        shotPosition[0] = matchDetails.ball.position[0]
        shotPosition[1] = matchDetails.ball.position[1] - shotPower
        resolveBallMovement(player, player.startPOS, shotPosition, shotPower, team, opposition, matchDetails).then(function(endPosition) {
          matchDetails.iterationLog.push('Shot Off Target')
          matchDetails.iterationLog.push('resolving ball movement')
          if (shotPosition[0] !== endPosition[0] || shotPosition[1] !== endPosition[1]) {
            matchDetails.iterationLog.push(`Ball deflected to: ${endPosition}`)
            resolve(endPosition)
          } else {
            resolve(endPosition)
          }
        }).catch(function(error) {
          console.error('Error when resolving ball movement after a failed shot: ', error)
          console.error(matchDetails.iterationLog)
        })
      }
    } else {
      if (common.isEven(matchDetails.half)) {
        matchDetails.secondTeamStatistics.shots++
      } else if (common.isOdd(matchDetails.half)) {
        matchDetails.kickOffTeamStatistics.shots++
      } else {
        reject('You cannot supply 0 as a half')
      }
      distanceFromGoal = matchDetails.pitchSize[1] - player.startPOS[1]
      if (common.isBetween(shotPower, distanceFromGoal, distanceFromGoal + 50)) {
        if (player.skill.shooting > common.getRandomNumber(0, 20)) {
          matchDetails.iterationLog.push('Shot On Target')
          shotPosition[0] = common.getRandomNumber((matchDetails.pitchSize[0] / 2) - 20, (matchDetails.pitchSize[0] / 2) + 20)
          shotPosition[1] = matchDetails.pitchSize[1]
          resolveBallMovement(player, player.startPOS, shotPosition, shotPower, team, opposition, matchDetails).then(function(endPosition) {
            matchDetails.iterationLog.push('resolving ball movement whilst making a shot')
            if (shotPosition[0] !== endPosition[0] || shotPosition[1] !== endPosition[1]) {
              matchDetails.iterationLog.push(`Ball deflected to: ${endPosition}`)
            }
            if (common.isBetween(opposition.players[0].startPOS[0], endPosition[0] - 5, endPosition[0] + 5) && common.isBetween(opposition.players[0].startPOS[1], matchDetails.pitchSize[1] - 5, matchDetails.pitchSize[1] + 1)) {
              if (opposition.players[0].skill.saving > common.getRandomNumber(0, 100)) {
                matchDetails.iterationLog.push(`Shot Saved by: ${opposition.players[0].name}`)
                opposition.players[0].hasBall = true
                matchDetails.ball.Player = opposition.players[0].name
                var tempArray = opposition.players[0].startPOS
                matchDetails.ball.position = tempArray.map(x => x)
                opposition.intent = 'attack'
                team.intent = 'defend'
                resolve(endPosition)
              } else {
                setPositions.setGoalScored(team, opposition, matchDetails).then(function() {
                  matchDetails.iterationLog.push(`Goal Scored by: ${player.name}`)
                  if (common.isEven(matchDetails.half)) {
                    matchDetails.secondTeamStatistics.goals++
                    //console.log("goal 5: " + matchDetails.secondTeam.name + " " + matchDetails.secondTeamStatistics.goals);
                    resolve(endPosition)
                  } else if (common.isOdd(matchDetails.half)) {
                    matchDetails.kickOffTeamStatistics.goals++
                    //console.log("goal 6: " + matchDetails.kickOffTeam.name + " " + matchDetails.kickOffTeamStatistics.goals);
                    resolve(endPosition)
                  } else {
                    reject('You cannot supply 0 as a half')
                  }
                }).catch(function(error) {
                  console.error('Error when processing the goal: ', error)
                  console.error(matchDetails.iterationLog)
                })
              }
            } else {
              setPositions.setGoalScored(team, opposition, matchDetails).then(function() {
                matchDetails.iterationLog.push(`Goal Scored by: ${player.name}`)
                if (common.isEven(matchDetails.half)) {
                  matchDetails.secondTeamStatistics.goals++
                  //console.log("goal 7: " + matchDetails.secondTeam.name + " " + matchDetails.secondTeamStatistics.goals);
                  resolve(endPosition)
                } else if (common.isOdd(matchDetails.half)) {
                  matchDetails.kickOffTeamStatistics.goals++
                  //console.log("goal 8: " + matchDetails.kickOffTeam.name + " " + matchDetails.kickOffTeamStatistics.goals);
                  resolve(endPosition)
                } else {
                  reject('You cannot supply 0 as a half')
                }
              }).catch(function(error) {
                console.error('Error when processing the goal: ', error)
                console.error(matchDetails.iterationLog)
              })
            }
          }).catch(function(error) {
            console.error('Error when resolving ball movement during the shot: ', error)
            console.error(matchDetails.iterationLog)
          })
        } else {
          shotPosition[0] = common.getRandomNumber((matchDetails.pitchSize[0] / 2) - 30, (matchDetails.pitchSize[0] / 2) + 30)
          shotPosition[1] = common.getRandomNumber(matchDetails.pitchSize[1] - 1, matchDetails.pitchSize[1] - 20)
          resolveBallMovement(player, player.startPOS, shotPosition, shotPower, team, opposition, matchDetails).then(function(endPosition) {
            matchDetails.iterationLog.push('Shot Off Target')
            if (shotPosition[0] !== endPosition[0] || shotPosition[1] !== endPosition[1]) {
              matchDetails.iterationLog.push(`Ball deflected to: ${endPosition}`)
              resolve(endPosition)
            } else {
              resolve(endPosition)
            }
          }).catch(function(error) {
            console.error('Error when resolving ball movement after a failed shot: ', error)
            console.error(matchDetails.iterationLog)
          })
        }
      } else if (shotPower > (distanceFromGoal + 49)) {
        setPositions.setGoalKick(opposition, team, matchDetails).then(function(endPosition) {
          matchDetails.iterationLog.push(`Shot Missed, Goal Kick to: ${opposition.name}`)
          resolve(endPosition)
        }).catch(function(error) {
          console.error('Error when setting a goal kick after a shot has been made: ', error)
          console.error(matchDetails.iterationLog)
        })
      } else {
        matchDetails.iterationLog.push(`Shot not hard enough by: ${opposition.name}`)
        shotPosition[0] = matchDetails.ball.position[0]
        shotPosition[1] = matchDetails.ball.position[1] + shotPower
        matchDetails.iterationLog.push('resolving ball movement')
        resolveBallMovement(player, player.startPOS, shotPosition, shotPower, team, opposition, matchDetails).then(function(endPosition) {
          matchDetails.iterationLog.push('Shot Off Target')
          if (shotPosition[0] !== endPosition[0] || shotPosition[1] !== endPosition[1]) {
            matchDetails.iterationLog.push(`Ball deflected to: ${endPosition}`)
            resolve(endPosition)
          } else {
            resolve(endPosition)
          }
        }).catch(function(error) {
          console.error('Error when resolving ball movement after a failed shot: ', error)
          console.error(matchDetails.iterationLog)
        })
      }
    }
  })
}

function throughBall(matchDetails, teammates, player) {
  const kickOffTeam = matchDetails.kickOffTeam
  const secondTeam = matchDetails.secondTeam

  return new Promise(function(resolve, reject) {
    var position = matchDetails.ball.position
    var direction = matchDetails.ball.direction
    var closestPlayerPosition = [0, 0]
    var playersInDistance = []
    async.eachSeries(teammates.players, function eachPlayer(teamPlayer, teamPlayerCallback) {
      if (teamPlayer.name === player.name) {
        //do nothing
        teamPlayerCallback()
      } else {
        var playerToPlayerX = player.startPOS[0] - teamPlayer.startPOS[0]
        var playerToPlayerY = player.startPOS[1] - teamPlayer.startPOS[1]
        var proximityToBall = Math.abs(playerToPlayerX + playerToPlayerY)
        playersInDistance.push({
          'position': teamPlayer.startPOS,
          'proximity': proximityToBall,
          'name': teamPlayer.name
        })
        teamPlayerCallback()
      }
    }, function afterAllPlayers() {
      playersInDistance.sort(function(a, b) {
        return a.proximity - b.proximity
      })
      var targetPlayer = playersInDistance[common.getRandomNumber(0, (playersInDistance.length - 1))]
      matchDetails.iterationLog.push(`through ball passed by: ${player.name} to: ${targetPlayer.name}`)
      if (player.skill.passing > common.getRandomNumber(0, 100)) {
        if (player.originPOS[1] > matchDetails.pitchSize[1] / 2) {
          closestPlayerPosition[0] = targetPlayer.position[0]
          closestPlayerPosition[1] = targetPlayer.position[1] - 10
        } else {
          closestPlayerPosition[0] = targetPlayer.position[0]
          closestPlayerPosition[1] = targetPlayer.position[1] + 10
        }
      } else if (player.originPOS[1] > (matchDetails.pitchSize[1] / 2)) {
        if (position[1] > (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 3))) {
          closestPlayerPosition[0] = targetPlayer.position[0] + common.getRandomNumber(-10, 10)
          closestPlayerPosition[1] = targetPlayer.position[1] + common.getRandomNumber(-10, 10)
        } else if (position[1] > (matchDetails.pitchSize[1] / 3) && position[1] < (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 3))) {
          closestPlayerPosition[0] = targetPlayer.position[0] + common.getRandomNumber(-20, 20)
          closestPlayerPosition[1] = targetPlayer.position[1] + common.getRandomNumber(-50, 50)
        } else {
          closestPlayerPosition[0] = targetPlayer.position[0] + common.getRandomNumber(-30, 30)
          closestPlayerPosition[1] = targetPlayer.position[1] + common.getRandomNumber(-100, 100)
        }
      } else if (position[1] > (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 3))) {
        closestPlayerPosition[0] = targetPlayer.position[0] + common.getRandomNumber(-30, 30)
        closestPlayerPosition[1] = targetPlayer.position[1] + common.getRandomNumber(-100, 100)
      } else if (position[1] > (matchDetails.pitchSize[1] / 3) && position[1] < (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 3))) {
        closestPlayerPosition[0] = targetPlayer.position[0] + common.getRandomNumber(-20, 20)
        closestPlayerPosition[1] = targetPlayer.position[1] + common.getRandomNumber(-50, 50)
      } else {
        closestPlayerPosition[0] = targetPlayer.position[0] + common.getRandomNumber(-10, 10)
        closestPlayerPosition[1] = targetPlayer.position[1] + common.getRandomNumber(-10, 10)
      }
      var power = common.calculatePower(player.skill.strength)
      resolveBallMovement(player, position, closestPlayerPosition, power, kickOffTeam, secondTeam, matchDetails).then(function(endPosition) {
        matchDetails.iterationLog.push('resolving ball movement')
        matchDetails.iterationLog.push(`new ball position: ${endPosition}`)
        resolve(endPosition)
      }).catch(function(error) {
        console.error('Error when resolving the ball movement: ', error)
        console.error(matchDetails.iterationLog)
      })
    })
  })
}

function resolveBallMovement(player, currentPOS, newPOS, power, team, opposition, matchDetails) {
  return new Promise(function(resolve, reject) {
    var deflectionPlayer
    var deflectionPosition
    var deflectionTeam
    common.getBallTrajectory(currentPOS, newPOS, power).then(function(lineToEndPosition) {
      //console.log("do we get past ball trajectory?");
      async.eachSeries(
        lineToEndPosition, function eachPos(thisPos, thisPosCallback) {
          setPositions.closestPlayerToPosition(player, team, thisPos).then(function(playerInformation) {
            var thisTeamPlayer = playerInformation.thePlayer
            if (thisTeamPlayer && thisTeamPlayer.startPOS[0] === thisPos[0] && thisTeamPlayer.startPOS[1] === thisPos[1]) {
              if (!deflectionPlayer) {
                if (thisPos[2] < thisTeamPlayer.skill.jumping && thisPos[2] > 49) {
                  deflectionPlayer = thisTeamPlayer
                  deflectionPosition = thisPos
                  deflectionTeam = team.name
                  thisPosCallback()
                } else {
                  thisPosCallback()
                }
              } else {
                thisPosCallback()
              }
            } else {
              setPositions.closestPlayerToPosition(player, opposition, thisPos).then(function(playerInformation) {
                var thatTeamPlayer = playerInformation.thePlayer
                if (thatTeamPlayer) {
                  if (thatTeamPlayer.startPOS[0] === thisPos[0] && thatTeamPlayer.startPOS[1] === thisPos[1]) {
                    if (!deflectionPlayer) {
                      if (thisPos[2] < thatTeamPlayer.skill.jumping && thisPos[2] < 49) {
                        deflectionPlayer = thatTeamPlayer
                        deflectionPosition = thisPos
                        deflectionTeam = opposition.name
                        thisPosCallback()
                      } else {
                        thisPosCallback()
                      }
                    } else {
                      thisPosCallback()
                    }
                  } else {
                    thisPosCallback()
                  }
                } else {
                  thisPosCallback()
                }
              }).catch(function(error) {
                console.error('Error when getting this teams closest player to that position: ', error)
                console.error(matchDetails.iterationLog)
              })
            }
          }).catch(function(error) {
            console.error('Error when getting this teams closest player to this position: ', error)
            console.error(matchDetails.iterationLog)
          })
        },
        function afterAllPos() {
          if (!deflectionPlayer) {
          //console.log("before boundaries");
            setPositions.keepInBoundaries(newPOS, player.originPOS[1], matchDetails).then(function(finalPosition) {
            //console.log("are we breaking after in boundaries");
              matchDetails.iterationLog.push('Ball reached its target')
              resolve(finalPosition)
            }).catch(function(error) {
              console.error('Error when keeping ball in boundaries: ', error)
              console.error(matchDetails.iterationLog)
            })
          } else {
          //console.log("before deflect resolution");
            resolveDeflection(power, currentPOS, deflectionPosition, deflectionPlayer, deflectionTeam, matchDetails).then(function(newPosition) {
            //console.log("are we breaking after resolving deflection");
              matchDetails.iterationLog.push('Ball deflected')
              resolve(newPosition)
            }).catch(function(error) {
              console.error('Error when resolving the deflection: ', error)
              console.error(matchDetails.iterationLog)
            })
          }
        }
      )
    }).catch(function(error) {
      console.error('Error when getting the ball trajectory: ', error)
      console.error(matchDetails.iterationLog)
    })
  })
}

function resolveDeflection(power, currentPOS, deflectionPosition, deflectionPlayer, deflectionTeam, matchDetails) {
  return new Promise(function(resolve, reject) {
    var xMovement = Math.pow((currentPOS[0] - deflectionPosition[0]), 2)
    var yMovement = Math.pow((currentPOS[1] - deflectionPosition[1]), 2)
    var movementDistance = Math.sqrt(xMovement + yMovement)
    var newPower = power - movementDistance
    var tempPosition = ['', '']
    if (newPower < 75) {
      deflectionPlayer.hasBall = true
      matchDetails.ball.Player = deflectionPlayer.name
      matchDetails.ball.withPlayer = true
      matchDetails.ball.withTeam = deflectionTeam
      resolve(deflectionPosition)
    } else {
      if (matchDetails.ball.direction === 'east' || matchDetails.ball.direction === 'northeast' || matchDetails.ball.direction === 'southeast') {
        if (matchDetails.ball.direction === 'east') {
          tempPosition[1] = common.getRandomNumber(deflectionPosition[1] - 3, deflectionPosition[1] + 3)
        }
        tempPosition[0] = deflectionPosition[0] - (newPower / 2)
      } else if (matchDetails.ball.direction === 'west' || matchDetails.ball.direction === 'northwest' || matchDetails.ball.direction === 'southwest') {
        if (matchDetails.ball.direction === 'west') {
          tempPosition[1] = common.getRandomNumber(deflectionPosition[1] - 3, deflectionPosition[1] + 3)
        }
        tempPosition[0] = deflectionPosition[0] + (newPower / 2)
      }
      if (matchDetails.ball.direction === 'north' || matchDetails.ball.direction === 'northeast' || matchDetails.ball.direction === 'northwest') {
        if (matchDetails.ball.direction === 'north') {
          tempPosition[0] = common.getRandomNumber(deflectionPosition[0] - 3, deflectionPosition[0] + 3)
        }
        tempPosition[1] = deflectionPosition[1] + (newPower / 2)
      } else if (matchDetails.ball.direction === 'south' || matchDetails.ball.direction === 'southeast' || matchDetails.ball.direction === 'southwest') {
        if (matchDetails.ball.direction === 'south') {
          tempPosition[0] = common.getRandomNumber(deflectionPosition[0] - 3, deflectionPosition[0] + 3)
        }
        tempPosition[1] = deflectionPosition[1] - (newPower / 2)
      }
      if (matchDetails.ball.direction === 'wait') {
        tempPosition[0] = common.getRandomNumber(-newPower / 2, newPower / 2)
        tempPosition[1] = common.getRandomNumber(-newPower / 2, newPower / 2)
      }
      setPositions.keepInBoundaries(tempPosition, deflectionPlayer.originPOS[1], matchDetails).then(function(finalPosition) {
        resolve(finalPosition)
      }).catch(function(error) {
        console.error('Error when keeping ball in boundaries: ', error)
        console.error(matchDetails.iterationLog)
      })
    }
  })
}

function getBallDirection(matchDetails, nextPOS) {
  return new Promise(function(resolve, reject) {
    var currentPOS = matchDetails.ball.position
    // - - is south east
    // - + is north east
    // + - is south west
    // ++ is north west
    var movementX = currentPOS[0] - nextPOS[0]
    var movementY = currentPOS[1] - nextPOS[1]
    if (movementX === 0) {
      if (movementY === 0) {
        matchDetails.ball.direction = 'wait'
      } else if (movementY < 0) {
        matchDetails.ball.direction = 'south'
      } else if (movementY > 0) {
        matchDetails.ball.direction = 'north'
      }
    } else if (movementY === 0) {
      if (movementX < 0) {
        matchDetails.ball.direction = 'east'
      } else if (movementX > 0) {
        matchDetails.ball.direction = 'west'
      }
    } else if (movementX < 0 && movementY < 0) {
      matchDetails.ball.direction = 'southeast'
    } else if (movementX > 0 && movementY > 0) {
      matchDetails.ball.direction = 'northwest'
    } else if (movementX > 0 && movementY < 0) {
      matchDetails.ball.direction = 'southwest'
    } else if (movementX < 0 && movementY > 0) {
      matchDetails.ball.direction = 'northeast'
    }
    resolve()
  })
}

function ballPassed(matchDetails, teammates, player) {
  const kickOffTeam = matchDetails.kickOffTeam
  const secondTeam = matchDetails.secondTeam

  return new Promise(function(resolve, reject) {
    var position = matchDetails.ball.position
    var direction = matchDetails.ball.direction
    var closestPlayerPosition = [0, 0]
    var playersInDistance = []
    async.eachSeries(teammates.players, function eachPlayer(teamPlayer, teamPlayerCallback) {
      if (teamPlayer.name === player.name) {
        //do nothing
        teamPlayerCallback()
      } else {
        var playerToPlayerX = player.startPOS[0] - teamPlayer.startPOS[0]
        var playerToPlayerY = player.startPOS[1] - teamPlayer.startPOS[1]
        var proximityToBall = Math.abs(playerToPlayerX + playerToPlayerY)
        playersInDistance.push({
          'position': teamPlayer.startPOS,
          'proximity': proximityToBall,
          'name': teamPlayer.name
        })
        teamPlayerCallback()
      }
    }, function afterAllPlayers() {
      playersInDistance.sort(function(a, b) {
        return a.proximity - b.proximity
      })
      var targetPlayer = playersInDistance[common.getRandomNumber(0, (playersInDistance.length - 1))]
      if (player.skill.passing > common.getRandomNumber(0, 100)) {
        closestPlayerPosition = targetPlayer.position
      } else if (player.originPOS[1] > (matchDetails.pitchSize[1] / 2)) {
        if (position[1] > (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 3))) {
          closestPlayerPosition[0] = targetPlayer.position[0] + common.getRandomNumber(-10, 10)
          closestPlayerPosition[1] = targetPlayer.position[1] + common.getRandomNumber(-10, 10)
        } else if (position[1] > (matchDetails.pitchSize[1] / 3) && position[1] < (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 3))) {
          closestPlayerPosition[0] = targetPlayer.position[0] + common.getRandomNumber(-50, 50)
          closestPlayerPosition[1] = targetPlayer.position[1] + common.getRandomNumber(-50, 50)
        } else {
          closestPlayerPosition[0] = targetPlayer.position[0] + common.getRandomNumber(-100, 100)
          closestPlayerPosition[1] = targetPlayer.position[1] + common.getRandomNumber(-100, 100)
        }
      } else if (position[1] > (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 3))) {
        closestPlayerPosition[0] = targetPlayer.position[0] + common.getRandomNumber(-100, 100)
        closestPlayerPosition[1] = targetPlayer.position[1] + common.getRandomNumber(-100, 100)
      } else if (position[1] > (matchDetails.pitchSize[1] / 3) && position[1] < (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 3))) {
        closestPlayerPosition[0] = targetPlayer.position[0] + common.getRandomNumber(-50, 50)
        closestPlayerPosition[1] = targetPlayer.position[1] + common.getRandomNumber(-50, 50)
      } else {
        closestPlayerPosition[0] = targetPlayer.position[0] + common.getRandomNumber(-10, 10)
        closestPlayerPosition[1] = targetPlayer.position[1] + common.getRandomNumber(-10, 10)
      }
      matchDetails.iterationLog.push(`ball passed by: ${player.name} to: ${targetPlayer.name}`)
      var power = common.calculatePower(player.skill.strength)
      //console.log("do we get into resolving ball movement?");
      resolveBallMovement(player, position, closestPlayerPosition, power, kickOffTeam, secondTeam, matchDetails).then(function(endPosition) {
        resolve(endPosition)
      }).catch(function(error) {
        console.error('Error when resolving the ball movement: ', error)
        console.error(matchDetails.iterationLog)
      })
    })
  })
}

module.exports = {
  ballKicked,
  shotMade,
  throughBall,
  resolveBallMovement,
  resolveDeflection,
  getBallDirection,
  ballPassed
}
