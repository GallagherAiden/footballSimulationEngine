const common = require(`../lib/common`)
const setVariables = require(`../lib/setVariables`)
const setFreekicks = require(`../lib/setFreekicks`)

function setGoalieHasBall(matchDetails, thisGoalie) {
  let { kickOffTeam, secondTeam } = matchDetails
  let team = (kickOffTeam.players[0].playerID == thisGoalie.playerID) ? kickOffTeam : secondTeam
  let opposition = (kickOffTeam.players[0].playerID == thisGoalie.playerID) ? secondTeam : kickOffTeam
  thisGoalie.hasBall = true
  matchDetails.ball.lastTouch.playerName = thisGoalie.name
  matchDetails.ball.lastTouch.playerID = thisGoalie.playerID
  matchDetails.ball.lastTouch.teamID = team.teamID
  matchDetails.ball.lastTouch.deflection = false
  matchDetails.ball.position = [...thisGoalie.currentPOS, 0]
  matchDetails.ball.Player = thisGoalie.playerID
  matchDetails.ball.withPlayer = true
  matchDetails.ball.withTeam = team.teamID
  team.intent = 'attack'
  opposition.intent = 'defend'
  matchDetails.ball.ballOverIterations = []
  return matchDetails
}

function setTopRightCornerPositions(matchDetails) {
  common.removeBallFromAllPlayers(matchDetails)
  let [pitchWidth] = matchDetails.pitchSize
  let kickOffTeamKeepYPos = matchDetails.kickOffTeam.players[0].originPOS[1]
  let halfPitchSize = (matchDetails.pitchSize[1] / 2)
  let attack = (kickOffTeamKeepYPos > halfPitchSize) ? matchDetails.kickOffTeam : matchDetails.secondTeam
  let defence = (kickOffTeamKeepYPos > halfPitchSize) ? matchDetails.secondTeam : matchDetails.kickOffTeam
  for (let playerNum of [0, 1, 2, 3, 4]) {
    attack.players[playerNum].currentPOS = attack.players[playerNum].originPOS.map(x => x)
    defence.players[playerNum].currentPOS = defence.players[playerNum].originPOS.map(x => x)
  }
  for (let playerNum of [5, 6, 7, 8, 9, 10]) {
    attack.players[playerNum].currentPOS = common.getRandomTopPenaltyPosition(matchDetails)
    defence.players[playerNum].currentPOS = common.getRandomTopPenaltyPosition(matchDetails)
  }
  attack.players[1].currentPOS = [pitchWidth, 0]
  attack.players[4].currentPOS = [pitchWidth - 10, 20]
  defence.players[4].currentPOS = [pitchWidth - 12, 10]
  matchDetails.ball.position = [pitchWidth, 0, 0]
  setBallSpecificCornerValue(matchDetails, attack)
  matchDetails.endIteration = true
  return matchDetails
}

function setTopLeftCornerPositions(matchDetails) {
  common.removeBallFromAllPlayers(matchDetails)
  let kickOffTeamKeepYPos = matchDetails.kickOffTeam.players[0].originPOS[1]
  let halfPitchSize = matchDetails.pitchSize[1] / 2
  let attack = (kickOffTeamKeepYPos > halfPitchSize) ? matchDetails.kickOffTeam : matchDetails.secondTeam
  let defence = (kickOffTeamKeepYPos > halfPitchSize) ? matchDetails.secondTeam : matchDetails.kickOffTeam
  for (let playerNum of [0, 1, 2, 3, 4]) {
    attack.players[playerNum].currentPOS = attack.players[playerNum].originPOS.map(x => x)
    defence.players[playerNum].currentPOS = defence.players[playerNum].originPOS.map(x => x)
  }
  for (let playerNum of [5, 6, 7, 8, 9, 10]) {
    attack.players[playerNum].currentPOS = common.getRandomTopPenaltyPosition(matchDetails)
    defence.players[playerNum].currentPOS = common.getRandomTopPenaltyPosition(matchDetails)
  }
  attack.players[1].currentPOS = [0, 0]
  attack.players[4].currentPOS = [10, 20]
  defence.players[1].currentPOS = [12, 10]
  matchDetails.ball.position = [0, 0, 0]
  setBallSpecificCornerValue(matchDetails, attack)
  matchDetails.endIteration = true
  return matchDetails
}

