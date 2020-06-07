const common = require(`../lib/common`)
const setPositions = require(`../lib/setPositions`)

function moveBall(matchDetails) {
  if (matchDetails.ball.ballOverIterations === undefined || matchDetails.ball.ballOverIterations.length == 0) {
    matchDetails.ball.direction = `wait`
    return matchDetails
  }
  let { ball } = matchDetails
  let bPosition = ball.position
  let { kickOffTeam, secondTeam } = matchDetails
  let ballPos = ball.ballOverIterations[0]
  getBallDirection(matchDetails, ballPos)
  const power = ballPos[2]
  ballPos.splice()
  let bPlayer = setBPlayer(ballPos)
  let endPos = resolveBallMovement(bPlayer, bPosition, ballPos, power, kickOffTeam, secondTeam, matchDetails)
  matchDetails.ball.ballOverIterations.shift()
  matchDetails.iterationLog.push(`ball still moving from previous kick: ${endPos}`)
  matchDetails.ball.position = endPos
  checkGoalScored(matchDetails)
  return matchDetails
}

function setBPlayer(ballPos) {
  return {
    'name': `Ball`,
    'position': `LB`,
    'rating': `100`,
    'skill': {
      'passing': `100`,
      'shooting': `100`,
      'saving': `100`,
      'tackling': `100`,
      'agility': `100`,
      'strength': `100`,
      'penalty_taking': `100`,
      'jumping': `100`
    },
    'originPOS': ballPos,
    'currentPOS': ballPos,
    'injured': false
  }
}

function ballKicked(matchDetails, player) {
  let { position, direction } = matchDetails.ball
  const [, pitchHeight] = matchDetails.pitchSize
  matchDetails.iterationLog.push(`ball kicked by: ${player.name}`)
  matchDetails.ball.lastTouch = player.name
  let newPos = [0, 0]
  let teamShootingToTop = [`wait`, `north`, `north`, `north`, `north`, `east`, `east`, `west`, `west`]
  let teamShootingToTop2 = [`northeast`, `northeast`, `northeast`, `northwest`, `northwest`, `northwest`]
  let topTeamDirection = teamShootingToTop.concat(teamShootingToTop2)
  let teamShootingToBottom = [`wait`, `south`, `south`, `south`, `south`, `east`, `east`, `west`, `west`]
  let teamShootingToBottom2 = [`southeast`, `southeast`, `southeast`, `southwest`, `southwest`, `southwest`]
  let bottomTeamDirection = teamShootingToBottom.concat(teamShootingToBottom2)
  let power = common.calculatePower(player.skill.strength)
  if (player.originPOS[1] > (pitchHeight / 2)) {
    direction = topTeamDirection[common.getRandomNumber(0, topTeamDirection.length - 1)]
    newPos = getTopKickedPosition(direction, position, power)
  } else {
    direction = bottomTeamDirection[common.getRandomNumber(0, bottomTeamDirection.length - 1)]
    newPos = getBottomKickedPosition(direction, position, power)
  }
  return calcBallMovementOverTime(matchDetails, player.skill.strength, newPos, player)
}

function getTopKickedPosition(direction, position, power) {
  if (direction === `wait`) return newKickedPosition(position, 0, (power / 2), 0, (power / 2))
  else if (direction === `north`) return newKickedPosition(position, -20, 20, -power, -(power / 2))
  else if (direction === `east`) return newKickedPosition(position, (power / 2), power, -20, 20)
  else if (direction === `west`) return newKickedPosition(position, -power, -(power / 2), -20, 20)
  else if (direction === `northeast`) return newKickedPosition(position, 0, (power / 2), -power, -(power / 2))
  else if (direction === `northwest`) return newKickedPosition(position, -(power / 2), 0, -power, -(power / 2))
}

function getBottomKickedPosition(direction, position, power) {
  if (direction === `wait`) return newKickedPosition(position, 0, (power / 2), 0, (power / 2))
  else if (direction === `south`) return newKickedPosition(position, -20, 20, (power / 2), power)
  else if (direction === `east`) return newKickedPosition(position, (power / 2), power, -20, 20)
  else if (direction === `west`) return newKickedPosition(position, -power, -(power / 2), -20, 20)
  else if (direction === `southeast`) return newKickedPosition(position, 0, (power / 2), (power / 2), power)
  else if (direction === `southwest`) return newKickedPosition(position, -(power / 2), 0, (power / 2), power)
}

