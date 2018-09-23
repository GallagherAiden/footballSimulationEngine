const common = require('../lib/common')
const setPositions = require('../lib/setPositions')

async function selectAction(possibleActions) {
  let goodActions = []
  let decision
  for (const thisAction of possibleActions) {
    let tempArray = Array(thisAction.points).fill(thisAction.name)
    goodActions = goodActions.concat(tempArray)
    if (goodActions[0] == null) {
      decision = 'wait'
    } else {
      decision = goodActions[common.getRandomNumber(0, goodActions.length - 1)]
    }
  }
  return decision
}

function findPossibleActions(player, opposition, ballX, ballY, matchDetails) {
  let possibleActions = [{
    'name': 'shoot',
    'points': 0
  }, {
    'name': 'throughBall',
    'points': 0
  }, {
    'name': 'pass',
    'points': 0
  }, {
    'name': 'cross',
    'points': 0
  }, {
    'name': 'tackle',
    'points': 0
  }, {
    'name': 'intercept',
    'points': 0
  }, {
    'name': 'slide',
    'points': 0
  }, {
    'name': 'run',
    'points': 0
  }, {
    'name': 'sprint',
    'points': 0
  }, {
    'name': 'cleared',
    'points': 0
  }, {
    'name': 'boot',
    'points': 0
  }]
  let playerInformation = setPositions.closestPlayerToPosition(player, opposition, player.startPOS)
  let playerProximity = [Math.abs(playerInformation.proximity[0]), Math.abs(playerInformation.proximity[1])]
  let closePlayerPosition = playerInformation.thePlayer
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let {
    hasBall, position, startPOS, originPOS, skill
  } = player
  //[0]shoot, [1]throughBall, [2]pass, [3]cross, [4]tackle, [5]intercept
  //[6]slide, [7]run, [8]sprint //[9]cleared //[10]boot
  let parameters = []
  if (hasBall === false) {
    if (position === 'GK') {
      parameters = [0, 0, 0, 0, 0, 0, 0, 60, 40, 0, 0]
    } else if (common.isBetween(ballX, -2, 2) && common.isBetween(ballY, -2, 2)) {
      if (originPOS[1] > (pitchHeight / 2)) {
        let yPosition = common.isBetween(startPOS[0], (pitchWidth / 4) - 5, pitchWidth - (pitchWidth / 4) + 5)
        let xPosition = common.isBetween(startPOS[1], pitchHeight - (pitchHeight / 6) + 5, pitchHeight)
        if (yPosition && xPosition) {
          if (matchDetails.ball.withPlayer === false) {
            parameters = [0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0]
          } else {
            parameters = [0, 0, 0, 0, 50, 0, 10, 20, 20, 0, 0]
          }
        } else if (matchDetails.ball.withPlayer === false) {
          parameters = [0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0]
        } else {
          parameters = [0, 0, 0, 0, 70, 10, 20, 0, 0, 0, 0]
        }
      } else if (common.isBetween(startPOS[0], (pitchWidth / 4) - 5, pitchWidth - (pitchWidth / 4) + 5) && common.isBetween(startPOS[1], 0, (pitchHeight / 6) - 5)) {
        if (matchDetails.ball.withPlayer === false) {
          parameters = [0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0]
        } else {
          parameters = [0, 0, 0, 0, 40, 0, 20, 10, 30, 0, 0]
        }
      } else if (matchDetails.ball.withPlayer === false) {
        parameters = [0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0]
      } else {
        parameters = [0, 0, 0, 0, 70, 10, 20, 0, 0, 0, 0]
      }
    } else if (common.isBetween(ballX, -4, 4) && common.isBetween(ballY, -4, 4)) {
      if (originPOS[1] > (pitchHeight / 2)) {
        let xPosition = common.isBetween(startPOS[0], (pitchWidth / 4) - 5, pitchWidth - (pitchWidth / 4) + 5)
        let yPosition = common.isBetween(startPOS[1], pitchHeight - (pitchHeight / 6) + 5, pitchHeight)
        if (xPosition && yPosition) {
          if (matchDetails.ball.withPlayer === false) {
            parameters = [0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0]
          } else {
            parameters = [0, 0, 0, 0, 40, 0, 20, 10, 30, 0, 0]
          }
        } else if (matchDetails.ball.withPlayer === false) {
          parameters = [0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0]
        } else {
          parameters = [0, 0, 0, 0, 50, 0, 50, 0, 0, 0, 0]
        }
      } else if (common.isBetween(startPOS[0], (pitchWidth / 4) - 5, pitchWidth - (pitchWidth / 4) + 5) && common.isBetween(startPOS[1], 0, (pitchHeight / 6) - 5)) {
        if (matchDetails.ball.withPlayer === false) {
          parameters = [0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0]
        } else {
          parameters = [0, 0, 0, 0, 40, 0, 20, 10, 30, 0, 0]
        }
      } else if (matchDetails.ball.withPlayer === false) {
        parameters = [0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0]
      } else {
        parameters = [0, 0, 0, 0, 50, 0, 50, 0, 0, 0, 0]
      }
    } else if (common.isBetween(ballX, -20, 20) && common.isBetween(ballY, -20, 20)) {
      if (matchDetails.ball.withPlayer === false) {
        parameters = [0, 0, 0, 0, 0, 0, 0, 60, 40, 0, 0]
      } else {
        parameters = [0, 0, 0, 0, 0, 40, 0, 30, 30, 0, 0]
      }
    } else {
      parameters = [0, 0, 0, 0, 0, 10, 0, 50, 30, 0, 0]
    }
  } else if (originPOS[1] > (pitchHeight / 2)) {
    if (position === 'GK') {
      if (playerProximity[0] < 10 && playerProximity[1] < 25) {
        parameters = [0, 0, 10, 0, 0, 0, 0, 10, 0, 40, 40]
      } else {
        parameters = [0, 0, 50, 0, 0, 0, 0, 10, 0, 20, 20]
      }
    } else if (common.isBetween(startPOS[0], (pitchWidth / 4) - 5, pitchWidth - (pitchWidth / 4) + 5) && common.isBetween(startPOS[1], 0, (pitchHeight / 6) - 5)) {
      let xPosition = common.isBetween(startPOS[0], (pitchWidth / 3) - 5, pitchWidth - (pitchWidth / 3) + 5)
      let yPosition = common.isBetween(startPOS[1], 0, (pitchHeight / 12) - 5)
      if (xPosition && yPosition) {
        if (playerProximity[0] < 6 && playerProximity[1] < 6) {
          if (closePlayerPosition[1] < startPOS[1]) {
            parameters = [20, 0, 70, 0, 0, 0, 0, 10, 0, 0, 0]
          } else {
            parameters = [80, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        } else {
          parameters = [70, 10, 20, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      } else if (playerProximity[0] < 6 && playerProximity[1] < 6) {
        parameters = [10, 0, 70, 0, 0, 0, 0, 20, 0, 0, 0]
      } else {
        parameters = [70, 0, 20, 0, 0, 0, 0, 10, 0, 0, 0]
      }
    } else if (common.isBetween(startPOS[1], (pitchHeight / 6) - 5, pitchHeight / 3)) {
      if (playerProximity[0] < 10 && playerProximity[1] < 10) {
        parameters = [30, 20, 20, 10, 0, 0, 0, 20, 0, 0, 0]
      } else {
        parameters = [70, 10, 10, 0, 0, 0, 0, 10, 0, 0, 0]
      }
    } else if (common.isBetween(startPOS[1], (pitchHeight / 3), (2 * (pitchHeight / 3)))) {
      if (playerProximity[0] < 10 && playerProximity[1] < 10) {
        parameters = [0, 20, 30, 20, 0, 0, 20, 0, 0, 0, 10]
      } else if (skill.shooting > 85) {
        parameters = [60, 10, 10, 0, 0, 0, 20, 0, 0, 0, 0]
      } else if (position === 'LM' || position === 'CM' || position === 'RM') {
        parameters = [0, 10, 10, 10, 0, 0, 0, 30, 40, 0, 0]
      } else if (position === 'ST') {
        parameters = [0, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0]
      } else {
        parameters = [10, 10, 10, 10, 0, 0, 0, 30, 20, 0, 10]
      }
    } else if (playerProximity[0] < 10 && playerProximity[1] < 10) {
      parameters = [0, 0, 0, 0, 0, 0, 0, 10, 0, 70, 20]
    } else if (position === 'LM' || position === 'CM' || position === 'RM') {
      parameters = [0, 0, 30, 0, 0, 0, 0, 30, 40, 0, 0]
    } else if (position === 'ST') {
      parameters = [0, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0]
    } else {
      parameters = [0, 0, 40, 0, 0, 0, 0, 30, 0, 20, 10]
    }
  } else if (position === 'GK') {
    if (playerProximity[0] < 10 && playerProximity[1] < 25) {
      parameters = [0, 0, 10, 0, 0, 0, 0, 10, 0, 40, 40]
    } else {
      parameters = [0, 0, 50, 0, 0, 0, 0, 10, 0, 20, 20]
    }
  } else if (common.isBetween(startPOS[0], (pitchWidth / 4) - 5, pitchWidth - (pitchWidth / 4) + 5) && common.isBetween(startPOS[1], (pitchHeight - (pitchHeight / 6) + 5), pitchHeight)) {
    let xPosition = common.isBetween(startPOS[0], (pitchWidth / 3) - 5, pitchWidth - (pitchWidth / 3) + 5)
    let yPosition = common.isBetween(startPOS[1], (pitchHeight - (pitchHeight / 12) + 5), pitchHeight)
    if (xPosition && yPosition) {
      if (playerProximity[0] < 6 && playerProximity[1] < 6) {
        if (closePlayerPosition[1] > startPOS[1]) {
          parameters = [20, 0, 70, 0, 0, 0, 0, 10, 0, 0, 0]
        } else {
          parameters = [80, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      } else {
        parameters = [70, 10, 20, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    } else if (playerProximity[0] < 6 && playerProximity[1] < 6) {
      parameters = [10, 0, 70, 0, 0, 0, 0, 20, 0, 0, 0]
    } else {
      parameters = [70, 0, 20, 0, 0, 0, 0, 10, 0, 0, 0]
    }
  } else if (common.isBetween(startPOS[1], (pitchHeight - (pitchHeight / 3)), (pitchHeight - (pitchHeight / 6) + 5))) {
    if (playerProximity[0] < 10 && playerProximity[1] < 10) {
      parameters = [30, 20, 20, 10, 0, 0, 0, 20, 0, 0, 0]
    } else {
      parameters = [70, 10, 10, 0, 0, 0, 0, 10, 0, 0, 0]
    }
  } else if (common.isBetween(startPOS[1], (pitchHeight / 3), (pitchHeight - (pitchHeight / 3)))) {
    if (playerProximity[0] < 10 && playerProximity[1] < 10) {
      parameters = [0, 20, 30, 20, 0, 0, 20, 0, 0, 0, 10]
    } else if (skill.shooting > 85) {
      parameters = [60, 10, 10, 0, 0, 0, 20, 0, 0, 0, 0]
    } else if (position === 'LM' || position === 'CM' || position === 'RM') {
      parameters = [0, 10, 10, 10, 0, 0, 0, 30, 40, 0, 0]
    } else if (position === 'ST') {
      parameters = [0, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0]
    } else {
      parameters = [10, 10, 10, 10, 0, 0, 0, 30, 20, 0, 10]
    }
  } else if (playerProximity[0] < 10 && playerProximity[1] < 10) {
    parameters = [0, 0, 0, 0, 0, 0, 0, 10, 0, 70, 20]
  } else if (position === 'LM' || position === 'CM' || position === 'RM') {
    parameters = [0, 0, 30, 0, 0, 0, 0, 30, 40, 0, 0]
  } else if (position === 'ST') {
    parameters = [0, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0]
  } else {
    parameters = [0, 0, 40, 0, 0, 0, 0, 30, 0, 20, 10]
  }
  return populatePossibleActions(possibleActions, ...parameters)
}

function populatePossibleActions(possibleActions, shoot, throughball, pass, cross, tackle, intercept, slide, run, sprint, cleared, boot) {
  possibleActions[0].points = shoot
  possibleActions[1].points = throughball
  possibleActions[2].points = pass
  possibleActions[3].points = cross
  possibleActions[4].points = tackle
  possibleActions[5].points = intercept
  possibleActions[6].points = slide
  possibleActions[7].points = run
  possibleActions[8].points = sprint
  possibleActions[9].points = cleared
  possibleActions[10].points = boot
  return possibleActions
}

async function resolveTackle(player, team, opposition, matchDetails) {
  const [, pitchHeight] = matchDetails.pitchSize
  let foul = false
  matchDetails.iterationLog.push(`Tackle attempted by: ${player.name}`)
  for (const thatPlayer of opposition.players) {
    if (matchDetails.ball.Player === thatPlayer.name) {
      let tackleScore = (parseInt(player.skill.tackling, 10) + parseInt(player.skill.strength, 10)) / 2
      tackleScore += common.getRandomNumber(-5, 5)
      let retentionScore = (parseInt(thatPlayer.skill.agility, 10) + parseInt(thatPlayer.skill.strength, 10)) / 2
      retentionScore += common.getRandomNumber(-5, 5)
      if (wasFoul(10, 18) === true) {
        matchDetails.iterationLog.push('Foul against: ', thatPlayer.name)
        if (team.name === matchDetails.kickOffTeam.name) {
          matchDetails.kickOffTeamStatistics.fouls++
        } else {
          matchDetails.secondTeamStatistics.fouls++
        }
        foul = true
      } else if (tackleScore > retentionScore) {
        matchDetails.iterationLog.push('Successful tackle by: ', player.name)
        if (common.isInjured(14000) === true) {
          thatPlayer.injured = true
          matchDetails.iterationLog.push(`Player Injured - ${thatPlayer.name}`)
        }
        if (common.isInjured(15000) === true) {
          player.injured = true
          matchDetails.iterationLog.push(`Player Injured - ${thatPlayer.name}`)
        }
        player.hasBall = true
        matchDetails.ball.Player = player.name
        matchDetails.ball.withPlayer = true
        matchDetails.ball.withTeam = team.name
        team.intent = 'attack'
        opposition.intent = 'defend'
        if (player.originPOS[1] > pitchHeight / 2) {
          player.startPOS[1]--
          matchDetails.ball.position[1]--
          thatPlayer.startPOS[1]++
        } else {
          player.startPOS[1]++
          matchDetails.ball.position[1]++
          thatPlayer.startPOS[1]--
        }
      } else {
        matchDetails.iterationLog.push('Failed tackle by: ', player.name)
        if (common.isInjured(15000) === true) {
          thatPlayer.injured = true
          matchDetails.iterationLog.push(`Player Injured - ${thatPlayer.name}`)
        }
        if (common.isInjured(14000) === true) {
          player.injured = true
          matchDetails.iterationLog.push(`Player Injured - ${thatPlayer.name}`)
        }
        if (thatPlayer.originPOS[1] > pitchHeight / 2) {
          thatPlayer.startPOS[1]--
          matchDetails.ball.position[1]--
          player.startPOS[1]++
        } else {
          thatPlayer.startPOS[1]++
          matchDetails.ball.position[1]++
          player.startPOS[1]--
        }
      }
    }
  }
  return foul
}

async function resolveSlide(player, team, opposition, matchDetails) {
  const [, pitchHeight] = matchDetails.pitchSize
  let foul = false
  matchDetails.iterationLog.push(`Slide tackle attempted by: ${player.name}`)
  for (const thatPlayer of opposition.players) {
    if (matchDetails.ball.Player === thatPlayer.name) {
      let tackleScore = (parseInt(player.skill.tackling, 10) + parseInt(player.skill.strength, 10)) / 2
      tackleScore += common.getRandomNumber(-5, 5)
      let retentionScore = (parseInt(thatPlayer.skill.agility, 10) + parseInt(thatPlayer.skill.strength, 10)) / 2
      retentionScore += common.getRandomNumber(-5, 5)
      if (wasFoul(11, 20) === true) {
        matchDetails.iterationLog.push(`Foul against: ${thatPlayer.name}`)
        if (team.name === matchDetails.kickOffTeam.name) {
          matchDetails.kickOffTeamStatistics.fouls++
        } else {
          matchDetails.secondTeamStatistics.fouls++
        }
        foul = true
      } else if (tackleScore > retentionScore) {
        matchDetails.iterationLog.push('Successful tackle by: ', player.name)
        if (common.isInjured(14000) === true) {
          thatPlayer.injured = true
          matchDetails.iterationLog.push(`Player Injured - ${thatPlayer.name}`)
        }
        if (common.isInjured(15000) === true) {
          player.injured = true
          matchDetails.iterationLog.push(`Player Injured - ${thatPlayer.name}`)
        }
        player.hasBall = true
        matchDetails.ball.Player = player.name
        matchDetails.ball.withPlayer = true
        matchDetails.ball.withTeam = team.name
        team.intent = 'attack'
        opposition.intent = 'defend'
        if (player.originPOS[1] > pitchHeight / 2) {
          player.startPOS[1] += -3
          matchDetails.ball.position[1] += -3
          thatPlayer.startPOS[1]++
        } else {
          player.startPOS[1] += 3
          matchDetails.ball.position[1] += 3
          thatPlayer.startPOS[1] += -3
        }
      } else {
        matchDetails.iterationLog.push('Failed tackle by: ', player.name)
        if (common.isInjured(15000) === true) {
          thatPlayer.injured = true
          matchDetails.iterationLog.push(`Player Injured - ${thatPlayer.name}`)
        }
        if (common.isInjured(14000) === true) {
          player.injured = true
          matchDetails.iterationLog.push(`Player Injured - ${thatPlayer.name}`)
        }
        if (thatPlayer.originPOS[1] > pitchHeight / 2) {
          thatPlayer.startPOS[1] += -3
          matchDetails.ball.position[1] += -3
          player.startPOS[1] += 3
        } else {
          thatPlayer.startPOS[1] += 3
          matchDetails.ball.position[1] += 3
          player.startPOS[1] += -3
        }
      }
    }
  }
  return foul
}

function wasFoul(x, y) {
  let foul = common.getRandomNumber(0, x)
  if (common.isBetween(foul, 0, (y / 2) - 1)) {
    return true
  }
  return false
}

function foulIntensity() {
  return common.getRandomNumber(0, 100)
}

module.exports = {
  selectAction,
  findPossibleActions,
  populatePossibleActions,
  resolveTackle,
  resolveSlide,
  wasFoul,
  foulIntensity
}
