const common = require(`../lib/common`)

function setTopFreekick(matchDetails) {
  common.removeBallFromAllPlayers(matchDetails)
  let { kickOffTeam, secondTeam } = matchDetails
  let [, pitchHeight] = matchDetails.pitchSize
  let [, ballY] = matchDetails.ball.position
  let attack = (kickOffTeam.players[0].originPOS[1] < pitchHeight / 2) ? kickOffTeam : secondTeam
  let defence = (kickOffTeam.players[0].originPOS[1] < pitchHeight / 2) ? secondTeam : kickOffTeam
  let hundredToHalfway = common.isBetween(ballY, 100, (pitchHeight / 2) + 1)
  let halfwayToLastQtr = common.isBetween(ballY, pitchHeight / 2, pitchHeight - (pitchHeight / 4))
  let upperFinalQtr = common.isBetween(ballY, pitchHeight - (pitchHeight / 4), pitchHeight - (pitchHeight / 6) - 5)
  let lowerFinalQtr = common.isBetween(ballY, pitchHeight - (pitchHeight / 6) - 5, pitchHeight)

  if (ballY < 101) return setTopOneHundredYPos(matchDetails, attack, defence)
  if (hundredToHalfway) return setTopOneHundredToHalfwayYPos(matchDetails, attack, defence)
  if (halfwayToLastQtr) return setTopHalfwayToBottomQtrYPos(matchDetails, attack, defence)
  if (upperFinalQtr) return setTopBottomQtrCentreYPos(matchDetails, attack, defence)
  if (lowerFinalQtr) return setTopLowerFinalQtrBylinePos(matchDetails, attack, defence)
}

function setBottomFreekick(matchDetails) {
  common.removeBallFromAllPlayers(matchDetails)
  let { kickOffTeam, secondTeam } = matchDetails
  let [, pitchHeight] = matchDetails.pitchSize
  let [, ballY] = matchDetails.ball.position
  let attack = (kickOffTeam.players[0].originPOS[1] > pitchHeight / 2) ? kickOffTeam : secondTeam
  let defence = (kickOffTeam.players[0].originPOS[1] > pitchHeight / 2) ? secondTeam : kickOffTeam
  let hundredToHalfway = common.isBetween(ballY, (pitchHeight / 2) - 1, pitchHeight - 100)
  let halfwayToLastQtr = common.isBetween(ballY, pitchHeight / 4, pitchHeight / 2)
  let upperFinalQtr = common.isBetween(ballY, (pitchHeight / 6) - 5, pitchHeight / 4)
  let lowerFinalQtr = common.isBetween(ballY, 0, (pitchHeight / 6) - 5)

  if (ballY > pitchHeight - 100) return setBottomOneHundredYPos(matchDetails, attack, defence)
  if (hundredToHalfway) return setBottomOneHundredToHalfwayYPos(matchDetails, attack, defence)
  if (halfwayToLastQtr) return setBottomHalfwayToTopQtrYPos(matchDetails, attack, defence)
  if (upperFinalQtr) return setBottomUpperQtrCentreYPos(matchDetails, attack, defence)
  if (lowerFinalQtr) return setBottomLowerFinalQtrBylinePos(matchDetails, attack, defence)
}

function setTopOneHundredYPos(matchDetails, attack, defence) {
  attack.players[0].hasBall = true
  let { ball } = matchDetails
  ball.lastTouch = attack.players[0].name
  ball.Player = attack.players[0].playerID
  ball.withTeam = attack.teamID
  ball.direction = 'south'
  for (let player of attack.players) {
    if (player.position == 'GK') player.currentPOS = matchDetails.ball.position.map(x => x)
    if (player.position != 'GK') player.currentPOS = player.originPOS.map(x => x)
  }
  for (let player of defence.players) {
    if (player.position == 'GK') player.currentPOS = player.originPOS.map(x => x)
    if (player.position != 'GK') player.currentPOS = [player.originPOS[0], common.upToMin(player.originPOS[1] - 100, 0)]
  }
  return matchDetails
}

