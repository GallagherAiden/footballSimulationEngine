const common = require(`../lib/common`)
const setPositions = require(`../lib/setPositions`)

function moveBall(matchDetails) {
  if (matchDetails.ball.ballOverIterations === undefined || matchDetails.ball.ballOverIterations.length == 0) {
    return matchDetails
  }
  let { ball } = matchDetails
  let bPosition = ball.position
  let { kickOffTeam, secondTeam } = matchDetails
  let ballPos = ball.ballOverIterations[0]
  const power = ballPos[2]
  ballPos.splice()
  let bPlayer = {
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
    'startPOS': ballPos,
    'injured': false
  }
  let endPos = resolveBallMovement(bPlayer, bPosition, ballPos, power, kickOffTeam, secondTeam, matchDetails)
  matchDetails.ball.ballOverIterations.shift()
  matchDetails.iterationLog.push(`ball still moving from previous kick: ${endPos}`)
  matchDetails.ball.position = endPos
  checkGoalScored(matchDetails)
  return matchDetails
}

function ballKicked(matchDetails, player) {
  let { kickOffTeam, secondTeam } = matchDetails
  let { position, direction } = matchDetails.ball
  const [, pitchHeight] = matchDetails.pitchSize
  matchDetails.iterationLog.push(`ball kicked by: ${player.name}`)
  let newPosition = [0, 0]
  let teamShootingToTop = [`wait`, `north`, `north`, `north`, `north`, `east`, `east`, `west`, `west`]
  teamShootingToTop.push([`northeast`, `northeast`, `northeast`, `northwest`, `northwest`, `northwest`])
  let teamShootingToBottom = [`wait`, `south`, `south`, `south`, `south`, `east`, `east`, `west`, `west`]
  teamShootingToBottom.push([`southeast`, `southeast`, `southeast`, `southwest`, `southwest`, `southwest`])
  let power = common.calculatePower(player.skill.strength)
  if (player.originPOS[1] > (pitchHeight / 2)) {
    direction = teamShootingToTop[common.getRandomNumber(0, teamShootingToTop.length - 1)]
    if (direction === `wait`) {
      newPosition[0] = position[0] + common.getRandomNumber(0, (power / 2))
      newPosition[1] = position[1] + common.getRandomNumber(0, (power / 2))
    } else if (direction === `north`) {
      newPosition[0] = position[0] + common.getRandomNumber(-20, 20)
      newPosition[1] = position[1] + common.getRandomNumber(-power, -(power / 2))
    } else if (direction === `east`) {
      newPosition[0] = position[0] + common.getRandomNumber((power / 2), power)
      newPosition[1] = position[1] + common.getRandomNumber(-20, 20)
    } else if (direction === `west`) {
      newPosition[0] = position[0] + common.getRandomNumber(-power, -(power / 2))
      newPosition[1] = position[1] + common.getRandomNumber(-20, 20)
    } else if (direction === `northeast`) {
      newPosition[0] = position[0] + common.getRandomNumber(0, (power / 2))
      newPosition[1] = position[1] + common.getRandomNumber(-power, -(power / 2))
    } else if (direction === `northwest`) {
      newPosition[0] = position[0] + common.getRandomNumber(-(power / 2), 0)
      newPosition[1] = position[1] + common.getRandomNumber(-power, -(power / 2))
    }
  } else {
    direction = teamShootingToBottom[common.getRandomNumber(0, teamShootingToBottom.length - 1)]
    if (direction === `wait`) {
      newPosition[0] = position[0] + common.getRandomNumber(0, (power / 2))
      newPosition[1] = position[1] + common.getRandomNumber(0, (power / 2))
    } else if (direction === `east`) {
      newPosition[0] = position[0] + common.getRandomNumber((power / 2), power)
      newPosition[1] = position[1] + common.getRandomNumber(-20, 20)
    } else if (direction === `west`) {
      newPosition[0] = common.getRandomNumber(position[0] - 120, position[0])
      newPosition[1] = common.getRandomNumber(position[1] - 30, position[1] + 30)
    } else if (direction === `south`) {
      newPosition[0] = position[0] + common.getRandomNumber(-20, 20)
      newPosition[1] = position[1] + common.getRandomNumber((power / 2), power)
    } else if (direction === `southeast`) {
      newPosition[0] = position[0] + common.getRandomNumber(0, (power / 2))
      newPosition[1] = position[1] + common.getRandomNumber((power / 2), power)
    } else if (direction === `southwest`) {
      newPosition[0] = position[0] + common.getRandomNumber(-(power / 2), 0)
      newPosition[1] = position[1] + common.getRandomNumber((power / 2), power)
    }
  }
  //Calculate ball movement over time
  const changeInX = (newPosition[0] - position[0])
  const changeInY = (newPosition[1] - position[1])
  let totalChange = Math.max(Math.abs(changeInX), Math.abs(changeInY))
  let movementIterations = common.round((totalChange / common.getRandomNumber(2, 3)), 0)
  if (movementIterations < 1) {
    movementIterations = 1
  }
  let powerArray = splitNumberIntoN(power, movementIterations)
  let xArray = splitNumberIntoN(changeInX, movementIterations)
  let yArray = splitNumberIntoN(changeInY, movementIterations)
  let BOIts = mergeArrays(powerArray.length, position, newPosition, xArray, yArray, powerArray)
  matchDetails.ball.ballOverIterations = BOIts
  let endPos = resolveBallMovement(player, position, BOIts[0], power, kickOffTeam, secondTeam, matchDetails)
  matchDetails.ball.ballOverIterations.shift()
  matchDetails.iterationLog.push(`resolving ball movement`)
  matchDetails.iterationLog.push(`new ball position: ${endPos}`)
  return endPos
}

