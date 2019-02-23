const common = require(`../lib/common`)
const setVariables = require(`../lib/setVariables`)

function setCornerPositions(team, opposition, side, matchDetails) {
  removeBall(team)
  removeBall(opposition)
  const [matchWidth, matchHeight] = matchDetails.pitchSize
  if (team.players[0].originPOS[1] > matchHeight / 2) {
    if (side === `left`) {
      team.players[1].startPOS = [0, 0]
      team.players[4].startPOS = [10, 20]
      team.players[5].startPOS = [60, 40]
      team.players[8].startPOS = [50, 70]
      team.players[9].startPOS = [80, 50]
      team.players[10].startPOS = [60, 80]
      opposition.players[5].startPOS = [15, 25]
      opposition.players[6].startPOS = [40, 35]
      opposition.players[7].startPOS = [60, 35]
      opposition.players[8].startPOS = [60, 70]
      matchDetails.ball.position = [0, 0, 0]
      team.players[1].hasBall = true
      matchDetails.ball.ballOverIterations = []
      matchDetails.ball.withPlayer = true
      matchDetails.ball.Player = team.players[1].name
      matchDetails.ball.withTeam = team.name
    } else {
      team.players[1].startPOS = [matchWidth, 0]
      team.players[4].startPOS = [matchWidth - 10, 20]
      team.players[5].startPOS = [matchWidth - 60, 40]
      team.players[8].startPOS = [matchWidth - 50, 70]
      team.players[9].startPOS = [matchWidth - 80, 50]
      team.players[10].startPOS = [matchWidth - 60, 80]
      opposition.players[5].startPOS = [matchWidth - 15, 25]
      opposition.players[6].startPOS = [matchWidth - 40, 35]
      opposition.players[7].startPOS = [matchWidth - 60, 35]
      opposition.players[8].startPOS = [matchWidth - 60, 70]
      matchDetails.ball.position = [matchWidth, 0, 0]
      team.players[1].hasBall = true
      matchDetails.ball.ballOverIterations = []
      matchDetails.ball.withPlayer = true
      matchDetails.ball.Player = team.players[1].name
      matchDetails.ball.withTeam = team.name
    }
  } else if (side === `left`) {
    team.players[1].startPOS = [0, matchHeight]
    team.players[4].startPOS = [10, matchHeight - 20]
    team.players[5].startPOS = [60, matchHeight - 40]
    team.players[8].startPOS = [50, matchHeight - 70]
    team.players[9].startPOS = [80, matchHeight - 50]
    team.players[10].startPOS = [60, matchHeight - 80]
    opposition.players[5].startPOS = [15, matchHeight - 25]
    opposition.players[6].startPOS = [40, matchHeight - 35]
    opposition.players[7].startPOS = [60, matchHeight - 35]
    opposition.players[8].startPOS = [60, matchHeight - 70]
    matchDetails.ball.position = [0, matchHeight, 0]
    team.players[1].hasBall = true
    matchDetails.ball.ballOverIterations = []
    matchDetails.ball.withPlayer = true
    matchDetails.ball.Player = team.players[1].name
    matchDetails.ball.withTeam = team.name
  } else {
    team.players[1].startPOS = [matchWidth, matchHeight]
    team.players[4].startPOS = [matchWidth - 10, matchHeight - 20]
    team.players[5].startPOS = [matchWidth - 60, matchHeight - 40]
    team.players[8].startPOS = [matchWidth - 50, matchHeight - 70]
    team.players[9].startPOS = [matchWidth - 80, matchHeight - 50]
    team.players[10].startPOS = [matchWidth - 60, matchHeight - 80]
    opposition.players[5].startPOS = [matchWidth - 15, matchHeight - 25]
    opposition.players[6].startPOS = [matchWidth - 40, matchHeight - 35]
    opposition.players[7].startPOS = [matchWidth - 60, matchHeight - 35]
    opposition.players[8].startPOS = [matchWidth - 60, matchHeight - 70]
    matchDetails.ball.position = [matchWidth, matchHeight, 0]
    team.players[1].hasBall = true
    matchDetails.ball.ballOverIterations = []
    matchDetails.ball.withPlayer = true
    matchDetails.ball.Player = team.players[1].name
    matchDetails.ball.withTeam = team.name
  }
  return matchDetails.ball.position
}

