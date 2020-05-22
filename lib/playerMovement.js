const common = require(`../lib/common`)
const ballMovement = require(`../lib/ballMovement`)
const setPositions = require(`../lib/setPositions`)
const actions = require(`../lib/actions`)

function decideMovement(closestPlayer, team, opp, matchDetails) {
  const allActions = [`shoot`, `throughBall`, `pass`, `cross`, `tackle`, `intercept`, `slide`]
  Array.prototype.push.apply(allActions, [`run`, `sprint`, `cleared`, `boot`, `penalty`])
  const ballActions = [`shoot`, `throughBall`, `pass`, `cross`, `cleared`, `boot`, `penalty`]
  let {
    position, withPlayer, withTeam
  } = matchDetails.ball
  for (const thisPlayer of team.players) {
    if (thisPlayer.currentPOS[0] != 'NP') {
      let ballToPlayerX = thisPlayer.currentPOS[0] - position[0]
      let ballToPlayerY = thisPlayer.currentPOS[1] - position[1]
      let possibleActions
      possibleActions = actions.findPossActions(thisPlayer, team, opp, ballToPlayerX, ballToPlayerY, matchDetails)
      let action = actions.selectAction(possibleActions)
      let providedAction = (thisPlayer.action) ? thisPlayer.action : `unassigned`
      if (allActions.includes(providedAction)) {
        if (thisPlayer.playerID !== matchDetails.ball.Player) {
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
      } else if (withTeam && withTeam !== team.teamID) {
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
      let move = makeMovement(thisPlayer, action, opp, ballToPlayerX, ballToPlayerY, matchDetails)
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
          if (withPlayer === true && thisPlayer.hasBall === false && withTeam !== team.teamID) {
            if (action === `tackle`) {
              let foul = actions.resolveTackle(thisPlayer, team, opp, matchDetails)
              if (foul) {
                let intensity = actions.foulIntensity()
                if (common.isBetween(intensity, 75, 90)) {
                  thisPlayer.stats.cards.yellow++
                  if (thisPlayer.stats.cards.yellow == 2) {
                    thisPlayer.stats.cards.red++
                    thisPlayer.currentPOS = ['NP', 'NP']
                  }
                } else if (common.isBetween(intensity, 90, 100)) {
                  thisPlayer.stats.cards.red++
                  thisPlayer.currentPOS = ['NP', 'NP']
                }
                if (opp.name == matchDetails.kickOffTeam.name) {
                  setPositions.setSetpieceKickOffTeam(matchDetails)
                } else {
                  setPositions.setSetpieceSecondTeam(matchDetails)
                }
              }
            }
          } else {
            thisPlayer.hasBall = true
            matchDetails.ball.lastTouch = thisPlayer.name
            let tempArray = thisPlayer.currentPOS
            matchDetails.ball.position = tempArray.map(x => x)
            matchDetails.ball.ballOverIterations = []
            matchDetails.ball.Player = thisPlayer.playerID
            withPlayer = true
            withTeam = team.teamID
            team.intent = `attack`
            opp.intent = `defend`
            if (thisPlayer.offside) {
              matchDetails.iterationLog.push(`${thisPlayer.name} is offside`)
              if (team.name == matchDetails.kickOffTeam.name) {
                setPositions.setSetpieceKickOffTeam(matchDetails)
              } else {
                setPositions.setSetpieceSecondTeam(matchDetails)
              }
            }
          }
        } else if (withPlayer === true && thisPlayer.hasBall === false && withTeam !== team.teamID) {
          if (action === `slide`) {
            let foul = actions.resolveSlide(thisPlayer, team, opp, matchDetails)
            if (foul) {
              let intensity = actions.foulIntensity()
              if (common.isBetween(intensity, 65, 90)) {
                thisPlayer.stats.cards.yellow++
                if (thisPlayer.stats.cards.yellow == 2) {
                  thisPlayer.stats.cards.red++
                  thisPlayer.currentPOS = ['NP', 'NP']
                }
              } else if (common.isBetween(intensity, 85, 100)) {
                thisPlayer.stats.cards.red++
                thisPlayer.currentPOS = ['NP', 'NP']
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
          matchDetails.ball.Player = thisPlayer.playerID
          matchDetails.ball.withPlayer = true
          matchDetails.ball.withTeam = team.teamID
          team.intent = `attack`
          opp.intent = `defend`
          if (thisPlayer.offside) {
            matchDetails.iterationLog.push(`${thisPlayer.name} is offside`)
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
        matchDetails.ball.Player = thisPlayer.playerID
        matchDetails.ball.withPlayer = true
        matchDetails.ball.withTeam = team.teamID
        team.intent = `attack`
        opp.intent = `defend`
        if (thisPlayer.offside) {
          matchDetails.iterationLog.push(`${thisPlayer.name} is offside`)
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
          opp.intent = `attack`
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
            let newPosition = ballMovement.shotMade(matchDetails, team, opp, thisPlayer)
            let tempPosition = newPosition.map(x => x)
            matchDetails.ball.position = tempPosition
            matchDetails.ball.position[2] = 0
            thisPlayer.hasBall = false
          } else if (action === `penalty`) {
            let newPosition = ballMovement.penaltyTaken(matchDetails, team, opp, thisPlayer)
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
  }
  return team
}

function makeMovement(player, action, opposition, ballX, ballY, matchDetails) {
  const { position } = matchDetails.ball
  const ballActions = [`shoot`, `throughBall`, `pass`, `cross`, `cleared`, `boot`, `penalty`]
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
}

function checkOffside(team1, team2, matchDetails) {
  const { ball } = matchDetails
  const { pitchSize } = matchDetails
  const team1side = (team1.players[0].originPOS[1] < (pitchSize[1] / 2)) ? `top` : `bottom`
  if (ball.withTeam == false) return matchDetails
  if (team1side == `bottom`) {
    team1atBottom(team1, team2, pitchSize[1])
  } else {
    team1atTop(team1, team2, pitchSize[1])
  }
}

function getTopMostPlayer(team, pitchHeight) {
  let player
  for (let thisPlayer of team.players) {
    let topMostPosition = pitchHeight
    if (thisPlayer.currentPOS[1] < topMostPosition) {
      topMostPosition = thisPlayer.currentPOS[1]
      player = thisPlayer
    }
  }
  return player
}

function getBottomMostPlayer(team) {
  let player
  for (let thisPlayer of team.players) {
    let topMostPosition = 0
    if (thisPlayer.currentPOS[1] > topMostPosition) {
      topMostPosition = thisPlayer.currentPOS[1]
      player = thisPlayer
    }
  }
  return player
}

function team1atBottom(team1, team2, pitchHeight) {
  offsideT1Yposition = offsideYPOS(team2, `top`, pitchHeight)
  let topPlayer = getTopMostPlayer(team1, pitchHeight)
  let topPlayerOffsidePosition = common.isBetween(topPlayer.currentPOS[1], offsideT1Yposition.pos1, offsideT1Yposition.pos2) 
  if(topPlayerOffsidePosition && topPlayer.hasBall) return 
  for (let thisPlayer of team1.players) {
    thisPlayer.offside = false
    if (common.isBetween(thisPlayer.currentPOS[1], offsideT1Yposition.pos1, offsideT1Yposition.pos2)) {
      if (!thisPlayer.hasBall) thisPlayer.offside = true
    }
  }
  offsideT2Yposition = offsideYPOS(team1, `bottom`, pitchHeight)
  let btmPlayer = getBottomMostPlayer(team2)
  let btmPlayerOffsidePosition = common.isBetween(btmPlayer.currentPOS[1], offsideT1Yposition.pos2, offsideT1Yposition.pos1) 
  if(btmPlayerOffsidePosition && btmPlayer.hasBall) return 
  for (let thisPlayer of team2.players) {
    thisPlayer.offside = false
    if (common.isBetween(thisPlayer.currentPOS[1], offsideT1Yposition.pos2, offsideT1Yposition.pos1)) {
      if (!thisPlayer.hasBall) thisPlayer.offside = true
    }
  }
}

function team1atTop(team1, team2, pitchHeight) {
  offsideT1Yposition = offsideYPOS(team2, `bottom`, pitchHeight)
  let btmPlayer = getBottomMostPlayer(team1)
  let btmPlayerOffsidePosition = common.isBetween(btmPlayer.currentPOS[1], offsideT1Yposition.pos2, offsideT1Yposition.pos1) 
  if(btmPlayerOffsidePosition && btmPlayer.hasBall) return 
  for (let thisPlayer of team1.players) {
    thisPlayer.offside = false
    if (common.isBetween(thisPlayer.currentPOS[1], offsideT1Yposition.pos2, offsideT1Yposition.pos1)) {
      if (!thisPlayer.hasBall) thisPlayer.offside = true
    }
  }
  offsideT2Yposition = offsideYPOS(team1, `top`, pitchHeight)
  let topPlayer = getTopMostPlayer(team2, pitchHeight)
  let topPlayerOffsidePosition = common.isBetween(topPlayer.currentPOS[1], offsideT1Yposition.pos1, offsideT1Yposition.pos2) 
  if(topPlayerOffsidePosition && topPlayer.hasBall) return 
  for (let thisPlayer of team2.players) {
    thisPlayer.offside = false
    if (common.isBetween(thisPlayer.currentPOS[1], offsideT2Yposition.pos1, offsideT2Yposition.pos2)) {
      if (!thisPlayer.hasBall) thisPlayer.offside = true
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
      if(thisPlayer.hasBall){
        offsideYPOS.pos2 = position1
        return offsideYPOS
      }
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
  team1atBottom,
  team1atTop,
  checkOffside
}
