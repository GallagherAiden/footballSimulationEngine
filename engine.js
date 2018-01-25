//------------------------
//    NPM Modules
//------------------------
var async = require("async");

//------------------------
//    Functions
//------------------------
function initiateGame(team1, team2, pitchDetails) {
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
		setGameVariables(matchDetails.kickOffTeam).then(function (kickOffTeam) {
			setGameVariables(matchDetails.secondTeam).then(function (secondTeam) {
				koDecider(kickOffTeam, matchDetails).then(function (kickOffTeam) {
					matchDetails.iterationLog.push("Team to kick off - " + kickOffTeam.name);
					matchDetails.iterationLog.push("Second team - " + secondTeam.name);
					switchSide(secondTeam, matchDetails).then(function (secondTeam) {
						matchDetails.kickOffTeam = kickOffTeam;
						matchDetails.secondTeam = secondTeam;
						resolve(matchDetails);
					}).catch(function (error) {
						console.error("Error: ", error);
					});
				}).catch(function (error) {
					console.error("Error: ", error);
				});
			}).catch(function (error) {
				console.error("Error: ", error);
			});
		}).catch(function (error) {
			console.error("Error: ", error);
		});
	});
}

function playIteration(matchDetails) {
	return new Promise(function (resolve, reject) {
		var closestPlayerA = {
			"name": "",
			"position": 10000
		};
		var closestPlayerB = {
			"name": "",
			"position": 10000
		};
		matchDetails.iterationLog = [];
		kickOffTeam = matchDetails.kickOffTeam;
		secondTeam = matchDetails.secondTeam;
		matchInjury(kickOffTeam);
		matchInjury(secondTeam);
		closestPlayerToBall(closestPlayerA, kickOffTeam, matchDetails).then(function () {
			closestPlayerToBall(closestPlayerB, secondTeam, matchDetails).then(function () {
				// console.log("-----team1-----");
				decideMovement(closestPlayerA, kickOffTeam, secondTeam, matchDetails).then(function (kickOffTeam) {
					// console.log("-----team2-----");
					decideMovement(closestPlayerB, secondTeam, kickOffTeam, matchDetails).then(function (secondTeam) {
						matchDetails.kickOffTeam = kickOffTeam;
						matchDetails.secondTeam = secondTeam;
						resolve(matchDetails);
					}).catch(function (error) {
						console.error("Error: ", error);
					});
				}).catch(function (error) {
					console.error("Error: ", error);
				});
			}).catch(function (error) {
				console.error("Error: ", error);
			});
		}).catch(function (error) {
			console.error("Error: ", error);
		});
	});
}

function startSecondHalf(matchDetails) {
	return new Promise(function (resolve, reject) {
		kickOffTeam = matchDetails.kickOffTeam;
		secondTeam = matchDetails.secondTeam;
		switchSide(kickOffTeam, matchDetails).then(function (kickOffTeam) {
			switchSide(secondTeam, matchDetails).then(function (secondTeam) {
				setGoalScored(secondTeam, kickOffTeam, matchDetails).then(function () {
					matchDetails.half++;
					matchDetails.kickOffTeam = kickOffTeam;
					matchDetails.secondTeam = secondTeam;
					resolve(matchDetails);
				});
			});
		});
	});
}

function decideMovement(closestPlayer, team, opposition, matchDetails) {
	return new Promise(function (resolve, reject) {
		async.eachSeries(team.players, function eachPlayer(thisPlayer, thisPlayerCallback) {
				var ballToPlayerX = thisPlayer.startPOS[0] - matchDetails.ball.position[0];
				var ballToPlayerY = thisPlayer.startPOS[1] - matchDetails.ball.position[1];
				findPossibleActions(thisPlayer, opposition, ballToPlayerX, ballToPlayerY, matchDetails).then(function (possibleActions) {
					selectAction(possibleActions).then(function (action) {
						if (matchDetails.ball.withTeam !== team.name) {
							if (closestPlayer.name === thisPlayer.name) {
								if (action !== "tackle" && action !== "slide" && action !== "intercept") {
									action = "sprint";
								}
								if (isBetween(ballToPlayerX, -30, 30) === false) {
									if (ballToPlayerX > 29) {
										ballToPlayerX = 29;
									} else {
										ballToPlayerX = -29;
									}
								}
								if (isBetween(ballToPlayerY, -30, 30) === false) {
									if (ballToPlayerY > 29) {
										ballToPlayerY = 29;
									} else {
										ballToPlayerY = -29;
									}
								}
							}
						}
						makeMovement(thisPlayer, action, opposition, ballToPlayerX, ballToPlayerY, matchDetails).then(function (move) {
							var output = "Player Name: " + thisPlayer.name + ", Origin Position: " + thisPlayer.originPOS + ", Ball Position: " + matchDetails.ball.position + ", Player to ball X: " + ballToPlayerX + ", Player to ball Y: " + ballToPlayerY + ", \n Player Has Ball: " + thisPlayer.hasBall + ", Action: " + action + ", Movement: " + move;
							var intendedMovementX = thisPlayer.startPOS[0] + move[0];
							var intendedMovementY = thisPlayer.startPOS[1] + move[1];
							if (intendedMovementX < matchDetails.pitchSize[0] + 1 && intendedMovementX > -1) {
								thisPlayer.startPOS[0] = thisPlayer.startPOS[0] + move[0];
							}
							if (intendedMovementY < matchDetails.pitchSize[1] + 1 && intendedMovementY > -1) {
								thisPlayer.startPOS[1] = thisPlayer.startPOS[1] + move[1];
							}
							if (isBetween(thisPlayer.startPOS[0], matchDetails.ball.position[0] - 3, matchDetails.ball.position[0] + 3) && isBetween(thisPlayer.startPOS[1], matchDetails.ball.position[1] - 3, matchDetails.ball.position[1] + 3) && matchDetails.ball.withTeam !== team.name) {
								if (thisPlayer.startPOS[0] === matchDetails.ball.position[0] && thisPlayer.startPOS[1] === matchDetails.ball.position[1]) {
									if (matchDetails.ball.withPlayer === true && thisPlayer.hasBall === false && matchDetails.ball.withTeam !== team.name) {
										if (action === "tackle") {
											resolveTackle(thisPlayer, team, opposition, matchDetails).then(function (foul) {
												if (foul) {
													setSetpiece(matchDetails, opposition, team).then(function () {
														// do nothing
													}).catch(function (error) {
														console.error("Error whilst setting up the set piece: ", error);
														console.error(matchDetails.iterationLog);
													});
												}
											}).catch(function (error) {
												console.error("Error whilst resolving posession: ", error);
												console.error(matchDetails.iterationLog);
											});
										}
									} else {
										thisPlayer.hasBall = true;
										matchDetails.ball.Player = thisPlayer.name;
										matchDetails.ball.withPlayer = true;
										matchDetails.ball.withTeam = team.name;
										team.intent = "attack";
										opposition.intent = "defend";
									}
								} else {
									if (matchDetails.ball.withPlayer === true && thisPlayer.hasBall === false && matchDetails.ball.withTeam !== team.name) {
										if (action === "slide") {
											resolveSlide(thisPlayer, team, opposition, matchDetails).then(function (foul) {
												if (foul) {
													setSetpiece(matchDetails, opposition, team).then(function () {
														// do nothing
													}).catch(function (error) {
														console.error("Error whilst setting up the set piece: ", error);
														console.error(matchDetails.iterationLog);
													});
												}
											}).catch(function (error) {
												console.error("Error whilst resolving posession during slide: ", error);
												console.error(matchDetails.iterationLog);
											});
										}
									} else {
										thisPlayer.hasBall = true;
										matchDetails.ball.Player = thisPlayer.name;
										matchDetails.ball.withPlayer = true;
										matchDetails.ball.withTeam = team.name;
										team.intent = "attack";
										opposition.intent = "defend";
									}
								}
							}
							if (thisPlayer.hasBall === true) {
								getBallDirection(matchDetails, thisPlayer.startPOS).then(function () {
									var tempArray = thisPlayer.startPOS;
									matchDetails.ball.position = tempArray.map(x => x);
								}).catch(function (error) {
									console.error("Error getting the ball direction", error);
									console.error(matchDetails.iterationLog);
								});
							}
							if (action === "shoot" || action === "pass" || action === "cross" || action === "throughBall" || action === "cleared" || action === "boot") {
								thisPlayer.hasBall = false;
								matchDetails.ball.withPlayer = false;
								team.intent = "attack";
								opposition.intent = "attack";
								matchDetails.ball.Player = "";
								matchDetails.ball.withTeam = "";
								if (action === "cleared" || action === "boot") {
									ballKicked(matchDetails, thisPlayer).then(function (newPosition) {
										var tempPosition = newPosition.map(x => x);
										matchDetails.ball.position = tempPosition;
									}).catch(function (error) {
										console.error("Error calling ball kicked:", error);
										console.error(matchDetails.iterationLog);
									});
								} else if (action === "pass" || action === "cross") {
									ballPassed(matchDetails, team, thisPlayer).then(function (newPosition) {
										matchDetails.iterationLog.push("passed to new position: " + newPosition);
										var tempPosition = newPosition.map(x => x);
										matchDetails.ball.position = tempPosition;
									}).catch(function (error) {
										console.error("Error calling ball passed: ", error);
										console.error(matchDetails.iterationLog);
									});
								} else if (action === "throughBall") {
									throughBall(matchDetails, team, thisPlayer).then(function (newPosition) {
										var tempPosition = newPosition.map(x => x);
										matchDetails.ball.position = tempPosition;
									}).catch(function (error) {
										console.error("Error calling through ball: ", error);
										console.error(matchDetails.iterationLog);
									});
								} else if (action === "shoot") {
									shotMade(matchDetails, team, opposition, thisPlayer).then(function (newPosition) {
										var tempPosition = newPosition.map(x => x);
										matchDetails.ball.position = tempPosition;
									}).catch(function (error) {
										console.error("Error calling shot made: ", error);
										console.error(matchDetails.iterationLog);
									});
								}
							}
							output += ", Injured?: " + thisPlayer.injured + ", Relative Position: " + thisPlayer.relativePOS + ", Final Position: " + thisPlayer.startPOS + ", Intent: " + team.intent;
							//iterationLog.push(output);
							// console.log(output);
							thisPlayerCallback();
						}).catch(function (error) {
							console.error("Error calling make movement: ", error);
							console.error(matchDetails.iterationLog);
						});
					}).catch(function (error) {
						console.error("Error calling select action: ", error);
						console.error(matchDetails.iterationLog);
					});
				}).catch(function (error) {
					console.error("Error finding possible actions: ", error);
					console.error(matchDetails.iterationLog);
				});
			},
			function afterAllPlayers() {
				resolve(team);
			});
	});
}

function makeMovement(player, action, opposition, ballX, ballY, matchDetails) {
	return new Promise(function (resolve, reject) {
		var move = [];
		if (action === "wait") {
			move[0] = 0;
			move[1] = 0;
			resolve(move);
		} else if (action === "shoot" || action === "pass" || action === "cross" || action === "throughBall" || action === "cleared" || action === "boot") {
			move[0] = 0;
			move[1] = 0;
			resolve(move);
		} else if (action === "tackle" || action === "slide") {
			if (ballX > 0) {
				move[0] = -1;
			} else if (ballX === 0) {
				move[0] = 0;
			} else if (ballX < 0) {
				move[0] = 1;
			}
			if (ballY > 0) {
				move[1] = -1;
			} else if (ballY === 0) {
				move[1] = 0;
			} else if (ballY < 0) {
				move[1] = 1;
			}
			resolve(move);
		} else if (action === "intercept") {
			closestPlayerToPosition("name", opposition, matchDetails.ball.position).then(function (playerInformation) {
				var interceptPlayer = playerInformation.thePlayer;
				var interceptionPosition = [];
				var interceptPlayerToBallX = interceptPlayer.startPOS[0] - matchDetails.ball.position[0];
				var interceptPlayerToBallY = interceptPlayer.startPOS[1] - matchDetails.ball.position[1];
				if (interceptPlayerToBallX === 0) {
					if (interceptPlayerToBallY === 0) {
						move[0] = 0;
						move[1] = 0;
					} else if (interceptPlayerToBallY < 0) {
						interceptionPosition[0] = interceptPlayer.startPOS[0];
						interceptionPosition[1] = interceptPlayer.startPOS[1] + 1;
					} else if (interceptPlayerToBallY > 0) {
						interceptionPosition[0] = interceptPlayer.startPOS[0];
						interceptionPosition[1] = interceptPlayer.startPOS[1] - 1;
					}
				} else if (interceptPlayerToBallY === 0) {
					if (interceptPlayerToBallX < 0) {
						interceptionPosition[0] = interceptPlayer.startPOS[0] + 1;
						interceptionPosition[1] = interceptPlayer.startPOS[1];
					} else if (interceptPlayerToBallX > 0) {
						interceptionPosition[0] = interceptPlayer.startPOS[0] - 1;
						interceptionPosition[1] = interceptPlayer.startPOS[1];
					}
				} else if (interceptPlayerToBallX < 0 && interceptPlayerToBallY < 0) {
					interceptionPosition[0] = interceptPlayer.startPOS[0] + 1;
					interceptionPosition[1] = interceptPlayer.startPOS[1] + 1;
				} else if (interceptPlayerToBallX > 0 && interceptPlayerToBallY > 0) {
					interceptionPosition[0] = interceptPlayer.startPOS[0] - 1;
					interceptionPosition[1] = interceptPlayer.startPOS[1] - 1;
				} else if (interceptPlayerToBallX > 0 && interceptPlayerToBallY < 0) {
					interceptionPosition[0] = interceptPlayer.startPOS[0] - 1;
					interceptionPosition[1] = interceptPlayer.startPOS[1] + 1;
				} else if (interceptPlayerToBallX < 0 && interceptPlayerToBallY > 0) {
					interceptionPosition[0] = interceptPlayer.startPOS[0] + 1;
					interceptionPosition[1] = interceptPlayer.startPOS[1] - 1;
				}
				//set movement to the new interception position
				var interceptPositionX = player.startPOS[0] - interceptionPosition[0];
				var interceptPositionY = player.startPOS[1] - interceptionPosition[1];
				if (interceptPositionX === 0) {
					if (interceptPositionY === 0) {
						move[0] = 0;
						move[1] = 0;
					} else if (interceptPositionY < 0) {
						move[0] = 0;
						move[1] = 1;
					} else if (interceptPositionY > 0) {
						move[0] = 0;
						move[1] = -1;
					}
				} else if (interceptPositionY === 0) {
					if (interceptPositionX < 0) {
						move[0] = 1;
						move[1] = 0;
					} else if (interceptPositionX > 0) {
						move[0] = -1;
						move[1] = 0;
					}
				} else if (interceptPositionX < 0 && interceptPositionY < 0) {
					move[0] = 1;
					move[1] = 1;
				} else if (interceptPositionX > 0 && interceptPositionY > 0) {
					move[0] = -1;
					move[1] = -1;
				} else if (interceptPositionX > 0 && interceptPositionY < 0) {
					move[0] = -1;
					move[1] = 1;
				} else if (interceptPositionX < 0 && interceptPositionY > 0) {
					move[0] = 1;
					move[1] = -1;
				}
				resolve(move);
			}).catch(function (error) {
				console.error("Error when getting the closest opposition player: ", error);
				console.error(matchDetails.iterationLog);
			})
		} else if (action === "run") {
			if (player.hasBall) {
				if (player.originPOS[1] > matchDetails.pitchSize[1] / 2) {
					move[0] = getRandomNumber(0, 2);
					move[1] = getRandomNumber(0, 2);
				} else {
					move[0] = getRandomNumber(-2, 0);
					move[1] = getRandomNumber(-2, 0);
				}
				resolve(move);
			} else {
				var movementRun = [-1, 0, 1];
				if (isBetween(ballX, -30, 30) && isBetween(ballY, -30, 30)) {
					if (isBetween(ballX, -30, 1)) {
						move[0] = movementRun[getRandomNumber(1, 2)];
					} else if (isBetween(ballX, -1, 30)) {
						move[0] = movementRun[getRandomNumber(0, 1)];
					} else {
						move[0] = movementRun[getRandomNumber(1, 1)];
					}
					if (isBetween(ballY, -30, 1)) {
						move[1] = movementRun[getRandomNumber(1, 2)];
					} else if (isBetween(ballY, -1, 30)) {
						move[1] = movementRun[getRandomNumber(0, 1)];
					} else {
						move[1] = movementRun[getRandomNumber(1, 1)];
					}
					resolve(move);
				} else {
					formationCheck(player.relativePOS, player.startPOS).then(function (formationDirection) {
						if (formationDirection[0] === 0) {
							move[0] = movementRun[getRandomNumber(1, 1)];
						} else if (formationDirection[0] < 0) {
							move[0] = movementRun[getRandomNumber(0, 1)];
						} else if (formationDirection[0] > 0) {
							move[0] = movementRun[getRandomNumber(1, 2)];
						}
						if (formationDirection[1] === 0) {
							move[1] = movementRun[getRandomNumber(1, 1)];
						} else if (formationDirection[1] < 0) {
							move[1] = movementRun[getRandomNumber(0, 1)];
						} else if (formationDirection[1] > 0) {
							move[1] = movementRun[getRandomNumber(1, 2)];
						}
						resolve(move);
					}).catch(function (error) {
						console.error("couldn't check formation when running", error);
						console.error(matchDetails.iterationLog);
					});
				}
			}
		} else if (action === "sprint") {
			var movementSprint = [-2, -1, 0, 1, 2];
			if (isBetween(ballX, -30, 30) && isBetween(ballY, -30, 30)) {
				if (isBetween(ballX, -30, 1)) {
					move[0] = movementSprint[getRandomNumber(2, 4)];
				} else if (isBetween(ballX, -1, 30)) {
					move[0] = movementSprint[getRandomNumber(0, 2)];
				} else {
					move[0] = movementSprint[getRandomNumber(2, 2)];
				}
				if (isBetween(ballY, -30, 1)) {
					move[1] = movementSprint[getRandomNumber(2, 4)];
				} else if (isBetween(ballY, -1, 30)) {
					move[1] = movementSprint[getRandomNumber(0, 2)];
				} else {
					move[1] = movementSprint[getRandomNumber(2, 2)];
				}
				resolve(move);
			} else {
				formationCheck(player.relativePOS, player.startPOS).then(function (formationDirection) {
					if (formationDirection[0] === 0) {
						move[0] = movementSprint[getRandomNumber(2, 2)];
					} else if (formationDirection[0] < 0) {
						move[0] = movementSprint[getRandomNumber(0, 2)];
					} else if (formationDirection[0] > 0) {
						move[0] = movementSprint[getRandomNumber(2, 4)];
					}
					if (formationDirection[1] === 0) {
						move[1] = movementSprint[getRandomNumber(2, 2)];
					} else if (formationDirection[1] < 0) {
						move[1] = movementSprint[getRandomNumber(0, 2)];
					} else if (formationDirection[1] > 0) {
						move[1] = movementSprint[getRandomNumber(2, 4)];
					}
					resolve(move);
				}).catch(function (error) {
					console.error("error calling formation check when sprinting", error);
					console.error(matchDetails.iterationLog);
				});
			}
		}
	});
}

