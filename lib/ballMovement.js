const common = require('../lib/common')
const setPositions = require('../lib/setPositions')

async function moveBall(matchDetails) {
  if (matchDetails.ball.ballOverIterations === undefined || matchDetails.ball.ballOverIterations.length == 0) {
    return matchDetails
  }
  let { ball } = matchDetails
  let { kickOffTeam, secondTeam } = matchDetails
  let ballPosition = ball.ballOverIterations[0]
  const power = ballPosition[2]
  ballPosition.splice()
  let ballPlayer = {
    'name': 'Ball',
    'position': 'LB',
    'rating': '100',
    'skill': {
      'passing': '100',
      'shooting': '100',
      'saving': '100',
      'tackling': '100',
      'agility': '100',
      'strength': '100',
      'penalty_taking': '100',
      'jumping': '100'
    },
    'originPOS': ballPosition,
    'startPOS': ballPosition,
    'injured': false
  }
  let endPosition = await resolveBallMovement(ballPlayer, ball.position, ballPosition, power, kickOffTeam, secondTeam, matchDetails)
    .catch(function(err) {
      const error = `Error when resolving the ball movement: ${err}`
      throw error
    })
  matchDetails.ball.ballOverIterations.shift()
  matchDetails.iterationLog.push(`ball still moving from previous kick: ${endPosition}`)
  matchDetails.ball.position = endPosition
  return matchDetails
}

async function ballKicked(matchDetails, player) {
  let { kickOffTeam, secondTeam } = matchDetails
  let { position, direction } = matchDetails.ball
  const [, pitchHeight] = matchDetails.pitchSize
  matchDetails.iterationLog.push(`ball kicked by: ${player.name}`)
  let newPosition = [0, 0]
  let teamShootingToTop = ['wait', 'north', 'north', 'north', 'north', 'east', 'east', 'west', 'west', 'northeast', 'northeast', 'northeast', 'northwest', 'northwest', 'northwest']
  let teamShootingToBottom = ['wait', 'south', 'south', 'south', 'south', 'east', 'east', 'west', 'west', 'southeast', 'southeast', 'southeast', 'southwest', 'southwest', 'southwest']
  let power = common.calculatePower(player.skill.strength)
  if (player.originPOS[1] > (pitchHeight / 2)) {
    direction = teamShootingToTop[common.getRandomNumber(0, teamShootingToTop.length - 1)]
    if (direction === 'wait') {
      newPosition = [position[0] + common.getRandomNumber(0, (power / 2)), position[1] + common.getRandomNumber(0, (power / 2))]
    } else if (direction === 'north') {
      newPosition = [position[0] + common.getRandomNumber(-20, 20), position[1] + common.getRandomNumber(-power, -(power / 2))]
    } else if (direction === 'east') {
      newPosition = [position[0] + common.getRandomNumber((power / 2), power), position[1] + common.getRandomNumber(-20, 20)]
    } else if (direction === 'west') {
      newPosition = [position[0] + common.getRandomNumber(-power, -(power / 2)), position[1] + common.getRandomNumber(-20, 20)]
    } else if (direction === 'northeast') {
      newPosition = [position[0] + common.getRandomNumber(0, (power / 2)), position[1] + common.getRandomNumber(-power, -(power / 2))]
    } else if (direction === 'northwest') {
      newPosition = [position[0] + common.getRandomNumber(-(power / 2), 0), position[1] + common.getRandomNumber(-power, -(power / 2))]
    }
  } else {
    direction = teamShootingToBottom[common.getRandomNumber(0, teamShootingToBottom.length - 1)]
    if (direction === 'wait') {
      newPosition = [position[0] + common.getRandomNumber(0, (power / 2)), position[1] + common.getRandomNumber(0, (power / 2))]
    } else if (direction === 'east') {
      newPosition = [position[0] + common.getRandomNumber((power / 2), power), position[1] + common.getRandomNumber(-20, 20)]
    } else if (direction === 'west') {
      newPosition = [common.getRandomNumber(position[0] - 120, position[0]), common.getRandomNumber(position[1] - 30, position[1] + 30)]
    } else if (direction === 'south') {
      newPosition = [position[0] + common.getRandomNumber(-20, 20), position[1] + common.getRandomNumber((power / 2), power)]
    } else if (direction === 'southeast') {
      newPosition = [position[0] + common.getRandomNumber(0, (power / 2)), position[1] + common.getRandomNumber((power / 2), power)]
    } else if (direction === 'southwest') {
      newPosition = [position[0] + common.getRandomNumber(-(power / 2), 0), position[1] + common.getRandomNumber((power / 2), power)]
    }
  }
  //Calculate ball movement over time
  const changeInX = (newPosition[0] - position[0])
  const changeInY = (newPosition[1] - position[1])
  let movementIterations = common.round((Math.max(Math.abs(changeInX), Math.abs(changeInY)) / common.getRandomNumber(2, 3)), 0)
  if (movementIterations < 1) {
    movementIterations = 1
  }
  let powerArray = await splitNumberIntoN(power, movementIterations)
    .catch(function(err) {
      const error = `Unable to create an array of power over N iterations: ${err}`
      throw error
    })
  let xArray = await splitNumberIntoN(changeInX, movementIterations)
    .catch(function(err) {
      const error = `Unable to create an array of x over N iterations: ${err}`
      throw error
    })
  let yArray = await splitNumberIntoN(changeInY, movementIterations)
    .catch(function(err) {
      const error = `Unable to create an array of y over N iterations: ${err}`
      throw error
    })
  let ballOverIterations = await mergeArrays(powerArray.length, position, newPosition, xArray, yArray, powerArray)
    .catch(function(err) {
      const error = `Unable to merge arrays: ${err}`
      throw error
    })
  matchDetails.ball.ballOverIterations = ballOverIterations
  let endPosition = await resolveBallMovement(player, position, ballOverIterations[0], power, kickOffTeam, secondTeam, matchDetails)
    .catch(function(err) {
      const error = `Error when resolving the ball movement: ${err}`
      throw error
    })
  matchDetails.ball.ballOverIterations.shift()
  matchDetails.iterationLog.push('resolving ball movement')
  matchDetails.iterationLog.push(`new ball position: ${endPosition}`)
  return endPosition
}