function setBottomOneHundredYPos(matchDetails, attack, defence) {
  attack.players[0].hasBall = true
  let { ball, pitchSize } = matchDetails
  let [, pitchHeight] = pitchSize
  ball.lastTouch = attack.players[0].name
  ball.Player = attack.players[0].playerID
  ball.withTeam = attack.teamID
  ball.direction = 'north'
  for (let player of attack.players) {
    if (player.position == 'GK') player.currentPOS = matchDetails.ball.position.map(x => x)
    if (player.position != 'GK') player.currentPOS = player.originPOS.map(x => x)
  }
  for (let player of defence.players) {
    if (player.position == 'GK') player.currentPOS = player.originPOS.map(x => x)
    if (player.position != 'GK') {
      player.currentPOS = [player.originPOS[0], common.upToMax(player.originPOS[1] + 100, pitchHeight)]
    }
  }
  return matchDetails
}

function setTopOneHundredToHalfwayYPos(matchDetails, attack, defence) {
  let { ball } = matchDetails
  let [, pitchHeight] = matchDetails.pitchSize
  let goalieToKick = common.isBetween(ball.position[1], 0, (pitchHeight * 0.25) + 1)
  let kickPlayer = (goalieToKick) ? attack.players[0] : attack.players[3]
  kickPlayer.hasBall = true
  ball.lastTouch = kickPlayer.name
  ball.Player = kickPlayer.playerID
  ball.withTeam = attack.teamID
  ball.direction = 'south'
  for (let player of attack.players) {
    if (kickPlayer.position == 'GK') {
      if (player.position == 'GK') player.currentPOS = ball.position.map(x => x)
      if (player.name != kickPlayer.name) {
        let newYPOS = common.upToMax(player.originPOS[1] + 300, pitchHeight * 0.9)
        player.currentPOS = [player.originPOS[0], parseInt(newYPOS, 10)]
      }
    } else {
      let newYPOS = player.originPOS[1] + (ball.position[1] - player.originPOS[1]) + 300
      if (player.name == kickPlayer.name) player.currentPOS = ball.position.map(x => x)
      else if (player.position == 'GK') {
        let maxYPOSCheck = parseInt(common.upToMax(newYPOS, pitchHeight * 0.25), 10)
        player.currentPOS = [player.originPOS[0], maxYPOSCheck]
      } else if (['CB', 'LB', 'RB'].includes(player.position)) {
        let maxYPOSCheck = parseInt(common.upToMax(newYPOS, pitchHeight * 0.5), 10)
        player.currentPOS = [player.originPOS[0], maxYPOSCheck]
      } else if (['CM', 'LM', 'RM'].includes(player.position)) {
        let maxYPOSCheck = parseInt(common.upToMax(newYPOS, pitchHeight * 0.75), 10)
        player.currentPOS = [player.originPOS[0], maxYPOSCheck]
      } else {
        let maxYPOSCheck = parseInt(common.upToMax(newYPOS, pitchHeight * 0.9), 10)
        player.currentPOS = [player.originPOS[0], maxYPOSCheck]
      }
    }
  }
  for (let player of defence.players) {
    if (kickPlayer.position == 'GK') {
      if (player.position == 'GK') player.currentPOS = player.originPOS.map(x => x)
      if (player.position != 'GK') {
        player.currentPOS = [player.originPOS[0], common.upToMin(player.originPOS[1] - 100, 0)]
      }
    } else if (['GK', 'CB', 'LB', 'RB'].includes(player.position)) player.currentPOS = player.originPOS.map(x => x)
    else if (['CM', 'LM', 'RM'].includes(player.position)) {
      player.currentPOS = [player.originPOS[0], parseInt((pitchHeight * 0.75) + 5, 10)]
    } else {
      player.currentPOS = [player.originPOS[0], parseInt(pitchHeight * 0.5, 10)]
    }
  }
  return matchDetails
}