function newKickedPosition(pos, lowX, highX, lowY, highY) {
  let newPosition = [0, 0]
  newPosition[0] = pos[0] + common.getRandomNumber(lowX, highX)
  newPosition[1] = pos[1] + common.getRandomNumber(lowY, highY)
  return newPosition
}

function shotMade(matchDetails, player) {
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  matchDetails.iterationLog.push(`Shot Made by: ${player.name}`)
  matchDetails.ball.lastTouch = player.name
  let shotPosition = [0, 0]
  let shotPower = common.calculatePower(player.skill.strength)
  let PlyPos = player.currentPOS
  let thisTeamStats
  if (common.isEven(matchDetails.half)) thisTeamStats = matchDetails.kickOffTeamStatistics
  else if (common.isOdd(matchDetails.half)) thisTeamStats = matchDetails.secondTeamStatistics
  else throw new Error(`You cannot supply 0 as a half`)
  thisTeamStats.shots.total++
  player.stats.shots.total++
  if (player.skill.shooting > common.getRandomNumber(0, 40)) {
    thisTeamStats.shots.on++
    player.stats.shots.on++
    shotPosition[0] = common.getRandomNumber((pitchWidth / 2) - 50, (pitchWidth / 2) + 50)
    matchDetails.iterationLog.push(`Shot On Target at X Position ${shotPosition[0]}`)
  } else {
    thisTeamStats.shots.off++
    player.stats.off++
    let left = (common.getRandomNumber(0, 10) > 5)
    let leftPos = common.getRandomNumber(0, (pitchWidth / 2) - 55)
    let righttPos = common.getRandomNumber((pitchWidth / 2) + 55, pitchWidth)
    shotPosition[0] = (left) ? leftPos : righttPos
    matchDetails.iterationLog.push(`Shot Off Target at X Position ${shotPosition[0]}`)
  }
  if (player.originPOS[1] > pitchHeight / 2) shotPosition[1] = PlyPos[1] - shotPower
  else shotPosition[1] = PlyPos[1] + shotPower
  let endPos = calcBallMovementOverTime(matchDetails, player.skill.strength, shotPosition, player)
  checkGoalScored(matchDetails)
  return endPos
}

function penaltyTaken(matchDetails, player) {
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  player.action = `none`
  matchDetails.iterationLog.push(`Penalty Taken by: ${player.name}`)
  matchDetails.ball.lastTouch = player.name
  let shotPosition = [0, 0]
  let shotPower = common.calculatePower(player.skill.strength)
  let PlyPos = player.currentPOS
  let thisTeamStats
  if (common.isEven(matchDetails.half)) thisTeamStats = matchDetails.kickOffTeamStatistics
  else if (common.isOdd(matchDetails.half)) thisTeamStats = matchDetails.secondTeamStatistics
  else throw new Error(`You cannot supply 0 as a half`)
  thisTeamStats.shots.total++
  player.stats.shots.total++
  if (player.skill.penalty_taking > common.getRandomNumber(0, 100)) {
    thisTeamStats.shots.on++
    player.stats.shots.on++
    shotPosition[0] = common.getRandomNumber((pitchWidth / 2) - 50, (pitchWidth / 2) + 50)
    matchDetails.iterationLog.push(`Shot On Target at X Position ${shotPosition[0]}`)
  } else {
    thisTeamStats.shots.off++
    player.stats.shots.off++
    let left = (common.getRandomNumber(0, 10) > 5)
    let leftPos = common.getRandomNumber(0, (pitchWidth / 2) - 55)
    let righttPos = common.getRandomNumber((pitchWidth / 2) + 55, pitchWidth)
    shotPosition[0] = (left) ? leftPos : righttPos
    matchDetails.iterationLog.push(`Shot Off Target at X Position ${shotPosition[0]}`)
  }
  if (player.originPOS[1] > pitchHeight / 2) shotPosition[1] = PlyPos[1] - shotPower
  else shotPosition[1] = PlyPos[1] + shotPower
  let endPos = calcBallMovementOverTime(matchDetails, player.skill.strength, shotPosition, player)
  checkGoalScored(matchDetails)
  return endPos
}

