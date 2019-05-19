const common = require(`../lib/common`)
const setVariables = require(`../lib/setVariables`)

function setTopRightCornerPositions(matchDetails) {
  removeBallFromAllPlayers(matchDetails)
  let [matchWidth] = matchDetails.pitchSize
  let kickOffTeamKeepYPos = matchDetails.kickOffTeam.players[0].originPOS[1]
  let halfPitchSize = (matchDetails.pitchSize[1] / 2)
  let attack = (kickOffTeamKeepYPos > halfPitchSize) ? matchDetails.kickOffTeam : matchDetails.secondTeam
  let defence = (kickOffTeamKeepYPos > halfPitchSize) ? matchDetails.secondTeam : matchDetails.kickOffTeam
  attack.players[1].startPOS = [matchWidth, 0]
  attack.players[4].startPOS = [matchWidth - 10, 20]
  attack.players[5].startPOS = [matchWidth - 60, 40]
  attack.players[8].startPOS = [matchWidth - 50, 70]
  attack.players[9].startPOS = [matchWidth - 80, 50]
  attack.players[10].startPOS = [matchWidth - 60, 80]
  defence.players[5].startPOS = [matchWidth - 15, 25]
  defence.players[6].startPOS = [matchWidth - 40, 35]
  defence.players[7].startPOS = [matchWidth - 60, 35]
  defence.players[8].startPOS = [matchWidth - 60, 70]
  matchDetails.ball.position = [matchWidth, 0, 0]
  setBallSpecificCornerValue(matchDetails, attack)
  return matchDetails
}

function setTopLeftCornerPositions(matchDetails) {
  removeBallFromAllPlayers(matchDetails)
  let kickOffTeamKeepYPos = matchDetails.kickOffTeam.players[0].originPOS[1]
  let halfPitchSize = matchDetails.pitchSize[1] / 2
  let attack = (kickOffTeamKeepYPos > halfPitchSize) ? matchDetails.kickOffTeam : matchDetails.secondTeam
  let defence = (kickOffTeamKeepYPos > halfPitchSize) ? matchDetails.secondTeam : matchDetails.kickOffTeam
  attack.players[1].startPOS = [0, 0]
  attack.players[4].startPOS = [10, 20]
  attack.players[5].startPOS = [60, 40]
  attack.players[8].startPOS = [50, 70]
  attack.players[9].startPOS = [80, 50]
  attack.players[10].startPOS = [60, 80]
  defence.players[5].startPOS = [15, 25]
  defence.players[6].startPOS = [40, 35]
  defence.players[7].startPOS = [60, 35]
  defence.players[8].startPOS = [60, 70]
  matchDetails.ball.position = [0, 0, 0]
  setBallSpecificCornerValue(matchDetails, attack)
  return matchDetails
}

function setBottomLeftCornerPositions(matchDetails) {
  removeBallFromAllPlayers(matchDetails)
  let [, matchHeight] = matchDetails.pitchSize
  let kickOffTeamKeepYPos = matchDetails.kickOffTeam.players[0].originPOS[1]
  let halfPitchSize = matchDetails.pitchSize[1] / 2
  let attack = (kickOffTeamKeepYPos < halfPitchSize) ? matchDetails.kickOffTeam : matchDetails.secondTeam
  let defence = (kickOffTeamKeepYPos < halfPitchSize) ? matchDetails.secondTeam : matchDetails.kickOffTeam
  attack.players[1].startPOS = [0, matchHeight]
  attack.players[4].startPOS = [10, matchHeight - 20]
  attack.players[5].startPOS = [60, matchHeight - 40]
  attack.players[8].startPOS = [50, matchHeight - 70]
  attack.players[9].startPOS = [80, matchHeight - 50]
  attack.players[10].startPOS = [60, matchHeight - 80]
  defence.players[5].startPOS = [15, matchHeight - 25]
  defence.players[6].startPOS = [40, matchHeight - 35]
  defence.players[7].startPOS = [60, matchHeight - 35]
  defence.players[8].startPOS = [60, matchHeight - 70]
  matchDetails.ball.position = [0, matchHeight, 0]
  setBallSpecificCornerValue(matchDetails, attack)
  return matchDetails
}