function setThrowIn(team, opposition, side, place, matchDetails) {
  removeBall(team)
  removeBall(opposition)
  const [matchWidth, matchHeight] = matchDetails.pitchSize
  let newPlaceB = ((place - 30) < 0) ? 30 : place
  place = newPlaceB
  let newPlaceT = ((place + 10) > (matchHeight + 1)) ? (matchHeight - 10) : place
  place = newPlaceT
  let movement = team.players[5].originPOS[1] - place
  let oppMovement = 0 - movement
  if (side === `left`) {
    setPlayerPositions(matchDetails, team, movement)
    team.players[5].startPOS = [0, place]
    team.players[8].startPOS = [15, place]
    team.players[7].startPOS = [10, place + 10]
    team.players[9].startPOS = [10, place - 10]
    matchDetails.ball.position = [0, place, 0]
    team.players[5].startPOS = matchDetails.ball.position.map(x => x)
    team.players[5].startPOS.pop()
    team.players[5].hasBall = true
    matchDetails.ball.ballOverIterations = []
    matchDetails.ball.withPlayer = true
    matchDetails.ball.Player = team.players[5].name
    matchDetails.ball.withTeam = team.name
    setPlayerPositions(matchDetails, opposition, oppMovement)
    opposition.players[5].startPOS = [20, place]
    opposition.players[7].startPOS = [30, place + 5]
    opposition.players[8].startPOS = [25, place - 15]
    opposition.players[9].startPOS = [10, place - 30]
    return matchDetails.ball.position
  }
  setPlayerPositions(matchDetails, team, movement)
  team.players[5].startPOS = [matchWidth, place]
  team.players[8].startPOS = [matchWidth - 15, place]
  team.players[7].startPOS = [matchWidth - 10, place + 10]
  team.players[9].startPOS = [matchWidth - 10, place - 10]
  matchDetails.ball.position = [matchWidth, place, 0]
  team.players[5].startPOS = matchDetails.ball.position.map(x => x)
  team.players[5].startPOS.pop()
  team.players[5].hasBall = true
  matchDetails.ball.ballOverIterations = []
  matchDetails.ball.withPlayer = true
  matchDetails.ball.Player = team.players[5].name
  matchDetails.ball.withTeam = team.name
  setPlayerPositions(matchDetails, opposition, oppMovement)
  opposition.players[5].startPOS = [matchWidth - 20, place]
  opposition.players[7].startPOS = [matchWidth - 30, place + 5]
  opposition.players[8].startPOS = [matchWidth - 25, place - 15]
  opposition.players[9].startPOS = [matchWidth - 10, place - 30]
  return matchDetails.ball.position
}

function setGoalKick(team, opposition, matchDetails) {
  removeBall(team)
  removeBall(opposition)
  const [matchWidth, matchHeight] = matchDetails.pitchSize
  if (team.players[0].originPOS[1] > matchHeight / 2) {
    setPlayerPositions(matchDetails, team, -80)
    setVariables.resetPlayerPositions(opposition)
    matchDetails.ball.position = [matchWidth / 2, matchHeight - 20, 0]
    team.players[0].startPOS = matchDetails.ball.position.map(x => x)
    team.players[0].startPOS.pop()
    team.players[0].hasBall = true
    matchDetails.ball.ballOverIterations = []
    matchDetails.ball.withPlayer = true
    matchDetails.ball.Player = team.players[0].name
    matchDetails.ball.withTeam = team.name
    return matchDetails.ball.position
  }
  setPlayerPositions(matchDetails, team, 80)
  setVariables.resetPlayerPositions(opposition)
  matchDetails.ball.position = [matchWidth / 2, 20, 0]
  team.players[0].startPOS = matchDetails.ball.position.map(x => x)
  team.players[0].startPOS.pop()
  team.players[0].hasBall = true
  matchDetails.ball.ballOverIterations = []
  matchDetails.ball.withPlayer = true
  matchDetails.ball.Player = team.players[0].name
  matchDetails.ball.withTeam = team.name
  return matchDetails.ball.position
}

function closestPlayerToPosition(player, team, position) {
  let currentDifference = 100000
  let playerInformation = {
    'thePlayer': ``,
    'proxPos': [``, ``],
    'proxToBall': ''
  }
  for (const thisPlayer of team.players) {
    if (player.name !== thisPlayer.name) {
      let ballToPlayerX = thisPlayer.startPOS[0] - position[0]
      let ballToPlayerY = thisPlayer.startPOS[1] - position[1]
      let proximityToBall = Math.abs(ballToPlayerX + ballToPlayerY)
      if (proximityToBall < currentDifference) {
        playerInformation.thePlayer = thisPlayer
        playerInformation.proximity = [ballToPlayerX, ballToPlayerY]
        playerInformation.proxToBall = proximityToBall
        currentDifference = proximityToBall
      }
    }
  }
  return playerInformation
}