function formationCheck(origin, current) {
	return new Promise(function (resolve, reject) {
		var xPos = origin[0] - current[0];
		var yPos = origin[1] - current[1];
		var moveToFormation = [];
		moveToFormation.push(xPos);
		moveToFormation.push(yPos);
		resolve(moveToFormation);
	});
}

function selectAction(possibleActions) {
	return new Promise(function (resolve, reject) {
		goodActions = [];
		async.eachSeries(possibleActions, function eachPlayer(thisAction, thisActionCallback) {
			var tempArray = Array(thisAction.points).fill(thisAction.name);
			goodActions = goodActions.concat(tempArray);
			thisActionCallback();
		}, function afterAllActions() {
			var decision;
			if (goodActions[0] == null) {
				decision = "wait";
			} else {
				decision = goodActions[getRandomNumber(0, goodActions.length - 1)];
			}
			resolve(decision);
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

function switchSide(team, matchDetails) {
	return new Promise(function (resolve, reject) {
		if (!team) {
			reject("No Team supplied to switch side");
		}
		async.eachSeries(team.players, function eachPlayer(thisPlayer, thisPlayerCallback) {
			thisPlayer.originPOS[1] = matchDetails.pitchSize[1] - thisPlayer.originPOS[1];
			var tempArray = thisPlayer.originPOS;
			thisPlayer.startPOS = tempArray.map(x => x);
			thisPlayer.relativePOS = tempArray.map(x => x);
			thisPlayerCallback();
		}, function afterAllPlayers() {
			resolve(team);
		});
	});
}

function isBetween(num, low, high) {
	if (num > low && num < high) {
		return true;
	} else {
		return false;
	}
}

function koDecider(team1, matchDetails) {
	return new Promise(function (resolve, reject) {
		console.log(matchDetails);
		var playerWithBall = getRandomNumber(9, 10);
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

function closestPlayerToBall(closestPlayer, team, matchDetails) {
	return new Promise(function (resolve, reject) {
		var closestPlayerDetails;
		async.eachSeries(team.players, function eachPlayer(thisPlayer, thisPlayerACallback) {
			var ballToPlayerX = thisPlayer.startPOS[0] - matchDetails.ball.position[0];
			var ballToPlayerY = thisPlayer.startPOS[1] - matchDetails.ball.position[1];
			var proximityToBall = Math.abs(ballToPlayerX + ballToPlayerY);
			if (proximityToBall < closestPlayer.position) {
				closestPlayer.name = thisPlayer.name;
				closestPlayer.position = proximityToBall;
				closestPlayerDetails = thisPlayer;
			}
			thisPlayerACallback();
		}, function afterAllAPlayers() {
			setRelativePosition(closestPlayerDetails, team, matchDetails).then(function () {
				matchDetails.iterationLog.push("Closest Player to ball: " + closestPlayerDetails.name);
				resolve();
			}).catch(function (error) {
				console.error("Error when setting relative positions: ", error);
				console.error(matchDetails.iterationLog);
			});
		});
	});
}

function closestPlayerToPosition(player, team, position) {
	return new Promise(function (resolve, reject) {
		var currentDifference = 1000;
		var playerInformation = {
			"thePlayer": "",
			"proximity": ["", ""]
		};
		async.eachSeries(team.players, function eachPlayer(thisPlayer, thisPlayerCallback) {
			if (player.name === thisPlayer.name) {
				//do nothing
			} else {
				var ballToPlayerX = thisPlayer.startPOS[0] - position[0];
				var ballToPlayerY = thisPlayer.startPOS[1] - position[1];
				var proximityToBall = Math.abs(ballToPlayerX + ballToPlayerY);
				if (proximityToBall < currentDifference) {
					playerInformation.thePlayer = thisPlayer;
					playerInformation.proximity = [ballToPlayerX, ballToPlayerY];
					currentDifference = proximityToBall;
				}
			}
			thisPlayerCallback();
		}, function afterAllPlayers() {
			resolve(playerInformation);
		});
	});
}

function setRelativePosition(player, team, matchDetails) {
	return new Promise(function (resolve, reject) {
		var tempArray = parseInt(player.startPOS[1]) - parseInt(player.originPOS[1]);
		async.eachSeries(team.players, function eachPlayer(thisPlayer, thisPlayerCallback) {
			var originArray = thisPlayer.originPOS;
			var possibleMove = parseInt(thisPlayer.originPOS[1]) + tempArray;
			if (thisPlayer.name === player.name) {
				thisPlayer.relativePOS = thisPlayer.startPOS.map(x => x);
			} else {
				if (team.intent === "attack") {
					if (thisPlayer.position !== "GK" && thisPlayer.position !== "CB") {
						if (thisPlayer.originPOS[1] > matchDetails.pitchSize[1] / 2) {
							if (possibleMove > thisPlayer.originPOS) {
								thisPlayer.relativePOS = originArray.map(x => x);
							} else {
								thisPlayer.relativePOS[1] = possibleMove;
							}
						} else {
							if (possibleMove < thisPlayer.originPOS) {
								thisPlayer.relativePOS = originArray.map(x => x);
							} else {
								thisPlayer.relativePOS[1] = possibleMove;
							}
						}
					} else {
						thisPlayer.relativePOS = originArray.map(x => x);
					}
				} else {
					thisPlayer.relativePOS = originArray.map(x => x);
				}
			}
			thisPlayerCallback();
		}, function afterAllBlayers() {
			resolve();
		});
	});
}

function findPossibleActions(player, opposition, ballX, ballY, matchDetails) {
	return new Promise(function (resolve, reject) {
		var possibleActions = [{
				"name": "shoot",
				"points": 0
			},
			{
				"name": "throughBall",
				"points": 0
			},
			{
				"name": "pass",
				"points": 0
			},
			{
				"name": "cross",
				"points": 0
			},
			{
				"name": "tackle",
				"points": 0
			},
			{
				"name": "intercept",
				"points": 0
			},
			{
				"name": "slide",
				"points": 0
			},
			{
				"name": "run",
				"points": 0
			},
			{
				"name": "sprint",
				"points": 0
			},
			{
				"name": "cleared",
				"points": 0
			},
			{
				"name": "boot",
				"points": 0
			}
		];
		closestPlayerToPosition(player, opposition, player.startPOS).then(function (playerInformation) {
			var playerProximity = [Math.abs(playerInformation.proximity[0]), Math.abs(playerInformation.proximity[1])];
			var closePlayerPosition = playerInformation.thePlayer;
			if (player.hasBall === false) {
				if (player.position === "GK") {
					possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 0, 0, 60, 40, 0, 0);
					resolve(possibleActions);
				} else {
					//[0]shoot, [1]throughBall, [2]pass, [3]cross, [4]tackle, [5]intercept
					//[6]slide, [7]run, [8]sprint //[9]cleared //[10]boot
					if (isBetween(ballX, -2, 2) && isBetween(ballY, -2, 2)) {
						if (player.originPOS[1] > (matchDetails.pitchSize[1] / 2)) {
							if (isBetween(player.startPOS[0], (matchDetails.pitchSize[0] / 4) - 5, matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5) && isBetween(player.startPOS[1], matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) + 5, matchDetails.pitchSize[1])) {
								if (matchDetails.ball.withPlayer === false) {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0);
									resolve(possibleActions);
								} else {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 0, 0, 70, 30, 0, 0);
									resolve(possibleActions);
								}
							} else {
								if (matchDetails.ball.withPlayer === false) {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0);
									resolve(possibleActions);
								} else {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 70, 10, 20, 0, 0, 0, 0);
									resolve(possibleActions);
								}
							}
						} else {
							if (isBetween(player.startPOS[0], (matchDetails.pitchSize[0] / 4) - 5, matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5) && isBetween(player.startPOS[1], 0, (matchDetails.pitchSize[1] / 6) - 5)) {
								if (matchDetails.ball.withPlayer === false) {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0);
									resolve(possibleActions);
								} else {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 0, 0, 70, 30, 0, 0);
									resolve(possibleActions);
								}
							} else {
								if (matchDetails.ball.withPlayer === false) {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0);
									resolve(possibleActions);
								} else {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 70, 10, 20, 0, 0, 0, 0);
									resolve(possibleActions);
								}
							}
						}
					} else if (isBetween(ballX, -4, 4) && isBetween(ballY, -4, 4)) {
						//[0]shoot, [1]throughBall, [2]pass, [3]cross, [4]tackle, [5]intercept
						//[6]slide, [7]run, [8]sprint //[9]cleared //[10]boot
						if (player.originPOS[1] > (matchDetails.pitchSize[1] / 2)) {
							if (isBetween(player.startPOS[0], (matchDetails.pitchSize[0] / 4) - 5, matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5) && isBetween(player.startPOS[1], matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) + 5, matchDetails.pitchSize[1])) {
								if (matchDetails.ball.withPlayer === false) {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0);
									resolve(possibleActions);
								} else {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 0, 0, 70, 30, 0, 0);
									resolve(possibleActions);
								}
							} else {
								if (matchDetails.ball.withPlayer === false) {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0);
									resolve(possibleActions);
								} else {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 40, 20, 40, 0, 0, 0, 0);
									resolve(possibleActions);
								}
							}
						} else {
							if (isBetween(player.startPOS[0], (matchDetails.pitchSize[0] / 4) - 5, matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5) && isBetween(player.startPOS[1], 0, (matchDetails.pitchSize[1] / 6) - 5)) {
								if (matchDetails.ball.withPlayer === false) {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0);
									resolve(possibleActions);
								} else {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 0, 0, 70, 30, 0, 0);
									resolve(possibleActions);
								}
							} else {
								if (matchDetails.ball.withPlayer === false) {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0);
									resolve(possibleActions);
								} else {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 40, 20, 40, 0, 0, 0, 0);
									resolve(possibleActions);
								}
							}
						}
					} else if (isBetween(ballX, -20, 20) && isBetween(ballY, -20, 20)) {
						//[0]shoot, [1]throughBall, [2]pass, [3]cross, [4]tackle, [5]intercept
						//[6]slide, [7]run, [8]sprint //[9]cleared //[10]boot
						if (matchDetails.ball.withPlayer === false) {
							possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 0, 0, 60, 40, 0, 0);
						} else {
							possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 40, 0, 30, 30, 0, 0);
						}
						resolve(possibleActions);
					} else {
						//[0]shoot, [1]throughBall, [2]pass, [3]cross, [4]tackle, [5]intercept
						//[6]slide, [7]run, [8]sprint //[9]cleared //[10]boot
						possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 10, 0, 50, 30, 0, 0);
						resolve(possibleActions);
					}
				}
			} else {
				if (player.originPOS[1] > (matchDetails.pitchSize[1] / 2)) {
					//[0]shoot, [1]throughBall, [2]pass, [3]cross, [4]tackle, [5]intercept
					//[6]slide, [7]run, [8]sprint //[9]cleared //[10]boot
					if (player.position === "GK") {
						if (playerProximity[0] < 10 && playerProximity[1] < 25) {
							possibleActions = populatePossibleActions(possibleActions, 0, 0, 10, 0, 0, 0, 0, 10, 0, 40, 40);
							resolve(possibleActions);
						} else {
							possibleActions = populatePossibleActions(possibleActions, 0, 0, 50, 0, 0, 0, 0, 10, 0, 20, 20);
							resolve(possibleActions);
						}
					} else {
						if (isBetween(player.startPOS[0], (matchDetails.pitchSize[0] / 4) - 5, matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5) && isBetween(player.startPOS[1], 0, (matchDetails.pitchSize[1] / 6) - 5)) {
							if (isBetween(player.startPOS[0], (matchDetails.pitchSize[0] / 3) - 5, matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 3) + 5) && isBetween(player.startPOS[1], 0, (matchDetails.pitchSize[1] / 12) - 5)) {
								//[0]shoot, [1]throughBall, [2]pass, [3]cross, [4]tackle, [5]intercept
								//[6]slide, [7]run, [8]sprint //[9]cleared //[10]boot
								if (playerProximity[0] < 6 && playerProximity[1] < 6) {
									if (closePlayerPosition[1] < player.startPOS[1]) {
										possibleActions = populatePossibleActions(possibleActions, 20, 0, 70, 0, 0, 0, 0, 10, 0, 0, 0);
										resolve(possibleActions);
									} else {
										possibleActions = populatePossibleActions(possibleActions, 80, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0);
										resolve(possibleActions);
									}
								} else {
									possibleActions = populatePossibleActions(possibleActions, 70, 10, 20, 0, 0, 0, 0, 0, 0, 0, 0);
									resolve(possibleActions);
								}
							} else {
								if (playerProximity[0] < 6 && playerProximity[1] < 6) {
									possibleActions = populatePossibleActions(possibleActions, 10, 0, 70, 0, 0, 0, 0, 20, 0, 0, 0);
									resolve(possibleActions);
								} else {
									possibleActions = populatePossibleActions(possibleActions, 70, 0, 20, 0, 0, 0, 0, 10, 0, 0, 0);
									resolve(possibleActions);
								}
							}
						} else if (isBetween(player.startPOS[1], (matchDetails.pitchSize[1] / 6) - 5, matchDetails.pitchSize[1] / 3)) {
							//[0]shoot, [1]throughBall, [2]pass, [3]cross, [4]tackle, [5]intercept
							//[6]slide, [7]run, [8]sprint, [9]cleared, [10]boot
							if (playerProximity[0] < 10 && playerProximity[1] < 10) {
								possibleActions = populatePossibleActions(possibleActions, 30, 20, 20, 10, 0, 0, 0, 20, 0, 0, 0);
								resolve(possibleActions);
							} else {
								possibleActions = populatePossibleActions(possibleActions, 70, 10, 10, 0, 0, 0, 0, 10, 0, 0, 0);
								resolve(possibleActions);
							}
						} else if (isBetween(player.startPOS[1], (matchDetails.pitchSize[1] / 3), (2 * (matchDetails.pitchSize[1] / 3)))) {
							//[0]shoot, [1]throughBall, [2]pass, [3]cross, [4]tackle, [5]intercept
							//[6]slide, [7]run, [8]sprint //[9]cleared //[10]boot
							if (playerProximity[0] < 10 && playerProximity[1] < 10) {
								possibleActions = populatePossibleActions(possibleActions, 0, 20, 30, 20, 0, 0, 20, 0, 0, 0, 10);
								resolve(possibleActions);
							} else {
								if (player.skill.shooting > 85) {
									possibleActions = populatePossibleActions(possibleActions, 60, 10, 10, 0, 0, 0, 20, 0, 0, 0, 0);
									resolve(possibleActions);
								} else {
									if (player.position === "LM" || player.position === "CM" || player.position === "RM") {
										possibleActions = populatePossibleActions(possibleActions, 0, 10, 10, 10, 0, 0, 0, 30, 40, 0, 0);
										resolve(possibleActions);
									} else if (player.position === "ST") {
										possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0);
										resolve(possibleActions);
									} else {
										possibleActions = populatePossibleActions(possibleActions, 10, 10, 10, 10, 0, 0, 0, 30, 20, 0, 10);
										resolve(possibleActions);
									}
								}
							}
						} else {
							//[0]shoot, [1]throughBall, [2]pass, [3]cross, [4]tackle, [5]intercept
							//[6]slide, [7]run, [8]sprint //[9]cleared //[10]boot
							if (playerProximity[0] < 10 && playerProximity[1] < 10) {
								possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 0, 0, 10, 0, 70, 20);
								resolve(possibleActions);
							} else {
								if (player.position === "LM" || player.position === "CM" || player.position === "RM") {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 30, 0, 0, 0, 0, 30, 40, 0, 0);
									resolve(possibleActions);
								} else if (player.position === "ST") {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0);
									resolve(possibleActions);
								} else {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 40, 0, 0, 0, 0, 30, 0, 20, 10);
									resolve(possibleActions);
								}
							}
						}
					}
				} else {
					//[0]shoot, [1]throughBall, [2]pass, [3]cross, [4]tackle, [5]intercept
					//[6]slide, [7]run, [8]sprint //[9]cleared //[10]boot
					if (player.position === "GK") {
						if (playerProximity[0] < 10 && playerProximity[1] < 25) {
							possibleActions = populatePossibleActions(possibleActions, 0, 0, 10, 0, 0, 0, 0, 10, 0, 40, 40);
							resolve(possibleActions);
						} else {
							possibleActions = populatePossibleActions(possibleActions, 0, 0, 50, 0, 0, 0, 0, 10, 0, 20, 20);
							resolve(possibleActions);
						}
					} else {
						if (isBetween(player.startPOS[0], (matchDetails.pitchSize[0] / 4) - 5, matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5) && isBetween(player.startPOS[1], (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) + 5), matchDetails.pitchSize[1])) {
							if (isBetween(player.startPOS[0], (matchDetails.pitchSize[0] / 3) - 5, matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 3) + 5) && isBetween(player.startPOS[1], (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 12) + 5), matchDetails.pitchSize[1])) {
								//[0]shoot, [1]throughBall, [2]pass, [3]cross, [4]tackle, [5]intercept
								//[6]slide, [7]run, [8]sprint //[9]cleared //[10]boot
								if (playerProximity[0] < 6 && playerProximity[1] < 6) {
									if (closePlayerPosition[1] > player.startPOS[1]) {
										possibleActions = populatePossibleActions(possibleActions, 20, 0, 70, 0, 0, 0, 0, 10, 0, 0, 0);
										resolve(possibleActions);
									} else {
										possibleActions = populatePossibleActions(possibleActions, 80, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0);
										resolve(possibleActions);
									}
								} else {
									possibleActions = populatePossibleActions(possibleActions, 70, 10, 20, 0, 0, 0, 0, 0, 0, 0, 0);
									resolve(possibleActions);
								}
							} else {
								if (playerProximity[0] < 6 && playerProximity[1] < 6) {
									possibleActions = populatePossibleActions(possibleActions, 10, 0, 70, 0, 0, 0, 0, 20, 0, 0, 0);
									resolve(possibleActions);
								} else {
									possibleActions = populatePossibleActions(possibleActions, 70, 0, 20, 0, 0, 0, 0, 10, 0, 0, 0);
									resolve(possibleActions);
								}
							}
						} else if (isBetween(player.startPOS[1], (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 3)), (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) + 5))) {
							//[0]shoot, [1]throughBall, [2]pass, [3]cross, [4]tackle, [5]intercept
							//[6]slide, [7]run, [8]sprint, [9]cleared, [10]boot
							if (playerProximity[0] < 10 && playerProximity[1] < 10) {
								possibleActions = populatePossibleActions(possibleActions, 30, 20, 20, 10, 0, 0, 0, 20, 0, 0, 0);
								resolve(possibleActions);
							} else {
								possibleActions = populatePossibleActions(possibleActions, 70, 10, 10, 0, 0, 0, 0, 10, 0, 0, 0);
								resolve(possibleActions);
							}
						} else if (isBetween(player.startPOS[1], (matchDetails.pitchSize[1] / 3), (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 3)))) {
							//[0]shoot, [1]throughBall, [2]pass, [3]cross, [4]tackle, [5]intercept
							//[6]slide, [7]run, [8]sprint //[9]cleared //[10]boot
							if (playerProximity[0] < 10 && playerProximity[1] < 10) {
								possibleActions = populatePossibleActions(possibleActions, 0, 20, 30, 20, 0, 0, 20, 0, 0, 0, 10);
								resolve(possibleActions);
							} else {
								if (player.skill.shooting > 85) {
									possibleActions = populatePossibleActions(possibleActions, 60, 10, 10, 0, 0, 0, 20, 0, 0, 0, 0);
									resolve(possibleActions);
								} else {
									if (player.position === "LM" || player.position === "CM" || player.position === "RM") {
										possibleActions = populatePossibleActions(possibleActions, 0, 10, 10, 10, 0, 0, 0, 30, 40, 0, 0);
										resolve(possibleActions);
									} else if (player.position === "ST") {
										possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0);
										resolve(possibleActions);
									} else {
										possibleActions = populatePossibleActions(possibleActions, 10, 10, 10, 10, 0, 0, 0, 30, 20, 0, 10);
										resolve(possibleActions);
									}
								}
							}
						} else {
							//[0]shoot, [1]throughBall, [2]pass, [3]cross, [4]tackle, [5]intercept
							//[6]slide, [7]run, [8]sprint //[9]cleared //[10]boot
							if (playerProximity[0] < 10 && playerProximity[1] < 10) {
								possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 0, 0, 10, 0, 70, 20);
								resolve(possibleActions);
							} else {
								if (player.position === "LM" || player.position === "CM" || player.position === "RM") {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 30, 0, 0, 0, 0, 30, 40, 0, 0);
									resolve(possibleActions);
								} else if (player.position === "ST") {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0);
									resolve(possibleActions);
								} else {
									possibleActions = populatePossibleActions(possibleActions, 0, 0, 40, 0, 0, 0, 0, 30, 0, 20, 10);
									resolve(possibleActions);
								}
							}
						}
					}
				}
			}
		}).catch(function (error) {
			console.error("Error when finding the closest opposition player ", error);
		});
	});
}

