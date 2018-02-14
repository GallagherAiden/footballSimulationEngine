var async = require("async");
var common = require("../lib/common");

function resetPlayerPositions(team) {
	return new Promise(function (resolve, reject) {
		async.eachSeries(team.players, function eachPlayer(thisPlayer, thisPlayerCallback) {
			var tempArray = thisPlayer.originPOS;
			thisPlayer.startPOS = tempArray.map(x => x);
			thisPlayer.relativePOS = tempArray.map(x => x);
			thisPlayerCallback();
		}, function afterAllPlayers() {
			resolve();
		});
	});
}

function setGameVariables(team) {
	return new Promise(function (resolve, reject) {
		async.eachSeries(team.players, function eachPlayer(thisPlayer, thisPlayerCallback) {
			var tempArray = thisPlayer.startPOS;
			thisPlayer.originPOS = tempArray.map(x => x);
			thisPlayer.relativePOS = tempArray.map(x => x);
			thisPlayer.hasBall = false;
			team.intent = "";
			thisPlayerCallback();
		}, function afterAllPlayers() {
			resolve(team);
		});
	});
}

function koDecider(team1, matchDetails) {
	return new Promise(function (resolve, reject) {
		var playerWithBall = common.getRandomNumber(9, 10);
		var waitingPlayer;
		if (playerWithBall === 9) {
			waitingPlayer = 10;
		} else {
			waitingPlayer = 9;
		}
		team1.players[playerWithBall].startPOS = matchDetails.ball.position.map(x => x);
		team1.players[playerWithBall].hasBall = true;
		matchDetails.ball.withPlayer = true;
		matchDetails.ball.Player = team1.players[playerWithBall].name;
		matchDetails.ball.withTeam = team1.name;
		var tempPosition = [matchDetails.ball.position[0] + 20, matchDetails.ball.position[1]];
		team1.players[waitingPlayer].startPOS = tempPosition.map(x => x);
		team1.intent = "attack";
		resolve(team1);
	});
}

function populateMatchDetails(team1, team2, pitchDetails) {
	return new Promise(function (resolve, reject) {
		var matchDetails = {
			"kickOffTeam": team1,
			"secondTeam": team2,
			"pitchSize": [pitchDetails.pitchWidth, pitchDetails.pitchHeight],
			"ball": {
				"position": [pitchDetails.pitchWidth / 2, pitchDetails.pitchHeight / 2],
				"withPlayer": true,
				"Player": "",
				"withTeam": "",
				"direction": "south"
			},
			"half": 1,
			"kickOffTeamStatistics": {
				"goals": 0,
				"shots": 0,
				"corners": 0,
				"freekicks": 0,
				"penalties": 0,
				"fouls": 0
			},
			"secondTeamStatistics": {
				"goals": 0,
				"shots": 0,
				"corners": 0,
				"freekicks": 0,
				"penalties": 0,
				"fouls": 0
			},
			"iterationLog": []
		};
		resolve(matchDetails);
	});
}

module.exports = {
	resetPlayerPositions: resetPlayerPositions,
	setGameVariables: setGameVariables,
	koDecider: koDecider,
	populateMatchDetails: populateMatchDetails
};
