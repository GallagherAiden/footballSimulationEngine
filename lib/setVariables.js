var common = require('../lib/common')

async function resetPlayerPositions(team) {
	team.players.forEach(player => {
		player.startPOS = player.originPOS.slice()
		player.relativePOS = player.originPOS.slice()
	})
}

async function setGameVariables(team) {
	if (typeof (team) != 'object') team = JSON.parse(team)

	team.players.forEach(player => {
		player.originPOS = player.startPOS.slice()
		player.relativePOS = player.startPOS.slice()
		player.action = "none"
		player.offside = false
		player.hasBall = false
		player.cards = {
			yellow: 0,
			red: 0
		}
	})

	team.intent = ''

	return team
}

async function koDecider(team1, matchDetails) {
	if (typeof (team1) != 'object') team1 = JSON.parse(team1)

	const playerWithBall = common.getRandomNumber(9, 10)

	matchDetails.ball.withPlayer = true
	matchDetails.ball.Player = team1.players[playerWithBall].name
	matchDetails.ball.withTeam = team1.name

	team1.intent = 'attack'

	team1.players[playerWithBall].startPOS = matchDetails.ball.position.map(x => x)
	team1.players[playerWithBall].startPOS.pop()
	team1.players[playerWithBall].hasBall = true
	matchDetails.ball.ballOverIterations = []

	let waitingPlayer = playerWithBall == 9 ? 10 : 9

	team1.players[waitingPlayer].startPOS = [matchDetails.ball.position[0] + 20, matchDetails.ball.position[1]]

	return team1
}

async function populateMatchDetails(team1, team2, pitchDetails) {
	return {
		kickOffTeam: team1,
		secondTeam: team2,
		pitchSize: [pitchDetails.pitchWidth, pitchDetails.pitchHeight],
		ball: {
			position: [pitchDetails.pitchWidth / 2, pitchDetails.pitchHeight / 2, 0],
			withPlayer: true,
			Player: '',
			withTeam: '',
			direction: 'south',
			ballOverIterations: []
		},
		half: 1,
		kickOffTeamStatistics: {
			goals: 0,
			shots: 0,
			corners: 0,
			freekicks: 0,
			penalties: 0,
			fouls: 0
		},
		secondTeamStatistics: {
			goals: 0,
			shots: 0,
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