function populatePossibleActions(possibleActions, shoot, throughball, pass, cross, tackle, intercept, slide, run, sprint, cleared, boot) {
	possibleActions[0].points = shoot;
	possibleActions[1].points = throughball;
	possibleActions[2].points = pass;
	possibleActions[3].points = cross;
	possibleActions[4].points = tackle;
	possibleActions[5].points = intercept;
	possibleActions[6].points = slide;
	possibleActions[7].points = run;
	possibleActions[8].points = sprint;
	possibleActions[9].points = cleared;
	possibleActions[10].points = boot;
	return possibleActions;
}

function getBallDirection(matchDetails, nextPOS) {
	return new Promise(function (resolve, reject) {
		console.log(matchDetails);
		var currentPOS = matchDetails.ball.position;
		// - - is south east
		// - + is north east
		// + - is south west
		// ++ is north west
		var movementX = currentPos[0] - nextPOS[0];
		var movementY = currentPos[1] - nextPOS[1];
		if (movementX === 0) {
			if (movementY === 0) {
				matchDetails.ball.direction = "wait";
			} else if (movementY < 0) {
				matchDetails.ball.direction = "south";
			} else if (movementY > 0) {
				matchDetails.ball.direction = "north";
			}
		} else if (movementY === 0) {
			if (movementX < 0) {
				matchDetails.ball.direction = "east";
			} else if (movementX > 0) {
				matchDetails.ball.direction = "west";
			}
		} else if (movementX < 0 && movementY < 0) {
			matchDetails.ball.direction = "southeast";
		} else if (movementX > 0 && movementY > 0) {
			matchDetails.ball.direction = "northwest";
		} else if (movementX > 0 && movementY < 0) {
			matchDetails.ball.direction = "southwest";
		} else if (movementX < 0 && movementY > 0) {
			matchDetails.ball.direction = "northeast";
		}
		resolve();
	});
}

function ballKicked(matchDetails, player) {
	return new Promise(function (resolve, reject) {
		var position = matchDetails.ball.position;
		var direction = matchDetails.ball.direction;
		matchDetails.iterationLog.push("ball kicked by: " + player.name);
		var newPosition = [0, 0];
		var teamShootingToTop = ["wait", "north", "north", "north", "north", "east", "east", "west", "west", "northeast", "northeast", "northeast", "northwest", "northwest", "northwest"];
		var teamShootingToBottom = ["wait", "south", "south", "south", "south", "east", "east", "west", "west", "southeast", "southeast", "southeast", "southwest", "southwest", "southwest"];
		var power = calculatePower(player.skill.strength);
		if (player.originPOS[1] > (matchDetails.pitchSize[1] / 2)) {
			direction = teamShootingToTop[getRandomNumber(0, teamShootingToTop.length - 1)];
			if (direction === "wait") {
				newPosition = [position[0] + getRandomNumber(0, (power / 2)), position[1] + getRandomNumber(0, (power / 2))];
			} else if (direction === "north") {
				newPosition = [position[0] + getRandomNumber(-20, 20), position[1] + getRandomNumber(-power, -(power / 2))];
			} else if (direction === "east") {
				newPosition = [position[0] + getRandomNumber((power / 2), power), position[1] + getRandomNumber(-20, 20)];
			} else if (direction === "west") {
				newPosition = [position[0] + getRandomNumber(-power, -(power / 2)), position[1] + getRandomNumber(-20, 20)];
			} else if (direction === "northeast") {
				newPosition = [position[0] + getRandomNumber(0, (power / 2)), position[1] + getRandomNumber(-power, -(power / 2))];
			} else if (direction === "northwest") {
				newPosition = [position[0] + getRandomNumber(-(power / 2), 0), position[1] + getRandomNumber(-power, -(power / 2))];
			}
		} else {
			direction = teamShootingToBottom[getRandomNumber(0, teamShootingToBottom.length - 1)];
			if (direction === "wait") {
				newPosition = [position[0] + getRandomNumber(0, (power / 2)), position[1] + getRandomNumber(0, (power / 2))];
			} else if (direction === "east") {
				newPosition = [position[0] + getRandomNumber((power / 2), power), position[1] + getRandomNumber(-20, 20)];
			} else if (direction === "west") {
				newPosition = [getRandomNumber(position[0] - 120, position[0]), getRandomNumber(position[1] - 30, position[1] + 30)];
			} else if (direction === "south") {
				newPosition = [position[0] + getRandomNumber(-20, 20), position[1] + getRandomNumber((power / 2), power)];
			} else if (direction === "southeast") {
				newPosition = [position[0] + getRandomNumber(0, (power / 2)), position[1] + getRandomNumber((power / 2), power)];
			} else if (direction === "southwest") {
				newPosition = [position[0] + getRandomNumber(-(power / 2), 0), position[1] + getRandomNumber((power / 2), power)];
			}
		}
		resolveBallMovement(player, position, newPosition, power, kickOffTeam, secondTeam, matchDetails).then(function (endPosition) {
			matchDetails.iterationLog.push("resolving ball movement");
			matchDetails.iterationLog.push("new ball position: " + endPosition);
			resolve(endPosition);
		}).catch(function (error) {
			console.error("Error when resolving the ball movement: ", error);
			console.error(matchDetails.iterationLog);
		});
	});
}

function ballPassed(matchDetails, teammates, player) {
	return new Promise(function (resolve, reject) {
		var position = matchDetails.ball.position;
		var direction = matchDetails.ball.direction;
		var closestPlayerPosition = [0, 0];
		var playersInDistance = [];
		async.eachSeries(teammates.players, function eachPlayer(teamPlayer, teamPlayerCallback) {
			if (teamPlayer.name === player.name) {
				//do nothing
				teamPlayerCallback();
			} else {
				var playerToPlayerX = player.startPOS[0] - teamPlayer.startPOS[0];
				var playerToPlayerY = player.startPOS[1] - teamPlayer.startPOS[1];
				var proximityToBall = Math.abs(playerToPlayerX + playerToPlayerY);
				playersInDistance.push({
					"position": teamPlayer.startPOS,
					"proximity": proximityToBall,
					"name": teamPlayer.name
				});
				teamPlayerCallback();
			}
		}, function afterAllPlayers() {
			playersInDistance.sort(function (a, b) {
				return a.proximity - b.proximity
			});
			var targetPlayer = playersInDistance[getRandomNumber(0, 9)];
			if (player.skill.passing > getRandomNumber(0, 100)) {
				closestPlayerPosition = targetPlayer.position;
			} else {
				if (player.originPOS[1] > (matchDetails.pitchSize[1] / 2)) {
					if (position[1] > (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 3))) {
						closestPlayerPosition[0] = targetPlayer.position[0] + getRandomNumber(-10, 10);
						closestPlayerPosition[1] = targetPlayer.position[1] + getRandomNumber(-10, 10);
					} else if (position[1] > (matchDetails.pitchSize[1] / 3) && position[1] < (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 3))) {
						closestPlayerPosition[0] = targetPlayer.position[0] + getRandomNumber(-50, 50);
						closestPlayerPosition[1] = targetPlayer.position[1] + getRandomNumber(-50, 50);
					} else {
						closestPlayerPosition[0] = targetPlayer.position[0] + getRandomNumber(-100, 100);
						closestPlayerPosition[1] = targetPlayer.position[1] + getRandomNumber(-100, 100);
					}
				} else {
					if (position[1] > (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 3))) {
						closestPlayerPosition[0] = targetPlayer.position[0] + getRandomNumber(-100, 100);
						closestPlayerPosition[1] = targetPlayer.position[1] + getRandomNumber(-100, 100);
					} else if (position[1] > (matchDetails.pitchSize[1] / 3) && position[1] < (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 3))) {
						closestPlayerPosition[0] = targetPlayer.position[0] + getRandomNumber(-50, 50);
						closestPlayerPosition[1] = targetPlayer.position[1] + getRandomNumber(-50, 50);
					} else {
						closestPlayerPosition[0] = targetPlayer.position[0] + getRandomNumber(-10, 10);
						closestPlayerPosition[1] = targetPlayer.position[1] + getRandomNumber(-10, 10);
					}
				}
			}
			matchDetails.iterationLog.push("ball passed by: " + player.name + " to: " + targetPlayer.name);
			var power = calculatePower(player.skill.strength);
			resolveBallMovement(player, position, closestPlayerPosition, power, kickOffTeam, secondTeam, matchDetails).then(function (endPosition) {
				resolve(endPosition);
			}).catch(function (error) {
				console.error("Error when resolving the ball movement: ", error);
				console.error(matchDetails.iterationLog);
			});
		});
	});
}