function setBottomRightCornerPositions(matchDetails) {
  removeBallFromAllPlayers(matchDetails)
  let [matchWidth, matchHeight] = matchDetails.pitchSize
  let kickOffTeamKeepYPos = matchDetails.kickOffTeam.players[0].originPOS[1]
  let halfPitchSize = matchDetails.pitchSize[1] / 2
  let attack = (kickOffTeamKeepYPos < halfPitchSize) ? matchDetails.kickOffTeam : matchDetails.secondTeam
  let defence = (kickOffTeamKeepYPos < halfPitchSize) ? matchDetails.secondTeam : matchDetails.kickOffTeam
  attack.players[1].startPOS = [matchWidth, matchHeight]
  attack.players[4].startPOS = [matchWidth - 10, matchHeight - 20]
  attack.players[5].startPOS = [matchWidth - 60, matchHeight - 40]
  attack.players[8].startPOS = [matchWidth - 50, matchHeight - 70]
  attack.players[9].startPOS = [matchWidth - 80, matchHeight - 50]
  attack.players[10].startPOS = [matchWidth - 60, matchHeight - 80]
  defence.players[5].startPOS = [matchWidth - 15, matchHeight - 25]
  defence.players[6].startPOS = [matchWidth - 40, matchHeight - 35]
  defence.players[7].startPOS = [matchWidth - 60, matchHeight - 35]
  defence.players[8].startPOS = [matchWidth - 60, matchHeight - 70]
  matchDetails.ball.position = [matchWidth, matchHeight, 0]
  setBallSpecificCornerValue(matchDetails, attack)
  return matchDetails
}

function setBallSpecificCornerValue(matchDetails, attack) {
  attack.players[1].hasBall = true
  matchDetails.ball.ballOverIterations = []
  matchDetails.ball.withPlayer = true
  matchDetails.ball.Player = attack.players[1].name
  matchDetails.ball.withTeam = attack.name
  matchDetails.iterationLog.push(`Corner to - ${attack.name}`)
}

function setLeftKickOffTeamThrowIn(matchDetails, ballIntended) {
  removeBallFromAllPlayers(matchDetails)
  let { kickOffTeam, secondTeam } = matchDetails
  let [, place] = ballIntended
  const [, matchHeight] = matchDetails.pitchSize
  place = ((place - 30) < 0) ? 30 : place
  place = ((place + 10) > (matchHeight + 1)) ? (matchHeight - 10) : place
  let movement = kickOffTeam.players[5].originPOS[1] - place
  let oppMovement = 0 - movement
  ballThrowInPosition(matchDetails, kickOffTeam)
  setPlayerPositions(matchDetails, kickOffTeam, movement)
  setPlayerPositions(matchDetails, secondTeam, oppMovement)
  attackLeftThrowInPlayerPosition(kickOffTeam, place)
  defenceLeftThrowInPlayerPosition(secondTeam, place)
  matchDetails.ball.position = [0, place, 0]
  kickOffTeam.players[5].startPOS = matchDetails.ball.position.map(x => x)
  kickOffTeam.players[5].startPOS.pop()
  return matchDetails
}

function setRightKickOffTeamThrowIn(matchDetails, ballIntended) {
  removeBallFromAllPlayers(matchDetails)
  let { kickOffTeam, secondTeam } = matchDetails
  let [, place] = ballIntended
  const [matchWidth, matchHeight] = matchDetails.pitchSize
  place = ((place - 30) < 0) ? 30 : place
  place = ((place + 10) > (matchHeight + 1)) ? (matchHeight - 10) : place
  let movement = kickOffTeam.players[5].originPOS[1] - place
  let oppMovement = 0 - movement
  ballThrowInPosition(matchDetails, kickOffTeam)
  setPlayerPositions(matchDetails, kickOffTeam, movement)
  setPlayerPositions(matchDetails, secondTeam, oppMovement)
  attackRightThrowInPlayerPosition(matchWidth, kickOffTeam, place)
  defenceRightThrowInPlayerPosition(matchWidth, secondTeam, place)
  matchDetails.ball.position = [matchWidth, place, 0]
  kickOffTeam.players[5].startPOS = matchDetails.ball.position.map(x => x)
  kickOffTeam.players[5].startPOS.pop()
  return matchDetails
}