function checkGoalScored(matchDetails) {
  let {
    ball, half, kickOffTeam, secondTeam
  } = matchDetails
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  const centreGoal = pitchWidth / 2
  const goalEdge = centreGoal / 3
  const goalX = common.isBetween(ball.position[0], centreGoal - goalEdge, centreGoal + goalEdge)
  let KOGoalie = kickOffTeam.players[0]
  let STGoalie = secondTeam.players[0]
  let ballProx = 8
  let [ballX, ballY] = ball.position
  let nearKOGoalieX = common.isBetween(ballX, KOGoalie.currentPOS[0] - ballProx, KOGoalie.currentPOS[0] + ballProx)
  let nearKOGoalieY = common.isBetween(ballY, KOGoalie.currentPOS[1] - ballProx, KOGoalie.currentPOS[1] + ballProx)
  let nearSTGoalieX = common.isBetween(ballX, STGoalie.currentPOS[0] - ballProx, STGoalie.currentPOS[0] + ballProx)
  let nearSTGoalieY = common.isBetween(ballY, STGoalie.currentPOS[1] - ballProx, STGoalie.currentPOS[1] + ballProx)
  if (nearKOGoalieX && nearKOGoalieY && KOGoalie.skill.saving > common.getRandomNumber(0, 100)) {
    matchDetails = setPositions.setGoalieHasBall(matchDetails, KOGoalie)
    if (common.inTopPenalty(matchDetails, ball.position) || common.inBottomPenalty(matchDetails, ball.position)) {
      matchDetails.iterationLog.push(`ball saved by ${KOGoalie.name} possesion to ${kickOffTeam.name}`)
      KOGoalie.stats.saves++
    }
  } else if (nearSTGoalieX && nearSTGoalieY && STGoalie.skill.saving > common.getRandomNumber(0, 100)) {
    matchDetails = setPositions.setGoalieHasBall(matchDetails, STGoalie)
    if (common.inTopPenalty(matchDetails, ball.position) || common.inBottomPenalty(matchDetails, ball.position)) {
      matchDetails.iterationLog.push(`ball saved by ${STGoalie.name} possesion to ${secondTeam.name}`)
      STGoalie.stats.saves++
    }
  } else if (goalX) {
    if (ball.position[1] < 1) {
      if (half == 0) throw new Error('cannot set half as 0')
      else if (common.isOdd(half)) matchDetails = setPositions.setSecondTeamGoalScored(matchDetails)
      else matchDetails = setPositions.setKickOffTeamGoalScored(matchDetails)
    } else if (ball.position[1] >= pitchHeight) {
      if (half == 0) throw new Error('cannot set half as 0')
      else if (common.isOdd(half)) matchDetails = setPositions.setKickOffTeamGoalScored(matchDetails)
      else matchDetails = setPositions.setSecondTeamGoalScored(matchDetails)
    }
  }
}

function throughBall(matchDetails, team, player) {
  matchDetails.ball.lastTouch = player.name
  const [, pitchHeight] = matchDetails.pitchSize
  let { position } = matchDetails.ball
  let closePlyPos = [0, 0]
  let playersInDistance = getPlayersInDistance(team, player, matchDetails.pitchSize)
  let tPlyr = playersInDistance[common.getRandomNumber(0, (playersInDistance.length - 1))]
  matchDetails.iterationLog.push(`through ball passed by: ${player.name} to: ${tPlyr.name}`)
  player.stats.passes.total++
  let bottomThird = (position[1] > (pitchHeight - (pitchHeight / 3)))
  let middleThird = !!((position[1] > (pitchHeight / 3) && position[1] < (pitchHeight - (pitchHeight / 3))))
  if (player.skill.passing > common.getRandomNumber(0, 100)) {
    if (player.originPOS[1] > pitchHeight / 2) closePlyPos = setTargetPlyPos(tPlyr.position, 0, 0, -20, -10)
    else closePlyPos = setTargetPlyPos(tPlyr.position, 0, 0, 10, 30)
  } else if (player.originPOS[1] > (pitchHeight / 2)) {
    if (bottomThird) closePlyPos = setTargetPlyPos(tPlyr.position, -10, 10, -10, 10)
    else if (middleThird) closePlyPos = setTargetPlyPos(tPlyr.position, -20, 20, -50, 50)
    else closePlyPos = setTargetPlyPos(tPlyr.position, -30, 30, -100, 100)
  } else if (bottomThird) closePlyPos = setTargetPlyPos(tPlyr.position, -30, 30, -100, 100)
  else if (middleThird) closePlyPos = setTargetPlyPos(tPlyr.position, -20, 20, -50, 50)
  else closePlyPos = setTargetPlyPos(tPlyr.position, -10, 10, -10, 10)
  return calcBallMovementOverTime(matchDetails, player.skill.strength, closePlyPos, player)
}