function throughBall(matchDetails, teammates, player) {
	return new Promise(function (resolve, reject) {
		var position = matchDetails.ball.position;
		var direction = matchDetails.ball.direction;
		var closestPlayerPosition = [0, 0];
		var playersInDistance = [];
		async.eachSeries(teammates.players, function eachPlayer(teamPlayer, teamPlayerCallback) {
			if (teamPlayer.name === player.name) {
				//do nothing
				teamPlayerCallback();
			} else {
				var playerToPlayerX = player.startPOS[0] - teamPlayer.startPOS[0];
				var playerToPlayerY = player.startPOS[1] - teamPlayer.startPOS[1];
				var proximityToBall = Math.abs(playerToPlayerX + playerToPlayerY);
				playersInDistance.push({
					"position": teamPlayer.startPOS,
					"proximity": proximityToBall,
					"name": teamPlayer.name
				});
				teamPlayerCallback();
			}
		}, function afterAllPlayers() {
			playersInDistance.sort(function (a, b) {
				return a.proximity - b.proximity;
			});
			var targetPlayer = playersInDistance[getRandomNumber(0, 9)];
			matchDetails.iterationLog.push("through ball passed by: " + player.name + " to: " + targetPlayer.name);
			if (player.skill.passing > getRandomNumber(0, 100)) {
				if (player.originPOS[1] > matchDetails.pitchSize[1] / 2) {
					closestPlayerPosition[0] = targetPlayer.position[0];
					closestPlayerPosition[1] = targetPlayer.position[1] - 10;
				} else {
					closestPlayerPosition[0] = targetPlayer.position[0];
					closestPlayerPosition[1] = targetPlayer.position[1] + 10;
				}
			} else {
				if (player.originPOS[1] > (matchDetails.pitchSize[1] / 2)) {
					if (position[1] > (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 3))) {
						closestPlayerPosition[0] = targetPlayer.position[0] + getRandomNumber(-10, 10);
						closestPlayerPosition[1] = targetPlayer.position[1] + getRandomNumber(-10, 10);
					} else if (position[1] > (matchDetails.pitchSize[1] / 3) && position[1] < (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 3))) {
						closestPlayerPosition[0] = targetPlayer.position[0] + getRandomNumber(-20, 20);
						closestPlayerPosition[1] = targetPlayer.position[1] + getRandomNumber(-50, 50);
					} else {
						closestPlayerPosition[0] = targetPlayer.position[0] + getRandomNumber(-30, 30);
						closestPlayerPosition[1] = targetPlayer.position[1] + getRandomNumber(-100, 100);
					}
				} else {
					if (position[1] > (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 3))) {
						closestPlayerPosition[0] = targetPlayer.position[0] + getRandomNumber(-30, 30);
						closestPlayerPosition[1] = targetPlayer.position[1] + getRandomNumber(-100, 100);
					} else if (position[1] > (matchDetails.pitchSize[1] / 3) && position[1] < (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 3))) {
						closestPlayerPosition[0] = targetPlayer.position[0] + getRandomNumber(-20, 20);
						closestPlayerPosition[1] = targetPlayer.position[1] + getRandomNumber(-50, 50);
					} else {
						closestPlayerPosition[0] = targetPlayer.position[0] + getRandomNumber(-10, 10);
						closestPlayerPosition[1] = targetPlayer.position[1] + getRandomNumber(-10, 10);
					}
				}
			}
			var power = calculatePower(player.skill.strength);
			resolveBallMovement(player, position, closestPlayerPosition, power, kickOffTeam, secondTeam, matchDetails).then(function (endPosition) {
				matchDetails.iterationLog.push("resolving ball movement");
				matchDetails.iterationLog.push("new ball position: " + endPosition);
				resolve(endPosition);
			}).catch(function (error) {
				console.error("Error when resolving the ball movement: ", error);
				console.error(matchDetails.iterationLog);
			});
		});
	});
}

function resolveBallMovement(player, currentPOS, newPOS, power, team, opposition, matchDetails) {
	return new Promise(function (resolve, reject) {
		var deflectionPlayer;
		var deflectionPosition;
		var deflectionTeam;
		getBallTrajectory(currentPOS, newPOS, power).then(function (lineToEndPosition) {
			async.eachSeries(lineToEndPosition, function eachPos(thisPos, thisPosCallback) {
					closestPlayerToPosition(player, team, thisPos).then(function (playerInformation) {
						var thisTeamPlayer = playerInformation.thePlayer;
						if (thisTeamPlayer && thisTeamPlayer.startPOS[0] === thisPos[0] && thisTeamPlayer.startPOS[1] === thisPos[1]) {
							if (!deflectionPlayer) {
								if (thisPos[2] < thisTeamPlayer.skill.jumping && thisPos[2] > 49) {
									deflectionPlayer = thisTeamPlayer;
									deflectionPosition = thisPos;
									deflectionTeam = team.name;
								}
							}
							thisPosCallback();
						} else {
							closestPlayerToPosition(player, opposition, thisPos).then(function (playerInformation) {
								var thatTeamPlayer = playerInformation.thePlayer;
								if (thatTeamPlayer) {
									if (thatTeamPlayer.startPOS[0] === thisPos[0] && thatTeamPlayer.startPOS[1] === thisPos[1]) {
										if (!deflectionPlayer) {
											if (thisPos[2] < thatTeamPlayer.skill.jumping && thisPos[2] < 49) {
												deflectionPlayer = thatTeamPlayer;
												deflectionPosition = thisPos;
												deflectionTeam = opposition.name;
											}
										}
									}
								}
								thisPosCallback();
							}).catch(function (error) {
								console.error("Error when getting this teams closest player to that position: ", error);
								console.error(matchDetails.iterationLog);
							});
						}
					}).catch(function (error) {
						console.error("Error when getting this teams closest player to this position: ", error);
						console.error(matchDetails.iterationLog);
					});
				},
				function afterAllPos() {
					if (!deflectionPlayer) {
						keepInBoundaries(newPOS, player.originPOS[1], matchDetails).then(function (finalPosition) {
							matchDetails.iterationLog.push("Ball reached its target");
							resolve(finalPosition);
						}).catch(function (error) {
							console.error("Error when keeping ball in boundaries: ", error);
							console.error(matchDetails.iterationLog);
						});
					} else {
						resolveDeflection(power, currentPOS, deflectionPosition, deflectionPlayer, deflectionTeam, matchDetails).then(function (newPosition) {
							matchDetails.iterationLog.push("Ball deflected");
							resolve(newPosition);
						}).catch(function (error) {
							console.error("Error when resolving the deflection: ", error);
							console.error(matchDetails.iterationLog);
						});
					}
				});
		}).catch(function (error) {
			console.error("Error when getting the ball trajectory: ", error);
			console.error(matchDetails.iterationLog);
		});
	});
}

function resolveDeflection(power, currentPOS, deflectionPosition, deflectionPlayer, deflectionTeam, matchDetails) {
	return new Promise(function (resolve, reject) {
		var xMovement = Math.pow((currentPOS[0] - deflectionPosition[0]), 2);
		var yMovement = Math.pow((currentPOS[1] - deflectionPosition[1]), 2);
		var movementDistance = Math.sqrt(xMovement + yMovement);
		var newPower = power - movementDistance;
		var tempPosition = ["", ""];
		if (newPower < 75) {
			deflectionPlayer.hasBall = true;
			matchDetails.ball.Player = deflectionPlayer.name;
			matchDetails.ball.withPlayer = true;
			matchDetails.ball.withTeam = deflectionTeam;
		} else {
			if (matchDetails.ball.direction === "east" || matchDetails.ball.direction === "northeast" || matchDetails.ball.direction === "southeast") {
				if (matchDetails.ball.direction === "east") {
					tempPosition[1] = getRandomNumber(deflectionPosition[1] - 3, deflectionPosition[1] + 3);
				}
				tempPosition[0] = deflectionPosition[0] - (newPower / 2);
			} else if (matchDetails.ball.direction === "west" || matchDetails.ball.direction === "northwest" || matchDetails.ball.direction === "southwest") {
				if (matchDetails.ball.direction === "west") {
					tempPosition[1] = getRandomNumber(deflectionPosition[1] - 3, deflectionPosition[1] + 3);
				}
				tempPosition[0] = deflectionPosition[0] + (newPower / 2);
			}
			if (matchDetails.ball.direction === "north" || matchDetails.ball.direction === "northeast" || matchDetails.ball.direction === "northwest") {
				if (matchDetails.ball.direction === "north") {
					tempPosition[0] = getRandomNumber(deflectionPosition[0] - 3, deflectionPosition[0] + 3);
				}
				tempPosition[1] = deflectionPosition[1] + (newPower / 2);
			} else if (matchDetails.ball.direction === "south" || matchDetails.ball.direction === "southeast" || matchDetails.ball.direction === "southwest") {
				if (matchDetails.ball.direction === "south") {
					tempPosition[0] = getRandomNumber(deflectionPosition[0] - 3, deflectionPosition[0] + 3);
				}
				tempPosition[1] = deflectionPosition[1] - (newPower / 2);
			}
			if (matchDetails.ball.direction === "wait") {
				tempPosition[0] = getRandomNumber(-newPower / 2, newPower / 2);
				tempPosition[1] = getRandomNumber(-newPower / 2, newPower / 2);
			}
			keepInBoundaries(tempPosition, deflectionPlayer.originPOS[1], matchDetails).then(function (finalPosition) {
				resolve(finalPosition);
			}).catch(function (error) {
				console.error("Error when keeping ball in boundaries: ", error);
				console.error(matchDetails.iterationLog);
			});
		}
	});
}

function getBallTrajectory(currentPOS, newPOS, power) {
	return new Promise(function (resolve, reject) {
		var xMovement = Math.pow((currentPOS[0] - newPOS[0]), 2);
		var yMovement = Math.pow((parseInt(currentPOS[1]) - parseInt(newPOS[1])), 2);
		var movementDistance = Math.round(Math.sqrt(xMovement + yMovement), 0);
		var arraySize = Math.round(currentPOS[1] - newPOS[1]);
		if (movementDistance >= power) {
			power = parseInt(power) + parseInt(movementDistance);
		}
		var height = Math.sqrt(Math.abs(Math.pow(movementDistance / 2, 2) - Math.pow(power / 2, 2)));
		if (arraySize < 1) {
			arraySize = 1;
		}
		var yPlaces = Array.apply(null, Array(Math.abs(arraySize))).map(function (x, i) {
			return i;
		});
		var trajectory = [];
		trajectory.push([currentPOS[0], currentPOS[1], 0]);
		var changeInX = (newPOS[0] - currentPOS[0]) / Math.abs(currentPOS[1] - newPOS[1]);
		var changeInY = (currentPOS[1] - newPOS[1]) / (newPOS[1] - currentPOS[1]);
		var changeInH = height / (yPlaces.length / 2);
		var elevation = 1;
		async.eachSeries(yPlaces, function eachPos(thisYPos, thisYPosCallback) {
			var lastX = trajectory[trajectory.length - 1][0];
			var lastY = trajectory[trajectory.length - 1][1];
			var lastH = trajectory[trajectory.length - 1][2];
			var xPos = round(lastX + changeInX, 5);
			if (newPOS[1] > currentPOS[1]) {
				yPos = parseInt(lastY) - parseInt(changeInY);
			} else {
				yPos = parseInt(lastY) + parseInt(changeInY);
			}
			var hPos;
			if (elevation === 1) {
				hPos = round(lastH + changeInH, 5);
				if (hPos >= height) {
					elevation = 0;
					hPos = height;
				}
			} else {
				hPos = round(lastH - changeInH, 5);
			}
			trajectory.push([xPos, yPos, hPos]);
			thisYPosCallback();
		}, function afterAllYPos() {
			resolve(trajectory);
		});
	});
}

function resolveTackle(player, team, opposition, matchDetails) {
	return new Promise(function (resolve, reject) {
		var foul = false;
		matchDetails.iterationLog.push("Tackle attempted by: " + player.name);
		async.eachSeries(opposition.players, function eachPlayer(thatPlayer, thatPlayerCallback) {
				if (matchDetails.ball.Player === thatPlayer.name) {
					var tackleScore = (parseInt(player.skill.tackling) + parseInt(player.skill.strength)) / 2;
					tackleScore += getRandomNumber(-5, 5);
					var retentionScore = (parseInt(thatPlayer.skill.agility) + parseInt(thatPlayer.skill.strength)) / 2;
					retentionScore += getRandomNumber(-5, 5);
					if (wasFoul(10, 10) === true) {
						matchDetails.iterationLog.push("Foul against: ", thatPlayer.name);
						foul = true;
					} else {
						if (tackleScore > retentionScore) {
							matchDetails.iterationLog.push("Successful tackle by: ", player.name);
							if (isInjured(1000) === true) {
								thatPlayer.injured = true;
								matchDetails.iterationLog.push("Player Injured - " + thatPlayer.name);
							}
							if (isInjured(1200) === true) {
								player.injured = true;
								matchDetails.iterationLog.push("Player Injured - " + thatPlayer.name);
							}
							player.hasBall = true;
							matchDetails.ball.Player = player.name;
							matchDetails.ball.withPlayer = true;
							matchDetails.ball.withTeam = team.name;
							team.intent = "attack";
							opposition.intent = "defend";
							if (player.originPOS[1] > matchDetails.pitchSize[1] / 2) {
								player.startPOS[1]--;
								matchDetails.ball.position[1]--;
								thatPlayer.startPOS[1]++;
							} else {
								player.startPOS[1]++;
								matchDetails.ball.position[1]++;
								thatPlayer.startPOS[1]--;
							}
						} else {
							matchDetails.iterationLog.push("Failed tackle by: ", player.name);
							if (isInjured(1200) === true) {
								thatPlayer.injured = true;
								matchDetails.iterationLog.push("Player Injured - " + thatPlayer.name);
							}
							if (isInjured(1000) === true) {
								player.injured = true;
								matchDetails.iterationLog.push("Player Injured - " + thatPlayer.name);
							}
							if (thatPlayer.originPOS[1] > pitchSize[1] / 2) {
								thatPlayer.startPOS[1]--;
								matchDetails.ball.position[1]--;
								player.startPOS[1]++;
							} else {
								thatPlayer.startPOS[1]++;
								matchDetails.ball.position[1]++;
								player.startPOS[1]--;
							}
						}
					}
				}
				thatPlayerCallback();
			},
			function afterAllPlayers() {
				resolve(foul);
			});
	});
}

function resolveSlide(player, team, opposition, matchDetails) {
	return new Promise(function (resolve, reject) {
		var foul = false;
		matchDetails.iterationLog.push("Slide tackle attempted by: " + player.name);
		async.eachSeries(opposition.players, function eachPlayer(thatPlayer, thatPlayerCallback) {
				if (matchDetails.ball.Player === thatPlayer.name) {
					var tackleScore = (parseInt(player.skill.tackling) + parseInt(player.skill.strength)) / 2;
					tackleScore += getRandomNumber(-5, 5);
					var retentionScore = (parseInt(thatPlayer.skill.agility) + parseInt(thatPlayer.skill.strength)) / 2;
					retentionScore += getRandomNumber(-5, 5);
					if (wasFoul(20, 32) === true) {
						matchDetails.iterationLog.push("Foul against: " + thatPlayer.name);
						foul = true;
					} else {
						if (tackleScore > retentionScore) {
							matchDetails.iterationLog.push("Successful tackle by: ", player.name);
							if (isInjured(600) === true) {
								thatPlayer.injured = true;
								matchDetails.iterationLog.push("Player Injured - " + thatPlayer.name);
							}
							if (isInjured(800) === true) {
								player.injured = true;
								matchDetails.iterationLog.push("Player Injured - " + thatPlayer.name);
							}
							player.hasBall = true;
							matchDetails.ball.Player = player.name;
							matchDetails.ball.withPlayer = true;
							matchDetails.ball.withTeam = team.name;
							team.intent = "attack";
							opposition.intent = "defend";
							if (player.originPOS[1] > matchDetails.pitchSize[1] / 2) {
								player.startPOS[1] += -3;
								matchDetails.ball.position[1] += -3;
								thatPlayer.startPOS[1]++;
							} else {
								player.startPOS[1] += 3;
								matchDetails.ball.position[1] += 3;
								thatPlayer.startPOS[1] += -3;
							}
						} else {
							matchDetails.iterationLog.push("Failed tackle by: ", player.name);
							if (isInjured(800) === true) {
								thatPlayer.injured = true;
								matchDetails.iterationLog.push("Player Injured - " + thatPlayer.name);
							}
							if (isInjured(600) === true) {
								player.injured = true;
								matchDetails.iterationLog.push("Player Injured - " + thatPlayer.name);
							}
							if (thatPlayer.originPOS[1] > matchDetails.pitchSize[1] / 2) {
								thatPlayer.startPOS[1] += -3;
								matchDetails.ball.position[1] += -3;
								player.startPOS[1] += 3;
							} else {
								thatPlayer.startPOS[1] += 3;
								matchDetails.ball.position[1] += 3;
								player.startPOS[1] += -3;
							}
						}
					}
				}
				thatPlayerCallback();
			},
			function afterAllPlayers() {
				resolve(foul);
			});
	});
}

