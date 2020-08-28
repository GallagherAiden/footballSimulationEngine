const common = require('../lib/common')
const setPositions = require('../lib/setPositions')

function selectAction(possibleActions) {
  let goodActions = []
  for (const thisAction of possibleActions) {
    let tempArray = Array(thisAction.points).fill(thisAction.name)
    goodActions = goodActions.concat(tempArray)
  }
  if (goodActions[0] == null) return 'wait'
  return goodActions[common.getRandomNumber(0, goodActions.length - 1)]
}

function findPossActions(player, team, opposition, ballX, ballY, matchDetails) {
  let possibleActions = populateActionsJSON()
  const [, pitchHeight] = matchDetails.pitchSize
  let params = []
  let {
    hasBall, originPOS
  } = player
  if (hasBall === false) params = playerDoesNotHaveBall(player, ballX, ballY, matchDetails)
  else if (originPOS[1] > (pitchHeight / 2)) params = bottomTeamPlayerHasBall(matchDetails, player, team, opposition)
  else params = topTeamPlayerHasBall(matchDetails, player, team, opposition)
  return populatePossibleActions(possibleActions, ...params)
}

function topTeamPlayerHasBall(matchDetails, player, team, opposition) {
  let playerInformation = setPositions.closestPlayerToPosition(player, opposition, player.currentPOS)
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let {
    position, currentPOS, skill
  } = player
  if (position === 'GK' && oppositionNearPlayer(playerInformation, 10, 25)) return [0, 0, 10, 0, 0, 0, 0, 10, 0, 40, 40]
  else if (position === 'GK') return [0, 0, 50, 0, 0, 0, 0, 10, 0, 20, 20]
  else if (onBottomCornerBoundary(currentPOS, pitchWidth, pitchHeight)) return [0, 0, 20, 80, 0, 0, 0, 0, 0, 0, 0]
  else if (checkPositionInBottomPenaltyBox(currentPOS, pitchWidth, pitchHeight)) {
    return topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition)
  } else if (common.isBetween(currentPOS[1], pitchHeight - (pitchHeight / 3), (pitchHeight - (pitchHeight / 6) + 5))) {
    if (oppositionNearPlayer(playerInformation, 10, 10)) return [30, 20, 20, 10, 0, 0, 0, 20, 0, 0, 0]
    return [70, 10, 10, 0, 0, 0, 0, 10, 0, 0, 0]
  } else if (common.isBetween(currentPOS[1], (pitchHeight / 3), (pitchHeight - (pitchHeight / 3)))) {
    if (oppositionNearPlayer(playerInformation, 10, 10)) return [0, 20, 30, 20, 0, 0, 20, 0, 0, 0, 10]
    else if (skill.shooting > 85) return [10, 10, 30, 0, 0, 0, 50, 0, 0, 0, 0]
    else if (position === 'LM' || position === 'CM' || position === 'RM') return [0, 10, 10, 10, 0, 0, 0, 30, 40, 0, 0]
    else if (position === 'ST') return [0, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0]
    return [0, 0, 10, 0, 0, 0, 0, 60, 20, 0, 10]
  } else if (oppositionNearPlayer(playerInformation, 10, 10)) return [0, 0, 0, 0, 0, 0, 0, 10, 0, 70, 20]
  else if (position === 'LM' || position === 'CM' || position === 'RM') return [0, 0, 30, 0, 0, 0, 0, 30, 40, 0, 0]
  else if (position === 'ST') return [0, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0]
  return [0, 0, 40, 0, 0, 0, 0, 30, 0, 20, 10]
}

function topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition) {
  let playerInformation = setPositions.closestPlayerToPosition(player, opposition, player.currentPOS)
  let ownPlayerInformation = setPositions.closestPlayerToPosition(player, team, player.currentPOS)
  let tmateProximity = [Math.abs(ownPlayerInformation.proxPOS[0]), Math.abs(ownPlayerInformation.proxPOS[1])]
  let closePlayerPosition = playerInformation.thePlayer.currentPOS
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let {
    currentPOS, skill
  } = player
  let halfRange = pitchHeight - (skill.shooting / 2)
  let shotRange = pitchHeight - skill.shooting
  if (checkPositionInBottomPenaltyBoxClose(currentPOS, pitchWidth, pitchHeight)) {
    if (oppositionNearPlayer(playerInformation, 6, 6)) {
      if (checkOppositionBelow(closePlayerPosition, currentPOS)) {
        if (checkTeamMateSpaceClose(tmateProximity, -10, 10, -10, 10)) return [20, 0, 70, 0, 0, 0, 0, 10, 0, 0, 0]
        else if (common.isBetween(currentPOS[1], halfRange, pitchHeight)) return [100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        else if (common.isBetween(currentPOS[1], shotRange, pitchHeight)) return [70, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0]
        return [20, 0, 0, 0, 0, 0, 0, 40, 20, 0, 0]
      } else if (checkTeamMateSpaceClose(tmateProximity, -10, 10, -4, 10)) {
        if (common.isBetween(currentPOS[1], halfRange, pitchHeight)) return [90, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0]
        else if (common.isBetween(currentPOS[1], shotRange, pitchHeight)) return [50, 0, 20, 0, 0, 0, 0, 30, 0, 0, 0]
        return [20, 0, 30, 0, 0, 0, 0, 30, 20, 0, 0]
      } else if (common.isBetween(currentPOS[1], halfRange, pitchHeight)) return [90, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0]
      else if (common.isBetween(currentPOS[1], shotRange, pitchHeight)) return [70, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0]
      return [20, 0, 0, 0, 0, 0, 0, 50, 30, 0, 0]
    } else if (checkTeamMateSpaceClose(tmateProximity, -10, 10, -4, 10)) {
      if (common.isBetween(currentPOS[1], halfRange, pitchHeight)) return [90, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0]
      else if (common.isBetween(currentPOS[1], shotRange, pitchHeight)) return [50, 0, 20, 0, 0, 0, 0, 30, 0, 0, 0]
      return [20, 0, 30, 0, 0, 0, 0, 30, 20, 0, 0]
    } else if (common.isBetween(currentPOS[1], halfRange, pitchHeight)) return [100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    else if (common.isBetween(currentPOS[1], shotRange, pitchHeight)) return [60, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0]
    return [30, 0, 0, 0, 0, 0, 0, 40, 30, 0, 0]
  } else if (common.isBetween(currentPOS[1], shotRange, pitchHeight)) return [50, 0, 20, 0, 0, 0, 0, 30, 0, 0, 0]
  else if (oppositionNearPlayer(playerInformation, 6, 6)) return [10, 0, 70, 0, 0, 0, 0, 20, 0, 0, 0]
  return [70, 0, 20, 0, 0, 0, 0, 10, 0, 0, 0]
}

function bottomTeamPlayerHasBall(matchDetails, player, team, opposition) {
  let playerInformation = setPositions.closestPlayerToPosition(player, opposition, player.currentPOS)
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let {
    position, currentPOS, skill
  } = player
  if (position === 'GK' && oppositionNearPlayer(playerInformation, 10, 25)) return [0, 0, 10, 0, 0, 0, 0, 10, 0, 40, 40]
  else if (position === 'GK') return [0, 0, 50, 0, 0, 0, 0, 10, 0, 20, 20]
  else if (onTopCornerBoundary(currentPOS, pitchWidth)) return [0, 0, 20, 80, 0, 0, 0, 0, 0, 0, 0]
  else if (checkPositionInTopPenaltyBox(currentPOS, pitchWidth, pitchHeight)) {
    return bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition)
  } else if (common.isBetween(currentPOS[1], (pitchHeight / 6) - 5, pitchHeight / 3)) {
    if (oppositionNearPlayer(playerInformation, 10, 10)) return [30, 20, 20, 10, 0, 0, 0, 20, 0, 0, 0]
    return [70, 10, 10, 0, 0, 0, 0, 10, 0, 0, 0]
  } else if (common.isBetween(currentPOS[1], (pitchHeight / 3), (2 * (pitchHeight / 3)))) {
    return bottomTeamPlayerHasBallInMiddle(playerInformation, position, skill)
  } else if (oppositionNearPlayer(playerInformation, 10, 10)) return [0, 0, 0, 0, 0, 0, 0, 10, 0, 70, 20]
  else if (position === 'LM' || position === 'CM' || position === 'RM') return [0, 0, 30, 0, 0, 0, 0, 30, 40, 0, 0]
  else if (position === 'ST') return [0, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0]
  return [0, 0, 30, 0, 0, 0, 0, 50, 0, 10, 10]
}

function bottomTeamPlayerHasBallInMiddle(playerInformation, position, skill) {
  if (oppositionNearPlayer(playerInformation, 10, 10)) return [0, 20, 30, 20, 0, 0, 0, 20, 0, 0, 10]
  else if (skill.shooting > 85) return [10, 10, 30, 0, 0, 0, 0, 50, 0, 0, 0]
  else if (position === 'LM' || position === 'CM' || position === 'RM') return [0, 10, 10, 10, 0, 0, 0, 30, 40, 0, 0]
  else if (position === 'ST') return [0, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0]
  return [0, 0, 10, 0, 0, 0, 0, 60, 20, 0, 10]
}

function bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition) {
  let playerInformation = setPositions.closestPlayerToPosition(player, opposition, player.currentPOS)
  let ownPlayerInformation = setPositions.closestPlayerToPosition(player, team, player.currentPOS)
  let tmateProximity = [Math.abs(ownPlayerInformation.proxPOS[0]), Math.abs(ownPlayerInformation.proxPOS[1])]
  let closePlayerPosition = playerInformation.thePlayer.currentPOS
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let {
    currentPOS, skill
  } = player
  if (checkPositionInTopPenaltyBoxClose(currentPOS, pitchWidth, pitchHeight)) {
    if (oppositionNearPlayer(playerInformation, 20, 20)) {
      if (checkOppositionAhead(closePlayerPosition, currentPOS)) {
        if (checkTeamMateSpaceClose(tmateProximity, -10, 10, -10, 10)) return [20, 0, 70, 0, 0, 0, 0, 10, 0, 0, 0]
        else if (common.isBetween(currentPOS[1], 0, (skill.shooting / 2))) return [100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        else if (common.isBetween(currentPOS[1], 0, skill.shooting)) return [70, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0]
        return [20, 0, 0, 0, 0, 0, 0, 40, 20, 0, 0]
      } else if (checkTeamMateSpaceClose(tmateProximity, -10, 10, -4, 10)) {
        if (common.isBetween(currentPOS[1], 0, (skill.shooting / 2))) return [90, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0]
        else if (common.isBetween(currentPOS[1], 0, skill.shooting)) return [50, 0, 20, 0, 0, 0, 0, 30, 0, 0, 0]
        return [20, 0, 30, 0, 0, 0, 0, 30, 20, 0, 0]
      } else if (common.isBetween(currentPOS[1], 0, (skill.shooting / 2))) return [90, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0]
      else if (common.isBetween(currentPOS[1], 0, skill.shooting)) return [70, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0]
      return [20, 0, 0, 0, 0, 0, 0, 50, 30, 0, 0]
    } else if (checkTeamMateSpaceClose(tmateProximity, -10, 10, -4, 10)) {
      if (common.isBetween(currentPOS[1], 0, (skill.shooting / 2))) return [90, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0]
      else if (common.isBetween(currentPOS[1], 0, skill.shooting)) return [50, 0, 20, 0, 0, 0, 0, 30, 0, 0, 0]
      return [20, 0, 30, 0, 0, 0, 0, 30, 20, 0, 0]
    } else if (common.isBetween(currentPOS[1], 0, (skill.shooting / 2))) return [100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    else if (common.isBetween(currentPOS[1], 0, skill.shooting)) return [60, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0]
    return [30, 0, 0, 0, 0, 0, 0, 40, 30, 0, 0]
  } else if (common.isBetween(currentPOS[1], 0, skill.shooting)) return [50, 0, 20, 0, 0, 0, 0, 30, 0, 0, 0]
  else if (checkOppositionAhead(closePlayerPosition, currentPOS)) return [20, 0, 0, 0, 0, 0, 0, 80, 0, 0, 0]
  return [50, 0, 20, 20, 0, 0, 0, 10, 0, 0, 0]
}

function oppositionNearPlayer(oppositionPlayer, spaceX, spaceY) {
  let oppositionProximity = [Math.abs(oppositionPlayer.proxPOS[0]), Math.abs(oppositionPlayer.proxPOS[1])]
  if (oppositionProximity[0] < spaceX && oppositionProximity[1] < spaceY) return true
  return false
}

function checkTeamMateSpaceClose(tmateProximity, lowX, highX, lowY, highY) {
  if (common.isBetween(tmateProximity[0], lowX, highX) && common.isBetween(tmateProximity[1], lowY, highY)) return true
  return false
}

function checkOppositionAhead(closePlayerPosition, currentPOS) {
  let closePlyX = common.isBetween(closePlayerPosition[0], currentPOS[0] - 4, currentPOS[0] + 4)
  if (closePlyX && closePlayerPosition[1] < currentPOS[1]) return true
  return false
}

function checkOppositionBelow(closePlayerPosition, currentPOS) {
  let closePlyX = common.isBetween(closePlayerPosition[0], currentPOS[0] - 4, currentPOS[0] + 4)
  if (closePlyX && closePlayerPosition[1] > currentPOS[1]) return true
  return false
}

function playerDoesNotHaveBall(player, ballX, ballY, matchDetails) {
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let {
    position, currentPOS, originPOS
  } = player
  if (position === 'GK') return [0, 0, 0, 0, 0, 0, 0, 60, 40, 0, 0]
  else if (common.isBetween(ballX, -2, 2) && common.isBetween(ballY, -2, 2)) {
    return noBallNotGK2CloseBall(matchDetails, currentPOS, originPOS, pitchWidth, pitchHeight)
  } else if (common.isBetween(ballX, -4, 4) && common.isBetween(ballY, -4, 4)) {
    return noBallNotGK4CloseBall(matchDetails, currentPOS, originPOS, pitchWidth, pitchHeight)
  } else if (common.isBetween(ballX, -20, 20) && common.isBetween(ballY, -20, 20)) {
    if (matchDetails.ball.withPlayer === false) return [0, 0, 0, 0, 0, 0, 0, 60, 40, 0, 0]
    return [0, 0, 0, 0, 0, 40, 0, 30, 30, 0, 0]
  }
  return [0, 0, 0, 0, 0, 10, 0, 50, 30, 0, 0]
}

function noBallNotGK4CloseBall(matchDetails, currentPOS, originPOS, pitchWidth, pitchHeight) {
  if (originPOS[1] > (pitchHeight / 2)) {
    return noBallNotGK4CloseBallBottomTeam(matchDetails, currentPOS, pitchWidth, pitchHeight)
  }
  if (checkPositionInTopPenaltyBox(currentPOS, pitchWidth, pitchHeight)) {
    if (matchDetails.ball.withPlayer === false) return [0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0]
    return [0, 0, 0, 0, 40, 0, 20, 10, 30, 0, 0]
  } else if (matchDetails.ball.withPlayer === false) return [0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0]
  return [0, 0, 0, 0, 50, 0, 50, 0, 0, 0, 0]
}

function noBallNotGK4CloseBallBottomTeam(matchDetails, currentPOS, pitchWidth, pitchHeight) {
  if (checkPositionInBottomPenaltyBox(currentPOS, pitchWidth, pitchHeight)) {
    if (matchDetails.ball.withPlayer === false) return [0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0]
    return [0, 0, 0, 0, 40, 0, 20, 10, 30, 0, 0]
  } else if (matchDetails.ball.withPlayer === false) return [0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0]
  return [0, 0, 0, 0, 50, 0, 50, 0, 0, 0, 0]
}

function noBallNotGK2CloseBall(matchDetails, currentPOS, originPOS, pitchWidth, pitchHeight) {
  if (originPOS[1] > (pitchHeight / 2)) {
    return noBallNotGK2CloseBallBottomTeam(matchDetails, currentPOS, pitchWidth, pitchHeight)
  }
  if (checkPositionInTopPenaltyBox(currentPOS, pitchWidth, pitchHeight)) {
    if (matchDetails.ball.withPlayer === false) return [0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0]
    return [0, 0, 0, 0, 40, 0, 20, 10, 30, 0, 0]
  } else if (matchDetails.ball.withPlayer === false) return [0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0]
  return [0, 0, 0, 0, 70, 10, 20, 0, 0, 0, 0]
}

function noBallNotGK2CloseBallBottomTeam(matchDetails, currentPOS, pitchWidth, pitchHeight) {
  if (checkPositionInBottomPenaltyBox(currentPOS, pitchWidth, pitchHeight)) {
    if (matchDetails.ball.withPlayer === false) return [0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0]
    return [0, 0, 0, 0, 50, 0, 10, 20, 20, 0, 0]
  }
  if (matchDetails.ball.withPlayer === false) return [0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0]
  return [0, 0, 0, 0, 70, 10, 20, 0, 0, 0, 0]
}

function checkPositionInBottomPenaltyBox(position, pitchWidth, pitchHeight) {
  let yPos = common.isBetween(position[0], (pitchWidth / 4) - 5, pitchWidth - (pitchWidth / 4) + 5)
  let xPos = common.isBetween(position[1], pitchHeight - (pitchHeight / 6) + 5, pitchHeight)
  if (yPos && xPos) return true
  return false
}

function checkPositionInBottomPenaltyBoxClose(position, pitchWidth, pitchHeight) {
  let yPos = common.isBetween(position[0], (pitchWidth / 3) - 5, pitchWidth - (pitchWidth / 3) + 5)
  let xPos = common.isBetween(position[1], (pitchHeight - (pitchHeight / 12) + 5), pitchHeight)
  if (yPos && xPos) return true
  return false
}

function checkPositionInTopPenaltyBox(position, pitchWidth, pitchHeight) {
  let xPos = common.isBetween(position[0], (pitchWidth / 4) - 5, pitchWidth - (pitchWidth / 4) + 5)
  let yPos = common.isBetween(position[1], 0, (pitchHeight / 6) - 5)
  if (yPos && xPos) return true
  return false
}

function checkPositionInTopPenaltyBoxClose(position, pitchWidth, pitchHeight) {
  let xPos = common.isBetween(position[0], (pitchWidth / 3) - 5, pitchWidth - (pitchWidth / 3) + 5)
  let yPos = common.isBetween(position[1], 0, (pitchHeight / 12) - 5)
  if (yPos && xPos) return true
  return false
}

function onBottomCornerBoundary(position, pitchWidth, pitchHeight) {
  if (position[1] == pitchHeight && (position[0] == 0 || position[0] == pitchWidth)) return true
  return false
}

function onTopCornerBoundary(position, pitchWidth) {
  if (position[1] == 0 && (position[0] == 0 || position[0] == pitchWidth)) return true
  return false
}

function populatePossibleActions(possibleActions, a, b, c, d, e, f, g, h, i, j, k) {
  //a-shoot, b-throughBall, c-pass, d-cross, e-tackle, f-intercept
  //g-slide, h-run, i-sprint j-cleared k-boot
  possibleActions[0].points = a
  possibleActions[1].points = b
  possibleActions[2].points = c
  possibleActions[3].points = d
  possibleActions[4].points = e
  possibleActions[5].points = f
  possibleActions[6].points = g
  possibleActions[7].points = h
  possibleActions[8].points = i
  possibleActions[9].points = j
  possibleActions[10].points = k
  return possibleActions
}

function populateActionsJSON() {
  return [{
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
}

function resolveTackle(player, team, opposition, matchDetails) {
  matchDetails.iterationLog.push(`Tackle attempted by: ${player.name}`)
  let tackleDetails = {
    'injuryHigh': 1500,
    'injuryLow': 1400,
    'increment': 1
  }
  let index = opposition.players.findIndex(function(thisPlayer) {
    return thisPlayer.playerID === matchDetails.ball.Player
  })
  let thatPlayer
  if (index) thatPlayer = opposition.players[index]
  else return false
  player.stats.tackles.total++
  if (wasFoul(10, 18)) {
    setFoul(matchDetails, team, player, thatPlayer)
    return true
  }
  if (calcTackleScore(player.skill, 5) > calcRetentionScore(thatPlayer.skill, 5)) {
    setSuccessTackle(matchDetails, team, opposition, player, thatPlayer, tackleDetails)
    return false
  }
  setFailedTackle(matchDetails, player, thatPlayer, tackleDetails)
  return false
}

function resolveSlide(player, team, opposition, matchDetails) {
  matchDetails.iterationLog.push(`Slide tackle attempted by: ${player.name}`)
  let tackleDetails = {
    'injuryHigh': 1500,
    'injuryLow': 1400,
    'increment': 3
  }
  let index = opposition.players.findIndex(function(thisPlayer) {
    return thisPlayer.playerID === matchDetails.ball.Player
  })
  let thatPlayer
  if (index) thatPlayer = opposition.players[index]
  else return false
  player.stats.tackles.total++
  if (wasFoul(11, 20)) {
    setFoul(matchDetails, team, player, thatPlayer)
    return true
  }
  if (calcTackleScore(player.skill, 5) > calcRetentionScore(thatPlayer.skill, 5)) {
    setSuccessTackle(matchDetails, team, opposition, player, thatPlayer, tackleDetails)
    return false
  }
  setFailedTackle(matchDetails, player, thatPlayer, tackleDetails)
  return false
}

function setFailedTackle(matchDetails, player, thatPlayer, tackleDetails) {
  matchDetails.iterationLog.push(`Failed tackle by: ${player.name}`)
  player.stats.tackles.off++
  setInjury(matchDetails, player, thatPlayer, tackleDetails.injuryHigh, tackleDetails.injuryLow)
  setPostTacklePosition(matchDetails, thatPlayer, player, tackleDetails.increment)
}

function setSuccessTackle(matchDetails, team, opposition, player, thatPlayer, tackleDetails) {
  setPostTackleBall(matchDetails, team, opposition, player)
  matchDetails.iterationLog.push(`Successful tackle by: ${player.name}`)
  player.stats.tackles.on++
  setInjury(matchDetails, thatPlayer, player, tackleDetails.injuryLow, tackleDetails.injuryHigh)
  setPostTacklePosition(matchDetails, player, thatPlayer, tackleDetails.increment)
}

function calcTackleScore(skill, diff) {
  return ((parseInt(skill.tackling, 10) + parseInt(skill.strength, 10)) / 2) + common.getRandomNumber(-diff, diff)
}

function calcRetentionScore(skill, diff) {
  return ((parseInt(skill.agility, 10) + parseInt(skill.strength, 10)) / 2) + common.getRandomNumber(-diff, diff)
}

function setPostTackleBall(matchDetails, team, opposition, player) {
  player.hasBall = true
  matchDetails.ball.lastTouch = player.name
  let tempArray = player.currentPOS
  matchDetails.ball.position = tempArray.map(x => x)
  matchDetails.ball.Player = player.playerID
  matchDetails.ball.withPlayer = true
  matchDetails.ball.withTeam = team.teamID
  team.intent = 'attack'
  opposition.intent = 'defend'
}

function setPostTacklePosition(matchDetails, winningPlyr, losePlayer, increment) {
  const [, pitchHeight] = matchDetails.pitchSize
  if (losePlayer.originPOS[1] > pitchHeight / 2) {
    losePlayer.currentPOS[1] = common.upToMin(losePlayer.currentPOS[1] - increment, 0)
    matchDetails.ball.position[1] = common.upToMin(matchDetails.ball.position[1] - increment, 0)
    winningPlyr.currentPOS[1] = common.upToMax(winningPlyr.currentPOS[1] + increment, pitchHeight)
  } else {
    losePlayer.currentPOS[1] = common.upToMax(losePlayer.currentPOS[1] + increment, pitchHeight)
    matchDetails.ball.position[1] = common.upToMax(matchDetails.ball.position[1] + increment, pitchHeight)
    winningPlyr.currentPOS[1] = common.upToMin(winningPlyr.currentPOS[1] - increment, 0)
  }
}

function setInjury(matchDetails, thatPlayer, player, tackledInjury, tacklerInjury) {
  if (common.isInjured(tackledInjury)) {
    thatPlayer.injured = true
    matchDetails.iterationLog.push(`Player Injured - ${thatPlayer.name}`)
  }
  if (common.isInjured(tacklerInjury)) {
    player.injured = true
    matchDetails.iterationLog.push(`Player Injured - ${player.name}`)
  }
}

function setFoul(matchDetails, team, player, thatPlayer) {
  matchDetails.iterationLog.push(`Foul against: ${thatPlayer.name}`)
  player.stats.tackles.fouls++
  if (team.teamID === matchDetails.kickOffTeam.teamID) matchDetails.kickOffTeamStatistics.fouls++
  else matchDetails.secondTeamStatistics.fouls++
}

function wasFoul(x, y) {
  let foul = common.getRandomNumber(0, x)
  if (common.isBetween(foul, 0, (y / 2) - 1)) return true
  return false
}

function foulIntensity() {
  return common.getRandomNumber(0, 100)
}

module.exports = {
  selectAction,
  findPossActions,
  playerDoesNotHaveBall,
  topTeamPlayerHasBall,
  topTeamPlayerHasBallInBottomPenaltyBox,
  bottomTeamPlayerHasBall,
  bottomTeamPlayerHasBallInMiddle,
  bottomTeamPlayerHasBallInTopPenaltyBox,
  noBallNotGK2CloseBall,
  noBallNotGK2CloseBallBottomTeam,
  noBallNotGK4CloseBall,
  noBallNotGK4CloseBallBottomTeam,
  oppositionNearPlayer,
  checkTeamMateSpaceClose,
  checkOppositionAhead,
  checkOppositionBelow,
  checkPositionInTopPenaltyBox,
  checkPositionInTopPenaltyBoxClose,
  onBottomCornerBoundary,
  onTopCornerBoundary,
  checkPositionInBottomPenaltyBox,
  checkPositionInBottomPenaltyBoxClose,
  populatePossibleActions,
  resolveTackle,
  resolveSlide,
  calcTackleScore,
  calcRetentionScore,
  setPostTackleBall,
  setPostTacklePosition,
  setFoul,
  setInjury,
  wasFoul,
  foulIntensity
}