function setLeftSecondTeamThrowIn(matchDetails, ballIntended) {
  removeBallFromAllPlayers(matchDetails)
  let { kickOffTeam, secondTeam } = matchDetails
  let [, place] = ballIntended
  const [, matchHeight] = matchDetails.pitchSize
  place = ((place - 30) < 0) ? 30 : place
  place = ((place + 10) > (matchHeight + 1)) ? (matchHeight - 10) : place
  let movement = secondTeam.players[5].originPOS[1] - place
  let oppMovement = 0 - movement
  ballThrowInPosition(matchDetails, secondTeam)
  setPlayerPositions(matchDetails, secondTeam, movement)
  setPlayerPositions(matchDetails, kickOffTeam, oppMovement)
  attackLeftThrowInPlayerPosition(secondTeam, place)
  defenceLeftThrowInPlayerPosition(kickOffTeam, place)
  matchDetails.ball.position = [0, place, 0]
  secondTeam.players[5].startPOS = matchDetails.ball.position.map(x => x)
  secondTeam.players[5].startPOS.pop()
  return matchDetails
}

function setRightSecondTeamThrowIn(matchDetails, ballIntended) {
  removeBallFromAllPlayers(matchDetails)
  let { kickOffTeam, secondTeam } = matchDetails
  let [, place] = ballIntended
  const [matchWidth, matchHeight] = matchDetails.pitchSize
  place = ((place - 30) < 0) ? 30 : place
  place = ((place + 10) > (matchHeight + 1)) ? (matchHeight - 10) : place
  let movement = secondTeam.players[5].originPOS[1] - place
  let oppMovement = 0 - movement
  ballThrowInPosition(matchDetails, secondTeam)
  setPlayerPositions(matchDetails, secondTeam, movement)
  setPlayerPositions(matchDetails, kickOffTeam, oppMovement)
  attackRightThrowInPlayerPosition(matchWidth, secondTeam, place)
  defenceRightThrowInPlayerPosition(matchWidth, kickOffTeam, place)
  matchDetails.ball.position = [matchWidth, place, 0]
  secondTeam.players[5].startPOS = matchDetails.ball.position.map(x => x)
  secondTeam.players[5].startPOS.pop()
  return matchDetails
}

function ballThrowInPosition(matchDetails, attack) {
  matchDetails.ball.ballOverIterations = []
  matchDetails.ball.withPlayer = true
  matchDetails.ball.Player = attack.players[5].name
  matchDetails.ball.withTeam = attack.name
  matchDetails.iterationLog.push(`Throw in to - ${attack.name}`)
}

function attackLeftThrowInPlayerPosition(attack, place) {
  attack.players[8].startPOS = [15, place]
  attack.players[7].startPOS = [10, place + 10]
  attack.players[9].startPOS = [10, place - 10]
  attack.players[5].hasBall = true
}

function defenceLeftThrowInPlayerPosition(defence, place) {
  defence.players[5].startPOS = [20, place]
  defence.players[7].startPOS = [30, place + 5]
  defence.players[8].startPOS = [25, place - 15]
  defence.players[9].startPOS = [10, place - 30]
}

function attackRightThrowInPlayerPosition(matchWidth, attack, place) {
  attack.players[8].startPOS = [matchWidth - 15, place]
  attack.players[7].startPOS = [matchWidth - 10, place + 10]
  attack.players[9].startPOS = [matchWidth - 10, place - 10]
  attack.players[5].hasBall = true
}

function defenceRightThrowInPlayerPosition(matchWidth, defence, place) {
  defence.players[5].startPOS = [matchWidth - 20, place]
  defence.players[7].startPOS = [matchWidth - 30, place + 5]
  defence.players[8].startPOS = [matchWidth - 25, place - 15]
  defence.players[9].startPOS = [matchWidth - 10, place - 30]
}