function shotMade(matchDetails, team, opp, player) {
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  matchDetails.iterationLog.push(`Shot Made by: ${player.name}`)
  let shotPosition = [0, 0]
  let shotPower = common.calculatePower(player.skill.strength)
  let PlyPos = player.startPOS
  if (common.isEven(matchDetails.half)) {
    matchDetails.kickOffTeamStatistics.shots++
  } else if (common.isOdd(matchDetails.half)) {
    matchDetails.secondTeamStatistics.shots++
  } else {
    throw new Error(`You cannot supply 0 as a half`)
  }
  matchDetails.iterationLog.push(`Shot On Target`)
  shotPosition[0] = common.getRandomNumber((pitchWidth / 2) - 50, (pitchWidth / 2) + 50)
  if (player.originPOS[1] > pitchHeight / 2) {
    shotPosition[1] = PlyPos[1] - shotPower
  } else {
    shotPosition[1] = PlyPos[1] + shotPower
  }
  //Calculate ball movement over time
  const changeInX = (shotPosition[0] - PlyPos[0])
  const changeInY = (shotPosition[1] - PlyPos[1])
  let totalChange = Math.max(Math.abs(changeInX), Math.abs(changeInY))
  let movementIterations = common.round((totalChange / common.getRandomNumber(2, 3)), 0)
  if (movementIterations < 1) {
    movementIterations = 1
  }
  let powerArray = splitNumberIntoN(shotPower, movementIterations)
  let xArray = splitNumberIntoN(changeInX, movementIterations)
  let yArray = splitNumberIntoN(changeInY, movementIterations)
  let BOIts = mergeArrays(powerArray.length, PlyPos, shotPosition, xArray, yArray, powerArray)
  matchDetails.ball.ballOverIterations = BOIts
  let endPos = resolveBallMovement(player, PlyPos, BOIts[0], shotPower, team, opp, matchDetails)
  matchDetails.iterationLog.push(`resolving ball movement whilst making a shot`)
  matchDetails.ball.ballOverIterations.shift()
  matchDetails.iterationLog.push(`resolving ball movement`)
  matchDetails.iterationLog.push(`new ball position: ${endPos}`)
  checkGoalScored(matchDetails)
  return endPos
}

function checkGoalScored(matchDetails) {
  let {
    ball, half, secondTeam, kickOffTeam
  } = matchDetails
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  const centreGoal = pitchWidth / 2
  const goalEdge = centreGoal / 3
  const goalX = common.isBetween(ball.position[0], centreGoal - goalEdge, centreGoal + goalEdge)
  if (goalX) {
    if (ball.position[1] < 1) {
      if (half == 0) {
        throw new Error('cannot set half as 0')
      } else if (common.isOdd(half)) {
        matchDetails = setPositions.setSecondTeamGoalScored(matchDetails)
        matchDetails.secondTeamStatistics.goals++
      } else {
        matchDetails = setPositions.setKickOffTeamGoalScored(kickOffTeam, secondTeam, matchDetails)
        matchDetails.kickOffTeamStatistics.goals++
      }
    } else if (ball.position[1] >= pitchHeight) {
      if (half == 0) {
        throw new Error('cannot set half as 0')
      } else if (common.isOdd(half)) {
        matchDetails = setPositions.setKickOffTeamGoalScored(matchDetails)
        matchDetails.kickOffTeamStatistics.goals++
      } else {
        matchDetails = setPositions.setSecondTeamGoalScored(matchDetails)
        matchDetails.secondTeamStatistics.goals++
      }
    }
  }
}