function setBottomOneHundredToHalfwayYPos(matchDetails, attack, defence) {
  let { ball } = matchDetails
  let [, pitchHeight] = matchDetails.pitchSize
  let goalieToKick = common.isBetween(ball.position[1], (pitchHeight * 0.75) + 1, pitchHeight)
  let kickPlayer = (goalieToKick) ? attack.players[0] : attack.players[3]
  kickPlayer.hasBall = true
  ball.lastTouch = kickPlayer.name
  ball.Player = kickPlayer.playerID
  ball.withTeam = attack.teamID
  ball.direction = 'north'
  for (let player of attack.players) {
    if (kickPlayer.position == 'GK') {
      if (player.position == 'GK') player.currentPOS = ball.position.map(x => x)
      if (player.name != kickPlayer.name) {
        let newYPOS = common.upToMin(player.originPOS[1] - 300, pitchHeight * 0.1)
        player.currentPOS = [player.originPOS[0], parseInt(newYPOS, 10)]
      }
    } else {
      let newYPOS = player.originPOS[1] + (ball.position[1] - player.originPOS[1]) - 300
      if (player.name == kickPlayer.name) player.currentPOS = ball.position.map(x => x)
      else if (player.position == 'GK') {
        let maxYPOSCheck = parseInt(common.upToMin(newYPOS, pitchHeight * 0.75), 10)
        player.currentPOS = [player.originPOS[0], maxYPOSCheck]
      } else if (['CB', 'LB', 'RB'].includes(player.position)) {
        let maxYPOSCheck = parseInt(common.upToMin(newYPOS, pitchHeight * 0.5), 10)
        player.currentPOS = [player.originPOS[0], maxYPOSCheck]
      } else if (['CM', 'LM', 'RM'].includes(player.position)) {
        let maxYPOSCheck = parseInt(common.upToMin(newYPOS, pitchHeight * 0.25), 10)
        player.currentPOS = [player.originPOS[0], maxYPOSCheck]
      } else {
        let maxYPOSCheck = parseInt(common.upToMin(newYPOS, pitchHeight * 0.1), 10)
        player.currentPOS = [player.originPOS[0], maxYPOSCheck]
      }
    }
  }
  for (let player of defence.players) {
    if (kickPlayer.position == 'GK') {
      if (player.position == 'GK') player.currentPOS = player.originPOS.map(x => x)
      if (player.position != 'GK') {
        let newYPOS = common.upToMax(player.originPOS[1] + 100, pitchHeight)
        player.currentPOS = [player.originPOS[0], parseInt(newYPOS, 10)]
      }
    } else if (['GK', 'CB', 'LB', 'RB'].includes(player.position)) player.currentPOS = player.originPOS.map(x => x)
    else if (['CM', 'LM', 'RM'].includes(player.position)) {
      player.currentPOS = [player.originPOS[0], parseInt((pitchHeight * 0.25) - 5, 10)]
    } else {
      player.currentPOS = [player.originPOS[0], parseInt(pitchHeight * 0.5, 10)]
    }
  }
  return matchDetails
}