function wasFoul(x, y) {
	var foul = getRandomNumber(0, x);
	if (isBetween(foul, 0, (y / 2) - 1)) {
		return true;
	} else {
		return false;
	}
}

function shotMade(matchDetails, team, opposition, player) {
	return new Promise(function (resolve, reject) {
		var position = matchDetails.ball.position;
		var direction = matchDetails.ball.direction;
		matchDetails.iterationLog.push("Shot Made by: " + player.name);
		var shotPosition = [0, 0];
		var distanceFromGoal;
		var shotPower = calculatePower(player.skill.strength);
		if (player.originPOS[1] > matchDetails.pitchSize[1] / 2) {
			distanceFromGoal = player.startPOS[1] - 0;
			if (isBetween(shotPower, distanceFromGoal, distanceFromGoal + 50)) {
				if (player.skill.shooting > getRandomNumber(0, 100)) {
					matchDetails.iterationLog.push("Shot On Target");
					shotPosition[0] = getRandomNumber((matchDetails.pitchSize[0] / 2) - 20, (matchDetails.pitchSize[0] / 2) + 20);
					shotPosition[1] = 0;
					matchDetails.secondTeamStatistics.shots++;
					resolveBallMovement(player, player.startPOS, shotPosition, shotPower, team, opposition, matchDetails).then(function (endPosition) {
						matchDetails.iterationLog.push("resolving ball movement whilst making a shot");
						if (shotPosition[0] !== endPosition[0] || shotPosition[1] !== endPosition[1]) {
							matchDetails.iterationLog.push("Ball deflected to: " + endPosition);
						}
						if (isBetween(opposition.players[0].startPOS[0], endPosition[0] - 15, endPosition[0] + 15) && isBetween(opposition.players[0].startPOS[1], -1, 5)) {
							if (opposition.players[0].skill.saving > getRandomNumber(0, 100)) {
								matchDetails.iterationLog.push("Shot Saved by: " + opposition.players[0].name);
								opposition.players[0].hasBall = true;
								matchDetails.ball.Player = opposition.players[0].name;
								var tempArray = opposition.players[0].startPOS;
								matchDetails.ball.position = tempArray.map(x => x);
								opposition.intent = "attack";
								team.intent = "defend";
								resolve(endPosition);
							} else {
								setGoalScored(team, opposition, matchDetails).then(function () {
									matchDetails.iterationLog.push("Goal Scored by: " + player.name);
									matchDetails.secondTeamStatistics.goals++;
									resolve(endPosition);
								}).catch(function (error) {
									console.error("Error when processing the goal: ", error);
									console.error(matchDetails.iterationLog);
								});
							}
						} else {
							setGoalScored(team, opposition, matchDetails).then(function () {
								matchDetails.iterationLog.push("Goal Scored by - " + player.name);
								matchDetails.secondTeamStatistics.goals++;
								resolve(endPosition);
							}).catch(function (error) {
								console.error("Error when processing the goal: ", error);
								console.error(matchDetails.iterationLog);
							});
						}
					}).catch(function (error) {
						console.error("Error when resolving ball movement during the shot: ", error);
						console.error(matchDetails.iterationLog);
					});
				} else {
					shotPosition[0] = getRandomNumber((matchDetails.pitchSize[0] / 2) - 30, (matchDetails.pitchSize[0] / 2) + 30);
					shotPosition[1] = getRandomNumber(1, 20);
					resolveBallMovement(player, player.startPOS, shotPosition, shotPower, team, opposition, matchDetails).then(function (endPosition) {
						matchDetails.iterationLog.push("Shot Off Target");
						matchDetails.iterationLog.push("resolving ball movement");
						if (shotPosition[0] !== endPosition[0] || shotPosition[1] !== endPosition[1]) {
							matchDetails.iterationLog.push("Ball deflected to: " + endPosition);
						}
						resolve(endPosition);
					}).catch(function (error) {
						console.error("Error when resolving ball movement after a failed shot: ", error);
						console.error(iterationLog);
					});
				}
			} else if (shotPower > (distanceFromGoal + 49)) {
				setGoalKick(opposition, team, matchDetails).then(function (endPosition) {
					matchDetails.iterationLog.push("Shot Missed the goal, Goal Kick to: " + opposition.name);
					resolve(endPosition);
				}).catch(function (error) {
					console.error("Error when setting a goal kick after a shot has been made: ", error);
					console.error(matchDetails.iterationLog);
				});
			} else {
				matchDetails.iterationLog.push("Shot not hard enough by: " + opposition.name);
				shotPosition[0] = matchDetails.ball.position[0];
				shotPosition[1] = matchDetails.ball.position[1] - shotPower;
				resolveBallMovement(player, player.startPOS, shotPosition, shotPower, team, opposition, matchDetails).then(function (endPosition) {
					matchDetails.iterationLog.push("Shot Off Target");
					matchDetails.iterationLog.push("resolving ball movement");
					if (shotPosition[0] !== endPosition[0] || shotPosition[1] !== endPosition[1]) {
						matchDetails.iterationLog.push("Ball deflected to: " + endPosition);
					}
					resolve(endPosition);
				}).catch(function (error) {
					console.error("Error when resolving ball movement after a failed shot: ", error);
					console.error(matchDetails.iterationLog);
				});
			}
		} else {
			distanceFromGoal = matchDetails.pitchSize[1] - player.startPOS[1];
			if (isBetween(shotPower, distanceFromGoal, distanceFromGoal + 50)) {
				if (player.skill.shooting > getRandomNumber(0, 100)) {
					matchDetails.iterationLog.push("Shot On Target");
					shotPosition[0] = getRandomNumber((matchDetails.pitchSize[0] / 2) - 20, (matchDetails.pitchSize[0] / 2) + 20);
					shotPosition[1] = matchDetails.pitchSize[1];
					matchDetails.kickOffTeamStatistics.shots++;
					resolveBallMovement(player, player.startPOS, shotPosition, shotPower, team, opposition, matchDetails).then(function (endPosition) {
						matchDetails.iterationLog.push("resolving ball movement whilst making a shot");
						if (shotPosition[0] !== endPosition[0] || shotPosition[1] !== endPosition[1]) {
							matchDetails.iterationLog.push("Ball deflected to: " + endPosition);
						}
						if (isBetween(opposition.players[0].startPOS[0], endPosition[0] - 5, endPosition[0] + 5) && isBetween(opposition.players[0].startPOS[1], matchDetails.pitchSize[1] - 5, matchDetails.pitchSize[1] + 1)) {
							if (opposition.players[0].skill.saving > getRandomNumber(0, 100)) {
								matchDetails.iterationLog.push("Shot Saved by: " + opposition.players[0].name);
								opposition.players[0].hasBall = true;
								matchDetails.ball.Player = opposition.players[0].name;
								var tempArray = opposition.players[0].startPOS;
								matchDetails.ball.position = tempArray.map(x => x);
								opposition.intent = "attack";
								team.intent = "defend";
								resolve(endPosition);
							} else {
								setGoalScored(team, opposition, matchDetails).then(function () {
									matchDetails.iterationLog.push("Goal Scored by: " + player.name);
									matchDetails.kickOffTeamStatistics.goals++;
									resolve(endPosition);
								}).catch(function (error) {
									console.error("Error when processing the goal: ", error);
									console.error(matchDetails.iterationLog);
								});
							}
						} else {
							setGoalScored(team, opposition, matchDetails).then(function () {
								matchDetails.iterationLog.push("Goal Scored by: " + player.name);
								matchDetails.kickOffTeamStatistics.goals++;
								resolve(endPosition);
							}).catch(function (error) {
								console.error("Error when processing the goal: ", error);
								console.error(matchDetails.iterationLog);
							});
						}
					}).catch(function (error) {
						console.error("Error when resolving ball movement during the shot: ", error);
						console.error(matchDetails.iterationLog);
					});
				} else {
					shotPosition[0] = getRandomNumber((matchDetails.pitchSize[0] / 2) - 30, (matchDetails.pitchSize[0] / 2) + 30);
					shotPosition[1] = getRandomNumber(matchDetails.pitchSize[1] - 1, matchDetails.pitchSize[1] - 20);
					resolveBallMovement(player, player.startPOS, shotPosition, shotPower, team, opposition, matchDetails).then(function (endPosition) {
						matchDetails.iterationLog.push("Shot Off Target");
						if (shotPosition[0] !== endPosition[0] || shotPosition[1] !== endPosition[1]) {
							matchDetails.iterationLog.push("Ball deflected to: " + endPosition);
						}
						resolve(endPosition);
					}).catch(function (error) {
						console.error("Error when resolving ball movement after a failed shot: ", error);
						console.error(matchDetails.iterationLog);
					});
				}
			} else if (shotPower > (distanceFromGoal + 49)) {
				setGoalKick(opposition, team, matchDetails).then(function (endPosition) {
					matchDetails.iterationLog.push("Shot Missed, Goal Kick to: " + opposition.name);
					resolve(endPosition);
				}).catch(function (error) {
					console.error("Error when setting a goal kick after a shot has been made: ", error);
					console.error(matchDetails.iterationLog);
				});
			} else {
				matchDetails.iterationLog.push("Shot not hard enough by: " + opposition.name);
				shotPosition[0] = matchDetails.ball.position[0];
				shotPosition[1] = matchDetails.ball.position[1] + shotPower;
				matchDetails.iterationLog.push("resolving ball movement");
				resolveBallMovement(player, player.startPOS, shotPosition, shotPower, team, opposition, matchDetails).then(function (endPosition) {
					matchDetails.iterationLog.push("Shot Off Target");
					if (shotPosition[0] !== endPosition[0] || shotPosition[1] !== endPosition[1]) {
						matchDetails.iterationLog.push("Ball deflected to: " + endPosition);
					}
					resolve(endPosition);
				}).catch(function (error) {
					console.error("Error when resolving ball movement after a failed shot: ", error);
					console.error(matchDetails.iterationLog);
				});
			}
		}
	});
}

function resetClosestPlayer() {
	closestPlayerA.name = "";
	closestPlayerA.position = 10000;
	closestPlayerB.name = "";
	closestPlayerB.position = 10000;
}

function calculatePower(strength) {
	var hit = getRandomNumber(1, 5);
	var power = parseInt(strength) * hit;
	return power;
}

function setSetpiece(matchDetails, team, opposition) {
	return new Promise(function (resolve, reject) {
		var ballPosition = matchDetails.ball.position;
		if (team.players[0].originPOS[1] > matchDetails.pitchSize[1] / 2) {
			if (isBetween(ballPosition[0], (matchDetails.pitchSize[0] / 4) - 5, matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5) && isBetween(ballPosition[1], 0, (matchDetails.pitchSize[1] / 6) - 5)) {
				setPenalty(team, opposition, "top", matchDetails).then(function () {
					matchDetails.iterationLog.push("penalty to: " + team.name);
					resolve();
				}).catch(function (error) {
					console.error("Error whilst setting the penalty for " + team.name + ": ", error);
					console.error(matchDetails.iterationLog);
				});
			} else {
				setFreekick(ballPosition, team, opposition, "top", matchDetails).then(function () {
					matchDetails.iterationLog.push("freekick to: " + team.name);
					resolve();
				}).catch(function (error) {
					console.error("Error whilst setting the freekick for " + team.name + ": ", error);
					console.error(matchDetails.iterationLog);
				});
			}
		} else {
			if (isBetween(ballPosition[0], (matchDetails.pitchSize[0] / 4) - 5, matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5) && isBetween(ballPosition[1], matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) + 5, matchDetails.pitchSize[1])) {
				setPenalty(team, opposition, "bottom", matchDetails).then(function () {
					matchDetails.iterationLog.push("penalty to: " + team.name);
					resolve();
				}).catch(function (error) {
					console.error("Error whilst setting the penalty for " + team.name + ": ", error);
					console.error(matchDetails.iterationLog);
				});
				resolve();
			} else {
				setFreekick(ballPosition, team, opposition, "bottom", matchDetails).then(function () {
					matchDetails.iterationLog.push("freekick to: " + team.name);
					resolve();
				}).catch(function (error) {
					console.error("Error whilst setting the freekick for " + team.name + ": ", error);
					console.error(matchDetails.iterationLog);
				});
			}
		}
	});
}

function setPenalty(team, opposition, side, matchDetails) {
	return new Promise(function (resolve, reject) {
		if (side === "top") {
			var tempArray = [matchDetails.pitchSize[0] / 2, matchDetails.pitchSize[1] / 6];
			var shootArray = [matchDetails.pitchSize[0] / 2, 60];
			matchDetails.ball.direction = "north";
			matchDetails.ball.position = shootArray.map(x => x);
			matchDetails.ball.position[1] += -2;
		} else {
			var tempArray = [matchDetails.pitchSize[0] / 2, matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6)];
			var shootArray = [matchDetails.pitchSize[0] / 2, matchDetails.pitchSize[1] - 60];
			matchDetails.ball.direction = "south";
			matchDetails.ball.position = shootArray.map(x => x);
			matchDetails.ball.position[1] += 2;
		}
		opposition.players[0].startPOS = opposition.players[0].originPOS.map(x => x);
		opposition.players[1].startPOS = tempArray.map(x => x);
		opposition.players[2].startPOS = tempArray.map(x => x);
		opposition.players[3].startPOS = tempArray.map(x => x);
		opposition.players[4].startPOS = tempArray.map(x => x);
		opposition.players[5].startPOS = tempArray.map(x => x);
		opposition.players[6].startPOS = tempArray.map(x => x);
		opposition.players[7].startPOS = tempArray.map(x => x);
		opposition.players[8].startPOS = tempArray.map(x => x);
		opposition.players[9].startPOS = tempArray.map(x => x);
		opposition.players[10].startPOS = tempArray.map(x => x);
		opposition.players[1].startPOS[0] += -10;
		opposition.players[2].startPOS[0] += -8;
		opposition.players[3].startPOS[0] += -6;
		opposition.players[4].startPOS[0] += -4;
		opposition.players[5].startPOS[0] += -2;
		opposition.players[6].startPOS[0] += 0;
		opposition.players[7].startPOS[0] += 2;
		opposition.players[8].startPOS[0] += 4;
		opposition.players[9].startPOS[0] += 6;
		opposition.players[10].startPOS[0] += 8;
		team.players[1].startPOS = tempArray.map(x => x);
		team.players[2].startPOS = tempArray.map(x => x);
		team.players[3].startPOS = tempArray.map(x => x);
		team.players[4].startPOS = tempArray.map(x => x);
		team.players[5].startPOS = tempArray.map(x => x);
		team.players[6].startPOS = tempArray.map(x => x);
		team.players[7].startPOS = tempArray.map(x => x);
		team.players[8].startPOS = tempArray.map(x => x);
		team.players[9].startPOS = tempArray.map(x => x);
		team.players[10].startPOS = shootArray.map(x => x);
		team.players[1].startPOS[0] += -9;
		team.players[2].startPOS[0] += -7;
		team.players[3].startPOS[0] += -5;
		team.players[4].startPOS[0] += -3;
		team.players[5].startPOS[0] += -1;
		team.players[6].startPOS[0] += 1;
		team.players[7].startPOS[0] += 3;
		team.players[8].startPOS[0] += 5;
		team.players[9].startPOS[0] += 7;
		team.players[10].hasBall = true;
		matchDetails.ball.Player = team.players[10].name;
		matchDetails.ball.withPlayer = true;
		matchDetails.ball.withTeam = team.name;
		team.intent = "attack";
		opposition.intent = "defend";
		resolve();
	});
}