function throughBall(matchDetails, teammates, player) {
  let { kickOffTeam, secondTeam } = matchDetails
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let { position } = matchDetails.ball
  let closestPlayerPosition = [0, 0]
  let playersInDistance = []
  for (const teamPlayer of teammates.players) {
    if (teamPlayer.name != player.name) {
      let onPitchX = common.isBetween(teamPlayer.startPOS[0], -1, pitchWidth + 1)
      let onPitchY = common.isBetween(teamPlayer.startPOS[1], -1, pitchHeight + 1)
      if (onPitchX && onPitchY) {
        let playerToPlayerX = player.startPOS[0] - teamPlayer.startPOS[0]
        let playerToPlayerY = player.startPOS[1] - teamPlayer.startPOS[1]
        let proximityToBall = Math.abs(playerToPlayerX + playerToPlayerY)
        playersInDistance.push({
          'position': teamPlayer.startPOS,
          'proximity': proximityToBall,
          'name': teamPlayer.name
        })
      }
    }
  }
  playersInDistance.sort(function(a, b) {
    return a.proximity - b.proximity
  })
  let targetPlayer = playersInDistance[common.getRandomNumber(0, (playersInDistance.length - 1))]
  let [targetPlayerXPos, targetPlayerYPos] = targetPlayer.position
  matchDetails.iterationLog.push(`through ball passed by: ${player.name} to: ${targetPlayer.name}`)
  if (player.skill.passing > common.getRandomNumber(0, 100)) {
    if (player.originPOS[1] > pitchHeight / 2) {
      closestPlayerPosition = [targetPlayerXPos, targetPlayerYPos - 10]
    } else {
      closestPlayerPosition = [targetPlayerXPos, targetPlayerYPos + 10]
    }
  } else if (player.originPOS[1] > (pitchHeight / 2)) {
    if (position[1] > (pitchHeight - (pitchHeight / 3))) {
      closestPlayerPosition[0] = targetPlayerXPos + common.getRandomNumber(-10, 10)
      closestPlayerPosition[1] = targetPlayerYPos + common.getRandomNumber(-10, 10)
    } else if (position[1] > (pitchHeight / 3) && position[1] < (pitchHeight - (pitchHeight / 3))) {
      closestPlayerPosition[0] = targetPlayerXPos + common.getRandomNumber(-20, 20)
      closestPlayerPosition[1] = targetPlayerYPos + common.getRandomNumber(-50, 50)
    } else {
      closestPlayerPosition[0] = targetPlayerXPos + common.getRandomNumber(-30, 30)
      closestPlayerPosition[1] = targetPlayerYPos + common.getRandomNumber(-100, 100)
    }
  } else if (position[1] > (pitchHeight - (pitchHeight / 3))) {
    closestPlayerPosition[0] = targetPlayerXPos + common.getRandomNumber(-30, 30)
    closestPlayerPosition[1] = targetPlayerYPos + common.getRandomNumber(-100, 100)
  } else if (position[1] > (pitchHeight / 3) && position[1] < (pitchHeight - (pitchHeight / 3))) {
    closestPlayerPosition[0] = targetPlayerXPos + common.getRandomNumber(-20, 20)
    closestPlayerPosition[1] = targetPlayerYPos + common.getRandomNumber(-50, 50)
  } else {
    closestPlayerPosition[0] = targetPlayerXPos + common.getRandomNumber(-10, 10)
    closestPlayerPosition[1] = targetPlayerYPos + common.getRandomNumber(-10, 10)
  }
  //Calculate ball movement over time
  const power = common.calculatePower(player.skill.strength)
  const changeInX = (closestPlayerPosition[0] - position[0])
  const changeInY = (closestPlayerPosition[1] - position[1])
  let totalChange = Math.max(Math.abs(changeInX), Math.abs(changeInY))
  let movementIterations = common.round((totalChange / common.getRandomNumber(2, 3)), 0)
  if (movementIterations < 1) {
    movementIterations = 1
  }
  let powerArray = splitNumberIntoN(power, movementIterations)
  let xArray = splitNumberIntoN(changeInX, movementIterations)
  let yArray = splitNumberIntoN(changeInY, movementIterations)
  let BOIts = mergeArrays(powerArray.length, position, closestPlayerPosition, xArray, yArray, powerArray)
  matchDetails.ball.ballOverIterations = BOIts
  let endPos = resolveBallMovement(player, position, BOIts[0], power, kickOffTeam, secondTeam, matchDetails)
  matchDetails.ball.ballOverIterations.shift()
  matchDetails.iterationLog.push(`resolving ball movement`)
  matchDetails.iterationLog.push(`new ball position: ${endPos}`)
  return endPos
}

