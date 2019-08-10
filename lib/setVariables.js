const common = require(`../lib/common`)

function resetPlayerPositions(matchDetails) {
  for (let player of matchDetails.kickOffTeam.players) {
    player.currentPOS = player.originPOS.map(x => x)
    player.intentPOS = player.originPOS.map(x => x)
  }
  for (let player of matchDetails.secondTeam.players) {
    player.currentPOS = player.originPOS.map(x => x)
    player.intentPOS = player.originPOS.map(x => x)
  }
}

function setGameVariables(team) {
  team.players.forEach(player => {
    player.playerID = common.getRandomNumber(1000000000000, 99999999999999999)
    player.originPOS = player.currentPOS.slice()
    player.intentPOS = player.currentPOS.slice()
    player.action = `none`
    player.offside = false
    player.hasBall = false
    player.stats = {
      'goals': 0,
      'shots': {
        'total': 0,
        'on': 0,
        'off': 0
      },
      'cards': {
        'yellow': 0,
        'red': 0
      },
      'passes': {
        'total': 0,
        'on': 0,
        'off': 0
      },
      'tackles': {
        'total': 0,
        'on': 0,
        'off': 0,
        'fouls': 0
      }
    }
    if (player.position == 'GK') player.stats.saves = 0
  })
  team.intent = `none`
  team.teamID = common.getRandomNumber(1000000000000, 99999999999999999)
  return team
}

function koDecider(team1, matchDetails) {
  const playerWithBall = common.getRandomNumber(9, 10)
  matchDetails.ball.withPlayer = true
  matchDetails.ball.Player = team1.players[playerWithBall].playerID
  matchDetails.ball.withTeam = team1.teamID
  team1.intent = `attack`
  team1.players[playerWithBall].currentPOS = matchDetails.ball.position.map(x => x)
  team1.players[playerWithBall].intentPOS = matchDetails.ball.position.map(x => x)
  team1.players[playerWithBall].currentPOS.pop()
  team1.players[playerWithBall].intentPOS.pop()
  team1.players[playerWithBall].hasBall = true
  matchDetails.ball.lastTouch = team1.players[playerWithBall].name
  matchDetails.ball.ballOverIterations = []
  let waitingPlayer = playerWithBall == 9 ? 10 : 9
  team1.players[waitingPlayer].currentPOS = [matchDetails.ball.position[0] + 20, matchDetails.ball.position[1]]
  team1.players[waitingPlayer].intentPOS = [matchDetails.ball.position[0] + 20, matchDetails.ball.position[1]]
  return team1
}

function populateMatchDetails(team1, team2, pitchDetails) {
  return {
    matchID: common.getRandomNumber(1000000000000, 99999999999999999),
    kickOffTeam: team1,
    secondTeam: team2,
    pitchSize: [pitchDetails.pitchWidth, pitchDetails.pitchHeight],
    ball: {
      position: [pitchDetails.pitchWidth / 2, pitchDetails.pitchHeight / 2, 0],
      withPlayer: true,
      Player: ``,
      withTeam: ``,
      direction: `south`,
      ballOverIterations: []
    },
    half: 1,
    kickOffTeamStatistics: {
      goals: 0,
      shots: {
        'total': 0,
        'on': 0,
        'off': 0
      },
      corners: 0,
      freekicks: 0,
      penalties: 0,
      fouls: 0
    },
    secondTeamStatistics: {
      goals: 0,
      shots: {
        'total': 0,
        'on': 0,
        'off': 0
      },
      corners: 0,
      freekicks: 0,
      penalties: 0,
      fouls: 0
    },
    iterationLog: []
  }
}

module.exports = {
  resetPlayerPositions,
  setGameVariables,
  koDecider,
  populateMatchDetails
}
