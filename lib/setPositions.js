const common = require(`../lib/common`)
const setVariables = require(`../lib/setVariables`)
const setFreekicks = require(`../lib/setFreekicks`)

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
  let ballInPenalyBoxX = common.isBetween(ballPosition[0], (matchWidth / 4) + 5, matchWidth - (matchWidth / 4) - 5)
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
  } else if (attackingTowardsTop) {
    matchDetails.kickOffTeamStatistics.freekicks++
    matchDetails.iterationLog.push(`freekick to: ${matchDetails.kickOffTeam.name}`)
    return setFreekicks.setBottomFreekick(matchDetails, ballPosition)
  }
  matchDetails.kickOffTeamStatistics.freekicks++
  matchDetails.iterationLog.push(`freekick to: ${matchDetails.kickOffTeam.name}`)
  return setFreekicks.setTopFreekick(matchDetails, ballPosition)
}

function setSetpieceSecondTeam(matchDetails) {
  const [matchWidth, matchHeight] = matchDetails.pitchSize
  let ballPosition = matchDetails.ball.position.map(x => x)
  let ballInPenalyBoxX = common.isBetween(ballPosition[0], (matchWidth / 4) + 5, matchWidth - (matchWidth / 4) - 5)
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
  } else if (attackingTowardsTop) {
    matchDetails.secondTeamStatistics.freekicks++
    matchDetails.iterationLog.push(`freekick to: ${matchDetails.secondTeam.name}`)
    return setFreekicks.setBottomFreekick(matchDetails, ballPosition)
  }
  matchDetails.secondTeamStatistics.freekicks++
  matchDetails.iterationLog.push(`freekick to: ${matchDetails.secondTeam.name}`)
  return setFreekicks.setTopFreekick(matchDetails, ballPosition)
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

function setRelativePosition(matchDetails) {
  let { ball, kickOffTeam, secondTeam } = matchDetails
  let kickOffTeamCheck = kickOffTeam.players.find(thisPlayer => thisPlayer.name == ball.Player)
  let secondTeamCheck = secondTeam.players.find(thisPlayer => thisPlayer.name == ball.Player)
  let kickTeam = (kickOffTeamCheck) ? kickOffTeam : (secondTeamCheck) ? secondTeam : 'none'
  let defendingTeam = (kickTeam == 'none') ? 'none' : (kickTeam.name == kickOffTeam.name) ? secondTeam : kickOffTeam
  if (defendingTeam != 'none') setDefenceRelativePos(matchDetails, defendingTeam)
  if (kickTeam != 'none') setAttackRelativePos(matchDetails, kickTeam)
  if (kickTeam == 'none' && defendingTeam == 'none') {
    setLooseRelativePos(matchDetails, kickOffTeam)
    setLooseRelativePos(matchDetails, secondTeam)
  }
}

function setLooseRelativePos(matchDetails, thisTeam) {
  const [, pitchHeight] = matchDetails.pitchSize
  let { ball } = matchDetails
  let side = (thisTeam.players[0].originPOS[1] < pitchHeight / 2) ? 'top' : 'bottom'
  for (let player of thisTeam.players) {
    let diffXPOSplayerandball = ball.position[0] - player.startPOS[0]
    let diffYPOSplayerandball = ball.position[1] - player.startPOS[1]
    if (common.isBetween(diffXPOSplayerandball, -16, 16) && common.isBetween(diffYPOSplayerandball, -16, 16)) {
      player.relativePOS = ball.position.map(x => x)
    } else {
      let newYPOS
      if (side == 'top') newYPOS = setNewRelativeTopYPOS(pitchHeight, player, 20)
      if (side == 'bottom') newYPOS = setNewRelativeBottomYPOS(pitchHeight, player, -20)
      player.relativePOS = [player.originPOS[0], parseInt(newYPOS, 10)]
    }
  }
}