function setBottomGoalKick(matchDetails) {
  let kickOffTeamKeepYPos = matchDetails.kickOffTeam.players[0].originPOS[1]
  let halfPitchSize = matchDetails.pitchSize[1] / 2
  let attack = (kickOffTeamKeepYPos > halfPitchSize) ? matchDetails.kickOffTeam : matchDetails.secondTeam
  const [matchWidth, matchHeight] = matchDetails.pitchSize
  removeBallFromAllPlayers(matchDetails)
  setVariables.resetPlayerPositions(matchDetails)
  setPlayerPositions(matchDetails, attack, -80)
  matchDetails.ball.position = [matchWidth / 2, matchHeight - 20, 0]
  setBallSpecificGoalKickValue(matchDetails, attack)
  return matchDetails
}

function setTopGoalKick(matchDetails) {
  let kickOffTeamKeepYPos = matchDetails.kickOffTeam.players[0].originPOS[1]
  let halfPitchSize = matchDetails.pitchSize[1] / 2
  let attack = (kickOffTeamKeepYPos > halfPitchSize) ? matchDetails.secondTeam : matchDetails.kickOffTeam
  const [matchWidth] = matchDetails.pitchSize
  removeBallFromAllPlayers(matchDetails)
  setVariables.resetPlayerPositions(matchDetails)
  setPlayerPositions(matchDetails, attack, 80)
  matchDetails.ball.position = [matchWidth / 2, 20, 0]
  setBallSpecificGoalKickValue(matchDetails, attack)
  return matchDetails
}

function setBallSpecificGoalKickValue(matchDetails, attack) {
  attack.players[0].startPOS = matchDetails.ball.position.map(x => x)
  attack.players[0].startPOS.pop()
  attack.players[0].hasBall = true
  matchDetails.ball.ballOverIterations = []
  matchDetails.ball.withPlayer = true
  matchDetails.ball.Player = attack.players[0].name
  matchDetails.ball.withTeam = attack.name
  matchDetails.iterationLog.push(`Goal Kick to - ${attack.name}`)
}

function closestPlayerToPosition(player, team, position) {
  let currentDifference = 1000000
  let playerInformation = {
    'thePlayer': ``,
    'proxPOS': [``, ``],
    'proxToBall': ''
  }
  for (const thisPlayer of team.players) {
    if (player.name !== thisPlayer.name) {
      let ballToPlayerX = thisPlayer.startPOS[0] - position[0]
      let ballToPlayerY = thisPlayer.startPOS[1] - position[1]
      let proximityToBall = Math.abs(ballToPlayerX + ballToPlayerY)
      if (proximityToBall < currentDifference) {
        playerInformation.thePlayer = thisPlayer
        playerInformation.proxPOS = [ballToPlayerX, ballToPlayerY]
        playerInformation.proxToBall = proximityToBall
        currentDifference = proximityToBall
      }
    }
  }
  return playerInformation
}

function setSetpieceKickOffTeam(matchDetails) {
  const [matchWidth, matchHeight] = matchDetails.pitchSize
  let ballPosition = matchDetails.ball.position.map(x => x)
  let ballInPenalyBoxX = common.isBetween(ballPosition[0], (matchWidth / 4) - 5, matchWidth - (matchWidth / 4) + 5)
  let ballInTopPenalyBoxY = common.isBetween(ballPosition[1], 0, (matchHeight / 6) - 5)
  let ballInBottomPenalyBoxY = common.isBetween(ballPosition[1], matchHeight - (matchHeight / 6) + 5, matchHeight)
  let attackingTowardsTop = (matchDetails.kickOffTeam.players[0].startPOS[1] > matchHeight / 2)
  if (attackingTowardsTop && ballInPenalyBoxX && ballInTopPenalyBoxY) {
    matchDetails.kickOffTeamStatistics.penalties++
    matchDetails.iterationLog.push(`penalty to: ${matchDetails.kickOffTeam.name}`)
    return setTopPenalty(matchDetails)
  } else if (attackingTowardsTop == false && ballInPenalyBoxX && ballInBottomPenalyBoxY) {
    matchDetails.kickOffTeamStatistics.penalties++
    matchDetails.iterationLog.push(`penalty to: ${matchDetails.kickOffTeam.name}`)
    return setBottomPenalty(matchDetails)
  }
  matchDetails.kickOffTeamStatistics.freekicks++
  matchDetails.iterationLog.push(`freekick to: ${matchDetails.kickOffTeam.name}`)
  return setFreekick(ballPosition, matchDetails.kickOffTeam, matchDetails.secondTeam, `top`, matchDetails)
}

