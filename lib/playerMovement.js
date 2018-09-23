const common = require('../lib/common')
const ballMovement = require('../lib/ballMovement')
const setPositions = require('../lib/setPositions')
const actions = require('../lib/actions')

async function decideMovement(closestPlayer, team, opposition, matchDetails) {
  const allActions = ['shoot', 'throughBall', 'pass', 'cross', 'tackle', 'intercept', 'slide']
  Array.prototype.push.apply(allActions, ['run', 'sprint', 'cleared', 'boot'])
  const ballActions = ['shoot', 'throughBall', 'pass', 'cross', 'cleared', 'boot']
  let {
    position, Player, withPlayer, withTeam
  } = matchDetails.ball
  for (const thisPlayer of team.players) {
    let ballToPlayerX = thisPlayer.startPOS[0] - position[0]
    let ballToPlayerY = thisPlayer.startPOS[1] - position[1]
    let possibleActions
    possibleActions = actions.findPossibleActions(thisPlayer, opposition, ballToPlayerX, ballToPlayerY, matchDetails)
    let action = await actions.selectAction(possibleActions).catch(function(err) {
      const error = `Error when selecting an action ${err}`
      throw error
    })
    let providedAction = (thisPlayer.action) ? thisPlayer.action : 'unassigned'
    if (allActions.includes(providedAction)) {
      if (thisPlayer.name !== Player) {
        if (ballActions.includes(providedAction)) {
          const notice = `${thisPlayer.name} doesnt have the ball so cannot ${providedAction} -action: run`
          console.error(notice)
          action = 'run'
        } else {
          action = providedAction
        }
      } else if (providedAction === 'tackle' || providedAction === 'slide' || providedAction === 'intercept') {
        action = ballActions[common.getRandomNumber(0, 5)]
        const notice = `${thisPlayer.name} has the ball so cannot ${providedAction} -action: ${action}`
        console.error(notice)
      } else {
        action = providedAction
      }
    } else if (thisPlayer.action !== 'none') {
      const error = `Invalid player action for ${thisPlayer.name}`
      throw error
    } else if (withTeam !== team.name) {
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
    let move = await makeMovement(thisPlayer, action, opposition, ballToPlayerX, ballToPlayerY, matchDetails)
      .catch(function(err) {
        const error = `Error calling ball movement: ${err}`
        throw error
      })
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
    let xPosition = common.isBetween(thisPlayer.startPOS[0], position[0] - 3, position[0] + 3)
    let yPosition = common.isBetween(thisPlayer.startPOS[1], position[1] - 3, position[1] + 3)
    if (xPosition && yPosition && withTeam !== team.name) {
      if (thisPlayer.startPOS[0] === position[0] && thisPlayer.startPOS[1] === position[1]) {
        if (withPlayer === true && thisPlayer.hasBall === false && withTeam !== team.name) {
          if (action === 'tackle') {
            let foul = await actions.resolveTackle(thisPlayer, team, opposition, matchDetails)
              .catch(function(err) {
                const error = `Error whilst resolving possession: ${err}`
                throw error
              })
            if (foul) {
              let intensity = actions.foulIntensity()
              if (common.isBetween(intensity, 75, 90)) {
                thisPlayer.cards.yellow++
              } else if (common.isBetween(intensity, 90, 100)) {
                thisPlayer.cards.red++
              }
              await setPositions.setSetpiece(matchDetails, opposition, team)
                .catch(function(err) {
                  const error = `Error whilst setting up the set piece: ${err}`
                  throw error
                })
            }
          }
        } else {
          thisPlayer.hasBall = true
          matchDetails.ball.ballOverIterations = []
          Player = thisPlayer.name
          withPlayer = true
          withTeam = team.name
          team.intent = 'attack'
          opposition.intent = 'defend'
          if (thisPlayer.offside) {
            matchDetails.iterationLog.push(thisPlayer.name, ' is offside ')
            await setPositions.setSetpiece(matchDetails, team, opposition)
              .catch(function(err) {
                const error = `Error whilst setting up the set piece: ${err}`
                throw error
              })
          }
        }
      } else if (withPlayer === true && thisPlayer.hasBall === false && withTeam !== team.name) {
        if (action === 'slide') {
          let foul = await actions.resolveSlide(thisPlayer, team, opposition, matchDetails)
            .catch(function(err) {
              const error = `Error whilst resolving posession during slide: ${err}`
              throw error
            })
          if (foul) {
            let intensity = actions.foulIntensity()
            if (common.isBetween(intensity, 65, 90)) {
              thisPlayer.cards.yellow++
            } else if (common.isBetween(intensity, 85, 100)) {
              thisPlayer.cards.red++
            }
            await setPositions.setSetpiece(matchDetails, opposition, team)
              .catch(function(err) {
                const error = `Error whilst setting up the set piece: ${err}`
                throw error
              })
          }
        }
      } else {
        thisPlayer.hasBall = true
        matchDetails.ball.ballOverIterations = []
        Player = thisPlayer.name
        withPlayer = true
        withTeam = team.name
        team.intent = 'attack'
        opposition.intent = 'defend'
        if (thisPlayer.offside) {
          matchDetails.iterationLog.push(thisPlayer.name, ' is offside ')
          await setPositions.setSetpiece(matchDetails, team, opposition)
            .catch(function(err) {
              const error = `Error whilst setting up the set piece: ${err}`
              throw error
            })
        }
      }
    }
    //handle Player with balls action
    if (thisPlayer.hasBall === true) {
      ballMovement.getBallDirection(matchDetails, thisPlayer.startPOS)
      let tempArray = thisPlayer.startPOS
      position = tempArray.map(x => x)
      position[2] = 0
      if (ballActions.includes(action)) {
        thisPlayer.hasBall = false
        withPlayer = false
        team.intent = 'attack'
        opposition.intent = 'attack'
        Player = ''
        withTeam = ''
        if (action === 'cleared' || action === 'boot') {
          let newPosition = await ballMovement.ballKicked(matchDetails, thisPlayer)
            .catch(function(err) {
              const error = `Error calling ball kicked: ${err}`
              throw error
            })
          let tempPosition = newPosition.map(x => x)
          position = tempPosition
          position[2] = 0
        } else if (action === 'pass' || action === 'cross') {
          let newPosition = await ballMovement.ballPassed(matchDetails, team, thisPlayer)
            .catch(function(err) {
              const error = `Error calling ball passed: ${err}`
              throw error
            })
          matchDetails.iterationLog.push(`passed to new position: ${newPosition}`)
          let tempPosition = newPosition.map(x => x)
          position = tempPosition
          position[2] = 0
        } else if (action === 'throughBall') {
          let newPosition = await ballMovement.throughBall(matchDetails, team, thisPlayer)
            .catch(function(err) {
              const error = `Error calling through ball: ${err}`
              throw error
            })
          let tempPosition = newPosition.map(x => x)
          position = tempPosition
          position[2] = 0
        } else if (action === 'shoot') {
          let newPosition = await ballMovement.shotMade(matchDetails, team, opposition, thisPlayer)
            .catch(function(err) {
              const error = `Error calling shot made: ${err}`
              throw error
            })
          let tempPosition = newPosition.map(x => x)
          position = tempPosition
          position[2] = 0
        }
      }
    }
    // let output = `Player Name: ${thisPlayer.name}, Origin Position: ${thisPlayer.originPOS}`
    // output += `Ball Position: ${position}, Player to ball X: ${ballToPlayerX}`
    // output += `Player to ball Y: ${ballToPlayerY}, \n Player Has Ball: ${thisPlayer.hasBall}`
    // output += `Action: ${action}, Movement: ${move}`
    //   output += `, Injured?: ${thisPlayer.injured}, Relative Position: ${thisPlayer.relativePOS}`
    //   output += `Final Position: ${thisPlayer.startPOS}, Intent: ${team.intent}`
    // iterationLog.push(output);
  }
  return team
}

async function makeMovement(player, action, opposition, ballX, ballY, matchDetails) {
  const { position } = matchDetails.ball
  const ballActions = ['shoot', 'throughBall', 'pass', 'cross', 'cleared', 'boot']
  let move = []
  if (action === 'wait') {
    return [0, 0]
  } else if (ballActions.includes(action)) {
    return [0, 0]
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
    return move
  } else if (action === 'intercept') {
    let playerInformation = setPositions.closestPlayerToPosition('name', opposition, position)
    let interceptPlayer = playerInformation.thePlayer
    const [interceptX, interceptY] = interceptPlayer.startPOS
    let interceptionPosition = []
    let interceptPlayerToBallX = interceptX - position[0]
    let interceptPlayerToBallY = interceptY - position[1]
    if (interceptPlayerToBallX === 0) {
      if (interceptPlayerToBallY === 0) {
        move = [0, 0]
      } else if (interceptPlayerToBallY < 0) {
        interceptionPosition = [interceptX, interceptY + 1]
      } else if (interceptPlayerToBallY > 0) {
        interceptionPosition = [interceptX, interceptY - 1]
      }
    } else if (interceptPlayerToBallY === 0) {
      if (interceptPlayerToBallX < 0) {
        interceptionPosition = [interceptX + 1, interceptY]
      } else if (interceptPlayerToBallX > 0) {
        interceptionPosition = [interceptX - 1, interceptY]
      }
    } else if (interceptPlayerToBallX < 0 && interceptPlayerToBallY < 0) {
      interceptionPosition = [interceptX + 1, interceptY + 1]
    } else if (interceptPlayerToBallX > 0 && interceptPlayerToBallY > 0) {
      interceptionPosition = [interceptX - 1, interceptY - 1]
    } else if (interceptPlayerToBallX > 0 && interceptPlayerToBallY < 0) {
      interceptionPosition = [interceptX - 1, interceptY + 1]
    } else if (interceptPlayerToBallX < 0 && interceptPlayerToBallY > 0) {
      interceptionPosition = [interceptX + 1, interceptY - 1]
    }
    //set movement to the new interception position
    let interceptPositionX = player.startPOS[0] - interceptionPosition[0]
    let interceptPositionY = player.startPOS[1] - interceptionPosition[1]
    if (interceptPositionX === 0) {
      if (interceptPositionY === 0) {
        move = [0, 0]
      } else if (interceptPositionY < 0) {
        move = [0, 1]
      } else if (interceptPositionY > 0) {
        move = [0, -1]
      }
    } else if (interceptPositionY === 0) {
      if (interceptPositionX < 0) {
        move = [1, 0]
      } else if (interceptPositionX > 0) {
        move = [-1, 0]
      }
    } else if (interceptPositionX < 0 && interceptPositionY < 0) {
      move = [1, 1]
    } else if (interceptPositionX > 0 && interceptPositionY > 0) {
      move = [-1, -1]
    } else if (interceptPositionX > 0 && interceptPositionY < 0) {
      move = [-1, 1]
    } else if (interceptPositionX < 0 && interceptPositionY > 0) {
      move = [1, -1]
    }
    return move
  } else if (action === 'run') {
    if (player.fitness > 20) {
      player.fitness = common.round(player.fitness - 0.005, 6)
    }
    if (player.hasBall) {
      if (player.originPOS[1] > matchDetails.pitchSize[1] / 2) {
        move = [common.getRandomNumber(0, 2), common.getRandomNumber(0, 2)]
      } else {
        move = [common.getRandomNumber(-2, 0), common.getRandomNumber(-2, 0)]
      }
      return move
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
      return move
    }
    let formationDirection = await setPositions.formationCheck(player.relativePOS, player.startPOS)
      .catch(function(err) {
        const error = `couldnt check formation when running${err}`
        throw error
      })
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
    return move
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
      return move
    }
    let formationDirection = await setPositions.formationCheck(player.relativePOS, player.startPOS)
      .catch(function(err) {
        const error = `error calling formation check when sprinting ${err}`
        throw error
      })
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
    return move
  }
}

