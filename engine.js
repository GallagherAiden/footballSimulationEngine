//------------------------
//    NPM Modules
//------------------------
const common = require('./lib/common')
const setPositions = require('./lib/setPositions')
const setVariables = require('./lib/setVariables')
const playerMovement = require('./lib/playerMovement')
const ballMovement = require('./lib/ballMovement')
const validate = require('./lib/validate')

//------------------------
//    Functions
//------------------------
async function initiateGame(team1, team2, pitchDetails) {
  validate.validateArguments(team1, team2, pitchDetails)
  validate.validateTeam(team1)
  validate.validateTeam(team2)
  validate.validatePitch(pitchDetails)
  let matchDetails = setVariables.populateMatchDetails(team1, team2, pitchDetails)
  let kickOffTeam = setVariables.setGameVariables(matchDetails.kickOffTeam)
  let secondTeam = setVariables.setGameVariables(matchDetails.secondTeam)
  kickOffTeam = setVariables.koDecider(kickOffTeam, matchDetails)
  matchDetails.iterationLog.push(`Team to kick off - ${kickOffTeam.name}`)
  matchDetails.iterationLog.push(`Second team - ${secondTeam.name}`)
  setPositions.switchSide(matchDetails, secondTeam)
  matchDetails.kickOffTeam = kickOffTeam
  matchDetails.secondTeam = secondTeam
  return matchDetails
}

async function playIteration(matchDetails) {
  let closestPlayerA = {
    'name': '',
    'position': 100000
  }
  let closestPlayerB = {
    'name': '',
    'position': 100000
  }
  validate.validateMatchDetails(matchDetails)
  validate.validateTeamSecondHalf(matchDetails.kickOffTeam)
  validate.validateTeamSecondHalf(matchDetails.secondTeam)
  validate.validatePlayerPositions(matchDetails)
  matchDetails.iterationLog = []
  let { kickOffTeam, secondTeam } = matchDetails
  common.matchInjury(matchDetails, kickOffTeam)
  common.matchInjury(matchDetails, secondTeam)
  matchDetails = ballMovement.moveBall(matchDetails)
  playerMovement.closestPlayerToBall(closestPlayerA, kickOffTeam, matchDetails)
  playerMovement.closestPlayerToBall(closestPlayerB, secondTeam, matchDetails)
  kickOffTeam = playerMovement.decideMovement(closestPlayerA, kickOffTeam, secondTeam, matchDetails)
  secondTeam = playerMovement.decideMovement(closestPlayerB, secondTeam, kickOffTeam, matchDetails)
  matchDetails.kickOffTeam = kickOffTeam
  matchDetails.secondTeam = secondTeam
  if (matchDetails.ball.ballOverIterations.length == 0 || matchDetails.ball.withTeam != '') {
    playerMovement.checkOffside(kickOffTeam, secondTeam, matchDetails)
  }
  return matchDetails
}

async function startSecondHalf(matchDetails) {
  validate.validateMatchDetails(matchDetails)
  validate.validateTeamSecondHalf(matchDetails.kickOffTeam)
  validate.validateTeamSecondHalf(matchDetails.secondTeam)
  validate.validatePlayerPositions(matchDetails)
  let { kickOffTeam, secondTeam } = matchDetails
  setPositions.switchSide(matchDetails, kickOffTeam)
  setPositions.switchSide(matchDetails, secondTeam)
  common.removeBallFromAllPlayers(matchDetails)
  setVariables.resetPlayerPositions(matchDetails)
  setPositions.setBallSpecificGoalScoreValue(matchDetails, matchDetails.kickOffTeam)
  matchDetails.kickOffTeam.intent = `attack`
  matchDetails.secondTeam.intent = `defend`
  matchDetails.half++
  return matchDetails
}

module.exports = {
  initiateGame,
  playIteration,
  startSecondHalf
}