function getPlayersInDistance(team, player, pitchSize) {
  const [pitchWidth, pitchHeight] = pitchSize
  let playersInDistance = []
  for (const teamPlayer of team.players) {
    if (teamPlayer.name != player.name) {
      let onPitchX = common.isBetween(teamPlayer.currentPOS[0], -1, pitchWidth + 1)
      let onPitchY = common.isBetween(teamPlayer.currentPOS[1], -1, pitchHeight + 1)
      if (onPitchX && onPitchY) {
        let playerToPlayerX = player.currentPOS[0] - teamPlayer.currentPOS[0]
        let playerToPlayerY = player.currentPOS[1] - teamPlayer.currentPOS[1]
        let proximityToBall = Math.abs(playerToPlayerX + playerToPlayerY)
        playersInDistance.push({
          'position': teamPlayer.currentPOS,
          'proximity': proximityToBall,
          'name': teamPlayer.name
        })
      }
    }
  }
  playersInDistance.sort(function(a, b) {
    return a.proximity - b.proximity
  })
  return playersInDistance
}

function resolveBallMovement(player, thisPOS, newPOS, power, team, opp, matchDetails) {
  common.removeBallFromAllPlayers(matchDetails)
  let lineToEndPosition = common.getBallTrajectory(thisPOS, newPOS, power)
  for (const thisPos of lineToEndPosition) {
    let checkPos = [common.round(thisPos[0], 0), common.round(thisPos[1], 0), thisPos[2]]
    let playerInfo1 = setPositions.closestPlayerToPosition(player, team, checkPos)
    let playerInfo2 = setPositions.closestPlayerToPosition(player, opp, checkPos)
    let thisPlayerProx = Math.max(playerInfo1.proxToBall, playerInfo2.proxToBall)
    let thisPlayer = (thisPlayerProx == playerInfo1.proxToBall) ? playerInfo1.thePlayer : playerInfo2.thePlayer
    let thisTeam = (thisPlayerProx == playerInfo1.proxToBall) ? team : opp
    if (thisPlayer) thisPlayerIsInProximity(matchDetails, thisPlayer, thisPOS, thisPos, power, thisTeam)
  }
  matchDetails = setPositions.keepInBoundaries(matchDetails, team.name, newPOS)
  let lastPOS = matchDetails.ballIntended || matchDetails.ball.position
  delete matchDetails.ballIntended
  return [common.round(lastPOS[0], 2), common.round(lastPOS[1], 2)]
}

function thisPlayerIsInProximity(matchDetails, thisPlayer, thisPOS, thisPos, power, thisTeam) {
  let checkPos = [common.round(thisPos[0], 0), common.round(thisPos[1], 0), thisPos[2]]
  let isGoalie = (thisPlayer.position === 'GK')
  const xPosProx = common.isBetween(thisPlayer.currentPOS[0], thisPos[0] - 3, thisPos[0] + 3)
  const yPosProx = common.isBetween(thisPlayer.currentPOS[1], thisPos[1] - 3, thisPos[1] + 3)
  const goaliexPosProx = common.isBetween(thisPlayer.currentPOS[0], thisPos[0] - 11, thisPos[0] + 11)
  const goalieyPosProx = common.isBetween(thisPlayer.currentPOS[1], thisPos[1] - 2, thisPos[1] + 2)
  if (isGoalie && goaliexPosProx && goalieyPosProx) {
    if (common.isBetween(checkPos[2], -1, thisPlayer.skill.jumping + 1)) {
      let saving = thisPlayer.skill.saving || ''
      if (saving && saving > common.getRandomNumber(0, power)) {
        setBallMovementMatchDetails(matchDetails, thisPlayer, thisPos, thisTeam)
        matchDetails.iterationLog.push(`Ball saved`)
        thisPlayer.stats.saves++
        return thisPos
      }
    }
  } else if (xPosProx && yPosProx) {
    if (common.isBetween(checkPos[2], -1, thisPlayer.skill.jumping + 1)) {
      let deflectPos = thisPlayer.currentPOS
      let newPOS = resolveDeflection(power, thisPOS, deflectPos, thisPlayer, thisTeam.name, matchDetails)
      matchDetails.iterationLog.push(`Ball deflected`)
      return [common.round(newPOS[0], 2), common.round(newPOS[1], 2)]
    }
  }
}