function setSetpiece(matchDetails, team, opposition) {
  removeBall(team)
  removeBall(opposition)
  const [matchWidth, matchHeight] = matchDetails.pitchSize
  let ballPosition = matchDetails.ball.position
  let ballXpos1 = common.isBetween(ballPosition[0], (matchWidth / 4) - 5, matchWidth - (matchWidth / 4) + 5)
  let ballYpos1 = common.isBetween(ballPosition[1], 0, (matchHeight / 6) - 5)
  let ballXpos2 = common.isBetween(ballPosition[0], (matchWidth / 4) - 5, matchWidth - (matchWidth / 4) + 5)
  let ballYpos2 = common.isBetween(ballPosition[1], matchHeight - (matchHeight / 6) + 5, matchHeight)
  if (team.players[0].originPOS[1] > matchHeight / 2) {
    if (ballXpos1 && ballYpos1) {
      setPenalty(team, opposition, `top`, matchDetails)
      matchDetails.iterationLog.push(`penalty to: ${team.name}`)
      if (team.name === matchDetails.kickOffTeam.name) {
        matchDetails.kickOffTeamStatistics.penalties++
      } else {
        matchDetails.secondTeamStatistics.penalties++
      }
    } else {
      setFreekick(ballPosition, team, opposition, `top`, matchDetails)
      matchDetails.iterationLog.push(`freekick to: ${team.name}`)
      if (team.name === matchDetails.kickOffTeam.name) {
        matchDetails.kickOffTeamStatistics.freekicks++
      } else {
        matchDetails.secondTeamStatistics.freekicks++
      }
    }
  } else if (ballXpos2 && ballYpos2) {
    setPenalty(team, opposition, `bottom`, matchDetails)
    matchDetails.iterationLog.push(`penalty to: ${team.name}`)
    if (team.name === matchDetails.kickOffTeam.name) {
      matchDetails.kickOffTeamStatistics.penalties++
    } else {
      matchDetails.secondTeamStatistics.penalties++
    }
  } else {
    setFreekick(ballPosition, team, opposition, `bottom`, matchDetails)
    matchDetails.iterationLog.push(`freekick to: ${team.name}`)
    if (team.name === matchDetails.kickOffTeam.name) {
      matchDetails.kickOffTeamStatistics.freekicks++
    } else {
      matchDetails.secondTeamStatistics.freekicks++
    }
  }
}

function setPenalty(team, opposition, side, matchDetails) {
  removeBall(team)
  removeBall(opposition)
  const [matchWidth, matchHeight] = matchDetails.pitchSize
  let shootArray
  let tempArray
  if (side === `top`) {
    tempArray = [matchWidth / 2, matchHeight / 6]
    shootArray = [matchWidth / 2, 60]
  } else {
    tempArray = [matchWidth / 2, matchHeight - (matchHeight / 6)]
    shootArray = [matchWidth / 2, matchHeight - 60]
  }
  matchDetails.ball.position = shootArray.map(x => x)
  matchDetails.ball.position[2] = 0
  matchDetails.ball.direction = (side === `top`) ? `north` : `south`
  matchDetails.ball.position[1] += (side === `top`) ? -2 : 2
  opposition.players[0].startPOS = opposition.players[0].originPOS.map(x => x)
  let oppxpos = -10
  let teamxpos = -9
  for (const num of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    opposition.players[num].startPOS = tempArray.map(x => x)
    opposition.players[num].startPOS[0] += oppxpos
    team.players[num].startPOS = tempArray.map(x => x)
    team.players[num].startPOS[0] += teamxpos
    oppxpos += 2
    teamxpos += 2
  }
  team.players[10].startPOS = shootArray.map(x => x)
  team.players[10].hasBall = true
  matchDetails.ball.ballOverIterations = []
  matchDetails.ball.Player = team.players[10].name
  matchDetails.ball.withPlayer = true
  matchDetails.ball.withTeam = team.name
  team.intent = `attack`
  opposition.intent = `defend`
}

