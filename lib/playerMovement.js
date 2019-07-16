const common = require(`../lib/common`)
const ballMovement = require(`../lib/ballMovement`)
const setPositions = require(`../lib/setPositions`)
const actions = require(`../lib/actions`)

function decideMovement(closestPlayer, team, opposition, matchDetails) {
  const allActions = [`shoot`, `throughBall`, `pass`, `cross`, `tackle`, `intercept`, `slide`]
  Array.prototype.push.apply(allActions, [`run`, `sprint`, `cleared`, `boot`])
  const ballActions = [`shoot`, `throughBall`, `pass`, `cross`, `cleared`, `boot`]
  let {
    position, Player, withPlayer, withTeam, lastTouch
  } = matchDetails.ball
  for (const thisPlayer of team.players) {
    let ballToPlayerX = thisPlayer.currentPOS[0] - position[0]
    let ballToPlayerY = thisPlayer.currentPOS[1] - position[1]
    let possibleActions
    possibleActions = actions.findPossActions(thisPlayer, team, opposition, ballToPlayerX, ballToPlayerY, matchDetails)
    let action = actions.selectAction(possibleActions)
    let providedAction = (thisPlayer.action) ? thisPlayer.action : `unassigned`
    if (allActions.includes(providedAction)) {
      if (thisPlayer.name !== Player) {
        if (ballActions.includes(providedAction)) {
          const notice = `${thisPlayer.name} doesnt have the ball so cannot ${providedAction} -action: run`
          console.error(notice)
          action = `run`
        } else {
          action = providedAction
        }
      } else if (providedAction === `tackle` || providedAction === `slide` || providedAction === `intercept`) {
        action = ballActions[common.getRandomNumber(0, 5)]
        const notice = `${thisPlayer.name} has the ball so cannot ${providedAction} -action: ${action}`
        console.error(notice)
      } else {
        action = providedAction
      }
    } else if (thisPlayer.action !== `none`) {
      throw new Error(`Invalid player action for ${thisPlayer.name}`)
    } else if (withTeam !== team.name) {
      if (closestPlayer.name === thisPlayer.name) {
        if (action !== `tackle` && action !== `slide` && action !== `intercept`) {
          action = `sprint`
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
    let move = makeMovement(thisPlayer, action, opposition, ballToPlayerX, ballToPlayerY, matchDetails)
    let intendedMovementX = thisPlayer.currentPOS[0] + move[0]
    let intendedMovementY = thisPlayer.currentPOS[1] + move[1]
    if (intendedMovementX < matchDetails.pitchSize[0] + 1 && intendedMovementX > -1) {
      let newXpos = thisPlayer.currentPOS[0] + move[0]
      thisPlayer.currentPOS[0] = newXpos
    }
    if (intendedMovementY < matchDetails.pitchSize[1] + 1 && intendedMovementY > -1) {
      let newYpos = thisPlayer.currentPOS[1] + move[1]
      thisPlayer.currentPOS[1] = newYpos
    }
    let xPosition = common.isBetween(thisPlayer.currentPOS[0], position[0] - 3, position[0] + 3)
    let yPosition = common.isBetween(thisPlayer.currentPOS[1], position[1] - 3, position[1] + 3)
    if (xPosition && yPosition && withTeam !== team.name) {
      if (thisPlayer.currentPOS[0] === position[0] && thisPlayer.currentPOS[1] === position[1]) {
        if (withPlayer === true && thisPlayer.hasBall === false && withTeam !== team.name) {
          if (action === `tackle`) {
            let foul = actions.resolveTackle(thisPlayer, team, opposition, matchDetails)
            if (foul) {
              let intensity = actions.foulIntensity()
              if (common.isBetween(intensity, 75, 90)) {
                thisPlayer.cards.yellow++
              } else if (common.isBetween(intensity, 90, 100)) {
                thisPlayer.cards.red++
              }
              if (opposition.name == matchDetails.kickOffTeam.name) {
                setPositions.setSetpieceKickOffTeam(matchDetails)
              } else {
                setPositions.setSetpieceSecondTeam(matchDetails)
              }
            }
          }
        } else {
          thisPlayer.hasBall = true
          lastTouch = thisPlayer.name
          let tempArray = thisPlayer.currentPOS
          matchDetails.ball.position = tempArray.map(x => x)
          matchDetails.ball.ballOverIterations = []
          Player = thisPlayer.name
          withPlayer = true
          withTeam = team.name
          team.intent = `attack`
          opposition.intent = `defend`
          if (thisPlayer.offside) {
            matchDetails.iterationLog.push(thisPlayer.name, ` is offside `)
            if (team.name == matchDetails.kickOffTeam.name) {
              setPositions.setSetpieceKickOffTeam(matchDetails)
            } else {
              setPositions.setSetpieceSecondTeam(matchDetails)
            }
          }
        }
      } else if (withPlayer === true && thisPlayer.hasBall === false && withTeam !== team.name) {
        if (action === `slide`) {
          let foul = actions.resolveSlide(thisPlayer, team, opposition, matchDetails)
          if (foul) {
            let intensity = actions.foulIntensity()
            if (common.isBetween(intensity, 65, 90)) {
              thisPlayer.cards.yellow++
            } else if (common.isBetween(intensity, 85, 100)) {
              thisPlayer.cards.red++
            }
            if (team.name == matchDetails.kickOffTeam.name) {
              setPositions.setSetpieceKickOffTeam(matchDetails)
            } else {
              setPositions.setSetpieceSecondTeam(matchDetails)
            }
          }
        }
      } else {
        thisPlayer.hasBall = true
        matchDetails.ball.lastTouch = thisPlayer.name
        matchDetails.ball.ballOverIterations = []
        matchDetails.ball.position = thisPlayer.currentPOS.map(x => x)
        matchDetails.ball.Player = thisPlayer.name
        matchDetails.ball.withPlayer = true
        matchDetails.ball.withTeam = team.name
        team.intent = `attack`
        opposition.intent = `defend`
        if (thisPlayer.offside) {
          matchDetails.iterationLog.push(thisPlayer.name, ` is offside `)
          if (team.name == matchDetails.kickOffTeam.name) {
            setPositions.setSetpieceKickOffTeam(matchDetails)
          } else {
            setPositions.setSetpieceSecondTeam(matchDetails)
          }
        }
      }
    } else if (xPosition && yPosition && withPlayer == false) {
      thisPlayer.hasBall = true
      matchDetails.ball.lastTouch = thisPlayer.name
      matchDetails.ball.ballOverIterations = []
      matchDetails.ball.position = thisPlayer.currentPOS.map(x => x)
      matchDetails.ball.Player = thisPlayer.name
      matchDetails.ball.withPlayer = true
      matchDetails.ball.withTeam = team.name
      team.intent = `attack`
      opposition.intent = `defend`
      if (thisPlayer.offside) {
        matchDetails.iterationLog.push(thisPlayer.name, ` is offside `)
        if (team.name == matchDetails.kickOffTeam.name) {
          setPositions.setSetpieceKickOffTeam(matchDetails)
        } else {
          setPositions.setSetpieceSecondTeam(matchDetails)
        }
      }
    }
    //handle Player with balls action
    if (thisPlayer.hasBall === true) {
      ballMovement.getBallDirection(matchDetails, thisPlayer.currentPOS)
      let tempArray = thisPlayer.currentPOS
      matchDetails.ball.position = tempArray.map(x => x)
      matchDetails.ball.position[2] = 0
      if (ballActions.includes(action)) {
        thisPlayer.hasBall = false
        matchDetails.ball.withPlayer = false
        team.intent = `attack`
        opposition.intent = `attack`
        matchDetails.ball.Player = ``
        matchDetails.ball.withTeam = ``
        if (action === `cleared` || action === `boot`) {
          let newPosition = ballMovement.ballKicked(matchDetails, thisPlayer)
          let tempPosition = newPosition.map(x => x)
          matchDetails.ball.position = tempPosition
          matchDetails.ball.position[2] = 0
          thisPlayer.hasBall = false
        } else if (action === `pass`) {
          let newPosition = ballMovement.ballPassed(matchDetails, team, thisPlayer)
          matchDetails.iterationLog.push(`passed to new position: ${newPosition}`)
          let tempPosition = newPosition.map(x => x)
          matchDetails.ball.position = tempPosition
          matchDetails.ball.position[2] = 0
          thisPlayer.hasBall = false
        } else if (action === `cross`) {
          let newPosition = ballMovement.ballCrossed(matchDetails, thisPlayer)
          matchDetails.iterationLog.push(`crossed to new position: ${newPosition}`)
          let tempPosition = newPosition.map(x => x)
          matchDetails.ball.position = tempPosition
          matchDetails.ball.position[2] = 0
          thisPlayer.hasBall = false
        } else if (action === `throughBall`) {
          let newPosition = ballMovement.throughBall(matchDetails, team, thisPlayer)
          let tempPosition = newPosition.map(x => x)
          matchDetails.ball.position = tempPosition
          matchDetails.ball.position[2] = 0
          thisPlayer.hasBall = false
        } else if (action === `shoot`) {
          let newPosition = ballMovement.shotMade(matchDetails, team, opposition, thisPlayer)
          let tempPosition = newPosition.map(x => x)
          matchDetails.ball.position = tempPosition
          matchDetails.ball.position[2] = 0
          thisPlayer.hasBall = false
        }
      }
    }
    // let output = `Player Name: ${thisPlayer.name}, Origin Position: ${thisPlayer.originPOS}`
    // output += `, Ball Position: ${position}, Player to ball X: ${ballToPlayerX}`
    // output += `, Player to ball Y: ${ballToPlayerY}, \n Player Has Ball: ${thisPlayer.hasBall}`
    // output += `, Action: ${action}, Movement: ${move}`
    // output += `, Injured?: ${thisPlayer.injured}, Relative Position: ${thisPlayer.intentPOS}`
    // output += `, Final Position: ${thisPlayer.currentPOS}, Intent: ${team.intent}`
    // // iterationLog.push(output);
    // console.log(output)
  }
  return team
}

function makeMovement(player, action, opposition, ballX, ballY, matchDetails) {
  const { position } = matchDetails.ball
  const ballActions = [`shoot`, `throughBall`, `pass`, `cross`, `cleared`, `boot`]
  let move = []
  if (action === `wait`) {
    return [0, 0]
  } else if (ballActions.includes(action)) {
    return [0, 0]
  } else if (action === `tackle` || action === `slide`) {
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
  } else if (action === `intercept`) {
    let playerInformation = setPositions.closestPlayerToPosition(`name`, opposition, position)
    let interceptPlayer = playerInformation.thePlayer
    const [interceptX, interceptY] = interceptPlayer.currentPOS
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
    let interceptPositionX = player.currentPOS[0] - interceptionPosition[0]
    let interceptPositionY = player.currentPOS[1] - interceptionPosition[1]
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
  } else if (action === `run`) {
    if (player.fitness > 20) {
      player.fitness = common.round(player.fitness - 0.005, 6)
    }
    if (player.hasBall) {
      if (player.originPOS[1] > matchDetails.pitchSize[1] / 2) {
        return [common.getRandomNumber(0, 2), common.getRandomNumber(0, 2)]
      }
      return [common.getRandomNumber(-2, 0), common.getRandomNumber(-2, 0)]
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
    let formationDirection = setPositions.formationCheck(player.intentPOS, player.currentPOS)
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
  } else if (action === `sprint`) {
    if (player.fitness > 30) {
      player.fitness = common.round(player.fitness - 0.01, 6)
    }
    if (player.hasBall) {
      if (player.originPOS[1] > matchDetails.pitchSize[1] / 2) {
        return [common.getRandomNumber(-4, 4), common.getRandomNumber(-4, -2)]
      }
      return [common.getRandomNumber(-4, 4), common.getRandomNumber(2, 4)]
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
    let formationDirection = setPositions.formationCheck(player.intentPOS, player.currentPOS)
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

function closestPlayerToBall(closestPlayer, team, matchDetails) {
  try {
    let closestPlayerDetails
    let { position } = matchDetails.ball
    for (let thisPlayer of team.players) {
      let ballToPlayerX = thisPlayer.currentPOS[0] - position[0]
      let ballToPlayerY = thisPlayer.currentPOS[1] - position[1]
      let proximityToBall = Math.abs(ballToPlayerX + ballToPlayerY)
      if (proximityToBall < closestPlayer.position) {
        closestPlayer.name = thisPlayer.name
        closestPlayer.position = proximityToBall
        closestPlayerDetails = thisPlayer
      }
    }
    setPositions.setIntentPosition(matchDetails, closestPlayerDetails)
    matchDetails.iterationLog.push(`Closest Player to ball: ${closestPlayerDetails.name}`)
  } catch (err) {
    throw new Error(`Error getting closest player to ball: ${err}`)
  }
}

function checkOffside(team1, team2, matchDetails) {
  let offsideYposition
  const { ball } = matchDetails
  const { pitchSize } = matchDetails
  const team1side = (team1.players[0].originPOS[1] < (pitchSize[1] / 2)) ? `top` : `bottom`
  const team2side = (team2.players[0].originPOS[1] < (pitchSize[1] / 2)) ? `top` : `bottom`
  if (common.isBetween(ball.position[1], 0, (pitchSize[1] / 2))) {
    if (ball.withTeam == team1.name && team1side == `top`) {
      //do nothing. Team are in their own half
    } else if (ball.withTeam == team1.name && team1side == `bottom`) {
      offsideYposition = offsideYPOS(team2, `top`, pitchSize[1])
      for (let thisPlayer of team1.players) {
        thisPlayer.offside = false
        if (common.isBetween(thisPlayer.currentPOS[1], offsideYposition.pos1, offsideYposition.pos2)) {
          if (!thisPlayer.hasBall) {
            thisPlayer.offside = true
            matchDetails.iterationLog.push(thisPlayer.name, ` is offside`)
          }
        }
      }
    } else if (ball.withTeam == team2.name && team2side == `top`) {
      //do nothing. Team are in their own half
    } else if (ball.withTeam == team2.name && team2side == `bottom`) {
      offsideYposition = offsideYPOS(team2, `top`, pitchSize[1])
      for (let thisPlayer of team1.players) {
        thisPlayer.offside = false
        if (common.isBetween(thisPlayer.currentPOS[1], offsideYposition.pos1, offsideYposition.pos2)) {
          if (!thisPlayer.hasBall) {
            thisPlayer.offside = true
            matchDetails.iterationLog.push(thisPlayer.name, ` is offside`)
          }
        }
      }
    } else {
      //nobody has the ball
    }
  } else if (ball.withTeam == team1.name && team1side == `bottom`) {
    //do nothing. Team are in their own half
  } else if (ball.withTeam == team1.name && team1side == `top`) {
    offsideYposition = offsideYPOS(team2, `top`, pitchSize[1])
    for (let thisPlayer of team1.players) {
      thisPlayer.offside = false
      if (common.isBetween(thisPlayer.currentPOS[1], offsideYposition.pos1, offsideYposition.pos2)) {
        if (!thisPlayer.hasBall) {
          thisPlayer.offside = true
          matchDetails.iterationLog.push(thisPlayer.name, ` is offside`)
        }
      }
    }
  } else if (ball.withTeam == team2.name && team2side == `bottom`) {
    //do nothing. Team are in their own half
  } else if (ball.withTeam == team2.name && team2side == `top`) {
    offsideYposition = offsideYPOS(team2, `top`, pitchSize[1])
    for (let thisPlayer of team1.players) {
      thisPlayer.offside = false
      if (common.isBetween(thisPlayer.currentPOS[1], offsideYposition.pos1, offsideYposition.pos2)) {
        if (!thisPlayer.hasBall) {
          thisPlayer.offside = true
          matchDetails.iterationLog.push(thisPlayer.name, ` is offside`)
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
    if (thisPlayer.position == `GK`) {
      let [, position1] = thisPlayer.currentPOS
      offsideYPOS.pos1 = position1
    } else if (side == `top`) {
      if (thisPlayer.currentPOS[1] < offsideYPOS.pos2) {
        let [, position2] = thisPlayer.currentPOS
        offsideYPOS.pos2 = position2
      }
    } else if (thisPlayer.currentPOS[1] > offsideYPOS.pos2) {
      let [, position2] = thisPlayer.currentPOS
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