function setFreekick(ballPosition, team, opposition, side, matchDetails) {
	return new Promise(function (resolve, reject) {
		var tempArray = ballPosition;
		team.players[0].startPOS = team.players[0].originPOS.map(x => x);
		team.players[1].startPOS = team.players[1].originPOS.map(x => x);
		team.players[2].startPOS = team.players[2].originPOS.map(x => x);
		team.players[3].startPOS = team.players[3].originPOS.map(x => x);
		team.players[4].startPOS = team.players[4].originPOS.map(x => x);
		team.players[5].startPOS = tempArray.map(x => x);
		matchDetails.ball.withTeam = team.name;
		matchDetails.ball.withPlayer = true;
		matchDetails.ball.Player = team.players[5].name;
		team.players[5].hasBall = true;
		opposition.players[0].startPOS = opposition.players[0].originPOS.map(x => x);
		opposition.players[1].startPOS = opposition.players[1].originPOS.map(x => x);
		opposition.players[2].startPOS = opposition.players[2].originPOS.map(x => x);
		opposition.players[3].startPOS = opposition.players[3].originPOS.map(x => x);
		opposition.players[4].startPOS = opposition.players[4].originPOS.map(x => x);
		if (side === "top") {
			//shooting to top of pitch
			if (ballPosition[1] > (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 3))) {
				matchDetails.ball.Player = team.players[0].name;
				team.players[0].hasBall = true;
				team.players[0].startPOS = tempArray.map(x => x);
				team.players[1].startPOS = [team.players[1].originPOS[0], (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) - (600 - team.players[0].startPOS[1]) - (600 - team.players[1].originPOS[1]))];
				team.players[2].startPOS = [team.players[2].originPOS[0], (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) - (600 - team.players[0].startPOS[1]) - (600 - team.players[2].originPOS[1]))];
				team.players[3].startPOS = [team.players[3].originPOS[0], (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) - (600 - team.players[0].startPOS[1]) - (600 - team.players[3].originPOS[1]))];
				team.players[4].startPOS = [team.players[4].originPOS[0], (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) - (600 - team.players[0].startPOS[1]) - (600 - team.players[4].originPOS[1]))];
				team.players[5].startPOS = [team.players[5].originPOS[0], (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) - (600 - team.players[0].startPOS[1]) - (600 - team.players[5].originPOS[1]))];
				team.players[6].startPOS = [team.players[6].originPOS[0], (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) - (600 - team.players[0].startPOS[1]) - (600 - team.players[6].originPOS[1]))];
				team.players[7].startPOS = [team.players[7].originPOS[0], (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) - (600 - team.players[0].startPOS[1]) - (600 - team.players[7].originPOS[1]))];
				team.players[8].startPOS = [team.players[8].originPOS[0], (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) - (600 - team.players[0].startPOS[1]) - (600 - team.players[8].originPOS[1]))];
				team.players[9].startPOS = [team.players[9].originPOS[0], (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) - (600 - team.players[0].startPOS[1]) - (600 - team.players[9].originPOS[1]))];
				team.players[10].startPOS = [team.players[10].originPOS[0], (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) - (600 - team.players[0].startPOS[1]) - (600 - team.players[10].originPOS[1]))];
				opposition.players[1].startPOS = [opposition.players[1].originPOS[0], opposition.players[1].originPOS[1] + (matchDetails.pitchSize[1] / 6)];
				opposition.players[2].startPOS = [opposition.players[2].originPOS[0], opposition.players[2].originPOS[1] + (matchDetails.pitchSize[1] / 6)];
				opposition.players[3].startPOS = [opposition.players[3].originPOS[0], opposition.players[3].originPOS[1] + (matchDetails.pitchSize[1] / 6)];
				opposition.players[4].startPOS = [opposition.players[4].originPOS[0], opposition.players[4].originPOS[1] + (matchDetails.pitchSize[1] / 6)];
				opposition.players[9].startPOS = [opposition.players[9].originPOS[0] + 10, team.players[1].startPOS[1]];
				opposition.players[10].startPOS = [opposition.players[10].originPOS[0] + 10, team.players[1].startPOS[1]];
				opposition.players[5].startPOS = [opposition.players[5].originPOS[0], opposition.players[5].originPOS[1] + (matchDetails.pitchSize[1] / 6)];
				opposition.players[6].startPOS = [opposition.players[6].originPOS[0], opposition.players[6].originPOS[1] + (matchDetails.pitchSize[1] / 6)];
				opposition.players[7].startPOS = [opposition.players[7].originPOS[0], opposition.players[7].originPOS[1] + (matchDetails.pitchSize[1] / 6)];
				opposition.players[8].startPOS = [opposition.players[8].originPOS[0], opposition.players[8].originPOS[1] + (matchDetails.pitchSize[1] / 6)];
			} else if (ballPosition[1] > (matchDetails.pitchSize[1] / 2) && ballPosition[1] < (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 3))) {
				//ball in own half and opposition is at the bottom of pitch
				if (ballPosition[0] > matchDetails.pitchSize[0] / 2) {
					matchDetails.ball.direction = "northwest";
				} else if (ballPosition[0] < matchDetails.pitchSize[0] / 2) {
					matchDetails.ball.direction = "northeast";
				} else {
					matchDetails.ball.direction = "north";
				}
				var level = getRandomNumber(matchDetails.pitchSize[1] / 2, 200);
				team.players[1].startPOS = [team.players[1].originPOS[0], team.players[5].startPOS[1] + (matchDetails.pitchSize[1] / 6)];
				team.players[2].startPOS = [team.players[2].originPOS[0], team.players[5].startPOS[1] + (matchDetails.pitchSize[1] / 6)];
				team.players[3].startPOS = [team.players[3].originPOS[0], team.players[5].startPOS[1] + (matchDetails.pitchSize[1] / 6)];
				team.players[4].startPOS = [team.players[4].originPOS[0], team.players[5].startPOS[1] + (matchDetails.pitchSize[1] / 6)];
				team.players[6].startPOS = [team.players[6].originPOS[0], level];
				team.players[7].startPOS = [team.players[7].originPOS[0], level];
				team.players[8].startPOS = [team.players[8].originPOS[0], level];
				team.players[9].startPOS = [team.players[9].originPOS[0], level - (matchDetails.pitchSize[1] / 6)];
				team.players[10].startPOS = [team.players[10].originPOS[0], level - (matchDetails.pitchSize[1] / 6)];
				opposition.players[1].startPOS = [opposition.players[1].originPOS[0], opposition.players[1].originPOS[1] + (matchDetails.pitchSize[1] / 7)];
				opposition.players[2].startPOS = [opposition.players[2].originPOS[0], opposition.players[2].originPOS[1] + (matchDetails.pitchSize[1] / 7)];
				opposition.players[3].startPOS = [opposition.players[3].originPOS[0], opposition.players[3].originPOS[1] + (matchDetails.pitchSize[1] / 7)];
				opposition.players[4].startPOS = [opposition.players[4].originPOS[0], opposition.players[4].originPOS[1] + (matchDetails.pitchSize[1] / 7)];
				opposition.players[5].startPOS = [opposition.players[5].originPOS[0], opposition.players[5].originPOS[1] + (matchDetails.pitchSize[1] / 6)];
				opposition.players[6].startPOS = [opposition.players[6].originPOS[0], opposition.players[6].originPOS[1] + (matchDetails.pitchSize[1] / 6)];
				opposition.players[7].startPOS = [opposition.players[7].originPOS[0], opposition.players[7].originPOS[1] + (matchDetails.pitchSize[1] / 6)];
				opposition.players[8].startPOS = [opposition.players[8].originPOS[0], opposition.players[8].originPOS[1] + (matchDetails.pitchSize[1] / 6)];
				opposition.players[9].startPOS = [opposition.players[9].originPOS[0], opposition.players[9].originPOS[1] + (matchDetails.pitchSize[1] / 6)];
				opposition.players[10].startPOS = [opposition.players[10].originPOS[0], opposition.players[10].originPOS[1] + (matchDetails.pitchSize[1] / 6)];
			} else if (ballPosition[1] < (matchDetails.pitchSize[1] / 2) && ballPosition[1] > (matchDetails.pitchSize[1] / 6)) {
				//between halfway and last sixth
				var level = Math.round(getRandomNumber((matchDetails.pitchSize[1] / 9), ballPosition[1] + 15));
				team.players[0].startPOS = [team.players[0].originPOS[0], team.players[5].startPOS[1] + (matchDetails.pitchSize[1] / 3)];
				team.players[1].startPOS = [team.players[1].originPOS[0], team.players[5].startPOS[1] + (matchDetails.pitchSize[1] / 6)];
				team.players[2].startPOS = [team.players[2].originPOS[0], team.players[5].startPOS[1] + (matchDetails.pitchSize[1] / 6)];
				team.players[3].startPOS = [team.players[3].originPOS[0], team.players[5].startPOS[1] + (matchDetails.pitchSize[1] / 6)];
				team.players[4].startPOS = [team.players[4].originPOS[0], team.players[5].startPOS[1] + (matchDetails.pitchSize[1] / 6)];
				team.players[6].startPOS = [team.players[6].originPOS[0], level];
				team.players[7].startPOS = [team.players[7].originPOS[0], level];
				team.players[8].startPOS = [team.players[8].originPOS[0], level];
				team.players[9].startPOS = [team.players[9].originPOS[0], getRandomNumber(5, level - 20)];
				team.players[10].startPOS = [team.players[10].originPOS[0], getRandomNumber(5, level - 20)];
				if (ballPosition[0] > matchDetails.pitchSize[0] / 2) {
					ball.direction = "northwest";
					var midGoal = matchDetails.pitchSize[0] / 2;
					opposition.players[5].startPOS = [(tempArray[0] + ((midGoal - tempArray[0]) / 2)), tempArray[1] - 60];
					opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 30];
					opposition.players[7].startPOS = [tempArray[0], tempArray[1] - 30];
					opposition.players[8].startPOS = [team.players[10].startPOS[0] + 2, team.players[10].startPOS[0] - 2];
					opposition.players[9].startPOS = [(tempArray[0] + ((midGoal - tempArray[0]) / 2) + 2), tempArray[1] - 30];
					opposition.players[10].startPOS = [(tempArray[0] + ((midGoal - tempArray[0]) / 2) - 2), tempArray[1] - 30];
				} else if (ballPosition[0] < matchDetails.pitchSize[0] / 2) {
					ball.direction = "northeast";
					var midGoal = matchDetails.pitchSize[0] / 2;
					opposition.players[5].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 60];
					opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 30];
					opposition.players[7].startPOS = [tempArray[0], tempArray[1] - 30];
					opposition.players[8].startPOS = [team.players[10].startPOS[0] + 2, team.players[10].startPOS[0] - 2];
					opposition.players[9].startPOS = [(tempArray[0] + ((midGoal - tempArray[0]) / 2) + 2), tempArray[1] - 30];
					opposition.players[10].startPOS = [(tempArray[0] + ((midGoal - tempArray[0]) / 2) - 2), tempArray[1] - 30];
				} else {
					ball.direction = "north";
					opposition.players[5].startPOS = [tempArray[0], tempArray[1] - 60];
					opposition.players[6].startPOS = [tempArray[0], tempArray[1] - 30];
					opposition.players[7].startPOS = [tempArray[0] + 20, tempArray[1] - 20];
					opposition.players[8].startPOS = [team.players[10].startPOS[0] - 2, team.players[10].startPOS[0] + 2];
					opposition.players[9].startPOS = [tempArray[0] - 2, tempArray[1] - 30];
					opposition.players[10].startPOS = [tempArray[0] + 2, tempArray[1] - 30];
				}
			} else {
				//in the last sixth
				team.players[0].startPOS = [team.players[0].originPOS[0], team.players[0].originPOS[1] - (matchDetails.pitchSize[1] / 3)];
				team.players[2].startPOS = [team.players[2].originPOS[0], team.players[2].originPOS[1] - (matchDetails.pitchSize[1] / 2)];
				team.players[3].startPOS = [team.players[3].originPOS[0], team.players[3].originPOS[1] - (matchDetails.pitchSize[1] / 2)];
				team.players[1].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5)), getRandomNumber(0, (matchDetails.pitchSize[1] / 6) - 5)];
				team.players[4].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5)), getRandomNumber(0, (matchDetails.pitchSize[1] / 6) - 5)];
				team.players[6].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5)), getRandomNumber(0, (matchDetails.pitchSize[1] / 6) - 5)];
				team.players[7].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5)), getRandomNumber(0, (matchDetails.pitchSize[1] / 6) - 5)];
				team.players[8].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5)), getRandomNumber(0, (matchDetails.pitchSize[1] / 6) - 5)];
				team.players[9].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5)), getRandomNumber(0, (matchDetails.pitchSize[1] / 6) - 5)];
				team.players[10].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5)), getRandomNumber(0, (matchDetails.pitchSize[1] / 6) - 5)];
				opposition.players[1].startPOS = [(matchDetails.pitchSize[0] / 2) - 15, 10];
				opposition.players[2].startPOS = [(matchDetails.pitchSize[0] / 2) - 5, 10];
				opposition.players[3].startPOS = [(matchDetails.pitchSize[0] / 2) + 5, 10];
				opposition.players[4].startPOS = [(matchDetails.pitchSize[0] / 2) + 15, 10];
				if (ballPosition[0] > matchDetails.pitchSize[0] / 2) {
					var midGoal = matchDetails.pitchSize[0] / 2;
					ball.direction = "northwest";
					if (tempArray[1] < 15) {
						opposition.players[5].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1]];
						opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 2];
						opposition.players[7].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 4];
					} else {
						opposition.players[5].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 10];
						opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 12];
						opposition.players[7].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 14];
					}
					opposition.players[8].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5)), getRandomNumber(0, (matchDetails.pitchSize[1] / 6) - 5)];
					opposition.players[9].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5)), getRandomNumber(0, (matchDetails.pitchSize[1] / 6) - 5)];
					opposition.players[10].startPOS = [matchDetails.pitchSize[0] / 2, 20];
				} else if (ballPosition[0] < matchDetails.pitchSize[0] / 2) {
					var midGoal = matchDetails.pitchSize[0] / 2;
					ball.direction = "northeast";
					if (tempArray[1] < 15) {
						opposition.players[8].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1]];
						opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 2];
						opposition.players[7].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 4];
					} else {
						opposition.players[8].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 10];
						opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 12];
						opposition.players[7].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 14];
					}
					opposition.players[5].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) - 5)), getRandomNumber(0, (matchDetails.pitchSize[1] / 6) - 5)];
					opposition.players[9].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) - 5)), getRandomNumber(0, (matchDetails.pitchSize[1] / 6) - 5)];
					opposition.players[10].startPOS = [matchDetails.pitchSize[0] / 2, 20];
				} else {
					ball.direction = "north";
					opposition.players[5].startPOS = [(matchDetails.pitchSize[0] / 2) - 4, tempArray[1] - 40];
					opposition.players[6].startPOS = [(matchDetails.pitchSize[0] / 2) - 2, tempArray[1] - 40];
					opposition.players[7].startPOS = [(matchDetails.pitchSize[0] / 2), tempArray[1] - 40];
					opposition.players[8].startPOS = [(matchDetails.pitchSize[0] / 2) + 2, tempArray[1] - 40];
					opposition.players[9].startPOS = [(matchDetails.pitchSize[0] / 2) + 4, tempArray[1] - 40];
					opposition.players[10].startPOS = [(matchDetails.pitchSize[0] / 2), 30];
				}
			}
		} else {
			//other team
			//shooting to bottom of pitch
			if (ballPosition[1] < (matchDetails.pitchSize[1] / 3)) {
				ball.Player = team.players[0].name;
				team.players[0].hasBall = true;
				team.players[0].startPOS = tempArray.map(x => x);
				team.players[1].startPOS = [team.players[1].originPOS[0], ((matchDetails.pitchSize[1] / 6) + team.players[0].startPOS[1] + team.players[1].originPOS[1])];
				team.players[2].startPOS = [team.players[2].originPOS[0], ((matchDetails.pitchSize[1] / 6) + team.players[0].startPOS[1] + team.players[2].originPOS[1])];
				team.players[3].startPOS = [team.players[3].originPOS[0], ((matchDetails.pitchSize[1] / 6) + team.players[0].startPOS[1] + team.players[3].originPOS[1])];
				team.players[4].startPOS = [team.players[4].originPOS[0], ((matchDetails.pitchSize[1] / 6) + team.players[0].startPOS[1] + team.players[4].originPOS[1])];
				team.players[5].startPOS = [team.players[5].originPOS[0], ((matchDetails.pitchSize[1] / 6) + team.players[0].startPOS[1] + team.players[5].originPOS[1])];
				team.players[6].startPOS = [team.players[6].originPOS[0], ((matchDetails.pitchSize[1] / 6) + team.players[0].startPOS[1] + team.players[6].originPOS[1])];
				team.players[7].startPOS = [team.players[7].originPOS[0], ((matchDetails.pitchSize[1] / 6) + team.players[0].startPOS[1] + team.players[7].originPOS[1])];
				team.players[8].startPOS = [team.players[8].originPOS[0], ((matchDetails.pitchSize[1] / 6) + team.players[0].startPOS[1] + team.players[8].originPOS[1])];
				team.players[9].startPOS = [team.players[9].originPOS[0], ((matchDetails.pitchSize[1] / 6) + team.players[0].startPOS[1] + team.players[9].originPOS[1])];
				team.players[10].startPOS = [team.players[10].originPOS[0], ((matchDetails.pitchSize[1] / 6) + team.players[0].startPOS[1] + team.players[10].originPOS[1])];
				opposition.players[1].startPOS = [opposition.players[1].originPOS[0], opposition.players[1].originPOS[1] - (matchDetails.pitchSize[1] / 6)];
				opposition.players[2].startPOS = [opposition.players[2].originPOS[0], opposition.players[2].originPOS[1] - (matchDetails.pitchSize[1] / 6)];
				opposition.players[3].startPOS = [opposition.players[3].originPOS[0], opposition.players[3].originPOS[1] - (matchDetails.pitchSize[1] / 6)];
				opposition.players[4].startPOS = [opposition.players[4].originPOS[0], opposition.players[4].originPOS[1] - (matchDetails.pitchSize[1] / 6)];
				opposition.players[9].startPOS = [opposition.players[9].originPOS[0] + 10, team.players[1].startPOS[1]];
				opposition.players[10].startPOS = [opposition.players[10].originPOS[0] + 10, team.players[1].startPOS[1]];
				opposition.players[5].startPOS = [opposition.players[5].originPOS[0], opposition.players[5].originPOS[1] - (matchDetails.pitchSize[1] / 6)];
				opposition.players[6].startPOS = [opposition.players[6].originPOS[0], opposition.players[6].originPOS[1] - (matchDetails.pitchSize[1] / 6)];
				opposition.players[7].startPOS = [opposition.players[7].originPOS[0], opposition.players[7].originPOS[1] - (matchDetails.pitchSize[1] / 6)];
				opposition.players[8].startPOS = [opposition.players[8].originPOS[0], opposition.players[8].originPOS[1] - (matchDetails.pitchSize[1] / 6)];
			} else if (ballPosition[1] < (matchDetails.pitchSize[1] / 2) && ballPosition[1] > (matchDetails.pitchSize[1] / 3)) {
				//ball in own half and opposition is at the bottom of pitch
				if (ballPosition[0] > matchDetails.pitchSize[0] / 2) {
					ball.direction = "southwest";
				} else if (ballPosition[0] < matchDetails.pitchSize[0] / 2) {
					ball.direction = "southeast";
				} else {
					ball.direction = "south";
				}
				var level = getRandomNumber(matchDetails.pitchSize[1] / 2, matchDetails.pitchSize[1] - 200);
				team.players[1].startPOS = [team.players[1].originPOS[0], team.players[5].startPOS[1] - (matchDetails.pitchSize[1] / 6)];
				team.players[2].startPOS = [team.players[2].originPOS[0], team.players[5].startPOS[1] - (matchDetails.pitchSize[1] / 6)];
				team.players[3].startPOS = [team.players[3].originPOS[0], team.players[5].startPOS[1] - (matchDetails.pitchSize[1] / 6)];
				team.players[4].startPOS = [team.players[4].originPOS[0], team.players[5].startPOS[1] - (matchDetails.pitchSize[1] / 6)];
				team.players[6].startPOS = [team.players[6].originPOS[0], level];
				team.players[7].startPOS = [team.players[7].originPOS[0], level];
				team.players[8].startPOS = [team.players[8].originPOS[0], level];
				team.players[9].startPOS = [team.players[9].originPOS[0], level + (matchDetails.pitchSize[1] / 6)];
				team.players[10].startPOS = [team.players[10].originPOS[0], level + (matchDetails.pitchSize[1] / 6)];
				opposition.players[1].startPOS = [opposition.players[1].originPOS[0], opposition.players[1].originPOS[1] - (matchDetails.pitchSize[1] / 7)];
				opposition.players[2].startPOS = [opposition.players[2].originPOS[0], opposition.players[2].originPOS[1] - (matchDetails.pitchSize[1] / 7)];
				opposition.players[3].startPOS = [opposition.players[3].originPOS[0], opposition.players[3].originPOS[1] - (matchDetails.pitchSize[1] / 7)];
				opposition.players[4].startPOS = [opposition.players[4].originPOS[0], opposition.players[4].originPOS[1] - (matchDetails.pitchSize[1] / 7)];
				opposition.players[5].startPOS = [opposition.players[5].originPOS[0], opposition.players[5].originPOS[1] - (matchDetails.pitchSize[1] / 6)];
				opposition.players[6].startPOS = [opposition.players[6].originPOS[0], opposition.players[6].originPOS[1] - (matchDetails.pitchSize[1] / 6)];
				opposition.players[7].startPOS = [opposition.players[7].originPOS[0], opposition.players[7].originPOS[1] - (matchDetails.pitchSize[1] / 6)];
				opposition.players[8].startPOS = [opposition.players[8].originPOS[0], opposition.players[8].originPOS[1] - (matchDetails.pitchSize[1] / 6)];
				opposition.players[9].startPOS = [opposition.players[9].originPOS[0], opposition.players[9].originPOS[1] - (matchDetails.pitchSize[1] / 6)];
				opposition.players[10].startPOS = [opposition.players[10].originPOS[0], opposition.players[10].originPOS[1] - (matchDetails.pitchSize[1] / 6)];
			} else if (ballPosition[1] > (matchDetails.pitchSize[1] / 2) && ballPosition[1] < (matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6))) {
				//between halfway and last sixth
				var level = Math.round(getRandomNumber(ballPosition[1] + 15, (matchDetails.pitchSize[1] - matchDetails.pitchSize[1] / 9)));
				team.players[0].startPOS = [team.players[0].originPOS[0], team.players[5].startPOS[1] - (matchDetails.pitchSize[1] / 3)];
				team.players[1].startPOS = [team.players[1].originPOS[0], team.players[5].startPOS[1] - (matchDetails.pitchSize[1] / 6)];
				team.players[2].startPOS = [team.players[2].originPOS[0], team.players[5].startPOS[1] - (matchDetails.pitchSize[1] / 6)];
				team.players[3].startPOS = [team.players[3].originPOS[0], team.players[5].startPOS[1] - (matchDetails.pitchSize[1] / 6)];
				team.players[4].startPOS = [team.players[4].originPOS[0], team.players[5].startPOS[1] - (matchDetails.pitchSize[1] / 6)];
				team.players[6].startPOS = [team.players[6].originPOS[0], level];
				team.players[7].startPOS = [team.players[7].originPOS[0], level];
				team.players[8].startPOS = [team.players[8].originPOS[0], level];
				team.players[9].startPOS = [team.players[9].originPOS[0], level + (matchDetails.pitchSize[1] / 6)];
				team.players[10].startPOS = [team.players[10].originPOS[0], level + (matchDetails.pitchSize[1] / 6)];
				if (ballPosition[0] > matchDetails.pitchSize[0] / 2) {
					ball.direction = "southwest";
					var midGoal = matchDetails.pitchSize[0] / 2;
					opposition.players[5].startPOS = [(tempArray[0] + ((midGoal - tempArray[0]) / 2)), tempArray[1] + 60];
					opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 30];
					opposition.players[7].startPOS = [tempArray[0], tempArray[1] + 30];
					opposition.players[8].startPOS = [team.players[10].startPOS[0] + 2, team.players[10].startPOS[0] + 2];
					opposition.players[9].startPOS = [(tempArray[0] + ((midGoal - tempArray[0]) / 2) + 2), tempArray[1] + 30];
					opposition.players[10].startPOS = [(tempArray[0] + ((midGoal - tempArray[0]) / 2) - 2), tempArray[1] + 30];
				} else if (ballPosition[0] < matchDetails.pitchSize[0] / 2) {
					ball.direction = "southeast";
					var midGoal = matchDetails.pitchSize[0] / 2;
					opposition.players[5].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 60];
					opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 30];
					opposition.players[7].startPOS = [tempArray[0], tempArray[1] + 30];
					opposition.players[8].startPOS = [team.players[10].startPOS[0] + 2, team.players[10].startPOS[0] + 2];
					opposition.players[9].startPOS = [(tempArray[0] + ((midGoal - tempArray[0]) / 2) + 2), tempArray[1] + 30];
					opposition.players[10].startPOS = [(tempArray[0] + ((midGoal - tempArray[0]) / 2) - 2), tempArray[1] + 30];
				} else {
					ball.direction = "south";
					opposition.players[5].startPOS = [tempArray[0], tempArray[1] + 60];
					opposition.players[6].startPOS = [tempArray[0], tempArray[1] + 30];
					opposition.players[7].startPOS = [tempArray[0] + 20, tempArray[1] + 20];
					opposition.players[8].startPOS = [team.players[10].startPOS[0] + 2, team.players[10].startPOS[0] + 2];
					opposition.players[9].startPOS = [tempArray[0] - 2, tempArray[1] + 30];
					opposition.players[10].startPOS = [tempArray[0] + 2, tempArray[1] + 30];
				}
			} else {
				//in the last sixth
				team.players[0].startPOS = [team.players[0].originPOS[0], team.players[0].originPOS[1] + (matchDetails.pitchSize[1] / 3)];
				team.players[2].startPOS = [team.players[2].originPOS[0], team.players[2].originPOS[1] + (matchDetails.pitchSize[1] / 2)];
				team.players[3].startPOS = [team.players[3].originPOS[0], team.players[3].originPOS[1] + (matchDetails.pitchSize[1] / 2)];
				team.players[1].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5)), getRandomNumber(matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) + 5, matchDetails.pitchSize[1])];
				team.players[4].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5)), getRandomNumber(matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) + 5, matchDetails.pitchSize[1])];
				team.players[6].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5)), getRandomNumber(matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) + 5, matchDetails.pitchSize[1])];
				team.players[7].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5)), getRandomNumber(matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) + 5, matchDetails.pitchSize[1])];
				team.players[8].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5)), getRandomNumber(matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) + 5, matchDetails.pitchSize[1])];
				team.players[9].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5)), getRandomNumber(matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) + 5, matchDetails.pitchSize[1])];
				team.players[10].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5)), getRandomNumber(matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) + 5, matchDetails.pitchSize[1])];
				opposition.players[1].startPOS = [(matchDetails.pitchSize[0] / 2) - 15, matchDetails.pitchSize[1] - 10];
				opposition.players[2].startPOS = [(matchDetails.pitchSize[0] / 2) - 5, matchDetails.pitchSize[1] - 10];
				opposition.players[3].startPOS = [(matchDetails.pitchSize[0] / 2) + 5, matchDetails.pitchSize[1] - 10];
				opposition.players[4].startPOS = [(matchDetails.pitchSize[0] / 2) + 15, matchDetails.pitchSize[1] - 10];
				if (ballPosition[0] > matchDetails.pitchSize[0] / 2) {
					var midGoal = matchDetails.pitchSize[0] / 2;
					ball.direction = "southwest";
					if (tempArray[1] > (matchDetails.pitchSize[1] - 15)) {
						opposition.players[5].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1]];
						opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 2];
						opposition.players[7].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 4];
					} else {
						opposition.players[5].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 10];
						opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 12];
						opposition.players[7].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 14];
					}
					opposition.players[8].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5)), getRandomNumber(matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) + 5, matchDetails.pitchSize[1])];
					opposition.players[9].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5)), getRandomNumber(matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) + 5, matchDetails.pitchSize[1])];
					opposition.players[10].startPOS = [matchDetails.pitchSize[0] / 2, matchDetails.pitchSize[1] + 20];
				} else if (ballPosition[0] < matchDetails.pitchSize[0] / 2) {
					var midGoal = matchDetails.pitchSize[0] / 2;
					ball.direction = "southeast";
					if (tempArray[1] > (matchDetails.pitchSize[1] - 15)) {
						opposition.players[8].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1]];
						opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 2];
						opposition.players[7].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] - 4];
					} else {
						opposition.players[8].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 10];
						opposition.players[6].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 12];
						opposition.players[7].startPOS = [tempArray[0] + ((midGoal - tempArray[0]) / 2), tempArray[1] + 14];
					}
					opposition.players[5].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5)), getRandomNumber(matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) + 5, matchDetails.pitchSize[1])];
					opposition.players[9].startPOS = [getRandomNumber((matchDetails.pitchSize[0] / 4) - 5, (matchDetails.pitchSize[0] - (matchDetails.pitchSize[0] / 4) + 5)), getRandomNumber(matchDetails.pitchSize[1] - (matchDetails.pitchSize[1] / 6) + 5, matchDetails.pitchSize[1])];
					opposition.players[10].startPOS = [matchDetails.pitchSize[0] / 2, matchDetails.pitchSize[1] + 20];
				} else {
					ball.direction = "south";
					opposition.players[5].startPOS = [(matchDetails.pitchSize[0] / 2) - 4, tempArray[1] + 40];
					opposition.players[6].startPOS = [(matchDetails.pitchSize[0] / 2) - 2, tempArray[1] + 40];
					opposition.players[7].startPOS = [(matchDetails.pitchSize[0] / 2), tempArray[1] + 40];
					opposition.players[8].startPOS = [(matchDetails.pitchSize[0] / 2) + 2, tempArray[1] + 40];
					opposition.players[9].startPOS = [(matchDetails.pitchSize[0] / 2) + 4, tempArray[1] + 40];
					opposition.players[10].startPOS = [(matchDetails.pitchSize[0] / 2), matchDetails.pitchSize[1] - 30];
				}
			}
		}
		resolve();
	});
}