function setFreekick(ballPosition, team, opposition, side, matchDetails) {
  removeBall(team)
  removeBall(opposition)
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

function setGoalScored(scoringTeam, conceedingTeam, matchDetails) {
  removeBall(scoringTeam)
  removeBall(conceedingTeam)
  const [matchWidth, matchHeight] = matchDetails.pitchSize
  setVariables.resetPlayerPositions(scoringTeam)
  setVariables.resetPlayerPositions(conceedingTeam)
  let playerWithBall = common.getRandomNumber(9, 10)
  let waitingPlayer
  if (playerWithBall === 9) {
    waitingPlayer = 10
  } else {
    waitingPlayer = 9
  }
  matchDetails.ball.position = [matchWidth / 2, matchHeight / 2, 0]
  conceedingTeam.players[playerWithBall].startPOS = matchDetails.ball.position.map(x => x)
  conceedingTeam.players[playerWithBall].startPOS.pop()
  conceedingTeam.players[playerWithBall].hasBall = true
  matchDetails.ball.ballOverIterations = []
  matchDetails.ball.withPlayer = true
  matchDetails.ball.Player = conceedingTeam.players[playerWithBall].name
  matchDetails.ball.withTeam = conceedingTeam.name
  let tempPosition = [matchDetails.ball.position[0] + 20, matchDetails.ball.position[1]]
  conceedingTeam.players[waitingPlayer].startPOS = tempPosition.map(x => x)
  conceedingTeam.intent = `attack`
  scoringTeam.intent = `defend`
}

function keepInBoundaries(ballIntended, kickersSide, matchDetails) {
  let { kickOffTeam, secondTeam } = matchDetails
  const [matchWidth, matchHeight] = matchDetails.pitchSize
  let newBallIntended
  if (ballIntended[0] < 0 || ballIntended[0] > matchWidth || ballIntended[1] < 0 || ballIntended[1] > matchHeight) {
    if (ballIntended[0] < 0) {
      if (kickersSide > matchHeight / 2) {
        let newBallIntended = setThrowIn(kickOffTeam, secondTeam, `left`, ballIntended[1], matchDetails)
        matchDetails.iterationLog.push(`Throw in to - ${kickOffTeam.name}`)
        return newBallIntended
      }
      let newBallIntended = setThrowIn(secondTeam, kickOffTeam, `left`, ballIntended[1], matchDetails)
      matchDetails.iterationLog.push(`Throw in to - ${secondTeam.name}`)
      return newBallIntended
    } else if (ballIntended[0] > matchWidth) {
      if (kickersSide > matchHeight / 2) {
        let newBallIntended = setThrowIn(kickOffTeam, secondTeam, `right`, ballIntended[1], matchDetails)
        matchDetails.iterationLog.push(`Throw in to - ${kickOffTeam.name}`)
        return newBallIntended
      }
      let newBallIntended = setThrowIn(secondTeam, kickOffTeam, `right`, ballIntended[1], matchDetails)
      matchDetails.iterationLog.push(`Throw in to - ${secondTeam.name}`)
      return newBallIntended
    }
    if (ballIntended[1] < 0) {
      let side
      if (ballIntended[0] > matchWidth / 2) {
        side = `right`
      } else {
        side = `left`
      }
      if (kickersSide > matchHeight / 2) {
        let newBallIntended = setGoalKick(kickOffTeam, secondTeam, matchDetails)
        matchDetails.iterationLog.push(`Goal Kick to - ${kickOffTeam.name}`)
        return newBallIntended
      }
      let newBallIntended = setCornerPositions(secondTeam, kickOffTeam, side, matchDetails)
      matchDetails.iterationLog.push(`Corner to - ${secondTeam.name}`)
      matchDetails.secondTeamStatistics.corners++
      return newBallIntended
    } else if (ballIntended[1] > matchHeight) {
      let side
      if (ballIntended[0] > matchWidth / 2) {
        side = `right`
      } else {
        side = `left`
      }
      if (kickersSide > matchHeight / 2) {
        let newBallIntended = setCornerPositions(kickOffTeam, secondTeam, side, matchDetails)
        matchDetails.iterationLog.push(`Corner to - ${kickOffTeam.name}`)
        matchDetails.kickOffTeamStatistics.corners++
        return newBallIntended
      }
      let newBallIntended = setGoalKick(secondTeam, kickOffTeam, matchDetails)
      matchDetails.iterationLog.push(`Goal Kick to - ${secondTeam.name}`)
      return newBallIntended
    }
  } else if (common.isBetween(ballIntended[0], (matchWidth / 2) - 20, (matchWidth / 2) + 20)) {
    let playerInformationA = closestPlayerToPosition(`none`, kickOffTeam, ballIntended)
    let playerInformationB = closestPlayerToPosition(`none`, secondTeam, ballIntended)
    let teamAPlayer = playerInformationA.thePlayer
    let teamBPlayer = playerInformationB.thePlayer
    if (teamAPlayer && teamAPlayer[0] === ballIntended[0] && teamAPlayer[1] === ballIntended[1]) {
      teamAPlayer.hasBall = true
      matchDetails.ball.ballOverIterations = []
      matchDetails.ball.Player = teamAPlayer.name
      matchDetails.ball.withPlayer = true
      matchDetails.ball.withTeam = kickOffTeam.name
    } else if (teamBPlayer && teamBPlayer[0] === ballIntended[0] && teamBPlayer[1] === ballIntended[1]) {
      teamBPlayer.hasBall = true
      matchDetails.ball.ballOverIterations = []
      matchDetails.ball.Player = teamBPlayer.name
      matchDetails.ball.withPlayer = true
      matchDetails.ball.withTeam = secondTeam.name
    } else if (ballIntended[1] > matchHeight) {
      newBallIntended = [matchWidth / 2, matchHeight / 2]
      if (matchDetails.half === 1) {
        setGoalScored(kickOffTeam, secondTeam, matchDetails)
        matchDetails.kickOffTeamStatistics.goals++
        return newBallIntended
      }
      setGoalScored(secondTeam, kickOffTeam, matchDetails)
      matchDetails.secondTeamStatistics.goals++
      return newBallIntended
    } else if (ballIntended[1] < 0) {
      newBallIntended = [matchWidth / 2, matchHeight / 2]
      if (matchDetails.half === 1) {
        setGoalScored(secondTeam, kickOffTeam, matchDetails)
        matchDetails.secondTeamStatistics.goals++
        return newBallIntended
      }
      setGoalScored(kickOffTeam, secondTeam, matchDetails)
      matchDetails.kickOffTeamStatistics.goals++
      return newBallIntended
    }
    return ballIntended
  }
  return ballIntended
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
  try {
    let xPos = origin[0] - current[0]
    let yPos = origin[1] - current[1]
    let moveToFormation = []
    moveToFormation.push(xPos)
    moveToFormation.push(yPos)
    return moveToFormation
  } catch (error) {
    throw new Error(error)
  }
}

function switchSide(team, matchDetails) {
  if (!team) {
    throw new Error(`No Team supplied to switch side`)
  }
  for (const thisPlayer of team.players) {
    if (!thisPlayer.originPOS) {
      throw new Error(`Each player must have an origin position set`)
    }
    thisPlayer.originPOS[1] = matchDetails.pitchSize[1] - thisPlayer.originPOS[1]
    let tempArray = thisPlayer.originPOS
    thisPlayer.startPOS = tempArray.map(x => x)
    thisPlayer.relativePOS = tempArray.map(x => x)
    if (thisPlayer.fitness < 51) {
      thisPlayer.fitness = common.round((thisPlayer.fitness + 50), 2)
    } else {
      thisPlayer.fitness = 100
    }
  }
  return team
}

function setRelativePosition(player, team, matchDetails) {
  let tempArray = parseInt(player.startPOS[1], 10) - parseInt(player.originPOS[1], 10)
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
      thisPlayer.relativePOS = originArray.map(x => x)
    }
  }
}

function removeBall(thisTeam) {
  thisTeam.players[0].hasBall = false
  thisTeam.players[1].hasBall = false
  thisTeam.players[2].hasBall = false
  thisTeam.players[3].hasBall = false
  thisTeam.players[4].hasBall = false
  thisTeam.players[5].hasBall = false
  thisTeam.players[6].hasBall = false
  thisTeam.players[7].hasBall = false
  thisTeam.players[8].hasBall = false
  thisTeam.players[9].hasBall = false
  thisTeam.players[10].hasBall = false
}

module.exports = {
  setCornerPositions,
  setPlayerPositions,
  keepInBoundaries,
  setThrowIn,
  setGoalKick,
  closestPlayerToPosition,
  setSetpiece,
  setPenalty,
  setFreekick,
  setGoalScored,
  formationCheck,
  switchSide,
  setRelativePosition
}