function resolveBallMovement(player, currentPOS, newPOS, power, team, opp, matchDetails) {
  setPositions.removeBallFromAllPlayers(matchDetails)
  let lineToEndPosition = common.getBallTrajectory(currentPOS, newPOS, power)
  for (const thisPos of lineToEndPosition) {
    let checkPos = [common.round(thisPos[0], 0), common.round(thisPos[1], 0), thisPos[2]]
    let playerInfo1 = setPositions.closestPlayerToPosition(player, team, checkPos)
    let playerInfo2 = setPositions.closestPlayerToPosition(player, opp, checkPos)
    let thisPlayerProx = Math.max(playerInfo1.proxToBall, playerInfo2.proxToBall)
    let thisPlayer = (thisPlayerProx == playerInfo1.proxToBall) ? playerInfo1.thePlayer : playerInfo2.thePlayer
    let thisTeam = (thisPlayerProx == playerInfo1.proxToBall) ? team : opp
    let isGoalie = (thisPlayer.position === 'GK')
    if (thisPlayer) {
      const xPosProx = common.isBetween(thisPlayer.startPOS[0], thisPos[0] - 3, thisPos[0] + 3)
      const yPosProx = common.isBetween(thisPlayer.startPOS[1], thisPos[1] - 3, thisPos[1] + 3)
      const goaliexPosProx = common.isBetween(thisPlayer.startPOS[0], thisPos[0] - 11, thisPos[0] + 11)
      const goalieyPosProx = common.isBetween(thisPlayer.startPOS[1], thisPos[1] - 2, thisPos[1] + 2)
      if (isGoalie && goaliexPosProx && goalieyPosProx) {
        if (common.isBetween(checkPos[2], -1, thisPlayer.skill.jumping + 1)) {
          let saving = thisPlayer.skill.saving || ''
          if (saving && saving > common.getRandomNumber(0, power)) {
            matchDetails.ball.ballOverIterations = []
            matchDetails.ball.Player = thisPlayer.name
            matchDetails.ball.withPlayer = true
            matchDetails.ball.withTeam = thisTeam.name
            let tempArray = thisPos
            matchDetails.ball.position = tempArray.map(x => x)
            thisPlayer.position = tempArray.map(x => x)
            matchDetails.iterationLog.push(`Ball saved`)
            return thisPos
          }
        }
      } else if (xPosProx && yPosProx) {
        if (common.isBetween(checkPos[2], -1, thisPlayer.skill.jumping + 1)) {
          let deflectPos = thisPlayer.startPOS
          let newPOS = resolveDeflection(power, currentPOS, deflectPos, thisPlayer, thisTeam.name, matchDetails)
          matchDetails.iterationLog.push(`Ball deflected`)
          return [common.round(newPOS[0], 2), common.round(newPOS[1], 2)]
        }
      }
    }
  }
  matchDetails = setPositions.keepInBoundaries(matchDetails, team.name, newPOS)
  let lastPOS = matchDetails.ballIntended.map(x => x) || matchDetails.ball.position.map(x => x)
  delete matchDetails.ballIntended
  return [common.round(lastPOS[0], 2), common.round(lastPOS[1], 2)]
}