async function closestPlayerToBall(closestPlayer, team, matchDetails) {
  let closestPlayerDetails
  let { position } = matchDetails.ball
  for (let thisPlayer of team.players) {
    let ballToPlayerX = thisPlayer.startPOS[0] - position[0]
    let ballToPlayerY = thisPlayer.startPOS[1] - position[1]
    let proximityToBall = Math.abs(ballToPlayerX + ballToPlayerY)
    if (proximityToBall < closestPlayer.position) {
      closestPlayer.name = thisPlayer.name
      closestPlayer.position = proximityToBall
      closestPlayerDetails = thisPlayer
    }
  }
  await setPositions.setRelativePosition(closestPlayerDetails, team, matchDetails)
    .catch(function(err) {
      const error = `Error when setting relative positions: ${err}`
      throw error
    })
  matchDetails.iterationLog.push(`Closest Player to ball: ${closestPlayerDetails.name}`)
}

function checkOffside(team1, team2, matchDetails) {
  let offsideYposition
  const { ball } = matchDetails
  const { pitchSize } = matchDetails
  const team1side = (team1.players[0].originPOS[1] < (pitchSize[1] / 2)) ? 'top' : 'bottom'
  const team2side = (team2.players[0].originPOS[1] < (pitchSize[1] / 2)) ? 'top' : 'bottom'
  if (common.isBetween(ball.position[1], 0, (pitchSize[1] / 2))) {
    if (ball.withTeam == team1.name && team1side == 'top') {
      //do nothing. Team are in their own half
    } else if (ball.withTeam == team1.name && team1side == 'bottom') {
      offsideYposition = offsideYPOS(team2, 'top', pitchSize[1])
      for (let thisPlayer of team1.players) {
        thisPlayer.offside = false
        if (common.isBetween(thisPlayer.startPOS[1], offsideYposition.pos1, offsideYposition.pos2)) {
          if (!thisPlayer.hasBall) {
            thisPlayer.offside = true
            matchDetails.iterationLog.push(thisPlayer.name, ' is offside')
          }
        }
      }
    } else if (ball.withTeam == team2.name && team2side == 'top') {
      //do nothing. Team are in their own half
    } else if (ball.withTeam == team2.name && team2side == 'bottom') {
      offsideYposition = offsideYPOS(team2, 'top', pitchSize[1])
      for (let thisPlayer of team1.players) {
        thisPlayer.offside = false
        if (common.isBetween(thisPlayer.startPOS[1], offsideYposition.pos1, offsideYposition.pos2)) {
          if (!thisPlayer.hasBall) {
            thisPlayer.offside = true
            matchDetails.iterationLog.push(thisPlayer.name, ' is offside')
          }
        }
      }
    } else {
      //nobody has the ball
    }
  } else if (ball.withTeam == team1.name && team1side == 'bottom') {
    //do nothing. Team are in their own half
  } else if (ball.withTeam == team1.name && team1side == 'top') {
    offsideYposition = offsideYPOS(team2, 'top', pitchSize[1])
    for (let thisPlayer of team1.players) {
      thisPlayer.offside = false
      if (common.isBetween(thisPlayer.startPOS[1], offsideYposition.pos1, offsideYposition.pos2)) {
        if (!thisPlayer.hasBall) {
          thisPlayer.offside = true
          matchDetails.iterationLog.push(thisPlayer.name, ' is offside')
        }
      }
    }
  } else if (ball.withTeam == team2.name && team2side == 'bottom') {
    //do nothing. Team are in their own half
  } else if (ball.withTeam == team2.name && team2side == 'top') {
    offsideYposition = offsideYPOS(team2, 'top', pitchSize[1])
    for (let thisPlayer of team1.players) {
      thisPlayer.offside = false
      if (common.isBetween(thisPlayer.startPOS[1], offsideYposition.pos1, offsideYposition.pos2)) {
        if (!thisPlayer.hasBall) {
          thisPlayer.offside = true
          matchDetails.iterationLog.push(thisPlayer.name, ' is offside')
        }
      }
    }
  }
}

function offsideYPOS(team, side, pitchHeight) {
  let offsideYPOS = {
    'pos1': 0,
    'pos2': pitchHeight / 2
  }
  for (let thisPlayer of team.players) {
    if (thisPlayer.position == 'GK') {
      let [, position1] = thisPlayer.startPOS
      offsideYPOS.pos1 = position1
    } else if (side == 'top') {
      if (thisPlayer.startPOS[1] < offsideYPOS.pos2) {
        let [, position2] = thisPlayer.startPOS
        offsideYPOS.pos2 = position2
      }
    } else if (thisPlayer.startPOS[1] > offsideYPOS.pos2) {
      let [, position2] = thisPlayer.startPOS
      offsideYPOS.pos2 = position2
    }
  }
  return offsideYPOS
}

module.exports = {
  decideMovement,
  makeMovement,
  closestPlayerToBall,
  checkOffside
}