function setSetpieceSecondTeam(matchDetails) {
  const [matchWidth, matchHeight] = matchDetails.pitchSize
  let ballPosition = matchDetails.ball.position.map(x => x)
  let ballInPenalyBoxX = common.isBetween(ballPosition[0], (matchWidth / 4) - 5, matchWidth - (matchWidth / 4) + 5)
  let ballInBottomPenalyBoxY = common.isBetween(ballPosition[1], matchHeight - (matchHeight / 6) + 5, matchHeight)
  let ballInTopPenalyBoxY = common.isBetween(ballPosition[1], 0, (matchHeight / 6) - 5)
  let attackingTowardsTop = (matchDetails.secondTeam.players[0].startPOS[1] > matchHeight / 2)
  if (attackingTowardsTop && ballInPenalyBoxX && ballInTopPenalyBoxY) {
    matchDetails.secondTeamStatistics.penalties++
    matchDetails.iterationLog.push(`penalty to: ${matchDetails.secondTeam.name}`)
    return setTopPenalty(matchDetails)
  } else if (attackingTowardsTop == false && ballInPenalyBoxX && ballInBottomPenalyBoxY) {
    matchDetails.secondTeamStatistics.penalties++
    matchDetails.iterationLog.push(`penalty to: ${matchDetails.secondTeam.name}`)
    return setBottomPenalty(matchDetails)
  }
  matchDetails.secondTeamStatistics.freekicks++
  matchDetails.iterationLog.push(`freekick to: ${matchDetails.secondTeam.name}`)
  return setFreekick(ballPosition, matchDetails.secondTeam, matchDetails.secondTeam, `top`, matchDetails)
}

function setTopPenalty(matchDetails) {
  removeBallFromAllPlayers(matchDetails)
  const [matchWidth, matchHeight] = matchDetails.pitchSize
  let kickOffTeamKeepYPos = matchDetails.kickOffTeam.players[0].originPOS[1]
  let halfPitchSize = (matchDetails.pitchSize[1] / 2)
  let attack = (kickOffTeamKeepYPos > halfPitchSize) ? matchDetails.kickOffTeam : matchDetails.secondTeam
  let defence = (kickOffTeamKeepYPos > halfPitchSize) ? matchDetails.secondTeam : matchDetails.kickOffTeam
  let tempArray = [matchWidth / 2, matchHeight / 6]
  let shootArray = [matchWidth / 2, 60]
  defence.players[0].startPOS = defence.players[0].originPOS.map(x => x)
  setPlayerPenaltyPositions(tempArray, attack, defence)
  setBallSpecificPenaltyValue(matchDetails, shootArray, attack)
  matchDetails.ball.direction = `north`
  attack.intent = `attack`
  defence.intent = `defend`
  return matchDetails
}

function setBottomPenalty(matchDetails) {
  removeBallFromAllPlayers(matchDetails)
  const [matchWidth, matchHeight] = matchDetails.pitchSize
  let kickOffTeamKeepYPos = matchDetails.kickOffTeam.players[0].originPOS[1]
  let halfPitchSize = (matchDetails.pitchSize[1] / 2)
  let attack = (kickOffTeamKeepYPos > halfPitchSize) ? matchDetails.secondTeam : matchDetails.kickOffTeam
  let defence = (kickOffTeamKeepYPos > halfPitchSize) ? matchDetails.kickOffTeam : matchDetails.secondTeam
  let tempArray = [matchWidth / 2, matchHeight - (matchHeight / 6)]
  let shootArray = [matchWidth / 2, matchHeight - 60]
  defence.players[0].startPOS = defence.players[0].originPOS.map(x => x)
  setPlayerPenaltyPositions(tempArray, attack, defence)
  setBallSpecificPenaltyValue(matchDetails, shootArray, attack)
  matchDetails.ball.direction = `south`
  attack.intent = `attack`
  defence.intent = `defend`
  return matchDetails
}