function setBallMovementMatchDetails(matchDetails, thisPlayer, thisPos, thisTeam) {
  matchDetails.ball.ballOverIterations = []
  matchDetails.ball.Player = thisPlayer.playerID
  matchDetails.ball.withPlayer = true
  matchDetails.ball.lastTouch = thisPlayer.name
  matchDetails.ball.withTeam = thisTeam.teamID
  let tempArray = thisPos
  matchDetails.ball.position = tempArray.map(x => x)
  thisPlayer.currentPOS = tempArray.map(x => x)
}

function resolveDeflection(power, thisPOS, defPosition, defPlayer, defTeam, matchDetails) {
  let xMovement = (thisPOS[0] - defPosition[0]) ** 2
  let yMovement = (thisPOS[1] - defPosition[1]) ** 2
  let movementDistance = Math.sqrt(xMovement + yMovement)
  let newPower = power - movementDistance
  let tempPosition = ['', '']
  let { direction } = matchDetails.ball
  if (newPower < 75) {
    setDeflectiionPlayerHasBall(matchDetails, defPlayer, defTeam)
    return defPosition
  }
  defPlayer.hasBall = false
  matchDetails.ball.Player = ''
  matchDetails.ball.withPlayer = false
  matchDetails.ball.withTeam = ''
  tempPosition = setDeflectionDirectionPos(direction, defPosition, newPower)
  matchDetails = setPositions.keepInBoundaries(matchDetails, defTeam.name, tempPosition)
  let intended = matchDetails.ballIntended
  let lastPOS = (intended) ? intended.map(x => x) : matchDetails.ball.position.map(x => x)
  delete matchDetails.ballIntended
  return lastPOS
}

function setDeflectionDirectionPos(direction, defPosition, newPower) {
  let tempPosition = [0, 0]
  if (direction === `east` || direction === `northeast` || direction === `southeast`) {
    if (direction === `east`) tempPosition[1] = common.getRandomNumber(defPosition[1] - 3, defPosition[1] + 3)
    tempPosition[0] = defPosition[0] - (newPower / 2)
  } else if (direction === `west` || direction === `northwest` || direction === `southwest`) {
    if (direction === `west`) tempPosition[1] = common.getRandomNumber(defPosition[1] - 3, defPosition[1] + 3)
    tempPosition[0] = defPosition[0] + (newPower / 2)
  }
  if (direction === `north` || direction === `northeast` || direction === `northwest`) {
    if (direction === `north`) tempPosition[0] = common.getRandomNumber(defPosition[0] - 3, defPosition[0] + 3)
    tempPosition[1] = defPosition[1] + (newPower / 2)
  } else if (direction === `south` || direction === `southeast` || direction === `southwest`) {
    if (direction === `south`) tempPosition[0] = common.getRandomNumber(defPosition[0] - 3, defPosition[0] + 3)
    tempPosition[1] = defPosition[1] - (newPower / 2)
  }
  if (direction === `wait`) {
    tempPosition[0] = common.getRandomNumber(-newPower / 2, newPower / 2)
    tempPosition[1] = common.getRandomNumber(-newPower / 2, newPower / 2)
  }
  return tempPosition
}

function setDeflectiionPlayerHasBall(matchDetails, defPlayer, defTeam) {
  defPlayer.hasBall = true
  matchDetails.ball.lastTouch = defPlayer.name
  if (defPlayer.offside == true) {
    setDeflectionPlayerOffside(matchDetails, defTeam, defPlayer)
    return matchDetails.ball.position
  }
  matchDetails.ball.ballOverIterations = []
  matchDetails.ball.Player = defPlayer.playerID
  matchDetails.ball.withPlayer = true
  matchDetails.ball.withTeam = defTeam.teamID
  let tempArray = defPlayer.currentPOS
  matchDetails.ball.position = tempArray.map(x => x)
}