function resolveDeflection(power, currentPOS, defPosition, defPlayer, defTeam, matchDetails) {
  let { kickOffTeam } = matchDetails
  let xMovement = (currentPOS[0] - defPosition[0]) ** 2
  let yMovement = (currentPOS[1] - defPosition[1]) ** 2
  let movementDistance = Math.sqrt(xMovement + yMovement)
  let newPower = power - movementDistance
  let tempPosition = ['', '']
  let { direction } = matchDetails.ball
  if (newPower < 75) {
    defPlayer.hasBall = true
    if (defPlayer.offside == true) {
      matchDetails.iterationLog.push(defPlayer.name, `is offside. Set piece given`)
      if (defTeam.name == kickOffTeam.name) {
        matchDetails = setPositions.setSetpieceKickOffTeam(matchDetails)
      } else {
        matchDetails = setPositions.setSetpieceSecondTeam(matchDetails)
      }
      return matchDetails.ball.position
    }
    matchDetails.ball.ballOverIterations = []
    matchDetails.ball.Player = defPlayer.name
    matchDetails.ball.withPlayer = true
    matchDetails.ball.withTeam = defTeam
    let tempArray = defPlayer.startPOS
    matchDetails.ball.position = tempArray.map(x => x)
    return defPosition
  }
  defPlayer.hasBall = true
  matchDetails.ball.Player = defPlayer.name
  matchDetails.ball.withPlayer = true
  matchDetails.ball.withTeam = defTeam
  if (defPlayer.offside == true) {
    matchDetails.iterationLog.push(defPlayer.name, `is offside. Set piece given`)
    if (defTeam.name == kickOffTeam.name) {
      matchDetails = setPositions.setSetpieceKickOffTeam(matchDetails)
    } else {
      matchDetails = setPositions.setSetpieceSecondTeam(matchDetails)
    }
    defPlayer.offside = false
    defPlayer.hasBall = false
    matchDetails.ball.Player = ''
    matchDetails.ball.withPlayer = false
    matchDetails.ball.withTeam = ''
    return matchDetails.ball.position
  }
  defPlayer.hasBall = false
  matchDetails.ball.Player = ''
  matchDetails.ball.withPlayer = false
  matchDetails.ball.withTeam = ''

  if (direction === `east` || direction === `northeast` || direction === `southeast`) {
    if (direction === `east`) {
      tempPosition[1] = common.getRandomNumber(defPosition[1] - 3, defPosition[1] + 3)
    }
    tempPosition[0] = defPosition[0] - (newPower / 2)
  } else if (direction === `west` || direction === `northwest` || direction === `southwest`) {
    if (direction === `west`) {
      tempPosition[1] = common.getRandomNumber(defPosition[1] - 3, defPosition[1] + 3)
    }
    tempPosition[0] = defPosition[0] + (newPower / 2)
  }
  if (direction === `north` || direction === `northeast` || direction === `northwest`) {
    if (direction === `north`) {
      tempPosition[0] = common.getRandomNumber(defPosition[0] - 3, defPosition[0] + 3)
    }
    tempPosition[1] = defPosition[1] + (newPower / 2)
  } else if (direction === `south` || direction === `southeast` || direction === `southwest`) {
    if (direction === `south`) {
      tempPosition[0] = common.getRandomNumber(defPosition[0] - 3, defPosition[0] + 3)
    }
    tempPosition[1] = defPosition[1] - (newPower / 2)
  }
  if (direction === `wait`) {
    tempPosition[0] = common.getRandomNumber(-newPower / 2, newPower / 2)
    tempPosition[1] = common.getRandomNumber(-newPower / 2, newPower / 2)
  }
  matchDetails = setPositions.keepInBoundaries(matchDetails, defTeam.name, tempPosition)
  let lastPOS = matchDetails.ballIntended.map(x => x) || matchDetails.ball.position.map(x => x)
  delete matchDetails.ballIntended
  return lastPOS
}

function getBallDirection(matchDetails, nextPOS) {
  let currentPOS = matchDetails.ball.position
  let movementX = currentPOS[0] - nextPOS[0]
  let movementY = currentPOS[1] - nextPOS[1]
  if (movementX === 0) {
    if (movementY === 0) {
      matchDetails.ball.direction = `wait`
    } else if (movementY < 0) {
      matchDetails.ball.direction = `south`
    } else if (movementY > 0) {
      matchDetails.ball.direction = `north`
    }
  } else if (movementY === 0) {
    if (movementX < 0) {
      matchDetails.ball.direction = `east`
    } else if (movementX > 0) {
      matchDetails.ball.direction = `west`
    }
  } else if (movementX < 0 && movementY < 0) {
    matchDetails.ball.direction = `southeast`
  } else if (movementX > 0 && movementY > 0) {
    matchDetails.ball.direction = `northwest`
  } else if (movementX > 0 && movementY < 0) {
    matchDetails.ball.direction = `southwest`
  } else if (movementX < 0 && movementY > 0) {
    matchDetails.ball.direction = `northeast`
  }
}