function setGoalScored(scoringTeam, conceedingTeam, matchDetails) {
	return new Promise(function (resolve, reject) {
		resetPlayerPositions(scoringTeam).then(function () {
			resetPlayerPositions(conceedingTeam).then(function () {
				var playerWithBall = getRandomNumber(9, 10);
				var waitingPlayer;
				if (playerWithBall === 9) {
					waitingPlayer = 10;
				} else {
					waitingPlayer = 9;
				}
				matchDetails.ball.position = [matchDetails.pitchSize[0] / 2, matchDetails.pitchSize[1] / 2];
				conceedingTeam.players[playerWithBall].startPOS = matchDetails.ball.position.map(x => x);
				conceedingTeam.players[playerWithBall].hasBall = true;
				matchDetails.ball.withPlayer = true;
				matchDetails.ball.Player = conceedingTeam.players[playerWithBall].name;
				matchDetails.ball.withTeam = conceedingTeam.name;
				var tempPosition = [matchDetails.ball.position[0] + 20, matchDetails.ball.position[1]];
				conceedingTeam.players[waitingPlayer].startPOS = tempPosition.map(x => x);
				conceedingTeam.intent = "attack";
				scoringTeam.intent = "defend";
				resolve();
			}).catch(function (error) {
				console.error("Error when resetting player positions: ", error);
				console.error(matchDetails.iterationLog);
			});
		}).catch(function (error) {
			console.error("Error when resetting player positions: ", error);
			console.error(matchDetails.iterationLog);
		});
	});
}

function setGoalKick(team, opposition, matchDetails) {
	return new Promise(function (resolve, reject) {
		if (team.players[0].originPOS[1] > matchDetails.pitchSize[1] / 2) {
			setPlayerPositions(team, -80).then(function () {
				resetPlayerPositions(opposition).then(function () {
					matchDetails.ball.position = [matchDetails.pitchSize[0] / 2, matchDetails.pitchSize[1] - 20];
					team.players[0].startPOS = matchDetails.ball.position.map(x => x);
					team.players[0].hasBall = true;
					matchDetails.ball.withPlayer = true;
					matchDetails.ball.Player = team.players[0].name;
					matchDetails.ball.withTeam = team.name;
					resolve(matchDetails.ball.position);
				}).catch(function (error) {
					console.error("Error when resetting player positions: ", error);
					console.error(matchDetails.iterationLog);
				});
			}).catch(function (error) {
				console.error("Error when setting player positions: ", error);
				console.error(matchDetails.iterationLog);
			});
		} else {
			setPlayerPositions(team, 80).then(function () {
				resetPlayerPositions(opposition).then(function () {
					matchDetails.ball.position = [matchDetails.pitchSize[0] / 2, 20];
					team.players[0].startPOS = matchDetails.ball.position.map(x => x);
					team.players[0].hasBall = true;
					matchDetails.ball.withPlayer = true;
					matchDetails.ball.Player = team.players[0].name;
					matchDetails.ball.withTeam = team.name;
					resolve(matchDetails.ball.position);
				}).catch(function (error) {
					console.error("Error when resetting player positions: ", error);
					console.error(matchDetails.iterationLog);
				});
			}).catch(function (error) {
				console.error("Error when setting player positions: ", error);
				console.error(matchDetails.iterationLog);
			});
		}
	});
}