function setBottomLeftCornerPositions(matchDetails) {
  common.removeBallFromAllPlayers(matchDetails)
  let [, pitchHeight] = matchDetails.pitchSize
  let kickOffTeamKeepYPos = matchDetails.kickOffTeam.players[0].originPOS[1]
  let halfPitchSize = matchDetails.pitchSize[1] / 2
  let attack = (kickOffTeamKeepYPos < halfPitchSize) ? matchDetails.kickOffTeam : matchDetails.secondTeam
  let defence = (kickOffTeamKeepYPos < halfPitchSize) ? matchDetails.secondTeam : matchDetails.kickOffTeam
  for (let playerNum of [0, 1, 2, 3, 4]) {
    attack.players[playerNum].currentPOS = attack.players[playerNum].originPOS.map(x => x)
    defence.players[playerNum].currentPOS = defence.players[playerNum].originPOS.map(x => x)
  }
  for (let playerNum of [5, 6, 7, 8, 9, 10]) {
    attack.players[playerNum].currentPOS = common.getRandomBottomPenaltyPosition(matchDetails)
    defence.players[playerNum].currentPOS = common.getRandomBottomPenaltyPosition(matchDetails)
  }
  attack.players[1].currentPOS = [0, pitchHeight]
  attack.players[4].currentPOS = [10, pitchHeight - 20]
  defence.players[1].currentPOS = [12, pitchHeight - 10]
  matchDetails.ball.position = [0, pitchHeight, 0]
  setBallSpecificCornerValue(matchDetails, attack)
  matchDetails.endIteration = true
  return matchDetails
}