function setPlayerPenaltyPositions(tempArray, attack, defence) {
  let oppxpos = -10
  let teamxpos = -9
  for (const num of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    if (num != 10) {
      attack.players[num].startPOS = tempArray.map(x => x)
      attack.players[num].startPOS[0] += teamxpos
    }
    defence.players[num].startPOS = tempArray.map(x => x)
    defence.players[num].startPOS[0] += oppxpos
    oppxpos += 2
    teamxpos += 2
  }
}

function setBallSpecificPenaltyValue(matchDetails, shootArray, attack) {
  attack.players[0].startPOS = attack.players[0].originPOS.map(x => x)
  attack.players[10].startPOS = shootArray.map(x => x)
  attack.players[10].hasBall = true
  matchDetails.ball.position = shootArray.map(x => x)
  matchDetails.ball.ballOverIterations = []
  matchDetails.ball.Player = attack.players[10].name
  matchDetails.ball.withPlayer = true
  matchDetails.ball.withTeam = attack.name
}

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

function setKickOffTeamGoalScored(matchDetails) {
  removeBallFromAllPlayers(matchDetails)
  setVariables.resetPlayerPositions(matchDetails)
  setBallSpecificGoalScoreValue(matchDetails, matchDetails.secondTeam)
  matchDetails.secondTeam.intent = `attack`
  matchDetails.kickOffTeam.intent = `defend`
  matchDetails.kickOffTeamStatistics.goals++
  matchDetails.iterationLog.push(`Goal Scored by - ${matchDetails.kickOffTeam.name}`)
  return matchDetails
}

function setSecondTeamGoalScored(matchDetails) {
  removeBallFromAllPlayers(matchDetails)
  setVariables.resetPlayerPositions(matchDetails)
  setBallSpecificGoalScoreValue(matchDetails, matchDetails.kickOffTeam)
  matchDetails.kickOffTeam.intent = `attack`
  matchDetails.secondTeam.intent = `defend`
  matchDetails.secondTeamStatistics.goals++
  matchDetails.iterationLog.push(`Goal Scored by - ${matchDetails.secondTeam.name}`)
  return matchDetails
}

function setBallSpecificGoalScoreValue(matchDetails, conceedingTeam) {
  matchDetails.ball.position = [matchDetails.pitchSize[0] / 2, matchDetails.pitchSize[1] / 2, 0]
  matchDetails.ball.ballOverIterations = []
  matchDetails.ball.withPlayer = true
  matchDetails.ball.withTeam = conceedingTeam.name
  let playerWithBall = common.getRandomNumber(9, 10)
  let waitingPlayer = (playerWithBall === 9) ? 10 : 9
  conceedingTeam.players[playerWithBall].startPOS = matchDetails.ball.position.map(x => x)
  conceedingTeam.players[playerWithBall].startPOS.pop()
  conceedingTeam.players[playerWithBall].hasBall = true
  matchDetails.ball.Player = conceedingTeam.players[playerWithBall].name
  let tempPosition = [matchDetails.ball.position[0] + 20, matchDetails.ball.position[1]]
  conceedingTeam.players[waitingPlayer].startPOS = tempPosition.map(x => x)
}