function setThrowIn(team, opposition, side, place, matchDetails) {
	return new Promise(function (resolve, reject) {
		var movement = team.players[5].originPOS[1] - place;
		var oppMovement = 0 - movement;
		if (side === "left") {
			setPlayerPositions(team, movement).then(function () {
				team.players[5].startPOS = [0, place];
				team.players[8].startPOS = [15, place];
				team.players[7].startPOS = [10, place + 10];
				team.players[9].startPOS = [10, place - 10];
				matchDetails.ball.position = [0, place];
				team.players[5].startPOS = matchDetails.ball.position.map(x => x);
				team.players[5].hasBall = true;
				matchDetails.ball.withPlayer = true;
				matchDetails.ball.Player = team.players[5].name;
				matchDetails.ball.withTeam = team.name;
				setPlayerPositions(opposition, oppMovement).then(function () {
					opposition.players[5].startPOS = [20, place];
					opposition.players[7].startPOS = [30, place + 5];
					opposition.players[8].startPOS = [25, place - 15];
					opposition.players[9].startPOS = [10, place - 30];
					resolve(matchDetails.ball.position);
				}).catch(function (error) {
					console.error("Error when setting opposition throwin positions: ", error);
					console.error(matchDetails.iterationLog);
				});
			}).catch(function (error) {
				console.error("Error when setting thowin player positions: ", error);
				console.error(matchDetails.iterationLog);
			});
		} else {
			setPlayerPositions(team, movement).then(function () {
				team.players[5].startPOS = [pitchSize[0], place];
				team.players[8].startPOS = [pitchSize[0] - 15, place];
				team.players[7].startPOS = [pitchSize[0] - 10, place + 10];
				team.players[9].startPOS = [pitchSize[0] - 10, place - 10];
				matchDetails.ball.position = [pitchSize[0], place];
				team.players[5].startPOS = matchDetails.ball.position.map(x => x);
				team.players[5].hasBall = true;
				matchDetails.ball.withPlayer = true;
				matchDetails.ball.Player = team.players[5].name;
				matchDetails.ball.withTeam = team.name;
				setPlayerPositions(opposition, oppMovement).then(function () {
					opposition.players[5].startPOS = [pitchSize[0] - 20, place];
					opposition.players[7].startPOS = [pitchSize[0] - 30, place + 5];
					opposition.players[8].startPOS = [pitchSize[0] - 25, place - 15];
					opposition.players[9].startPOS = [pitchSize[0] - 10, place - 30];
					resolve(matchDetails.ball.position);
				}).catch(function (error) {
					console.error("Error when setting opposition throwin positions: ", error);
					console.error(iterationLog);
				});
			}).catch(function (error) {
				console.error("Error when setting thowin player positions: ", error);
				console.error(iterationLog);
			});
		}
	});
}

function setCornerPositions(team, opposition, side, matchDetails) {
	return new Promise(function (resolve, reject) {
		if (team.players[0].originPOS[1] > matchDetails.pitchSize[1] / 2) {
			if (side === "left") {
				team.players[1].startPOS = [0, 0];
				team.players[4].startPOS = [10, 20];
				team.players[5].startPOS = [60, 40];
				team.players[8].startPOS = [50, 70];
				team.players[9].startPOS = [80, 50];
				team.players[10].startPOS = [60, 80];
				opposition.players[5].startPOS = [15, 25];
				opposition.players[6].startPOS = [40, 35];
				opposition.players[7].startPOS = [60, 35];
				opposition.players[8].startPOS = [60, 70];
				matchDetails.ball.position = [0, 0];
				team.players[1].hasBall = true;
				matchDetails.ball.withPlayer = true;
				matchDetails.ball.Player = team.players[1].name;
				matchDetails.ball.withTeam = team.name;
			} else {
				team.players[1].startPOS = [pitchSize[0], 0];
				team.players[4].startPOS = [pitchSize[0] - 10, 20];
				team.players[5].startPOS = [pitchSize[0] - 60, 40];
				team.players[8].startPOS = [pitchSize[0] - 50, 70];
				team.players[9].startPOS = [pitchSize[0] - 80, 50];
				team.players[10].startPOS = [pitchSize[0] - 60, 80];
				opposition.players[5].startPOS = [pitchSize[0] - 15, 25];
				opposition.players[6].startPOS = [pitchSize[0] - 40, 35];
				opposition.players[7].startPOS = [pitchSize[0] - 60, 35];
				opposition.players[8].startPOS = [pitchSize[0] - 60, 70];
				matchDetails.ball.position = [pitchSize[0], 0];
				team.players[1].hasBall = true;
				matchDetails.ball.withPlayer = true;
				matchDetails.ball.Player = team.players[1].name;
				matchDetails.ball.withTeam = team.name;
			}
		} else {
			if (side === "left") {
				team.players[1].startPOS = [0, pitchSize[1]];
				team.players[4].startPOS = [10, pitchSize[1] - 20];
				team.players[5].startPOS = [60, pitchSize[1] - 40];
				team.players[8].startPOS = [50, pitchSize[1] - 70];
				team.players[9].startPOS = [80, pitchSize[1] - 50];
				team.players[10].startPOS = [60, pitchSize[1] - 80];
				opposition.players[5].startPOS = [15, pitchSize[1] - 25];
				opposition.players[6].startPOS = [40, pitchSize[1] - 35];
				opposition.players[7].startPOS = [60, pitchSize[1] - 35];
				opposition.players[8].startPOS = [60, pitchSize[1] - 70];
				matchDetails.ball.position = [0, pitchSize[1]];
				team.players[1].hasBall = true;
				matchDetails.ball.withPlayer = true;
				matchDetails.ball.Player = team.players[1].name;
				matchDetails.ball.withTeam = team.name;
			} else {
				team.players[1].startPOS = [pitchSize[0], pitchSize[1]];
				team.players[4].startPOS = [pitchSize[0] - 10, pitchSize[1] - 20];
				team.players[5].startPOS = [pitchSize[0] - 60, pitchSize[1] - 40];
				team.players[8].startPOS = [pitchSize[0] - 50, pitchSize[1] - 70];
				team.players[9].startPOS = [pitchSize[0] - 80, pitchSize[1] - 50];
				team.players[10].startPOS = [pitchSize[0] - 60, pitchSize[1] - 80];
				opposition.players[5].startPOS = [pitchSize[0] - 15, pitchSize[1] - 25];
				opposition.players[6].startPOS = [pitchSize[0] - 40, pitchSize[1] - 35];
				opposition.players[7].startPOS = [pitchSize[0] - 60, pitchSize[1] - 35];
				opposition.players[8].startPOS = [pitchSize[0] - 60, pitchSize[1] - 70];
				matchDetails.ball.position = [pitchSize[0], pitchSize[1]];
				team.players[1].hasBall = true;
				matchDetails.ball.withPlayer = true;
				matchDetails.ball.Player = team.players[1].name;
				matchDetails.ball.withTeam = team.name;
			}
		}
		resolve(matchDetails.ball.position);
	});
}

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

function setPlayerPositions(team, extra) {
	return new Promise(function (resolve, reject) {
		async.eachSeries(team.players, function eachPlayer(thisPlayer, thisPlayerCallback) {
			var tempArray = thisPlayer.originPOS;
			thisPlayer.startPOS = tempArray.map(x => x);
			if ((parseInt(thisPlayer.startPOS[1]) + extra) > pitchSize[1] || (parseInt(thisPlayer.startPOS[1]) + extra) < 0) {
				//stay where they are
			} else {
				thisPlayer.startPOS[1] = parseInt(thisPlayer.startPOS[1]) + extra;
			}
			thisPlayer.relativePOS = tempArray.map(x => x);
			thisPlayer.relativePOS[1] = parseInt(thisPlayer.relativePOS[1]) + extra;
			thisPlayerCallback();
		}, function afterAllPlayers() {
			resolve();
		});
	});
}

function resetMatchDetails() {
	matchDetails = {
		"kickOffTeam": "",
		"secondTeam": "",
		"half": 0,
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
		}
	};
}

function matchInjury(team) {
	var player = team.players[getRandomNumber(0, 10)];
	if (isInjured(10000) === true) {
		player.injured = true;
		iterationLog.push("Player Injured - " + player.name);
	}
}

function isInjured(x) {
	var injury = getRandomNumber(0, x);
	if (injury === 23) {
		return true;
	} else {
		return false;
	}
}

function getRandomNumber(min, max) {
	var random = Math.floor(Math.random() * (max - min + 1)) + min;
	return random;
}

function round(value, decimals) {
	return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function keepInBoundaries(ballIntended, kickersSide, matchDetails) {
	return new Promise(function (resolve, reject) {
		if (ballIntended[0] < 0 || ballIntended[0] > matchDetails.pitchSize[0] || ballIntended[1] < 0 || ballIntended[1] > matchDetails.pitchSize[1]) {
			if (ballIntended[0] < 0) {
				if (kickersSide > matchDetails.pitchSize[1] / 2) {
					setThrowIn(kickOffTeam, secondTeam, "left", ballIntended[1]).then(function (ballIntended) {
						matchDetails.iterationLog.push("Throw in to - " + kickOffTeam.name);
						resolve(ballIntended);
					}).catch(function (error) {
						console.error("Error when setting up for a throwin: ", error);
						console.error(matchDetails.iterationLog);
					});
				} else {
					setThrowIn(secondTeam, kickOffTeam, "left", ballIntended[1]).then(function (ballIntended) {
						matchDetails.iterationLog.push("Throw in to - " + secondTeam.name);
						resolve(ballIntended);
					}).catch(function (error) {
						console.error("Error when setting up for a throwin: ", error);
						console.error(matchDetails.iterationLog);
					});
				}
			} else if (ballIntended[0] > matchDetails.pitchSize[0]) {
				if (kickersSide > matchDetails.pitchSize[1] / 2) {
					setThrowIn(kickOffTeam, secondTeam, "right", ballIntended[1]).then(function (ballIntended) {
						matchDetails.iterationLog.push("Throw in to - " + kickOffTeam.name);
						resolve(ballIntended);
					}).catch(function (error) {
						console.error("Error when setting up for a throwin: ", error);
						console.error(matchDetails.iterationLog);
					});
				} else {
					setThrowIn(secondTeam, kickOffTeam, "right", ballIntended[1]).then(function (ballIntended) {
						matchDetails.iterationLog.push("Throw in to - " + secondTeam.name);
						resolve(ballIntended);
					}).catch(function (error) {
						console.error("Error when setting up for a throwin: ", error);
						console.error(matchDetails.iterationLog);
					});
				}
			}
			if (ballIntended[1] < 0) {
				var side;
				if (ballIntended[0] > matchDetails.pitchSize[0] / 2) {
					side = "right";
				} else {
					side = "left";
				}
				if (kickersSide > pitchSize[1] / 2) {
					setGoalKick(kickOffTeam, secondTeam, matchDetails).then(function (ballIntended) {
						matchDetails.iterationLog.push("Goal Kick to - " + kickOffTeam.name);
						resolve(ballIntended);
					}).catch(function (error) {
						console.error("Error when setting the goal kick: ", error);
						console.error(matchDetails.iterationLog);
					});
				} else {
					setCornerPositions(secondTeam, kickOffTeam, side, matchDetails).then(function (ballIntended) {
						matchDetails.iterationLog.push("Corner to - " + secondTeam.name);
						resolve(ballIntended);
					}).catch(function (error) {
						console.error("Error when setting corner: ", error);
						console.error(matchDetails.iterationLog);
					});
				}
			} else if (ballIntended[1] > matchDetails.pitchSize[1]) {
				var side;
				if (ballIntended[0] > matchDetails.pitchSize[0] / 2) {
					side = "right";
				} else {
					side = "left";
				}
				if (kickersSide > matchDetails.pitchSize[1] / 2) {
					setCornerPositions(kickOffTeam, secondTeam, side, matchDetails).then(function (ballIntended) {
						matchDetails.iterationLog.push("Corner to - " + kickOffTeam.name);
						resolve(ballIntended);
					}).catch(function (error) {
						console.error("Error when setting corner: ", error);
						console.error(matchDetails.iterationLog);
					});
				} else {
					setGoalKick(secondTeam, kickOffTeam, matchDetails).then(function (ballIntended) {
						matchDetails.iterationLog.push("Goal Kick to - " + secondTeam.name);
						resolve(ballIntended);
					}).catch(function (error) {
						console.error("Error when setting the goal kick: ", error);
						console.error(matchDetails.iterationLog);
					});
				}
			}
		} else if (isBetween(ballIntended[0], (matchDetails.pitchSize[0] / 2) - 20, (matchDetails.pitchSize[0] / 2) + 20)) {
			closestPlayerToPosition("none", kickOffTeam, ballIntended).then(function (playerInformationA) {
				closestPlayerToPosition("none", secondTeam, ballIntended).then(function (playerInformationB) {
					var teamAPlayer = playerInformationA.thePlayer;
					var teamBPlayer = playerInformationB.thePlayer;
					if (teamAPlayer && teamAPlayer[0] === ballIntended[0] && teamAPlayer[1] === ballIntended[1]) {
						teamAPlayer.hasBall = true;
						matchDetails.ball.Player = teamAPlayer.name;
						matchDetails.ball.withPlayer = true;
						matchDetails.ball.withTeam = kickOffTeam.name;
					} else if (teamBPlayer && teamBPlayer[0] === ballIntended[0] && teamBPlayer[1] === ballIntended[1]) {
						teamBPlayer.hasBall = true;
						matchDetails.ball.Player = teamBPlayer.name;
						matchDetails.ball.withPlayer = true;
						matchDetails.ball.withTeam = secondTeam.name;
					} else {
						if (ballIntended[1] > matchDetails.pitchSize[1]) {
							ballIntended = [matchDetails.pitchSize[0] / 2, matchDetails.pitchSize[1] / 2];
							if (matchDetails.half === 1) {
								setGoalScored(kickOffTeam, secondTeam, matchDetails).then(function () {
									matchDetails.kickOffTeamStatistics.goals++;
									resolve(ballIntended);
								}).catch(function (error) {
									console.error("Error when processing the goal: ", error);
									console.error(matchDetails.iterationLog);
								});
							} else {
								setGoalScored(secondTeam, kickOffTeam, matchDetails).then(function () {
									matchDetails.secondTeamStatistics.goals++;
									resolve(ballIntended);
								}).catch(function (error) {
									console.error("Error when processing the goal: ", error);
									console.error(matchDetails.iterationLog);
								});
							}
						} else if (ballIntended[1] < 0) {
							ballIntended = [matchDetails.pitchSize[0] / 2, matchDetails.pitchSize[1] / 2];
							if (matchDetails.half === 1) {
								setGoalScored(secondTeam, kickOffTeam, matchDetails).then(function () {
									matchDetails.secondTeamStatistics.goals++;
									resolve(ballIntended);
								}).catch(function (error) {
									console.error("Error when processing the goal: ", error);
									console.error(matchDetails.iterationLog);
								});
							} else {
								setGoalScored(kickOffTeam, secondTeam, matchDetails).then(function () {
									matchDetails.kickOffTeamStatistics.goals++;
									resolve(ballIntended);
								}).catch(function (error) {
									console.error("Error when processing the goal: ", error);
									console.error(matchDetails.iterationLog);
								});
							}
						} else {
							resolve(ballIntended);
						}
					}
				}).catch(function (error) {
					console.error("Error when finding the closest player to ball for accidental goal ", error);
				})
			}).catch(function (error) {
				console.error("Error when finding the closest player to ball for accidental goal ", error);
			})
		} else {
			resolve(ballIntended);
		}
	});
}

module.exports = {
	initiateGame: initiateGame,
	playIteration: playIteration,
	startSecondHalf: startSecondHalf
}