function setDeflectionPlayerOffside(matchDetails, defTeam, defPlayer) {
  defPlayer.offside = false
  defPlayer.hasBall = false
  matchDetails.ball.Player = ''
  matchDetails.ball.withPlayer = false
  matchDetails.ball.withTeam = ''
  matchDetails.iterationLog.push(`${defPlayer.name} is offside. Set piece given`)
  if (defTeam.name == matchDetails.kickOffTeam.name) matchDetails = setPositions.setSetpieceSecondTeam(matchDetails)
  else matchDetails = setPositions.setSetpieceKickOffTeam(matchDetails)
}

function getBallDirection(matchDetails, nextPOS) {
  let thisPOS = matchDetails.ball.position
  let movementX = thisPOS[0] - nextPOS[0]
  let movementY = thisPOS[1] - nextPOS[1]
  if (movementX === 0) {
    if (movementY === 0) matchDetails.ball.direction = `wait`
    else if (movementY < 0) matchDetails.ball.direction = `south`
    else if (movementY > 0) matchDetails.ball.direction = `north`
  } else if (movementY === 0) {
    if (movementX < 0) matchDetails.ball.direction = `east`
    else if (movementX > 0) matchDetails.ball.direction = `west`
  } else if (movementX < 0 && movementY < 0) matchDetails.ball.direction = `southeast`
  else if (movementX > 0 && movementY > 0) matchDetails.ball.direction = `northwest`
  else if (movementX > 0 && movementY < 0) matchDetails.ball.direction = `southwest`
  else if (movementX < 0 && movementY > 0) matchDetails.ball.direction = `northeast`
}

function ballPassed(matchDetails, teammates, player) {
  matchDetails.ball.lastTouch = player.name
  const [, pitchHeight] = matchDetails.pitchSize
  const side = (player.originPOS[1] > (pitchHeight / 2)) ? 'bottom' : 'top'
  let { position } = matchDetails.ball
  let closePlyPos = [0, 0]
  let playersInDistance = getPlayersInDistance(teammates, player, matchDetails.pitchSize)
  let tPlyr = getTargetPlayer(playersInDistance, side)
  let bottomThird = (position[1] > (pitchHeight - (pitchHeight / 3)))
  let middleThird = !!((position[1] > (pitchHeight / 3) && position[1] < (pitchHeight - (pitchHeight / 3))))
  if (player.skill.passing > common.getRandomNumber(0, 100)) closePlyPos = tPlyr.position
  else if (player.originPOS[1] > (pitchHeight / 2)) {
    if (bottomThird) closePlyPos = setTargetPlyPos(tPlyr.position, -10, 10, -10, 10)
    else if (middleThird) closePlyPos = setTargetPlyPos(tPlyr.position, -50, 50, -50, 50)
    else closePlyPos = setTargetPlyPos(tPlyr.position, -100, 100, -100, 100)
  } else if (bottomThird) closePlyPos = setTargetPlyPos(tPlyr.position, -100, 100, -100, 100)
  else if (middleThird) closePlyPos = setTargetPlyPos(tPlyr.position, -50, 50, -50, 50)
  else closePlyPos = setTargetPlyPos(tPlyr.position, -10, 10, -10, 10)
  matchDetails.iterationLog.push(`ball passed by: ${player.name} to: ${tPlyr.name}`)
  player.stats.passes.total++
  return calcBallMovementOverTime(matchDetails, player.skill.strength, closePlyPos, player)
}

function setTargetPlyPos(tplyr, lowX, highX, lowY, highY) {
  let closePlyPos = [0, 0]
  let [targetPlayerXPos, targetPlayerYPos] = tplyr
  closePlyPos[0] = common.round(targetPlayerXPos + common.getRandomNumber(lowX, highX), 0)
  closePlyPos[1] = common.round(targetPlayerYPos + common.getRandomNumber(lowY, highY), 0)
  return closePlyPos
}

function getTargetPlayer(playersArray, side) {
  let thisRand = common.getRandomNumber(0, (playersArray.length - 1))
  let thisPlayer = playersArray[thisRand]
  if (thisRand > 5) thisRand = common.getRandomNumber(0, (playersArray.length - 1))
  if (side == 'top' && playersArray[thisRand].proximity > thisPlayer.proximity) {
    thisPlayer = playersArray[thisRand]
  } else if (side == 'bottom' && playersArray[thisRand].proximity < thisPlayer.proximity) {
    thisPlayer = playersArray[thisRand]
  }
  if (thisRand > 5) thisRand = common.getRandomNumber(0, (playersArray.length - 1))
  if (side == 'top' && playersArray[thisRand].proximity > thisPlayer.proximity) {
    thisPlayer = playersArray[thisRand]
  } else if (side == 'bottom' && playersArray[thisRand].proximity < thisPlayer.proximity) {
    thisPlayer = playersArray[thisRand]
  }
  return thisPlayer
}