async function shotMade(matchDetails, team, opposition, player) {
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  matchDetails.iterationLog.push(`Shot Made by: ${player.name}`)
  let shotPosition = [0, 0]
  let distanceFromGoal
  let shotPower = common.calculatePower(player.skill.strength)
  if (player.originPOS[1] > pitchHeight / 2) {
    if (common.isEven(matchDetails.half)) {
      matchDetails.kickOffTeamStatistics.shots++
    } else if (common.isOdd(matchDetails.half)) {
      matchDetails.secondTeamStatistics.shots++
    } else {
      const error = 'You cannot supply 0 as a half'
      throw error
    }
    distanceFromGoal = player.startPOS[1] - 0
    if (common.isBetween(shotPower, distanceFromGoal, distanceFromGoal + 50)) {
      if (player.skill.shooting > common.getRandomNumber(0, 20)) {
        matchDetails.iterationLog.push('Shot On Target')
        shotPosition[0] = common.getRandomNumber((pitchWidth / 2) - 20, (pitchWidth / 2) + 20)
        shotPosition[1] = 0
        let endPosition = await resolveBallMovement(player, player.startPOS, shotPosition, shotPower, team, opposition, matchDetails)
          .catch(function(err) {
            const error = `Error when resolving ball movement during the shot: ${err}`
            throw error
          })
        matchDetails.iterationLog.push('resolving ball movement whilst making a shot')
        if (shotPosition[0] !== endPosition[0] || shotPosition[1] !== endPosition[1]) {
          matchDetails.iterationLog.push(`Ball deflected to: ${endPosition}`)
        }
        const oppXpos = common.isBetween(opposition.players[0].startPOS[0], endPosition[0] - 15, endPosition[0] + 15)
        const oppYpos = common.isBetween(opposition.players[0].startPOS[1], -1, 5)
        if (oppXpos && oppYpos) {
          if (opposition.players[0].skill.saving > common.getRandomNumber(0, 100)) {
            matchDetails.iterationLog.push(`Shot Saved by: ${opposition.players[0].name}`)
            opposition.players[0].hasBall = true
            matchDetails.ball.ballOverIterations = []
            matchDetails.ball.Player = opposition.players[0].name
            let tempArray = opposition.players[0].startPOS
            matchDetails.ball.position = tempArray.map(x => x)
            matchDetails.ball.position[2] = 0
            opposition.intent = 'attack'
            team.intent = 'defend'
            return endPosition
          }
          await setPositions.setGoalScored(team, opposition, matchDetails)
            .catch(function(err) {
              const error = `Error when processing the goal: ${err}`
              throw error
            })
          matchDetails.iterationLog.push(`Goal Scored by: ${player.name}`)
          if (common.isEven(matchDetails.half)) {
            matchDetails.kickOffTeamStatistics.goals++
            return endPosition
          } else if (common.isOdd(matchDetails.half)) {
            matchDetails.secondTeamStatistics.goals++
            return endPosition
          }
          const error = 'You cannot supply 0 as a half'
          throw error
        }
        await setPositions.setGoalScored(team, opposition, matchDetails)
          .catch(function(err) {
            const error = `Error when processing the goal: ${err}`
            throw error
          })
        matchDetails.iterationLog.push(`Goal Scored by: ${player.name}`)
        if (common.isEven(matchDetails.half)) {
          matchDetails.kickOffTeamStatistics.goals++
          return endPosition
        } else if (common.isOdd(matchDetails.half)) {
          matchDetails.secondTeamStatistics.goals++
          return endPosition
        }
        const error = 'You cannot supply 0 as a half'
        throw error
      } else {
        shotPosition[0] = common.getRandomNumber((pitchWidth / 2) - 30, (pitchWidth / 2) + 30)
        shotPosition[1] = common.getRandomNumber(1, 20)
        let endPosition = resolveBallMovement(player, player.startPOS, shotPosition, shotPower, team, opposition, matchDetails)
          .catch(function(err) {
            const error = `Error when resolving ball movement after a failed shot: ${err}`
            throw error
          })
        matchDetails.iterationLog.push('Shot Off Target')
        matchDetails.iterationLog.push('resolving ball movement')
        if (shotPosition[0] !== endPosition[0] || shotPosition[1] !== endPosition[1]) {
          matchDetails.iterationLog.push(`Ball deflected to: ${endPosition}`)
          return endPosition
        }
        return endPosition
      }
    } else if (shotPower > (distanceFromGoal + 49)) {
      let endPosition = await setPositions.setGoalKick(opposition, team, matchDetails)
        .catch(function(err) {
          const error = `Error when setting a goal kick after a shot has been made: ${err}`
          throw error
        })
      matchDetails.iterationLog.push(`Shot Missed the goal, Goal Kick to: ${opposition.name}`)
      return endPosition
    } else {
      matchDetails.iterationLog.push(`Shot not hard enough by: ${opposition.name}`)
      let [shotXPos, shotYPos] = matchDetails.ball.position
      shotPosition[0] = shotXPos
      shotPosition[1] = shotYPos - shotPower
      let endPosition = await resolveBallMovement(player, player.startPOS, shotPosition, shotPower, team, opposition, matchDetails)
        .catch(function(err) {
          const error = `Error when resolving ball movement after a failed shot: ${err}`
          throw error
        })
      matchDetails.iterationLog.push('Shot Off Target')
      matchDetails.iterationLog.push('resolving ball movement')
      if (shotPosition[0] !== endPosition[0] || shotPosition[1] !== endPosition[1]) {
        matchDetails.iterationLog.push(`Ball deflected to: ${endPosition}`)
        return endPosition
      }
      return endPosition
    }
  } else {
    if (common.isEven(matchDetails.half)) {
      matchDetails.secondTeamStatistics.shots++
    } else if (common.isOdd(matchDetails.half)) {
      matchDetails.kickOffTeamStatistics.shots++
    } else {
      const error = 'You cannot supply 0 as a half'
      throw error
    }
    distanceFromGoal = pitchHeight - player.startPOS[1]
    if (common.isBetween(shotPower, distanceFromGoal, distanceFromGoal + 50)) {
      if (player.skill.shooting > common.getRandomNumber(0, 20)) {
        matchDetails.iterationLog.push('Shot On Target')
        shotPosition[0] = common.getRandomNumber((pitchWidth / 2) - 20, (pitchWidth / 2) + 20)
        shotPosition[1] = pitchHeight
        let endPosition = await resolveBallMovement(player, player.startPOS, shotPosition, shotPower, team, opposition, matchDetails)
          .catch(function(err) {
            const error = `Error when resolving ball movement during the shot: ${err}`
            throw error
          })
        matchDetails.iterationLog.push('resolving ball movement whilst making a shot')
        if (shotPosition[0] !== endPosition[0] || shotPosition[1] !== endPosition[1]) {
          matchDetails.iterationLog.push(`Ball deflected to: ${endPosition}`)
        }
        if (common.isBetween(opposition.players[0].startPOS[0], endPosition[0] - 5, endPosition[0] + 5) && common.isBetween(opposition.players[0].startPOS[1], pitchHeight - 5, pitchHeight + 1)) {
          if (opposition.players[0].skill.saving > common.getRandomNumber(0, 100)) {
            matchDetails.iterationLog.push(`Shot Saved by: ${opposition.players[0].name}`)
            opposition.players[0].hasBall = true
            matchDetails.ball.Player = opposition.players[0].name
            let tempArray = opposition.players[0].startPOS
            matchDetails.ball.position = tempArray.map(x => x)
            matchDetails.ball.position[2] = 0
            opposition.intent = 'attack'
            team.intent = 'defend'
            return endPosition
          }
          await setPositions.setGoalScored(team, opposition, matchDetails)
            .catch(function(err) {
              const error = `Error when processing the goal: ${err}`
              throw error
            })
          matchDetails.iterationLog.push(`Goal Scored by: ${player.name}`)
          if (common.isEven(matchDetails.half)) {
            matchDetails.secondTeamStatistics.goals++
            return endPosition
          } else if (common.isOdd(matchDetails.half)) {
            matchDetails.kickOffTeamStatistics.goals++
            return endPosition
          }
          const error = 'You cannot supply 0 as a half'
          throw error
        } else {
          await setPositions.setGoalScored(team, opposition, matchDetails)
            .catch(function(err) {
              const error = `Error when processing the goal: ${err}`
              throw error
            })
          matchDetails.iterationLog.push(`Goal Scored by: ${player.name}`)
          if (common.isEven(matchDetails.half)) {
            matchDetails.secondTeamStatistics.goals++
            return endPosition
          } else if (common.isOdd(matchDetails.half)) {
            matchDetails.kickOffTeamStatistics.goals++
            return endPosition
          }
          const error = 'You cannot supply 0 as a half'
          throw error
        }
      } else {
        shotPosition[0] = common.getRandomNumber((pitchWidth / 2) - 30, (pitchWidth / 2) + 30)
        shotPosition[1] = common.getRandomNumber(pitchHeight - 1, pitchHeight - 20)
        let endPosition = await resolveBallMovement(player, player.startPOS, shotPosition, shotPower, team, opposition, matchDetails)
          .catch(function(err) {
            const error = `Error when resolving ball movement after a failed shot: ${err}`
            throw error
          })
        matchDetails.iterationLog.push('Shot Off Target')
        if (shotPosition[0] !== endPosition[0] || shotPosition[1] !== endPosition[1]) {
          matchDetails.iterationLog.push(`Ball deflected to: ${endPosition}`)
          return endPosition
        }
        return endPosition
      }
    } else if (shotPower > (distanceFromGoal + 49)) {
      let endPosition = await setPositions.setGoalKick(opposition, team, matchDetails)
        .catch(function(err) {
          const error = `Error when setting a goal kick after a shot has been made: ${err}`
          throw error
        })
      matchDetails.iterationLog.push(`Shot Missed, Goal Kick to: ${opposition.name}`)
      return endPosition
    } else {
      matchDetails.iterationLog.push(`Shot not hard enough by: ${opposition.name}`)
      let [shotXPos, shotYPos] = matchDetails.ball.position
      shotPosition[0] = shotXPos
      shotPosition[1] = shotYPos + shotPower
      matchDetails.iterationLog.push('resolving ball movement')
      let endPosition = await resolveBallMovement(player, player.startPOS, shotPosition, shotPower, team, opposition, matchDetails)
        .catch(function(err) {
          const error = `Error when resolving ball movement after a failed shot: ${err}`
          throw error
        })
      matchDetails.iterationLog.push('Shot Off Target')
      if (shotPosition[0] !== endPosition[0] || shotPosition[1] !== endPosition[1]) {
        matchDetails.iterationLog.push(`Ball deflected to: ${endPosition}`)
        return endPosition
      }
      return endPosition
    }
  }
}