function ballPassed(matchDetails, teammates, player) {
  let { kickOffTeam, secondTeam } = matchDetails
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  const side = (player.originPOS[1] > (pitchHeight / 2)) ? 'bottom' : 'top'
  let { position } = matchDetails.ball
  let closestPlayerPosition = [0, 0]
  let playersInDistance = []
  for (const teamPlayer of teammates.players) {
    if (teamPlayer.name != player.name) {
      let onPitchX = common.isBetween(teamPlayer.startPOS[0], -1, pitchWidth + 1)
      let onPitchY = common.isBetween(teamPlayer.startPOS[1], -1, pitchHeight + 1)
      if (onPitchX && onPitchY) {
        let playerToPlayerX = player.startPOS[0] - teamPlayer.startPOS[0]
        let playerToPlayerY = player.startPOS[1] - teamPlayer.startPOS[1]
        let proximityToBall = Math.abs(playerToPlayerX + playerToPlayerY)
        playersInDistance.push({
          'position': teamPlayer.startPOS,
          'proximity': proximityToBall,
          'proximityToGoal': playerToPlayerY,
          'name': teamPlayer.name
        })
      }
    }
  }
  playersInDistance.sort(function(a, b) {
    return a.proximity - b.proximity
  })
  let targetPlayer = getTargetPlayer(playersInDistance, side)
  let [targetPlayerXPos, targetPlayerYPos] = targetPlayer.position
  if (player.skill.passing > common.getRandomNumber(0, 100)) {
    closestPlayerPosition = targetPlayer.position
  } else if (player.originPOS[1] > (pitchHeight / 2)) {
    if (position[1] > (pitchHeight - (pitchHeight / 3))) {
      closestPlayerPosition[0] = common.round(targetPlayerXPos + common.getRandomNumber(-10, 10), 0)
      closestPlayerPosition[1] = common.round(targetPlayerYPos + common.getRandomNumber(-10, 10), 0)
    } else if (position[1] > (pitchHeight / 3) && position[1] < (pitchHeight - (pitchHeight / 3))) {
      closestPlayerPosition[0] = common.round(targetPlayerXPos + common.getRandomNumber(-50, 50), 0)
      closestPlayerPosition[1] = common.round(targetPlayerYPos + common.getRandomNumber(-50, 50), 0)
    } else {
      closestPlayerPosition[0] = common.round(targetPlayerXPos + common.getRandomNumber(-100, 100), 0)
      closestPlayerPosition[1] = common.round(targetPlayerYPos + common.getRandomNumber(-100, 100), 0)
    }
  } else if (position[1] > (pitchHeight - (pitchHeight / 3))) {
    closestPlayerPosition[0] = common.round(targetPlayerXPos + common.getRandomNumber(-100, 100), 0)
    closestPlayerPosition[1] = common.round(targetPlayerYPos + common.getRandomNumber(-100, 100), 0)
  } else if (position[1] > (pitchHeight / 3) && position[1] < (pitchHeight - (pitchHeight / 3))) {
    closestPlayerPosition[0] = common.round(targetPlayerXPos + common.getRandomNumber(-50, 50), 0)
    closestPlayerPosition[1] = common.round(targetPlayerYPos + common.getRandomNumber(-50, 50), 0)
  } else {
    closestPlayerPosition[0] = common.round(targetPlayerXPos + common.getRandomNumber(-10, 10), 0)
    closestPlayerPosition[1] = common.round(targetPlayerYPos + common.getRandomNumber(-10, 10), 0)
  }
  matchDetails.iterationLog.push(`ball passed by: ${player.name} to: ${targetPlayer.name}`)
  //Calculate ball movement over time
  const power = common.calculatePower(player.skill.strength)
  const changeInX = (closestPlayerPosition[0] - position[0])
  const changeInY = (closestPlayerPosition[1] - position[1])
  let totalChange = Math.max(Math.abs(changeInX), Math.abs(changeInY))
  let movementIterations = common.round((totalChange / common.getRandomNumber(2, 3)), 0)
  if (movementIterations < 1) {
    movementIterations = 1
  }
  let powerArray = splitNumberIntoN(power, movementIterations)
  let xArray = splitNumberIntoN(changeInX, movementIterations)
  let yArray = splitNumberIntoN(changeInY, movementIterations)
  let BOIts = mergeArrays(powerArray.length, position, closestPlayerPosition, xArray, yArray, powerArray)
  matchDetails.ball.ballOverIterations = BOIts
  let endPos = resolveBallMovement(player, position, BOIts[0], power, kickOffTeam, secondTeam, matchDetails)
  matchDetails.ball.ballOverIterations.shift()
  return endPos
}

