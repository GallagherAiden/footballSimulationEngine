const common = require(`../lib/common`)

function setTopFreekick(matchDetails) {
  removeBallFromAllPlayers(matchDetails)
  let { kickOffTeam, secondTeam } = matchDetails
  let [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let [ballX, ballY] = matchDetails.ball.position
  let attack = (kickOffTeam.players[0].originPOS[1] < pitchHeight / 2) ? kickOffTeam : secondTeam
  let defence = (kickOffTeam.players[0].originPOS[1] < pitchHeight / 2) ? secondTeam : kickOffTeam
  let hundredToHalfway = common.isBetween(ballY, 100, (pitchHeight / 2) + 1)
  let halfwayToLastQuarter = common.isBetween(ballY, pitchHeight / 2, pitchHeight - (pitchHeight / 4))
  let penaltyXspan = common.isBetween(ballX, (pitchWidth / 4) + 5, (pitchWidth - (pitchWidth / 4) - 5))
  let leftOfPenaltyXspan = common.isBetween(ballX, 0, (pitchWidth / 4) + 5)
  let rightOfPenaltyXspan = common.isBetween(ballX, (pitchWidth - (pitchWidth / 4) - 5), pitchWidth)
  let upperFinalQuarter = common.isBetween(ballY, pitchHeight - (pitchHeight / 5), pitchHeight - (pitchHeight / 6) - 5)
  let lowerFinalQuarter = common.isBetween(ballY, pitchHeight - (pitchHeight / 6) - 5, pitchHeight)

  if (ballY < 101) return setTopOneHundredYPos(matchDetails, attack, defence)
  if (hundredToHalfway) return setTopOneHundredToHalfwayYPos(matchDetails, attack, defence)
  if (halfwayToLastQuarter) return setTopHalfwayToBottomQuarterYPos(matchDetails, attack, defence)
  if (penaltyXspan && upperFinalQuarter) return setTopBottomQuarterCentreYPos(matchDetails, attack, defence)
  if (leftOfPenaltyXspan && upperFinalQuarter) return setTopUpperFinalQuarterLeftPos(matchDetails, attack, defence)
  if (leftOfPenaltyXspan && lowerFinalQuarter) return setTopLowerFinalQuarterBylineLeftPos(matchDetails, attack, defence)
  if (rightOfPenaltyXspan && upperFinalQuarter) return setTopUpperFinalQuarterRightPos(matchDetails, attack, defence)
  if (rightOfPenaltyXspan && lowerFinalQuarter) return setTopLowerFinalQuarterBylineRightPos(matchDetails, attack, defence)
}

function setBottomFreekick(matchDetails) {
  return matchDetails
}

function setTopOneHundredYPos(matchDetails, attack, defence) {
  attack.players[0].hasBall = true
  let { ball } = matchDetails
  ball.Player = attack.players[0].name
  ball.withTeam = attack.name
  ball.direction = 'south'
  for (let player of attack.players) {
    if (player.position == 'GK') player.startPOS = matchDetails.ball.position.map(x => x)
    if (player.position != 'GK') player.startPOS = player.originPOS.map(x => x)
  }
  for (let player of defence.players) {
    if (player.position == 'GK') player.startPOS = player.originPOS.map(x => x)
    if (player.position != 'GK') player.startPOS = [player.originPOS[0], player.originPOS[1] - 100]
  }
  return matchDetails
}

function setTopOneHundredToHalfwayYPos(matchDetails, attack, defence) {
  let { ball } = matchDetails
  let [, pitchHeight] = matchDetails.pitchSize
  let goalieToKick = common.isBetween(ball.position[1], 0, (pitchHeight * 0.25) + 1)
  let kickPlayer = (goalieToKick) ? attack.players[0] : attack.players[3]
  kickPlayer.hasBall = true
  ball.Player = kickPlayer.name
  ball.withTeam = attack.name
  ball.direction = 'south'
  for (let player of attack.players) {
    if (kickPlayer.position == 'GK') {
      if (player.position == 'GK') player.startPOS = ball.position.map(x => x)
      if (player.name != kickPlayer.name) player.startPOS = [player.originPOS[0], player.originPOS[1] + 300]
    } else {
      let newYPOS = player.originPOS[1] + (ball.position[1] - player.originPOS[1]) + 300
      if (player.name == kickPlayer.name) player.startPOS = ball.position.map(x => x)
      else if (player.position == 'GK') {
        let maxYPOSCheck = parseInt(common.upToMax(newYPOS, pitchHeight * 0.25), 10)
        player.startPOS = [player.originPOS[0], maxYPOSCheck]
      } else if (['CB', 'LB', 'RB'].includes(player.position)) {
        let maxYPOSCheck = parseInt(common.upToMax(newYPOS, pitchHeight * 0.5), 10)
        player.startPOS = [player.originPOS[0], maxYPOSCheck]
      } else if (['CM', 'LM', 'RM'].includes(player.position)) {
        let maxYPOSCheck = parseInt(common.upToMax(newYPOS, pitchHeight * 0.75), 10)
        player.startPOS = [player.originPOS[0], maxYPOSCheck]
      } else {
        let maxYPOSCheck = parseInt(common.upToMax(newYPOS, pitchHeight * 0.9), 10)
        player.startPOS = [player.originPOS[0], maxYPOSCheck]
      }
    }
  }
  for (let player of defence.players) {
    if (kickPlayer.position == 'GK') {
      if (player.position == 'GK') player.startPOS = player.originPOS.map(x => x)
      if (player.position != 'GK') player.startPOS = [player.originPOS[0], player.originPOS[1] - 100]
    } else {
      if (['GK', 'CB', 'LB', 'RB'].includes(player.position)) player.startPOS = player.originPOS.map(x => x)
      else if (['CM', 'LM', 'RM'].includes(player.position)) {
        player.startPOS = [player.originPOS[0], parseInt((pitchHeight * 0.75) + 5, 10)]
      } else {
        player.startPOS = [player.originPOS[0], parseInt(pitchHeight * 0.5, 10)]
      }
    }
  }
  return matchDetails
}

function setTopHalfwayToBottomQuarterYPos(matchDetails, attack, defence) {
  let { ball } = matchDetails
  let [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let kickPlayer = attack.players[5]
  kickPlayer.hasBall = true
  ball.Player = kickPlayer.name
  ball.withTeam = attack.name
  let ballInCentre = common.isBetween(ball.position[0], (pitchWidth / 4) + 5, (pitchWidth - (pitchWidth / 4) - 5))
  let ballLeft = common.isBetween(ball.position[0], 0, (pitchWidth / 4) + 4)
  ball.direction = (ballInCentre) ? 'south' : (ballLeft) ? 'southeast' : 'southwest'
  kickPlayer.startPOS = ball.position.map(x => x)
  for (let player of attack.players) {
    if (player.position == 'GK') player.startPOS = [player.originPOS[0], parseInt(pitchHeight * 0.25, 10)]
    else if (['CB', 'LB', 'RB'].includes(player.position)) {
      let maxYPOSCheck = parseInt(common.upToMax(ball.position[1] - 100, pitchHeight * 0.5), 10)
      player.startPOS = [player.originPOS[0], maxYPOSCheck]
    } else if (['CM', 'LM', 'RM'].includes(player.position)) {
      let maxYPOSCheck = common.upToMax(ball.position[1] + common.getRandomNumber(150, 300), pitchHeight * 0.75)
      if (player.name != kickPlayer.name) player.startPOS = [player.originPOS[0], parseInt(maxYPOSCheck, 10)]
    } else {
      let maxYPOSCheck = common.upToMax(ball.position[1] + common.getRandomNumber(300, 400), pitchHeight * 0.9)
      player.startPOS = [player.originPOS[0], parseInt(maxYPOSCheck, 10)]
    }
  }
  for (let player of defence.players) {
    if (['GK', 'CB', 'LB', 'RB'].includes(player.position)) {
      player.startPOS = player.originPOS.map(x => x)
    } else if (['CM', 'LM', 'RM'].includes(player.position)) {
      player.startPOS = [player.originPOS[0], parseInt(pitchHeight * 0.75, 10)]
    } else {
      player.startPOS = [player.originPOS[0], parseInt(pitchHeight * 0.5, 10)]
    }
  }
  return matchDetails
}


function setTopBottomQuarterCentreYPos(matchDetails, attack, defence) { return matchDetails }
function setTopUpperFinalQuarterLeftPos(matchDetails, attack, defence) { return matchDetails }
function setTopLowerFinalQuarterBylineLeftPos(matchDetails, attack, defence) { return matchDetails }
function setTopUpperFinalQuarterRightPos(matchDetails, attack, defence) { return matchDetails }
function setTopLowerFinalQuarterBylineRightPos(matchDetails, attack, defence) { return matchDetails }



//OLD STUFF
//
//
//

function setFreekick(ballPosition, team, opposition, side, matchDetails) {
  removeBallFromAllPlayers(matchDetails)
  const [matchWidth, matchHeight] = matchDetails.pitchSize
  let tempArray = ballPosition
  team.players[5].startPOS = tempArray.map(x => x)
  matchDetails.ball.withTeam = team.name
  matchDetails.ball.withPlayer = true
  matchDetails.ball.Player = team.players[5].name
  team.players[5].hasBall = true
  matchDetails.ball.ballOverIterations = []
  if (side === `top`) {
    //shooting to top of pitch
    if (ballPosition[1] > (matchHeight - (matchHeight / 3))) {
      matchDetails.ball.Player = team.players[0].name
      team.players[0].hasBall = true
      matchDetails.ball.ballOverIterations = []
      team.players[0].startPOS = tempArray.map(x => x)
      //goalkeepers Y position
      for (const num of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
        let gkY = matchHeight - team.players[0].startPOS[1]
        let [txpos, typos] = team.players[num].originPOS
        let [oxpos, oypos] = opposition.players[num].originPOS
        let [, t1p1ypos] = team.players[1].startPOS
        team.players[num].startPOS[0] = txpos
        team.players[num].startPOS[1] = (matchHeight - (matchHeight / 6) - (gkY) - (matchHeight - typos))
        if (num == 9 || num == 10) {
          opposition.players[num].startPOS[0] = oxpos + 10
          opposition.players[num].startPOS[0] = oxpos + 10
          opposition.players[num].startPOS[1] = t1p1ypos
        } else {
          opposition.players[num].startPOS[0] = oxpos
          if (oypos + (matchHeight / 6) < (matchHeight + 1)) {
            opposition.players[num].startPOS[1] = oypos + (matchHeight / 6)
          } else {
            opposition.players[num].startPOS[1] = oypos
          }
        }
      }
    } else if (ballPosition[1] > (matchHeight / 2) && ballPosition[1] < (matchHeight - (matchHeight / 3))) {
      //ball in own half and opposition is at the bottom of pitch
      if (ballPosition[0] > matchWidth / 2) {
        matchDetails.ball.direction = `northwest`
      } else if (ballPosition[0] < matchWidth / 2) {
        matchDetails.ball.direction = `northeast`
      } else {
        matchDetails.ball.direction = `north`
      }
      const level = common.getRandomNumber(matchHeight / 2, 200)
      for (const num of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
        let [txpos] = team.players[num].originPOS
        let [oxpos, oypos] = opposition.players[num].originPOS
        team.players[num].startPOS[0] = txpos
        opposition.players[num].startPOS[0] = oxpos
        if (num == 1 || num == 2 || num == 3 || num == 4) {
          team.players[num].startPOS[1] = team.players[5].startPOS[1] + (matchHeight / 6)
          opposition.players[num].startPOS[1] = oypos + (matchHeight / 7)
        } else if (num == 6 || num == 7 || num == 8) {
          team.players[num].startPOS[1] = level
          if ((oypos + (matchHeight / 6)) < (matchHeight + 1)) {
            opposition.players[num].startPOS[1] = oypos + (matchHeight / 6)
          } else {
            opposition.players[num].startPOS[1] = oypos
          }
        } else {
          team.players[num].startPOS[1] = level - (matchHeight / 6)
          if ((oypos + (matchHeight / 6)) < (matchHeight + 1)) {
            opposition.players[num].startPOS[1] = oypos + (matchHeight / 6)
          } else {
            opposition.players[num].startPOS[1] = oypos
          }
        }
        if ((oypos + (matchHeight / 7)) < (matchHeight + 1)) {
          opposition.players[num].startPOS[1] = oypos + (matchHeight / 7)
        } else {
          opposition.players[num].startPOS[1] = oypos
        }
      }
    } else if (ballPosition[1] < (matchHeight / 2) && ballPosition[1] > (matchHeight / 6)) {
      //between halfway and last sixth
      const level = Math.round(common.getRandomNumber((matchHeight / 9), ballPosition[1] + 15))
      team.players[0].startPOS = [team.players[0].originPOS[0], team.players[5].startPOS[1] + (matchHeight / 3)]
      team.players[1].startPOS = [team.players[1].originPOS[0], team.players[5].startPOS[1] + (matchHeight / 6)]
      team.players[2].startPOS = [team.players[2].originPOS[0], team.players[5].startPOS[1] + (matchHeight / 6)]
      team.players[3].startPOS = [team.players[3].originPOS[0], team.players[5].startPOS[1] + (matchHeight / 6)]
      team.players[4].startPOS = [team.players[4].originPOS[0], team.players[5].startPOS[1] + (matchHeight / 6)]
      team.players[6].startPOS = [team.players[6].originPOS[0], level]
      team.players[7].startPOS = [team.players[7].originPOS[0], level]
      team.players[8].startPOS = [team.players[8].originPOS[0], level]
      team.players[9].startPOS = [team.players[9].originPOS[0], common.getRandomNumber(5, level - 20)]
      team.players[10].startPOS = [team.players[10].originPOS[0], common.getRandomNumber(5, level - 20)]
      if (ballPosition[0] > matchWidth / 2) {
        matchDetails.ball.direction = `northwest`
        const midGoal = matchWidth / 2
        opposition.players[5].startPOS = [(tempArray[0] + ((midGoal - tempArray[0]) / 2)), tempArray[1] - 60]
        opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 30]
        opposition.players[7].startPOS = [tempArray[0], tempArray[1] - 30]
        opposition.players[8].startPOS = [team.players[10].startPOS[0] + 2, team.players[10].startPOS[0] - 2]
        opposition.players[9].startPOS = [(tempArray[0] + ((midGoal - tempArray[0]) / 2) + 2), tempArray[1] - 30]
        opposition.players[10].startPOS = [(tempArray[0] + ((midGoal - tempArray[0]) / 2) - 2), tempArray[1] - 30]
      } else if (ballPosition[0] < matchWidth / 2) {
        matchDetails.ball.direction = `northeast`
        const midGoal = matchWidth / 2
        opposition.players[5].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 60]
        opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 30]
        opposition.players[7].startPOS = [tempArray[0], tempArray[1] - 30]
        opposition.players[8].startPOS = [team.players[10].startPOS[0] + 2, team.players[10].startPOS[0] - 2]
        opposition.players[9].startPOS = [(tempArray[0] + ((midGoal - tempArray[0]) / 2) + 2), tempArray[1] - 30]
        opposition.players[10].startPOS = [(tempArray[0] + ((midGoal - tempArray[0]) / 2) - 2), tempArray[1] - 30]
      } else {
        matchDetails.ball.direction = `north`
        opposition.players[5].startPOS = [tempArray[0], tempArray[1] - 60]
        opposition.players[6].startPOS = [tempArray[0], tempArray[1] - 30]
        opposition.players[7].startPOS = [tempArray[0] + 20, tempArray[1] - 20]
        opposition.players[8].startPOS = [team.players[10].startPOS[0] - 2, team.players[10].startPOS[0] + 2]
        opposition.players[9].startPOS = [tempArray[0] - 2, tempArray[1] - 30]
        opposition.players[10].startPOS = [tempArray[0] + 2, tempArray[1] - 30]
      }
    } else {
      //in the last sixth
      for (const num of [1, 4, 5, 7, 8, 9, 10]) {
        let xRandpos = common.getRandomNumber((matchWidth / 4) - 5, (matchWidth - (matchWidth / 4) + 5))
        let yRandpos = common.getRandomNumber(0, (matchHeight / 6) - 5)
        team.players[num].startPOS[0] = xRandpos
        team.players[num].startPOS[1] = yRandpos
      }
      team.players[0].startPOS = [team.players[0].originPOS[0], team.players[0].originPOS[1] - (matchHeight / 3)]
      team.players[2].startPOS = [team.players[2].originPOS[0], team.players[2].originPOS[1] - (matchHeight / 2)]
      team.players[3].startPOS = [team.players[3].originPOS[0], team.players[3].originPOS[1] - (matchHeight / 2)]
      opposition.players[1].startPOS = [(matchWidth / 2) - 15, 10]
      opposition.players[2].startPOS = [(matchWidth / 2) - 5, 10]
      opposition.players[3].startPOS = [(matchWidth / 2) + 5, 10]
      opposition.players[4].startPOS = [(matchWidth / 2) + 15, 10]
      if (ballPosition[0] > matchWidth / 2) {
        const midGoal = matchWidth / 2
        matchDetails.ball.direction = `northwest`
        if (tempArray[1] < 15) {
          opposition.players[5].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1]]
          opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 2]
          opposition.players[7].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 4]
        } else {
          opposition.players[5].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 10]
          opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 12]
          opposition.players[7].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 14]
        }
        let oxRandpos1 = common.getRandomNumber((matchWidth / 4) - 5, (matchWidth - (matchWidth / 4) + 5))
        let oxRandpos2 = common.getRandomNumber((matchWidth / 4) - 5, (matchWidth - (matchWidth / 4) + 5))
        let oyRandpos1 = common.getRandomNumber(0, (matchHeight / 6) - 5)
        let oyRandpos2 = common.getRandomNumber(0, (matchHeight / 6) - 5)
        opposition.players[8].startPOS = [oxRandpos1, oyRandpos1]
        opposition.players[9].startPOS = [oxRandpos2, oyRandpos2]
        opposition.players[10].startPOS = [matchWidth / 2, 20]
      } else if (ballPosition[0] < matchWidth / 2) {
        const midGoal = matchWidth / 2
        matchDetails.ball.direction = `northeast`
        if (tempArray[1] < 15) {
          opposition.players[8].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1]]
          opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 2]
          opposition.players[7].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 4]
        } else {
          opposition.players[8].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 10]
          opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 12]
          opposition.players[7].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 14]
        }
        let oxRandpos1 = common.getRandomNumber((matchWidth / 4) - 5, (matchWidth - (matchWidth / 4) - 5))
        let oxRandpos2 = common.getRandomNumber((matchWidth / 4) - 5, (matchWidth - (matchWidth / 4) - 5))
        let oyRandpos1 = common.getRandomNumber(0, (matchHeight / 6) - 5)
        let oyRandpos2 = common.getRandomNumber(0, (matchHeight / 6) - 5)
        opposition.players[5].startPOS = [oxRandpos1, oyRandpos1]
        opposition.players[9].startPOS = [oxRandpos2, oyRandpos2]
        opposition.players[10].startPOS = [matchWidth / 2, 20]
      } else {
        matchDetails.ball.direction = `north`
        opposition.players[5].startPOS = [(matchWidth / 2) - 4, tempArray[1] - 40]
        opposition.players[6].startPOS = [(matchWidth / 2) - 2, tempArray[1] - 40]
        opposition.players[7].startPOS = [(matchWidth / 2), tempArray[1] - 40]
        opposition.players[8].startPOS = [(matchWidth / 2) + 2, tempArray[1] - 40]
        opposition.players[9].startPOS = [(matchWidth / 2) + 4, tempArray[1] - 40]
        opposition.players[10].startPOS = [(matchWidth / 2), 30]
      }
    }
  } else if (side === `bottom`) {
    if (ballPosition[1] < (matchHeight / 3)) {
      matchDetails.ball.Player = team.players[0].name
      team.players[0].hasBall = true
      matchDetails.ball.ballOverIterations = []
      team.players[0].startPOS = tempArray.map(x => x)
      let gkypos = team.players[0].startPOS[1]
      let [, defypos] = team.players[1].startPOS
      for (const num of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
        let [txpos, typos] = team.players[num].originPOS
        let [oxpos, oypos] = opposition.players[num].originPOS
        team.players[num].startPOS[0] = txpos
        if (((matchHeight / 6) + gkypos + typos) < (matchHeight + 1)) {
          team.players[num].startPOS[1] = ((matchHeight / 6) + gkypos + typos)
        } else {
          team.players[num].startPOS[1] = matchHeight
        }
        opposition.players[num].startPOS[0] = oxpos
        if ((oypos - (matchHeight / 6)) < (matchHeight + 1)) {
          opposition.players[num].startPOS[1] = oypos - (matchHeight / 6)
        } else {
          opposition.players[num].startPOS[1] = oypos
        }
        if (num == 9 || num == 10) {
          if ((oxpos + 10) < (matchWidth + 1)) {
            opposition.players[num].startPOS[0] = oxpos + 10
          } else {
            opposition.players[num].startPOS[0] = oxpos
          }
          opposition.players[num].startPOS[1] = defypos
        }
      }
    } else if (ballPosition[1] < (matchHeight / 2) && ballPosition[1] > (matchHeight / 3)) {
      //ball in own half and opposition is at the bottom of pitch
      if (ballPosition[0] > matchWidth / 2) {
        matchDetails.ball.direction = `southwest`
      } else if (ballPosition[0] < matchWidth / 2) {
        matchDetails.ball.direction = `southeast`
      } else {
        matchDetails.ball.direction = `south`
      }
      const level = common.getRandomNumber(matchHeight / 2, matchHeight - 200)
      let [, tp5ypos] = team.players[5].startPOS
      for (const num of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
        let [txpos] = team.players[num].originPOS
        let [oxpos, oypos] = opposition.players[num].originPOS
        team.players[num].startPOS[0] = txpos
        opposition.players[num].startPOS[0] = oxpos
        if (num == 1 || num == 2 || num == 3 || num == 4) {
          team.players[num].startPOS[1] = tp5ypos - (matchHeight / 6)
          opposition.players[num].startPOS[1] = oypos - (matchHeight / 7)
        } else if (num == 5) {
          opposition.players[num].startPOS[1] = oypos - (matchHeight / 6)
        } else if (num == 6 || num == 7 || num == 8) {
          team.players[num].startPOS[1] = level
          opposition.players[num].startPOS[1] = oypos - (matchHeight / 6)
        } else if (num == 9 || num == 10) {
          team.players[num].startPOS[1] = level + (matchHeight / 6)
          opposition.players[num].startPOS[1] = oypos - (matchHeight / 6)
        }
      }
    } else if (ballPosition[1] > (matchHeight / 2) && ballPosition[1] < (matchHeight - (matchHeight / 6))) {
      //between halfway and last sixth
      let randLev = common.getRandomNumber(ballPosition[1] + 15, (matchHeight - matchHeight / 9))
      let level = Math.round(randLev)
      if ((level + (matchHeight / 6)) > matchHeight) {
        level -= (matchHeight / 6)
      }
      let [, tp5ypos] = team.players[5].startPOS
      for (const num of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
        let [txpos] = team.players[num].originPOS
        team.players[num].startPOS[0] = txpos
        if (num == 0) {
          team.players[num].startPOS[1] = tp5ypos - (matchHeight / 3)
        } else if (num == 1 || num == 2 || num == 3 || num == 4) {
          team.players[num].startPOS[1] = tp5ypos - (matchHeight / 6)
        } else if (num == 6 || num == 7 || num == 8) {
          team.players[num].startPOS[1] = level
        } else if (num == 9 || num == 10) {
          if ((level + (matchHeight / 6)) < (matchHeight + 1)) {
            team.players[num].startPOS[1] = level + (matchHeight / 6) - 2
          } else {
            team.players[num].startPOS[1] = matchHeight
          }
        }
      }
      if (ballPosition[0] > matchWidth / 2) {
        matchDetails.ball.direction = `southwest`
        const midGoal = matchWidth / 2
        opposition.players[5].startPOS = [(tempArray[0] + ((midGoal - tempArray[0]) / 2)), tempArray[1] + 60]
        opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 30]
        opposition.players[7].startPOS = [tempArray[0], tempArray[1] + 30]
        opposition.players[8].startPOS = [team.players[10].startPOS[0] + 2, team.players[10].startPOS[1] + 2]
        opposition.players[9].startPOS = [(tempArray[0] + ((midGoal - tempArray[0]) / 2) + 2), tempArray[1] + 30]
        opposition.players[10].startPOS = [(tempArray[0] + ((midGoal - tempArray[0]) / 2) - 2), tempArray[1] + 30]
      } else if (ballPosition[0] < matchWidth / 2) {
        matchDetails.ball.direction = `southeast`
        const midGoal = matchWidth / 2
        opposition.players[5].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 60]
        opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 30]
        opposition.players[7].startPOS = [tempArray[0], tempArray[1] + 30]
        opposition.players[8].startPOS = [team.players[10].startPOS[0] + 2, team.players[10].startPOS[1] + 2]
        opposition.players[9].startPOS = [(tempArray[0] + ((midGoal - tempArray[0]) / 2) + 2), tempArray[1] + 30]
        opposition.players[10].startPOS = [(tempArray[0] + ((midGoal - tempArray[0]) / 2) - 2), tempArray[1] + 30]
      } else {
        matchDetails.ball.direction = `south`
        opposition.players[5].startPOS = [tempArray[0], tempArray[1] + 60]
        opposition.players[6].startPOS = [tempArray[0], tempArray[1] + 30]
        opposition.players[7].startPOS = [tempArray[0] + 20, tempArray[1] + 20]
        opposition.players[8].startPOS = [team.players[10].startPOS[0] + 2, team.players[10].startPOS[1] + 2]
        opposition.players[9].startPOS = [tempArray[0] - 2, tempArray[1] + 30]
        opposition.players[10].startPOS = [tempArray[0] + 2, tempArray[1] + 30]
      }
    } else {
      //in the last sixth
      for (const num of [1, 4, 6, 7, 8, 9, 10]) {
        let xRandpos = common.getRandomNumber((matchWidth / 4) - 5, (matchWidth - (matchWidth / 4) + 5))
        let yRandpos = common.getRandomNumber(matchHeight - (matchHeight / 6) + 5, matchHeight)
        team.players[num].startPOS = [xRandpos, yRandpos]
        if (num == 8 || num == 9) {
          opposition.players[num].startPOS = [xRandpos, yRandpos]
        }
      }
      team.players[0].startPOS = [team.players[0].originPOS[0], team.players[0].originPOS[1] + (matchHeight / 3)]
      team.players[2].startPOS = [team.players[2].originPOS[0], team.players[2].originPOS[1] + (matchHeight / 2)]
      team.players[3].startPOS = [team.players[3].originPOS[0], team.players[3].originPOS[1] + (matchHeight / 2)]
      opposition.players[1].startPOS = [(matchWidth / 2) - 15, matchHeight - 10]
      opposition.players[2].startPOS = [(matchWidth / 2) - 5, matchHeight - 10]
      opposition.players[3].startPOS = [(matchWidth / 2) + 5, matchHeight - 10]
      opposition.players[4].startPOS = [(matchWidth / 2) + 15, matchHeight - 10]
      if (ballPosition[0] > matchWidth / 2) {
        const midGoal = matchWidth / 2
        matchDetails.ball.direction = `southwest`
        if (tempArray[1] > (matchHeight - 15)) {
          opposition.players[5].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1]]
          opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 2]
          opposition.players[7].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 4]
        } else {
          opposition.players[5].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 10]
          opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 12]
          opposition.players[7].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 14]
        }
        opposition.players[10].startPOS = [matchWidth / 2, matchHeight - 20]
      } else if (ballPosition[0] < matchWidth / 2) {
        const midGoal = matchWidth / 2
        matchDetails.ball.direction = `southeast`
        if (tempArray[1] > (matchHeight - 15)) {
          opposition.players[8].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1]]
          opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 2]
          opposition.players[7].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 4]
        } else {
          opposition.players[8].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 10]
          opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 12]
          opposition.players[7].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 14]
        }
        let xRandpos = common.getRandomNumber((matchWidth / 4) - 5, (matchWidth - (matchWidth / 4) + 5))
        let yRandpos = common.getRandomNumber(matchHeight - (matchHeight / 6) + 5, matchHeight)
        opposition.players[5].startPOS = [xRandpos, yRandpos]
        opposition.players[9].startPOS = [xRandpos, yRandpos]
        opposition.players[10].startPOS = [matchWidth / 2, matchHeight - 20]
      } else {
        matchDetails.ball.direction = `south`
        opposition.players[5].startPOS = [(matchWidth / 2) - 4, tempArray[1] + 40]
        opposition.players[6].startPOS = [(matchWidth / 2) - 2, tempArray[1] + 40]
        opposition.players[7].startPOS = [(matchWidth / 2), tempArray[1] + 40]
        opposition.players[8].startPOS = [(matchWidth / 2) + 2, tempArray[1] + 40]
        opposition.players[9].startPOS = [(matchWidth / 2) + 4, tempArray[1] + 40]
        opposition.players[10].startPOS = [(matchWidth / 2), matchHeight - 30]
      }
    }
  }
}

function removeBallFromAllPlayers(matchDetails) {
  for (let player of matchDetails.kickOffTeam.players) {
    player.hasBall = false
  }
  for (let player of matchDetails.secondTeam.players) {
    player.hasBall = false
  }
}

module.exports = {
  setFreekick,
  setTopFreekick,
  setBottomFreekick
}