async function throughBall(matchDetails, teammates, player) {
  let { kickOffTeam, secondTeam } = matchDetails
  const [, pitchHeight] = matchDetails.pitchSize
  let { position } = matchDetails.ball
  let closestPlayerPosition = [0, 0]
  let playersInDistance = []
  for (const teamPlayer of teammates.players) {
    if (teamPlayer.name != player.name) {
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
  let movementIterations = common.round((Math.max(Math.abs(changeInX), Math.abs(changeInY)) / common.getRandomNumber(2, 3)), 0)
  if (movementIterations < 1) {
    movementIterations = 1
  }
  let powerArray = await splitNumberIntoN(power, movementIterations)
    .catch(function(err) {
      const error = `Unable to create an array of power over N iterations: ${err}`
      throw error
    })
  let xArray = await splitNumberIntoN(changeInX, movementIterations)
    .catch(function(err) {
      const error = `Unable to create an array of x over N iterations: ${err}`
      throw error
    })
  let yArray = await splitNumberIntoN(changeInY, movementIterations)
    .catch(function(err) {
      const error = `Unable to create an array of y over N iterations: ${err}`
      throw error
    })
  let ballOverIterations = await mergeArrays(powerArray.length, position, closestPlayerPosition, xArray, yArray, powerArray)
    .catch(function(err) {
      const error = `Unable to merge arrays: ${err}`
      throw error
    })
  matchDetails.ball.ballOverIterations = ballOverIterations
  let endPosition = await resolveBallMovement(player, position, ballOverIterations[0], power, kickOffTeam, secondTeam, matchDetails)
    .catch(function(err) {
      const error = `Error when resolving the ball movement: ${err}`
      throw error
    })
  matchDetails.ball.ballOverIterations.shift()
  matchDetails.iterationLog.push('resolving ball movement')
  matchDetails.iterationLog.push(`new ball position: ${endPosition}`)
  return endPosition
}

async function resolveBallMovement(player, currentPOS, newPOS, power, team, opposition, matchDetails) {
  let deflectionPlayer
  let deflectionPosition
  let deflectionTeam
  let lineToEndPosition = await common.getBallTrajectory(currentPOS, newPOS, power).catch(function(err) {
    const error = `Error when getting the ball trajectory: ${err}`
    throw error
  })
  for (const thisPos of lineToEndPosition) {
    let playerInformation
    try {
      playerInformation = setPositions.closestPlayerToPosition(player, team, thisPos)
    } catch (err) {
      const error = `Error getting closest ${team.name} player: ${err}`
      throw error
    }
    let thisTeamPlayer = playerInformation.thePlayer
    if (thisTeamPlayer) {
      if (thisTeamPlayer && thisTeamPlayer.startPOS[0] === thisPos[0] && thisTeamPlayer.startPOS[1] === thisPos[1]) {
        if (!deflectionPlayer && thisPos[2] < thisTeamPlayer.skill.jumping && thisPos[2] > 49) {
          deflectionPlayer = thisTeamPlayer
          deflectionPosition = thisPos
          deflectionTeam = team.name
        }
      }
    } else {
      try {
        playerInformation = setPositions.closestPlayerToPosition(player, opposition, thisPos)
      } catch (err) {
        const error = `Error getting closest ${opposition.name} player: ${err}`
        throw error
      }
      let thatTeamPlayer = playerInformation.thePlayer
      if (thatTeamPlayer) {
        if (thatTeamPlayer.startPOS[0] === thisPos[0] && thatTeamPlayer.startPOS[1] === thisPos[1]) {
          if (!deflectionPlayer && thisPos[2] < thatTeamPlayer.skill.jumping && thisPos[2] < 49) {
            deflectionPlayer = thatTeamPlayer
            deflectionPosition = thisPos
            deflectionTeam = opposition.name
          }
        }
      }
    }
  }
  if (!deflectionPlayer) {
    let finalPosition = await setPositions.keepInBoundaries(newPOS, player.originPOS[1], matchDetails)
      .catch(function(err) {
        const errLine = err.stack
        const error = `Error when keeping ball in boundaries: ${err} ${errLine}`
        throw error
      })
    let sendPosition = [common.round(finalPosition[0], 2), common.round(finalPosition[1], 2)]
    return sendPosition
  }
  let newPosition = await resolveDeflection(power, currentPOS, deflectionPosition, deflectionPlayer, deflectionTeam, matchDetails).catch(function(err) {
    const error = `Error when resolving the deflection: ${err}`
    throw error
  })
  matchDetails.iterationLog.push('Ball deflected')
  let sendPosition = [common.round(newPosition[0], 2), common.round(newPosition[1], 2)]
  return sendPosition
}

async function resolveDeflection(power, currentPOS, deflectionPosition, deflectionPlayer, deflectionTeam, matchDetails) {
  let { kickOffTeam, secondTeam } = matchDetails
  let xMovement = (currentPOS[0] - deflectionPosition[0]) ** 2
  let yMovement = (currentPOS[1] - deflectionPosition[1]) ** 2
  let movementDistance = Math.sqrt(xMovement + yMovement)
  let newPower = power - movementDistance
  let tempPosition = ['', '']
  if (newPower < 75) {
    deflectionPlayer.hasBall = true
    if (deflectionPlayer.offside == true) {
      matchDetails.iterationLog.push(deflectionPlayer.name, 'is offside. Set piece given')
      let team = (deflectionTeam.name == kickOffTeam.name) ? kickOffTeam : secondTeam
      let opposition = (team.name == kickOffTeam.name) ? secondTeam : kickOffTeam
      await setPositions.setSetpiece(matchDetails, team, opposition)
        .catch(function(err) {
          const error = `Error whilst setting up the set piece: ${err}`
          throw error
        })
      return matchDetails.ball.position
    }
    matchDetails.ball.ballOverIterations = []
    matchDetails.ball.Player = deflectionPlayer.name
    matchDetails.ball.withPlayer = true
    matchDetails.ball.withTeam = deflectionTeam
    return deflectionPosition
  }
  if (matchDetails.ball.direction === 'east' || matchDetails.ball.direction === 'northeast' || matchDetails.ball.direction === 'southeast') {
    if (matchDetails.ball.direction === 'east') {
      tempPosition[1] = common.getRandomNumber(deflectionPosition[1] - 3, deflectionPosition[1] + 3)
    }
    tempPosition[0] = deflectionPosition[0] - (newPower / 2)
  } else if (matchDetails.ball.direction === 'west' || matchDetails.ball.direction === 'northwest' || matchDetails.ball.direction === 'southwest') {
    if (matchDetails.ball.direction === 'west') {
      tempPosition[1] = common.getRandomNumber(deflectionPosition[1] - 3, deflectionPosition[1] + 3)
    }
    tempPosition[0] = deflectionPosition[0] + (newPower / 2)
  }
  if (matchDetails.ball.direction === 'north' || matchDetails.ball.direction === 'northeast' || matchDetails.ball.direction === 'northwest') {
    if (matchDetails.ball.direction === 'north') {
      tempPosition[0] = common.getRandomNumber(deflectionPosition[0] - 3, deflectionPosition[0] + 3)
    }
    tempPosition[1] = deflectionPosition[1] + (newPower / 2)
  } else if (matchDetails.ball.direction === 'south' || matchDetails.ball.direction === 'southeast' || matchDetails.ball.direction === 'southwest') {
    if (matchDetails.ball.direction === 'south') {
      tempPosition[0] = common.getRandomNumber(deflectionPosition[0] - 3, deflectionPosition[0] + 3)
    }
    tempPosition[1] = deflectionPosition[1] - (newPower / 2)
  }
  if (matchDetails.ball.direction === 'wait') {
    tempPosition[0] = common.getRandomNumber(-newPower / 2, newPower / 2)
    tempPosition[1] = common.getRandomNumber(-newPower / 2, newPower / 2)
  }
  let finalPosition = setPositions.keepInBoundaries(tempPosition, deflectionPlayer.originPOS[1], matchDetails)
    .catch(function(err) {
      const errLine = err.stack
      const error = `Error when keeping ball in boundaries: ${err} ${errLine}`
      throw error
    })
  return finalPosition
}

function getBallDirection(matchDetails, nextPOS) {
  let currentPOS = matchDetails.ball.position
  let movementX = currentPOS[0] - nextPOS[0]
  let movementY = currentPOS[1] - nextPOS[1]
  if (movementX === 0) {
    if (movementY === 0) {
      matchDetails.ball.direction = 'wait'
    } else if (movementY < 0) {
      matchDetails.ball.direction = 'south'
    } else if (movementY > 0) {
      matchDetails.ball.direction = 'north'
    }
  } else if (movementY === 0) {
    if (movementX < 0) {
      matchDetails.ball.direction = 'east'
    } else if (movementX > 0) {
      matchDetails.ball.direction = 'west'
    }
  } else if (movementX < 0 && movementY < 0) {
    matchDetails.ball.direction = 'southeast'
  } else if (movementX > 0 && movementY > 0) {
    matchDetails.ball.direction = 'northwest'
  } else if (movementX > 0 && movementY < 0) {
    matchDetails.ball.direction = 'southwest'
  } else if (movementX < 0 && movementY > 0) {
    matchDetails.ball.direction = 'northeast'
  }
}

async function ballPassed(matchDetails, teammates, player) {
  let { kickOffTeam, secondTeam } = matchDetails
  const [, pitchHeight] = matchDetails.pitchSize
  let { position } = matchDetails.ball
  let closestPlayerPosition = [0, 0]
  let playersInDistance = []
  for (const teamPlayer of teammates.players) {
    if (teamPlayer.name != player.name) {
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
  playersInDistance.sort(function(a, b) {
    return a.proximity - b.proximity
  })
  let targetPlayer = playersInDistance[common.getRandomNumber(0, (playersInDistance.length - 1))]
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
  let movementIterations = common.round((Math.max(Math.abs(changeInX), Math.abs(changeInY)) / common.getRandomNumber(2, 3)), 0)
  if (movementIterations < 1) {
    movementIterations = 1
  }
  let powerArray = await splitNumberIntoN(power, movementIterations)
    .catch(function(err) {
      const error = `Unable to create an array of power over N iterations: ${err}`
      throw error
    })
  let xArray = await splitNumberIntoN(changeInX, movementIterations)
    .catch(function(err) {
      const error = `Unable to create an array of x over N iterations: ${err}`
      throw error
    })
  let yArray = await splitNumberIntoN(changeInY, movementIterations)
    .catch(function(err) {
      const error = `Unable to create an array of y over N iterations: ${err}`
      throw error
    })
  let ballOverIterations = await mergeArrays(powerArray.length, position, closestPlayerPosition, xArray, yArray, powerArray)
    .catch(function(err) {
      const error = `Unable to merge arrays: ${err}`
      throw error
    })
  matchDetails.ball.ballOverIterations = ballOverIterations
  let endPosition = await resolveBallMovement(player, position, ballOverIterations[0], power, kickOffTeam, secondTeam, matchDetails)
    .catch(function(err) {
      const error = `Error when resolving the ball movement: ${err}`
      throw error
    })
  matchDetails.ball.ballOverIterations.shift()
  return endPosition
}

async function splitNumberIntoN(number, n) {
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

async function mergeArrays(arrayLength, oldPos, newPos, array1, array2, array3) {
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
  moveBall
}