function setDefenceRelativePos(matchDetails, defendingTeam) {
  const [, pitchHeight] = matchDetails.pitchSize
  let { ball } = matchDetails
  let side = (defendingTeam.players[0].originPOS[1] < pitchHeight / 2) ? 'top' : 'bottom'
  for (let player of defendingTeam.players) {
    let diffXPOSplayerandball = ball.position[0] - player.startPOS[0]
    let diffYPOSplayerandball = ball.position[1] - player.startPOS[1]
    if (common.isBetween(diffXPOSplayerandball, -16, 16) && common.isBetween(diffYPOSplayerandball, -16, 16)) {
      player.relativePOS = ball.position.map(x => x)
    } else {
      let ballOnOppositeSide = false
      if (side == 'top' && ball.position[1] > pitchHeight / 2) ballOnOppositeSide = true
      if (side == 'bottom' && ball.position[1] < pitchHeight / 2) ballOnOppositeSide = true
      if (ballOnOppositeSide) {
        let newYPOS
        if (side == 'top') newYPOS = setNewRelativeTopYPOS(pitchHeight, player, 20)
        if (side == 'bottom') newYPOS = setNewRelativeBottomYPOS(pitchHeight, player, -20)
        player.relativePOS = [player.originPOS[0], parseInt(newYPOS, 10)]
      } else {
        let ballInFront = false
        if (side == 'top' && diffYPOSplayerandball > 0) ballInFront = true
        if (side == 'bottom' && diffYPOSplayerandball < 0) ballInFront = true
        let isDefender = ['GK', 'CB', 'LB', 'RB'].includes(player.position)
        if (ballInFront && isDefender) {
          player.relativePOS = player.originPOS.map(x => x)
        } else {
          let newYPOS
          if (side == 'top') newYPOS = setNewRelativeTopYPOS(pitchHeight, player, 20)
          if (side == 'bottom') newYPOS = setNewRelativeBottomYPOS(pitchHeight, player, -20)
          player.relativePOS = [player.originPOS[0], parseInt(newYPOS, 10)]
        }
      }
    }
  }
}

function setAttackRelativePos(matchDetails, kickingTeam) {
  const [, pitchHeight] = matchDetails.pitchSize
  let side = (kickingTeam.players[0].originPOS[1] < pitchHeight / 2) ? 'top' : 'bottom'
  for (let player of kickingTeam.players) {
    let newYPOS
    if (side == 'top') newYPOS = setNewRelativeTopYPOS(pitchHeight, player, 20)
    if (side == 'bottom') newYPOS = setNewRelativeBottomYPOS(pitchHeight, player, -20)
    player.relativePOS = [player.originPOS[0], parseInt(newYPOS, 10)]
  }
}

function setNewRelativeTopYPOS(pitchHeight, player, diff) {
  let { position } = player
  if (position == 'GK') return common.upToMax(player.startPOS[1] + diff, pitchHeight * 0.25)
  if (position == 'CB') return common.upToMax(player.startPOS[1] + diff, pitchHeight * 0.5)
  if (['LB', 'RB'].includes(position)) return common.upToMax(player.startPOS[1] + diff, pitchHeight * 0.66)
  if (position == 'CM') return common.upToMax(player.startPOS[1] + diff, pitchHeight * 0.75)
  return common.upToMax(player.startPOS[1] + diff, pitchHeight)
}

function setNewRelativeBottomYPOS(pitchHeight, player, diff) {
  let { position } = player
  if (position == 'GK') return common.upToMin(player.startPOS[1] + diff, pitchHeight * 0.75)
  if (position == 'CB') return common.upToMin(player.startPOS[1] + diff, pitchHeight * 0.5)
  if (['LB', 'RB'].includes(position)) return common.upToMin(player.startPOS[1] + diff, pitchHeight * 0.33)
  if (position == 'CM') return common.upToMin(player.startPOS[1] + diff, pitchHeight * 0.25)
  return common.upToMin(player.startPOS[1] + diff, 0)
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
