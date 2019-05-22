const common = require(`../lib/common`)
const setPos = require(`../lib/setPositions`)

function setFreekick(ballPosition, team, opposition, side, matchDetails) {
  setPos.removeBallFromAllPlayers(matchDetails)
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

module.exports = {
  setFreekick
}