function keepInBoundaries(matchDetails, kickteamName, ballIntended) {
  let { kickOffTeam } = matchDetails
  let KOTname = kickOffTeam.name
  const [matchWidth, matchHeight] = matchDetails.pitchSize
  const halfMWidth = matchWidth / 2
  const [bXPOS, bYPOS] = ballIntended
  let kickOffTeamSide = (kickOffTeam.players[0].originPOS[1] < halfMWidth) ? 'top' : 'bottom'
  if (bXPOS < 0 && kickteamName == KOTname) return setLeftSecondTeamThrowIn(matchDetails, ballIntended)
  if (bXPOS < 0 && kickteamName != KOTname) return setLeftKickOffTeamThrowIn(matchDetails, ballIntended)
  if (bXPOS > matchWidth && kickteamName == KOTname) return setRightSecondTeamThrowIn(matchDetails, ballIntended)
  if (bXPOS > matchWidth && kickteamName != KOTname) return setRightKickOffTeamThrowIn(matchDetails, ballIntended)

  if (bYPOS < 0) {
    if (common.isBetween(bXPOS, halfMWidth - 20, halfMWidth + 20)) {
      if (kickOffTeamSide == 'top') return setSecondTeamGoalScored(matchDetails)
      if (kickOffTeamSide == 'bottom') return setKickOffTeamGoalScored(matchDetails)
    } else {
      if (bXPOS < halfMWidth && kickteamName == KOTname) {
        if (kickOffTeamSide == 'top') return setTopLeftCornerPositions(matchDetails)
        if (kickOffTeamSide == 'bottom') return setTopGoalKick(matchDetails)
      }
      if (bXPOS > halfMWidth && kickteamName == KOTname) {
        if (kickOffTeamSide == 'top') return setTopRightCornerPositions(matchDetails)
        if (kickOffTeamSide == 'bottom') return setTopGoalKick(matchDetails)
      }
      if (bXPOS < halfMWidth && kickteamName != KOTname) {
        if (kickOffTeamSide == 'top') return setTopGoalKick(matchDetails)
        if (kickOffTeamSide == 'bottom') return setTopLeftCornerPositions(matchDetails)
      }
      if (bXPOS > halfMWidth && kickteamName != KOTname) {
        if (kickOffTeamSide == 'top') return setTopGoalKick(matchDetails)
        if (kickOffTeamSide == 'bottom') return setTopRightCornerPositions(matchDetails)
      }
    }
  }

  if (bYPOS > matchHeight) {
    if (common.isBetween(bXPOS, halfMWidth - 20, halfMWidth + 20)) {
      if (kickOffTeamSide == 'top') return setKickOffTeamGoalScored(matchDetails)
      if (kickOffTeamSide == 'bottom') return setSecondTeamGoalScored(matchDetails)
    } else {
      if (bXPOS < halfMWidth && kickteamName == KOTname) {
        if (kickOffTeamSide == 'top') return setBottomGoalKick(matchDetails)
        if (kickOffTeamSide == 'bottom') return setBottomLeftCornerPositions(matchDetails)
      }
      if (bXPOS > halfMWidth && kickteamName == KOTname) {
        if (kickOffTeamSide == 'top') return setBottomGoalKick(matchDetails)
        if (kickOffTeamSide == 'bottom') return setBottomRightCornerPositions(matchDetails)
      }
      if (bXPOS < halfMWidth && kickteamName != KOTname) {
        if (kickOffTeamSide == 'top') return setBottomLeftCornerPositions(matchDetails)
        if (kickOffTeamSide == 'bottom') return setBottomGoalKick(matchDetails)
      }
      if (bXPOS > halfMWidth && kickteamName != KOTname) {
        if (kickOffTeamSide == 'top') return setBottomRightCornerPositions(matchDetails)
        if (kickOffTeamSide == 'bottom') return setBottomGoalKick(matchDetails)
      }
    }
  }
  matchDetails.ballIntended = ballIntended
  return matchDetails
}

function setPlayerPositions(matchDetails, team, extra) {
  for (const thisPlayer of team.players) {
    if (thisPlayer.position == `GK`) {
      thisPlayer.startPOS = thisPlayer.originPOS.map(x => x)
    } else {
      let tempArray = thisPlayer.originPOS
      thisPlayer.startPOS = tempArray.map(x => x)
      const playerPos = parseInt(thisPlayer.startPOS[1], 10) + extra
      if (common.isBetween(playerPos, -1, (matchDetails.pitchSize[1] + 1))) {
        thisPlayer.startPOS[1] = playerPos
      }
      thisPlayer.relativePOS = tempArray.map(x => x)
      thisPlayer.relativePOS[1] = playerPos
    }
  }
}