function getTargetPlayer(playersArray, side) {
  let thisRand = common.getRandomNumber(0, (playersArray.length - 1))
  let thisPlayer = playersArray[thisRand]
  if (thisRand > 5) {
    thisRand = common.getRandomNumber(0, (playersArray.length - 1))
  }
  if (side == 'top' && playersArray[thisRand].proximity > thisPlayer.proximity) {
    thisPlayer = playersArray[thisRand]
  } else if (side == 'bottom' && playersArray[thisRand].proximity < thisPlayer.proximity) {
    thisPlayer = playersArray[thisRand]
  }
  if (thisRand > 5) {
    thisRand = common.getRandomNumber(0, (playersArray.length - 1))
  }
  if (side == 'top' && playersArray[thisRand].proximity > thisPlayer.proximity) {
    thisPlayer = playersArray[thisRand]
  } else if (side == 'bottom' && playersArray[thisRand].proximity < thisPlayer.proximity) {
    thisPlayer = playersArray[thisRand]
  }
  return thisPlayer
}

function ballCrossed(matchDetails, player) {
  let { kickOffTeam, secondTeam } = matchDetails
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let { position } = matchDetails.ball
  let ballIntended = []
  if (player.originPOS[1] > (pitchHeight / 2)) {
    ballIntended[1] = common.getRandomNumber(0, (pitchHeight / 5))
    if (player.startPOS[0] < (pitchWidth / 2)) {
      ballIntended[0] = common.getRandomNumber((pitchWidth / 3), pitchWidth)
    } else {
      ballIntended[0] = common.getRandomNumber(0, pitchWidth - (pitchWidth / 3))
    }
  } else {
    ballIntended[1] = common.getRandomNumber(pitchHeight - (pitchHeight / 5), pitchHeight)
    if (player.startPOS[0] < (pitchWidth / 2)) {
      ballIntended[0] = common.getRandomNumber((pitchWidth / 3), pitchWidth)
    } else {
      ballIntended[0] = common.getRandomNumber(0, pitchWidth - (pitchWidth / 3))
    }
  }
  matchDetails.iterationLog.push(`ball crossed by: ${player.name}`)
  //Calculate ball movement over time
  const power = common.calculatePower(player.skill.strength)
  const changeInX = (ballIntended[0] - position[0])
  const changeInY = (ballIntended[1] - position[1])
  let totalChange = Math.max(Math.abs(changeInX), Math.abs(changeInY))
  let movementIterations = common.round((totalChange / common.getRandomNumber(2, 3)), 0)
  if (movementIterations < 1) {
    movementIterations = 1
  }
  let powerArray = splitNumberIntoN(power, movementIterations)
  let xArray = splitNumberIntoN(changeInX, movementIterations)
  let yArray = splitNumberIntoN(changeInY, movementIterations)
  let BOIts = mergeArrays(powerArray.length, position, ballIntended, xArray, yArray, powerArray)
  matchDetails.ball.ballOverIterations = BOIts
  let endPos = resolveBallMovement(player, position, BOIts[0], power, kickOffTeam, secondTeam, matchDetails)
  matchDetails.ball.ballOverIterations.shift()
  return endPos
}

function splitNumberIntoN(number, n) {
  const arrayN = Array.from(Array(n).keys())
  let splitNumber = []
  for (let thisn of arrayN) {
    let nextNum = common.aTimesbDividedByC((n - thisn), number, n)
    if (nextNum === 0) {
      splitNumber.push(1)
    } else {
      splitNumber.push(common.round((nextNum), 0))
    }
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
  throughBall,
  resolveBallMovement,
  resolveDeflection,
  getBallDirection,
  ballPassed,
  ballCrossed,
  moveBall
}
