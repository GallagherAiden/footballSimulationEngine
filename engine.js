//------------------------
//    NPM Modules
//------------------------
const common = require('./lib/common')
const setPositions = require('./lib/setPositions')
const setVariables = require('./lib/setVariables')
const playerMovement = require('./lib/playerMovement')
const validate = require('./lib/validate')

//------------------------
//    Functions
//------------------------
async function initiateGame(team1, team2, pitchDetails) {
  validate.validateArguments(team1, team2, pitchDetails)
  validate.validateTeam(team1)
  validate.validateTeam(team2)
  validate.validatePitch(pitchDetails)

  const matchDetails = await setVariables.populateMatchDetails(team1, team2, pitchDetails)
  matchDetails.kickOffTeam = await setVariables.setGameVariables(matchDetails.kickOffTeam)
  matchDetails.secondTeam = await setVariables.setGameVariables(matchDetails.secondTeam)

  matchDetails.kickOffTeam = await setVariables.koDecider(matchDetails.kickOffTeam, matchDetails)
  matchDetails.iterationLog.push(`Team to kick off - ${matchDetails.kickOffTeam.name}`)
  matchDetails.iterationLog.push(`Second team - ${matchDetails.secondTeam.name}`)
  matchDetails.secondTeam = await setPositions.switchSide(matchDetails.secondTeam, matchDetails)

  return matchDetails
}

async function playIteration(matchDetails) {
  const closestPlayerA = {
    'name': '',
    'position': 10000
  }
  const closestPlayerB = {
    'name': '',
    'position': 10000
  }

  validate.validateMatchDetails(matchDetails)

  matchDetails.iterationLog = []
  common.matchInjury(matchDetails, matchDetails.kickOffTeam)
  common.matchInjury(matchDetails, matchDetails.secondTeam)

  await playerMovement.closestPlayerToBall(closestPlayerA, matchDetails.kickOffTeam, matchDetails)
  await playerMovement.closestPlayerToBall(closestPlayerB, matchDetails.secondTeam, matchDetails)

  matchDetails.kickOffTeam = await playerMovement.decideMovement(closestPlayerA, matchDetails.kickOffTeam, matchDetails.secondTeam, matchDetails)
  matchDetails.secondTeam = await playerMovement.decideMovement(closestPlayerB, matchDetails.secondTeam, matchDetails.kickOffTeam, matchDetails)

  return matchDetails
}

async function startSecondHalf(matchDetails) {
  validate.validateMatchDetails(matchDetails)

  matchDetails.kickOffTeam = await setPositions.switchSide(matchDetails.kickOffTeam, matchDetails)
  matchDetails.secondTeam = await setPositions.switchSide(matchDetails.secondTeam, matchDetails)

  await setPositions.setGoalScored(matchDetails.secondTeam, matchDetails.kickOffTeam, matchDetails)

  matchDetails.half++

  return matchDetails
}

module.exports = {
  initiateGame,
  playIteration,
  startSecondHalf
}