function formationCheck(origin, current) {
  let xPos = origin[0] - current[0]
  let yPos = origin[1] - current[1]
  let moveToFormation = []
  moveToFormation.push(xPos)
  moveToFormation.push(yPos)
  return moveToFormation
}

function switchSide(matchDetails, team) {
  for (const thisPlayer of team.players) {
    if (!thisPlayer.originPOS) {
      throw new Error(`Each player must have an origin position set`)
    }
    thisPlayer.originPOS[1] = matchDetails.pitchSize[1] - thisPlayer.originPOS[1]
    thisPlayer.startPOS = thisPlayer.originPOS.map(x => x)
    thisPlayer.relativePOS = thisPlayer.originPOS.map(x => x)
    thisPlayer.fitness = (thisPlayer.fitness < 51) ? common.round((thisPlayer.fitness + 50), 2) : 100
  }
  return matchDetails
}

function setRelativePosition(player, team, matchDetails) {
  let tempArray = parseInt(player.startPOS[1], 10) - parseInt(player.originPOS[1], 10)
  let { kickOffTeam, secondTeam } = matchDetails
  for (const thisPlayer of team.players) {
    let originArray = thisPlayer.originPOS
    let possibleMove = parseInt(thisPlayer.originPOS[1], 10) + tempArray
    if (thisPlayer.name === player.name) {
      thisPlayer.relativePOS = thisPlayer.startPOS.map(x => x)
    } else if (team.intent === `attack`) {
      if (thisPlayer.position !== `GK` && thisPlayer.position !== `CB`) {
        if (thisPlayer.originPOS[1] > matchDetails.pitchSize[1] / 2) {
          if (possibleMove > thisPlayer.originPOS) {
            thisPlayer.relativePOS = originArray.map(x => x)
          } else {
            thisPlayer.relativePOS[1] = possibleMove
          }
        } else if (possibleMove < thisPlayer.originPOS) {
          thisPlayer.relativePOS = originArray.map(x => x)
        } else {
          thisPlayer.relativePOS[1] = possibleMove
        }
      } else {
        thisPlayer.relativePOS = originArray.map(x => x)
      }
    } else {
      let opp = (team.name === kickOffTeam.name) ? secondTeam : kickOffTeam
      let oppPlyr = closestPlayerToPosition(player, opp, player.originPOS)
      let xDiff = Math.abs(player.originPOS[0] - oppPlyr.proxPOS[0])
      let yDiff = Math.abs(player.originPOS[1] - oppPlyr.proxPOS[1])
      let xClose = common.isBetween(xDiff, 0, 16)
      let yClose = common.isBetween(yDiff, 0, 16)
      if (xClose && yClose) {
        let tempArray = oppPlyr.thePlayer.startPOS
        thisPlayer.relativePOS = tempArray.map(x => x)
      } else {
        thisPlayer.relativePOS = originArray.map(x => x)
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
  setTopRightCornerPositions,
  setTopLeftCornerPositions,
  setBottomLeftCornerPositions,
  setBottomRightCornerPositions,
  setPlayerPositions,
  keepInBoundaries,
  setTopGoalKick,
  setBottomGoalKick,
  closestPlayerToPosition,
  setSetpieceKickOffTeam,
  setSetpieceSecondTeam,
  setTopPenalty,
  setBottomPenalty,
  setFreekick,
  setKickOffTeamGoalScored,
  setSecondTeamGoalScored,
  setBallSpecificGoalScoreValue,
  formationCheck,
  switchSide,
  setRelativePosition,
  removeBallFromAllPlayers,
  setLeftKickOffTeamThrowIn,
  setLeftSecondTeamThrowIn,
  setRightKickOffTeamThrowIn,
  setRightSecondTeamThrowIn
}