function setBottomRightCornerPositions(matchDetails) {
  common.removeBallFromAllPlayers(matchDetails)
  let [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let kickOffTeamKeepYPos = matchDetails.kickOffTeam.players[0].originPOS[1]
  let halfPitchSize = matchDetails.pitchSize[1] / 2
  let attack = (kickOffTeamKeepYPos < halfPitchSize) ? matchDetails.kickOffTeam : matchDetails.secondTeam
  let defence = (kickOffTeamKeepYPos < halfPitchSize) ? matchDetails.secondTeam : matchDetails.kickOffTeam
  for (let playerNum of [0, 1, 2, 3, 4]) {
    attack.players[playerNum].currentPOS = attack.players[playerNum].originPOS.map(x => x)
    defence.players[playerNum].currentPOS = defence.players[playerNum].originPOS.map(x => x)
  }
  for (let playerNum of [5, 6, 7, 8, 9, 10]) {
    attack.players[playerNum].currentPOS = common.getRandomBottomPenaltyPosition(matchDetails)
    defence.players[playerNum].currentPOS = common.getRandomBottomPenaltyPosition(matchDetails)
  }
  attack.players[1].currentPOS = [pitchWidth, pitchHeight]
  attack.players[4].currentPOS = [pitchWidth - 10, pitchHeight - 20]
  defence.players[4].currentPOS = [pitchWidth - 12, pitchHeight - 10]
  matchDetails.ball.position = [pitchWidth, pitchHeight, 0]
  setBallSpecificCornerValue(matchDetails, attack)
  matchDetails.endIteration = true
  return matchDetails
}

function setBallSpecificCornerValue(matchDetails, attack) {
  attack.players[1].hasBall = true
  matchDetails.ball.lastTouch.playerName = attack.players[1].name
  matchDetails.ball.lastTouch.playerID = attack.players[1].playerID
  matchDetails.ball.lastTouch.teamID = attack.teamID
  matchDetails.ball.lastTouch.deflection = false
  matchDetails.ball.ballOverIterations = []
  matchDetails.ball.withPlayer = true
  matchDetails.ball.Player = attack.players[1].playerID
  matchDetails.ball.withTeam = attack.teamID
  matchDetails.iterationLog.push(`Corner to - ${attack.name}`)
}

function setLeftKickOffTeamThrowIn(matchDetails, ballIntended) {
  common.removeBallFromAllPlayers(matchDetails)
  let { kickOffTeam, secondTeam } = matchDetails
  let [, place] = ballIntended
  const [, pitchHeight] = matchDetails.pitchSize
  place = ((place - 30) < 0) ? 30 : place
  place = ((place + 10) > (pitchHeight + 1)) ? (pitchHeight - 10) : place
  let movement = kickOffTeam.players[5].originPOS[1] - place
  let oppMovement = 0 - movement
  ballThrowInPosition(matchDetails, kickOffTeam)
  setPlayerPositions(matchDetails, kickOffTeam, movement)
  setPlayerPositions(matchDetails, secondTeam, oppMovement)
  attackLeftThrowInPlayerPosition(pitchHeight, kickOffTeam, place)
  defenceLeftThrowInPlayerPosition(pitchHeight, secondTeam, place)
  matchDetails.ball.position = [0, place, 0]
  kickOffTeam.players[5].currentPOS = matchDetails.ball.position.map(x => x)
  matchDetails.ball.lastTouch.playerName = kickOffTeam.players[5].name
  matchDetails.ball.lastTouch.playerID = kickOffTeam.players[5].playerID
  matchDetails.ball.lastTouch.teamID = kickOffTeam.teamID
  kickOffTeam.players[5].currentPOS.pop()
  matchDetails.endIteration = true
  return matchDetails
}

function setRightKickOffTeamThrowIn(matchDetails, ballIntended) {
  common.removeBallFromAllPlayers(matchDetails)
  let { kickOffTeam, secondTeam } = matchDetails
  let [, place] = ballIntended
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  place = ((place - 30) < 0) ? 30 : place
  place = ((place + 10) > (pitchHeight + 1)) ? (pitchHeight - 10) : place
  let movement = kickOffTeam.players[5].originPOS[1] - place
  let oppMovement = 0 - movement
  ballThrowInPosition(matchDetails, kickOffTeam)
  setPlayerPositions(matchDetails, kickOffTeam, movement)
  setPlayerPositions(matchDetails, secondTeam, oppMovement)
  attackRightThrowInPlayerPosition(matchDetails.pitchSize, kickOffTeam, place)
  defenceRightThrowInPlayerPosition(matchDetails.pitchSize, secondTeam, place)
  matchDetails.ball.position = [pitchWidth, place, 0]
  kickOffTeam.players[5].currentPOS = matchDetails.ball.position.map(x => x)
  matchDetails.ball.lastTouch.playerName = kickOffTeam.players[5].name
  matchDetails.ball.lastTouch.playerID = kickOffTeam.players[5].playerID
  matchDetails.ball.lastTouch.teamID = kickOffTeam.teamID
  kickOffTeam.players[5].currentPOS.pop()
  matchDetails.endIteration = true
  return matchDetails
}

function setLeftSecondTeamThrowIn(matchDetails, ballIntended) {
  common.removeBallFromAllPlayers(matchDetails)
  let { kickOffTeam, secondTeam } = matchDetails
  let [, place] = ballIntended
  const [, pitchHeight] = matchDetails.pitchSize
  place = ((place - 30) < 0) ? 30 : place
  place = ((place + 10) > (pitchHeight + 1)) ? (pitchHeight - 10) : place
  let movement = secondTeam.players[5].originPOS[1] - place
  let oppMovement = 0 - movement
  ballThrowInPosition(matchDetails, secondTeam)
  setPlayerPositions(matchDetails, secondTeam, movement)
  setPlayerPositions(matchDetails, kickOffTeam, oppMovement)
  attackLeftThrowInPlayerPosition(pitchHeight, secondTeam, place)
  defenceLeftThrowInPlayerPosition(pitchHeight, kickOffTeam, place)
  matchDetails.ball.position = [0, place, 0]
  secondTeam.players[5].currentPOS = matchDetails.ball.position.map(x => x)
  matchDetails.ball.lastTouch.playerName = secondTeam.players[5].name
  matchDetails.ball.lastTouch.playerID = secondTeam.players[5].playerID
  matchDetails.ball.lastTouch.teamID = secondTeam.teamID
  secondTeam.players[5].currentPOS.pop()
  matchDetails.endIteration = true
  return matchDetails
}

function setRightSecondTeamThrowIn(matchDetails, ballIntended) {
  common.removeBallFromAllPlayers(matchDetails)
  let { kickOffTeam, secondTeam } = matchDetails
  let [, place] = ballIntended
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  place = ((place - 30) < 0) ? 30 : place
  place = ((place + 10) > (pitchHeight + 1)) ? (pitchHeight - 10) : place
  let movement = secondTeam.players[5].originPOS[1] - place
  let oppMovement = 0 - movement
  ballThrowInPosition(matchDetails, secondTeam)
  setPlayerPositions(matchDetails, secondTeam, movement)
  setPlayerPositions(matchDetails, kickOffTeam, oppMovement)
  attackRightThrowInPlayerPosition(matchDetails.pitchSize, secondTeam, place)
  defenceRightThrowInPlayerPosition(matchDetails.pitchSize, kickOffTeam, place)
  matchDetails.ball.position = [pitchWidth, place, 0]
  secondTeam.players[5].currentPOS = matchDetails.ball.position.map(x => x)
  matchDetails.ball.lastTouch.playerName = secondTeam.players[5].name
  matchDetails.ball.lastTouch.playerID = secondTeam.players[5].playerID
  matchDetails.ball.lastTouch.teamID = secondTeam.teamID
  secondTeam.players[5].currentPOS.pop()
  matchDetails.endIteration = true
  return matchDetails
}

function ballThrowInPosition(matchDetails, attack) {
  matchDetails.ball.ballOverIterations = []
  matchDetails.ball.withPlayer = true
  matchDetails.ball.Player = attack.players[5].playerID
  matchDetails.ball.withTeam = attack.teamID
  matchDetails.ball.lastTouch.deflection = false
  matchDetails.iterationLog.push(`Throw in to - ${attack.name}`)
}

function attackLeftThrowInPlayerPosition(pitchHeight, attack, place) {
  attack.players[8].currentPOS = [15, place]
  attack.players[7].currentPOS = [10, common.upToMax(place + 10, pitchHeight)]
  attack.players[9].currentPOS = [10, common.upToMin(place - 10, 0)]
  attack.players[5].hasBall = true
}

function defenceLeftThrowInPlayerPosition(pitchHeight, defence, place) {
  defence.players[5].currentPOS = [20, place]
  defence.players[7].currentPOS = [30, common.upToMax(place + 5, pitchHeight)]
  defence.players[8].currentPOS = [25, common.upToMin(place - 15, 0)]
  defence.players[9].currentPOS = [10, common.upToMin(place - 30, 0)]
}

function attackRightThrowInPlayerPosition(pitchSize, attack, place) {
  const [pitchWidth, pitchHeight] = pitchSize
  attack.players[8].currentPOS = [pitchWidth - 15, place]
  attack.players[7].currentPOS = [pitchWidth - 10, common.upToMax(place + 10, pitchHeight)]
  attack.players[9].currentPOS = [pitchWidth - 10, common.upToMin(place - 10, 0)]
  attack.players[5].hasBall = true
}

function defenceRightThrowInPlayerPosition(pitchSize, defence, place) {
  const [pitchWidth, pitchHeight] = pitchSize
  defence.players[5].currentPOS = [pitchWidth - 20, place]
  defence.players[7].currentPOS = [pitchWidth - 30, common.upToMax(place + 5, pitchHeight)]
  defence.players[8].currentPOS = [pitchWidth - 25, common.upToMin(place - 15, 0)]
  defence.players[9].currentPOS = [pitchWidth - 10, common.upToMin(place - 30, 0)]
}

function setBottomGoalKick(matchDetails) {
  let kickOffTeamKeepYPos = matchDetails.kickOffTeam.players[0].originPOS[1]
  let halfPitchSize = matchDetails.pitchSize[1] / 2
  let attack = (kickOffTeamKeepYPos > halfPitchSize) ? matchDetails.kickOffTeam : matchDetails.secondTeam
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  common.removeBallFromAllPlayers(matchDetails)
  setVariables.resetPlayerPositions(matchDetails)
  setPlayerPositions(matchDetails, attack, -80)
  matchDetails.ball.position = [pitchWidth / 2, pitchHeight - 20, 0]
  setBallSpecificGoalKickValue(matchDetails, attack)
  matchDetails.endIteration = true
  return matchDetails
}

function setTopGoalKick(matchDetails) {
  let kickOffTeamKeepYPos = matchDetails.kickOffTeam.players[0].originPOS[1]
  let halfPitchSize = matchDetails.pitchSize[1] / 2
  let attack = (kickOffTeamKeepYPos > halfPitchSize) ? matchDetails.secondTeam : matchDetails.kickOffTeam
  const [pitchWidth] = matchDetails.pitchSize
  common.removeBallFromAllPlayers(matchDetails)
  setVariables.resetPlayerPositions(matchDetails)
  setPlayerPositions(matchDetails, attack, 80)
  matchDetails.ball.position = [pitchWidth / 2, 20, 0]
  setBallSpecificGoalKickValue(matchDetails, attack)
  matchDetails.endIteration = true
  return matchDetails
}

function setBallSpecificGoalKickValue(matchDetails, attack) {
  attack.players[0].currentPOS = matchDetails.ball.position.map(x => x)
  attack.players[0].currentPOS.pop()
  attack.players[0].hasBall = true
  matchDetails.ball.lastTouch.playerName = attack.players[0].name
  matchDetails.ball.lastTouch.playerID = attack.players[0].playerID
  matchDetails.ball.lastTouch.teamID = attack.teamID
  matchDetails.ball.lastTouch.deflection = false
  matchDetails.ball.ballOverIterations = []
  matchDetails.ball.withPlayer = true
  matchDetails.ball.Player = attack.players[0].playerID
  matchDetails.ball.withTeam = attack.teamID
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
    if (player.playerID !== thisPlayer.playerID) {
      let ballToPlayerX = thisPlayer.currentPOS[0] - position[0]
      let ballToPlayerY = thisPlayer.currentPOS[1] - position[1]
      let proximityToBall = Math.abs(ballToPlayerX) + Math.abs(ballToPlayerY)
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
  const [, pitchHeight] = matchDetails.pitchSize
  let ballPosition = matchDetails.ball.position.map(x => x)
  let attackingTowardsTop = (matchDetails.kickOffTeam.players[0].currentPOS[1] > pitchHeight / 2)
  if (attackingTowardsTop && common.inTopPenalty(matchDetails, ballPosition)) {
    matchDetails.kickOffTeamStatistics.penalties++
    matchDetails.iterationLog.push(`penalty to: ${matchDetails.kickOffTeam.name}`)
    matchDetails.iterationLog.push(`penalty awarded, ball moved to penalty spot`)
    return setTopPenalty(matchDetails)
  } else if (attackingTowardsTop == false && common.inBottomPenalty(matchDetails, ballPosition)) {
    matchDetails.kickOffTeamStatistics.penalties++
    matchDetails.iterationLog.push(`penalty to: ${matchDetails.kickOffTeam.name}`)
    matchDetails.iterationLog.push(`penalty awarded, ball moved to penalty spot`)
    return setBottomPenalty(matchDetails)
  } else if (attackingTowardsTop) {
    matchDetails.kickOffTeamStatistics.freekicks++
    matchDetails.iterationLog.push(`freekick to: ${matchDetails.kickOffTeam.name} [${matchDetails.ball.position}]`)
    matchDetails.iterationLog.push(`freekick awarded`)
    return setFreekicks.setBottomFreekick(matchDetails, ballPosition)
  }
  matchDetails.kickOffTeamStatistics.freekicks++
  matchDetails.iterationLog.push(`freekick to: ${matchDetails.kickOffTeam.name} [${matchDetails.ball.position}]`)
  matchDetails.iterationLog.push(`freekick awarded`)
  return setFreekicks.setTopFreekick(matchDetails, ballPosition)
}

function setSetpieceSecondTeam(matchDetails) {
  const [, pitchHeight] = matchDetails.pitchSize
  let ballPosition = matchDetails.ball.position.map(x => x)
  let attackingTowardsTop = (matchDetails.secondTeam.players[0].currentPOS[1] > pitchHeight / 2)
  if (attackingTowardsTop && common.inTopPenalty(matchDetails, ballPosition)) {
    matchDetails.secondTeamStatistics.penalties++
    matchDetails.iterationLog.push(`penalty to: ${matchDetails.secondTeam.name}`)
    return setTopPenalty(matchDetails)
  } else if (attackingTowardsTop == false && common.inBottomPenalty(matchDetails, ballPosition)) {
    matchDetails.secondTeamStatistics.penalties++
    matchDetails.iterationLog.push(`penalty to: ${matchDetails.secondTeam.name}`)
    return setBottomPenalty(matchDetails)
  } else if (attackingTowardsTop) {
    matchDetails.secondTeamStatistics.freekicks++
    matchDetails.iterationLog.push(`freekick to: ${matchDetails.secondTeam.name} [${matchDetails.ball.position}]`)
    return setFreekicks.setBottomFreekick(matchDetails, ballPosition)
  }
  matchDetails.secondTeamStatistics.freekicks++
  matchDetails.iterationLog.push(`freekick to: ${matchDetails.secondTeam.name} [${matchDetails.ball.position}]`)
  return setFreekicks.setTopFreekick(matchDetails, ballPosition)
}

function selectPenaltyTaker(team) {
  const available = team.players.filter(p => p.currentPOS[0] !== 'NP')
  available.sort((a, b) => b.skill.shooting - a.skill.shooting)
  return available[0]
}

function setTopPenalty(matchDetails) {
  common.removeBallFromAllPlayers(matchDetails)
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let kickOffTeamKeepYPos = matchDetails.kickOffTeam.players[0].originPOS[1]
  let halfPitchSize = (matchDetails.pitchSize[1] / 2)
  let attack = (kickOffTeamKeepYPos > halfPitchSize) ? matchDetails.kickOffTeam : matchDetails.secondTeam
  let defence = (kickOffTeamKeepYPos > halfPitchSize) ? matchDetails.secondTeam : matchDetails.kickOffTeam
  let tempArray = [pitchWidth / 2, pitchHeight / 6]
  let shootArray = [pitchWidth / 2, common.round(pitchHeight / 17.5, 0)]
  defence.players[0].currentPOS = defence.players[0].originPOS.map(x => x)
  setPlayerPenaltyPositions(tempArray, attack, defence, shootArray)
  setBallSpecificPenaltyValue(matchDetails, shootArray, attack)
  matchDetails.ball.direction = `north`
  attack.intent = `attack`
  defence.intent = `defend`
  matchDetails.endIteration = true
  return matchDetails
}

function setBottomPenalty(matchDetails) {
  common.removeBallFromAllPlayers(matchDetails)
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let kickOffTeamKeepYPos = matchDetails.kickOffTeam.players[0].originPOS[1]
  let halfPitchSize = (matchDetails.pitchSize[1] / 2)
  let attack = (kickOffTeamKeepYPos > halfPitchSize) ? matchDetails.secondTeam : matchDetails.kickOffTeam
  let defence = (kickOffTeamKeepYPos > halfPitchSize) ? matchDetails.kickOffTeam : matchDetails.secondTeam
  let tempArray = [pitchWidth / 2, pitchHeight - (pitchHeight / 6)]
  let shootArray = [pitchWidth / 2, pitchHeight - common.round(pitchHeight / 17.5, 0)]
  defence.players[0].currentPOS = defence.players[0].originPOS.map(x => x)
  setPlayerPenaltyPositions(tempArray, attack, defence, shootArray)
  setBallSpecificPenaltyValue(matchDetails, shootArray, attack)
  matchDetails.ball.direction = `south`
  attack.intent = `attack`
  defence.intent = `defend`
  matchDetails.endIteration = true
  return matchDetails
}

function setPlayerPenaltyPositions(tempArray, attack, defence, shootArray) {
  let oppxpos = -10
  let teamxpos = -9
  const ballY = shootArray[1]
  for (const num of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    if (num != 10) {
      if (attack.players[num].currentPOS[0] != 'NP') {
        attack.players[num].currentPOS = tempArray.map(x => x)
        attack.players[num].currentPOS[0] += teamxpos
        if (attack.players[num].currentPOS[1] > ballY) attack.players[num].currentPOS[1] = ballY
      }
    }
    if (defence.players[num].currentPOS[0] != 'NP') {
      defence.players[num].currentPOS = tempArray.map(x => x)
      defence.players[num].currentPOS[0] += oppxpos
    }
    oppxpos += 2
    teamxpos += 2
  }
}

function setBallSpecificPenaltyValue(matchDetails, shootArray, attack) {
  const taker = selectPenaltyTaker(attack)
  attack.players[0].currentPOS = attack.players[0].originPOS.map(x => x)
  taker.currentPOS = shootArray.map(x => x)
  taker.hasBall = true
  taker.action = `penalty`
  matchDetails.ball.lastTouch.playerName = taker.name
  matchDetails.ball.lastTouch.playerID = taker.playerID
  matchDetails.ball.lastTouch.teamID = attack.teamID
  matchDetails.ball.lastTouch.deflection = false
  matchDetails.ball.position = shootArray.map(x => x)
  matchDetails.ball.ballOverIterations = []
  matchDetails.ball.Player = taker.playerID
  matchDetails.ball.withPlayer = true
  matchDetails.ball.withTeam = attack.teamID
}

function setKickOffTeamGoalScored(matchDetails) {
  let scorer = matchDetails.ball.lastTouch.playerName
  matchDetails.iterationLog.push(`Goal Scored by - ${scorer} - (${matchDetails.kickOffTeam.name})`)
  let thisIndex = matchDetails.kickOffTeam.players.findIndex(thisPlayer => thisPlayer.name == scorer)
  if (thisIndex > -1) matchDetails.kickOffTeam.players[thisIndex].stats.goals++
  matchDetails.ball.lastTouch.playerName = ``
  matchDetails.ball.lastTouch.playerID = ``
  matchDetails.ball.lastTouch.teamID = ``
  common.removeBallFromAllPlayers(matchDetails)
  setVariables.resetPlayerPositions(matchDetails)
  setBallSpecificGoalScoreValue(matchDetails, matchDetails.secondTeam)
  matchDetails.secondTeam.intent = `attack`
  matchDetails.kickOffTeam.intent = `defend`
  matchDetails.kickOffTeamStatistics.goals++
  matchDetails.endIteration = true
  return matchDetails
}

function setSecondTeamGoalScored(matchDetails) {
  let scorer = matchDetails.ball.lastTouch.playerName
  matchDetails.iterationLog.push(`Goal Scored by - ${scorer} - (${matchDetails.secondTeam.name})`)
  let thisIndex = matchDetails.secondTeam.players.findIndex(thisPlayer => thisPlayer.name == scorer)
  if (thisIndex > -1) matchDetails.secondTeam.players[thisIndex].stats.goals++
  matchDetails.ball.lastTouch.playerName = ''
  matchDetails.ball.lastTouch.playerID = ``
  matchDetails.ball.lastTouch.teamID = ``
  common.removeBallFromAllPlayers(matchDetails)
  setVariables.resetPlayerPositions(matchDetails)
  setBallSpecificGoalScoreValue(matchDetails, matchDetails.kickOffTeam)
  matchDetails.kickOffTeam.intent = `attack`
  matchDetails.secondTeam.intent = `defend`
  matchDetails.secondTeamStatistics.goals++
  matchDetails.endIteration = true
  return matchDetails
}

function setBallSpecificGoalScoreValue(matchDetails, conceedingTeam) {
  matchDetails.ball.position = [matchDetails.pitchSize[0] / 2, matchDetails.pitchSize[1] / 2, 0]
  matchDetails.ball.ballOverIterations = []
  matchDetails.ball.withPlayer = true
  matchDetails.ball.withTeam = conceedingTeam.teamID
  let playerWithBall = common.getRandomNumber(9, 10)
  let waitingPlayer = (playerWithBall === 9) ? 10 : 9
  conceedingTeam.players[playerWithBall].currentPOS = matchDetails.ball.position.map(x => x)
  conceedingTeam.players[playerWithBall].currentPOS.pop()
  conceedingTeam.players[playerWithBall].hasBall = true
  matchDetails.ball.lastTouch.playerName = conceedingTeam.players[playerWithBall].name
  matchDetails.ball.lastTouch.playerID = conceedingTeam.players[playerWithBall].playerID
  matchDetails.ball.lastTouch.teamID = conceedingTeam.teamID
  matchDetails.ball.lastTouch.deflection = false
  matchDetails.ball.Player = conceedingTeam.players[playerWithBall].playerID
  let tempPosition = [matchDetails.ball.position[0] + 20, matchDetails.ball.position[1]]
  conceedingTeam.players[waitingPlayer].currentPOS = tempPosition.map(x => x)
}

function keepInBoundaries(matchDetails, kickteamID, ballIntended) {
  let { kickOffTeam } = matchDetails
  let KOTid = kickOffTeam.teamID
  const [pitchWidth, pitchHeight, goalWidth] = matchDetails.pitchSize
  let halfMWidth = parseInt(pitchWidth / 2, 10)
  let leftPost = parseInt(halfMWidth, 10) - parseInt(goalWidth / 2, 10)
  let rightPost = parseInt(halfMWidth, 10) + parseInt(goalWidth / 2, 10)
  const [bXPOS, bYPOS] = ballIntended
  let kickOffTeamSide = (kickOffTeam.players[0].originPOS[1] < (pitchHeight / 2)) ? 'top' : 'bottom'
  if (bXPOS < 0 && kickteamID == KOTid) return setLeftSecondTeamThrowIn(matchDetails, ballIntended)
  if (bXPOS < 0 && kickteamID != KOTid) return setLeftKickOffTeamThrowIn(matchDetails, ballIntended)
  if (bXPOS > pitchWidth && kickteamID == KOTid) return setRightSecondTeamThrowIn(matchDetails, ballIntended)
  if (bXPOS > pitchWidth && kickteamID != KOTid) return setRightKickOffTeamThrowIn(matchDetails, ballIntended)
  if (bYPOS < 0) {
    if (common.isBetween(bXPOS, leftPost, rightPost)) {
      if (kickOffTeamSide == 'top') return setSecondTeamGoalScored(matchDetails)
      if (kickOffTeamSide == 'bottom') return setKickOffTeamGoalScored(matchDetails)
    } else {
      if (bXPOS < halfMWidth && kickteamID == KOTid) {
        if (kickOffTeamSide == 'top') return setTopLeftCornerPositions(matchDetails)
        if (kickOffTeamSide == 'bottom') return setTopGoalKick(matchDetails)
      }
      if (bXPOS > halfMWidth && kickteamID == KOTid) {
        if (kickOffTeamSide == 'top') return setTopRightCornerPositions(matchDetails)
        if (kickOffTeamSide == 'bottom') return setTopGoalKick(matchDetails)
      }
      if (bXPOS < halfMWidth && kickteamID != KOTid) {
        if (kickOffTeamSide == 'top') return setTopGoalKick(matchDetails)
        if (kickOffTeamSide == 'bottom') return setTopLeftCornerPositions(matchDetails)
      }
      if (bXPOS > halfMWidth && kickteamID != KOTid) {
        if (kickOffTeamSide == 'top') return setTopGoalKick(matchDetails)
        if (kickOffTeamSide == 'bottom') return setTopRightCornerPositions(matchDetails)
      }
    }
  }

  if (bYPOS > pitchHeight) {
    if (common.isBetween(bXPOS, leftPost, rightPost)) {
      if (kickOffTeamSide == 'top') return setKickOffTeamGoalScored(matchDetails)
      if (kickOffTeamSide == 'bottom') return setSecondTeamGoalScored(matchDetails)
    } else {
      if (bXPOS < halfMWidth && kickteamID == KOTid) {
        if (kickOffTeamSide == 'top') return setBottomGoalKick(matchDetails)
        if (kickOffTeamSide == 'bottom') return setBottomLeftCornerPositions(matchDetails)
      }
      if (bXPOS > halfMWidth && kickteamID == KOTid) {
        if (kickOffTeamSide == 'top') return setBottomGoalKick(matchDetails)
        if (kickOffTeamSide == 'bottom') return setBottomRightCornerPositions(matchDetails)
      }
      if (bXPOS < halfMWidth && kickteamID != KOTid) {
        if (kickOffTeamSide == 'top') return setBottomLeftCornerPositions(matchDetails)
        if (kickOffTeamSide == 'bottom') return setBottomGoalKick(matchDetails)
      }
      if (bXPOS > halfMWidth && kickteamID != KOTid) {
        if (kickOffTeamSide == 'top') return setBottomRightCornerPositions(matchDetails)
        if (kickOffTeamSide == 'bottom') return setBottomGoalKick(matchDetails)
      }
    }
  }
  // if (bYPOS < pitchHeight + 1 && bYPOS > 0){
  matchDetails.ballIntended = ballIntended
  return matchDetails
  // }
}

function setPlayerPositions(matchDetails, team, extra) {
  for (const thisPlayer of team.players) {
    if (thisPlayer.position == `GK`) thisPlayer.currentPOS = thisPlayer.originPOS.map(x => x)
    else {
      thisPlayer.currentPOS = thisPlayer.originPOS.map(x => x)
      const playerPos = parseInt(thisPlayer.currentPOS[1], 10) + extra
      if (common.isBetween(playerPos, -1, (matchDetails.pitchSize[1] + 1))) thisPlayer.currentPOS[1] = playerPos
      thisPlayer.intentPOS = [thisPlayer.originPOS[0], playerPos]
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
    if (!thisPlayer.originPOS) throw new Error(`Each player must have an origin position set`)
    thisPlayer.originPOS[1] = matchDetails.pitchSize[1] - thisPlayer.originPOS[1]
    thisPlayer.currentPOS = thisPlayer.originPOS.map(x => x)
    thisPlayer.intentPOS = thisPlayer.originPOS.map(x => x)
    thisPlayer.fitness = (thisPlayer.fitness < 51) ? common.round((thisPlayer.fitness + 50), 2) : 100
  }
  return matchDetails
}

function setIntentPosition(matchDetails, closestPlayer) {
  let { ball, kickOffTeam, secondTeam } = matchDetails
  let kickOffTeamCheck = kickOffTeam.players.find(thisPlayer => thisPlayer.playerID == ball.Player)
  let secondTeamCheck = secondTeam.players.find(thisPlayer => thisPlayer.playerID == ball.Player)
  let kickTeam = (kickOffTeamCheck) ? kickOffTeam : (secondTeamCheck) ? secondTeam : 'none'
  let defendingTeam = (kickTeam == 'none') ? 'none' : (kickTeam.teamID == kickOffTeam.teamID) ? secondTeam : kickOffTeam
  if (defendingTeam != 'none') setDefenceRelativePos(matchDetails, defendingTeam, closestPlayer)
  if (kickTeam != 'none') setAttackRelativePos(matchDetails, kickTeam)
  if (kickTeam == 'none' && defendingTeam == 'none') {
    setLooseintentPOS(matchDetails, kickOffTeam, closestPlayer)
    setLooseintentPOS(matchDetails, secondTeam, closestPlayer)
  }
}

function setLooseintentPOS(matchDetails, thisTeam, closestPlayer) {
  const { ball } = matchDetails
  for (let player of thisTeam.players) {
    const baseX = player.originPOS[0]
    const baseY = player.originPOS[1]
    const diffX = ball.position[0] - player.currentPOS[0]
    const diffY = ball.position[1] - player.currentPOS[1]
    const distance = Math.sqrt(diffX * diffX + diffY * diffY)

    if (player.playerID === closestPlayer.playerID) {
      player.intentPOS = [ball.position[0], ball.position[1]]
      continue
    }

    if (distance < 150) {
      const pressure = 1 - (distance / 150)

      player.intentPOS = [
        player.currentPOS[0] + diffX * pressure * 0.4,
        player.currentPOS[1] + diffY * pressure * 0.4
      ]
      continue
    }

    const compressX = (ball.position[0] - baseX) * 0.25
    const compressY = (ball.position[1] - baseY) * 0.15
    player.intentPOS = [
      baseX + compressX,
      baseY + compressY
    ]
  }
}

function setDefenceRelativePos(matchDetails, defendingTeam, closestPlayer) {
  const { ball } = matchDetails
  for (let player of defendingTeam.players) {
    const baseX = player.originPOS[0]
    const baseY = player.originPOS[1]
    const diffX = ball.position[0] - player.currentPOS[0]
    const diffY = ball.position[1] - player.currentPOS[1]
    if (player.playerID === closestPlayer.playerID) {
      player.intentPOS = [
        player.currentPOS[0] + diffX * 0.6,
        player.currentPOS[1] + diffY * 0.6
      ]
      continue
    }
    const lineShiftY = (ball.position[1] - baseY) * 0.2
    const compressX = (ball.position[0] - baseX) * 0.2
    player.intentPOS = [
      baseX + compressX,
      baseY + lineShiftY
    ]
  }
}

function setAttackRelativePos(matchDetails, kickingTeam) {
  const { ball } = matchDetails
  for (let player of kickingTeam.players) {
    const baseX = player.originPOS[0]
    const baseY = player.originPOS[1]
    const compressX = (ball.position[0] - baseX) * 0.3
    const attackingPush = (ball.position[1] - baseY) * 0.35
    player.intentPOS = [
      baseX + compressX,
      baseY + attackingPush
    ]
  }
}

module.exports = {
  setGoalieHasBall,
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
  setIntentPosition,
  setLeftKickOffTeamThrowIn,
  setLeftSecondTeamThrowIn,
  setRightKickOffTeamThrowIn,
  setRightSecondTeamThrowIn
}