function ballCrossed(matchDetails, player) {
  matchDetails.ball.lastTouch = player.name
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let ballIntended = []
  if (player.originPOS[1] > (pitchHeight / 2)) {
    ballIntended[1] = common.getRandomNumber(0, (pitchHeight / 5))
    if (player.currentPOS[0] < (pitchWidth / 2)) ballIntended[0] = common.getRandomNumber((pitchWidth / 3), pitchWidth)
    else ballIntended[0] = common.getRandomNumber(0, pitchWidth - (pitchWidth / 3))
  } else {
    ballIntended[1] = common.getRandomNumber(pitchHeight - (pitchHeight / 5), pitchHeight)
    if (player.currentPOS[0] < (pitchWidth / 2)) ballIntended[0] = common.getRandomNumber((pitchWidth / 3), pitchWidth)
    else ballIntended[0] = common.getRandomNumber(0, pitchWidth - (pitchWidth / 3))
  }
  matchDetails.iterationLog.push(`ball crossed by: ${player.name}`)
  player.stats.passes.total++
  return calcBallMovementOverTime(matchDetails, player.skill.strength, ballIntended, player)
}

function calcBallMovementOverTime(matchDetails, strength, nextPosition, player) {
  let { kickOffTeam, secondTeam } = matchDetails
  let { position } = matchDetails.ball
  const power = common.calculatePower(strength)
  const changeInX = (nextPosition[0] - position[0])
  const changeInY = (nextPosition[1] - position[1])
  let totalChange = Math.max(Math.abs(changeInX), Math.abs(changeInY))
  let movementIterations = common.round((totalChange / common.getRandomNumber(2, 3)), 0)
  if (movementIterations < 1) movementIterations = 1
  let powerArray = splitNumberIntoN(power, movementIterations)
  let xArray = splitNumberIntoN(changeInX, movementIterations)
  let yArray = splitNumberIntoN(changeInY, movementIterations)
  let BOIts = mergeArrays(powerArray.length, position, nextPosition, xArray, yArray, powerArray)
  matchDetails.ball.ballOverIterations = BOIts
  let endPos = resolveBallMovement(player, position, BOIts[0], power, kickOffTeam, secondTeam, matchDetails)
  matchDetails.ball.ballOverIterations.shift()
  matchDetails.iterationLog.push(`resolving ball movement`)
  return endPos
}

function splitNumberIntoN(number, n) {
  const arrayN = Array.from(Array(n).keys())
  let splitNumber = []
  for (let thisn of arrayN) {
    let nextNum = common.aTimesbDividedByC((n - thisn), number, n)
    if (nextNum === 0) splitNumber.push(1)
    else splitNumber.push(common.round((nextNum), 0))
  }
  return splitNumber
}

function mergeArrays(arrayLength, oldPos, newPos, array1, array2, array3) {
  let tempPos = [oldPos[0], oldPos[1]]
  const arrayN = Array.from(Array(arrayLength - 1).keys())
  let newArray = []
  for (let thisn of arrayN) {
    newArray.push([tempPos[0] + array1[thisn], tempPos[1] + array2[thisn], array3[thisn]])
    tempPos = [tempPos[0] + array1[thisn], tempPos[1] + array2[thisn]]
  }
  newArray.push([newPos[0], newPos[1], array3[array3.length - 1]])
  return newArray
}

module.exports = {
  ballKicked,
  shotMade,
  penaltyTaken,
  throughBall,
  resolveBallMovement,
  resolveDeflection,
  getBallDirection,
  ballPassed,
  ballCrossed,
  moveBall,
  mergeArrays,
  splitNumberIntoN,
  calcBallMovementOverTime,
  setDeflectionDirectionPos,
  setDeflectionPlayerOffside,
  getTargetPlayer,
  setDeflectiionPlayerHasBall,
  setBallMovementMatchDetails,
  thisPlayerIsInProximity,
  setTargetPlyPos,
  setBPlayer,
  checkGoalScored,
  getTopKickedPosition,
  getBottomKickedPosition
}