function setTopHalfwayToBottomQtrYPos(matchDetails, attack, defence) {
  let { ball } = matchDetails
  let [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let kickPlayer = attack.players[5]
  kickPlayer.hasBall = true
  ball.lastTouch = kickPlayer.name
  ball.Player = kickPlayer.playerID
  ball.withTeam = attack.teamID
  let ballInCentre = common.isBetween(ball.position[0], (pitchWidth / 4) + 5, (pitchWidth - (pitchWidth / 4) - 5))
  let ballLeft = common.isBetween(ball.position[0], 0, (pitchWidth / 4) + 4)
  ball.direction = (ballInCentre) ? 'south' : (ballLeft) ? 'southeast' : 'southwest'
  kickPlayer.currentPOS = ball.position.map(x => x)
  for (let player of attack.players) {
    if (player.position == 'GK') player.currentPOS = [player.originPOS[0], parseInt(pitchHeight * 0.25, 10)]
    else if (['CB', 'LB', 'RB'].includes(player.position)) {
      let maxYPOSCheck = parseInt(common.upToMax(ball.position[1] - 100, pitchHeight * 0.5), 10)
      player.currentPOS = [player.originPOS[0], maxYPOSCheck]
    } else if (['CM', 'LM', 'RM'].includes(player.position)) {
      let maxYPOSCheck = common.upToMax(ball.position[1] + common.getRandomNumber(150, 300), pitchHeight * 0.75)
      if (player.name != kickPlayer.name) player.currentPOS = [player.originPOS[0], parseInt(maxYPOSCheck, 10)]
    } else {
      let maxYPOSCheck = common.upToMax(ball.position[1] + common.getRandomNumber(300, 400), pitchHeight * 0.9)
      player.currentPOS = [player.originPOS[0], parseInt(maxYPOSCheck, 10)]
    }
  }
  for (let player of defence.players) {
    if (['GK', 'CB', 'LB', 'RB'].includes(player.position)) {
      player.currentPOS = player.originPOS.map(x => x)
    } else if (['CM', 'LM', 'RM'].includes(player.position)) {
      player.currentPOS = [player.originPOS[0], parseInt(pitchHeight * 0.75, 10)]
    } else {
      player.currentPOS = [player.originPOS[0], parseInt(pitchHeight * 0.5, 10)]
    }
  }
  return matchDetails
}

function setBottomHalfwayToTopQtrYPos(matchDetails, attack, defence) {
  let { ball } = matchDetails
  let [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let kickPlayer = attack.players[5]
  kickPlayer.hasBall = true
  ball.lastTouch = kickPlayer.name
  ball.Player = kickPlayer.playerID
  ball.withTeam = attack.teamID
  let ballInCentre = common.isBetween(ball.position[0], (pitchWidth / 4) + 5, (pitchWidth - (pitchWidth / 4) - 5))
  let ballLeft = common.isBetween(ball.position[0], 0, (pitchWidth / 4) + 4)
  ball.direction = (ballInCentre) ? 'north' : (ballLeft) ? 'northeast' : 'northwest'
  kickPlayer.currentPOS = ball.position.map(x => x)
  for (let player of attack.players) {
    if (player.position == 'GK') player.currentPOS = [player.originPOS[0], parseInt(pitchHeight * 0.75, 10)]
    else if (['CB', 'LB', 'RB'].includes(player.position)) {
      let maxYPOSCheck = parseInt(common.upToMin(ball.position[1] + 100, pitchHeight * 0.5), 10)
      player.currentPOS = [player.originPOS[0], maxYPOSCheck]
    } else if (['CM', 'LM', 'RM'].includes(player.position)) {
      let maxYPOSCheck = common.upToMin(ball.position[1] - common.getRandomNumber(150, 300), pitchHeight * 0.25)
      if (player.name != kickPlayer.name) player.currentPOS = [player.originPOS[0], parseInt(maxYPOSCheck, 10)]
    } else {
      let maxYPOSCheck = common.upToMin(ball.position[1] - common.getRandomNumber(300, 400), pitchHeight * 0.1)
      player.currentPOS = [player.originPOS[0], parseInt(maxYPOSCheck, 10)]
    }
  }
  for (let player of defence.players) {
    if (['GK', 'CB', 'LB', 'RB'].includes(player.position)) {
      player.currentPOS = player.originPOS.map(x => x)
    } else if (['CM', 'LM', 'RM'].includes(player.position)) {
      player.currentPOS = [player.originPOS[0], parseInt(pitchHeight * 0.25, 10)]
    } else {
      player.currentPOS = [player.originPOS[0], parseInt(pitchHeight * 0.5, 10)]
    }
  }
  return matchDetails
}

function setTopBottomQtrCentreYPos(matchDetails, attack, defence) {
  let { ball } = matchDetails
  let [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let kickPlayer = attack.players[5]
  kickPlayer.hasBall = true
  ball.lastTouch = kickPlayer.name
  ball.Player = kickPlayer.playerID
  ball.withTeam = attack.teamID
  let ballInCentre = common.isBetween(ball.position[0], (pitchWidth / 4) + 5, (pitchWidth - (pitchWidth / 4) - 5))
  let ballLeft = common.isBetween(ball.position[0], 0, (pitchWidth / 4) + 4)
  ball.direction = (ballInCentre) ? 'south' : (ballLeft) ? 'southeast' : 'southwest'
  kickPlayer.currentPOS = ball.position.map(x => x)
  for (let player of attack.players) {
    if (player.position == 'GK') player.currentPOS = [player.originPOS[0], parseInt(pitchHeight * 0.25, 10)]
    else if (['CB', 'LB', 'RB'].includes(player.position)) {
      if (player.position == 'CB') {
        player.currentPOS = [player.originPOS[0], parseInt(pitchHeight * 0.5, 10)]
      } else if (player.position == 'LB' || player.position == 'RB') {
        player.currentPOS = [player.originPOS[0], parseInt(pitchHeight * 0.66, 10)]
      }
    } else if (player.name != kickPlayer.name) {
      player.currentPOS = common.getRandomBottomPenaltyPosition(matchDetails)
    }
  }
  let playerSpace = -3
  for (let player of defence.players) {
    let ballDistanceFromGoalX = ball.position[0] - (pitchWidth / 2)
    let midWayFromBalltoGoalX = parseInt((ball.position[0] - ballDistanceFromGoalX) / 2, 10)
    let ballDistanceFromGoalY = (pitchHeight - ball.position[1])
    let midWayFromBalltoGoalY = parseInt((ball.position[1] - ballDistanceFromGoalY) / 2, 10)
    if (player.position == 'GK') player.currentPOS = player.currentPOS = player.originPOS.map(x => x)
    else if (['CB', 'LB', 'RB'].includes(player.position)) {
      player.currentPOS = [midWayFromBalltoGoalX + playerSpace, midWayFromBalltoGoalY]
      playerSpace += 2
    } else {
      player.currentPOS = common.getRandomBottomPenaltyPosition(matchDetails)
    }
  }
  return matchDetails
}

function setBottomUpperQtrCentreYPos(matchDetails, attack, defence) {
  let { ball } = matchDetails
  let [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let kickPlayer = attack.players[5]
  kickPlayer.hasBall = true
  ball.lastTouch = kickPlayer.name
  ball.Player = kickPlayer.playerID
  ball.withTeam = attack.teamID
  let ballInCentre = common.isBetween(ball.position[0], (pitchWidth / 4) + 5, (pitchWidth - (pitchWidth / 4) - 5))
  let ballLeft = common.isBetween(ball.position[0], 0, (pitchWidth / 4) + 4)
  ball.direction = (ballInCentre) ? 'north' : (ballLeft) ? 'northeast' : 'northwest'
  kickPlayer.currentPOS = ball.position.map(x => x)
  for (let player of attack.players) {
    if (player.position == 'GK') player.currentPOS = [player.originPOS[0], parseInt(pitchHeight * 0.75, 10)]
    else if (['CB', 'LB', 'RB'].includes(player.position)) {
      if (player.position == 'CB') {
        player.currentPOS = [player.originPOS[0], parseInt(pitchHeight * 0.5, 10)]
      } else if (player.position == 'LB' || player.position == 'RB') {
        player.currentPOS = [player.originPOS[0], parseInt(pitchHeight * 0.33, 10)]
      }
    } else if (player.name != kickPlayer.name) {
      player.currentPOS = common.getRandomTopPenaltyPosition(matchDetails)
    }
  }
  let playerSpace = -3
  for (let player of defence.players) {
    let ballDistanceFromGoalX = ball.position[0] - (pitchWidth / 2)
    let midWayFromBalltoGoalX = parseInt((ball.position[0] - ballDistanceFromGoalX) / 2, 10)
    let midWayFromBalltoGoalY = parseInt(ball.position[1] / 2, 10)
    if (player.position == 'GK') player.currentPOS = player.currentPOS = player.originPOS.map(x => x)
    else if (['CB', 'LB', 'RB'].includes(player.position)) {
      player.currentPOS = [midWayFromBalltoGoalX + playerSpace, midWayFromBalltoGoalY]
      playerSpace += 2
    } else {
      player.currentPOS = common.getRandomTopPenaltyPosition(matchDetails)
    }
  }
  return matchDetails
}

function setTopLowerFinalQtrBylinePos(matchDetails, attack, defence) {
  let { ball } = matchDetails
  let [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let kickPlayer = attack.players[5]
  kickPlayer.hasBall = true
  ball.lastTouch = kickPlayer.name
  ball.Player = kickPlayer.playerID
  ball.withTeam = attack.teamID
  let ballLeft = common.isBetween(ball.position[0], 0, (pitchWidth / 4) + 4)
  ball.direction = (ballLeft) ? 'east' : 'west'
  kickPlayer.currentPOS = ball.position.map(x => x)
  for (let player of attack.players) {
    let { playerID, position, originPOS } = player
    if (position == 'GK') player.currentPOS = [originPOS[0], parseInt(pitchHeight * 0.25, 10)]
    else if (['CB', 'LB', 'RB'].includes(position)) {
      if (position == 'CB') player.currentPOS = [originPOS[0], parseInt(pitchHeight * 0.5, 10)]
      else if (['LB', 'RB'].includes(position)) player.currentPOS = [originPOS[0], parseInt(pitchHeight * 0.66, 10)]
    } else if (playerID != kickPlayer.playerID) player.currentPOS = common.getRandomBottomPenaltyPosition(matchDetails)
  }
  let playerSpace = common.upToMax(ball.position[1] + 3, pitchHeight)
  for (let player of defence.players) {
    let { position, originPOS } = player
    let ballDistanceFromGoalX = ball.position[0] - (pitchWidth / 2)
    let midWayFromBalltoGoalX = parseInt((ball.position[0] - ballDistanceFromGoalX) / 2, 10)
    if (position == 'GK') player.currentPOS = player.currentPOS = originPOS.map(x => x)
    else if (['CB', 'LB', 'RB'].includes(position)) {
      player.currentPOS = [midWayFromBalltoGoalX, playerSpace]
      playerSpace -= 2
    } else player.currentPOS = common.getRandomBottomPenaltyPosition(matchDetails)
  }
  return matchDetails
}

function setBottomLowerFinalQtrBylinePos(matchDetails, attack, defence) {
  let { ball } = matchDetails
  let [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let kickPlayer = attack.players[5]
  kickPlayer.hasBall = true
  ball.lastTouch = kickPlayer.name
  ball.Player = kickPlayer.playerID
  ball.withTeam = attack.teamID
  let ballLeft = common.isBetween(ball.position[0], 0, (pitchWidth / 4) + 4)
  ball.direction = (ballLeft) ? 'east' : 'west'
  kickPlayer.currentPOS = ball.position.map(x => x)
  for (let player of attack.players) {
    let { playerID, position, originPOS } = player
    if (position == 'GK') player.currentPOS = [originPOS[0], parseInt(pitchHeight * 0.75, 10)]
    else if (['CB', 'LB', 'RB'].includes(position)) {
      if (position == 'CB') player.currentPOS = [originPOS[0], parseInt(pitchHeight * 0.5, 10)]
      else if (['LB', 'RB'].includes(position)) player.currentPOS = [originPOS[0], parseInt(pitchHeight * 0.33, 10)]
    } else if (playerID != kickPlayer.playerID) player.currentPOS = common.getRandomTopPenaltyPosition(matchDetails)
  }
  let playerSpace = common.upToMin(ball.position[1] - 3, 0)
  for (let player of defence.players) {
    let { position, originPOS } = player
    let ballDistanceFromGoalX = ball.position[0] - (pitchWidth / 2)
    let midWayFromBalltoGoalX = parseInt((ball.position[0] - ballDistanceFromGoalX) / 2, 10)
    if (position == 'GK') player.currentPOS = player.currentPOS = originPOS.map(x => x)
    else if (['CB', 'LB', 'RB'].includes(position)) {
      player.currentPOS = [midWayFromBalltoGoalX, playerSpace]
      playerSpace += 2
    } else player.currentPOS = common.getRandomTopPenaltyPosition(matchDetails)
  }
  return matchDetails
}

module.exports = {
  setTopFreekick,
  setBottomFreekick
}
