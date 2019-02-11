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
  try {
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
    secondTeam = setPositions.switchSide(secondTeam, matchDetails)
    matchDetails.kickOffTeam = kickOffTeam
    matchDetails.secondTeam = secondTeam
    return matchDetails
  } catch (err) {
    throw new Error(err)
  }
}

async function playIteration(matchDetails) {
  try {
    let closestPlayerA = {
      'name': '',
      'position': 10000
    }
    let closestPlayerB = {
      'name': '',
      'position': 10000
    }
    validate.validateMatchDetails(matchDetails)
    validate.validatePlayerPositions(matchDetails)
    matchDetails.iterationLog = []
    let { kickOffTeam, secondTeam } = matchDetails
    common.matchInjury(matchDetails, kickOffTeam)
    common.matchInjury(matchDetails, secondTeam)
    matchDetails = ballMovement.moveBall(matchDetails)
    playerMovement.closestPlayerToBall(closestPlayerA, kickOffTeam, matchDetails)
    playerMovement.closestPlayerToBall(closestPlayerB, secondTeam, matchDetails)
    kickOffTeam = await playerMovement.decideMovement(closestPlayerA, kickOffTeam, secondTeam, matchDetails)
    secondTeam = await playerMovement.decideMovement(closestPlayerB, secondTeam, kickOffTeam, matchDetails)
    matchDetails.kickOffTeam = kickOffTeam
    matchDetails.secondTeam = secondTeam
    if (matchDetails.ball.ballOverIterations.length == 0 || matchDetails.ball.withTeam != '') {
      playerMovement.checkOffside(kickOffTeam, secondTeam, matchDetails)
    }
    ballMovement.checkBall(matchDetails.ball)
    return matchDetails
  } catch (err) {
    throw new Error(err)
  }
}

async function startSecondHalf(matchDetails) {
  try {
    validate.validateMatchDetails(matchDetails)
    let { kickOffTeam, secondTeam } = matchDetails
    kickOffTeam = setPositions.switchSide(kickOffTeam, matchDetails)
    secondTeam = setPositions.switchSide(secondTeam, matchDetails)
    await setPositions.setGoalScored(secondTeam, kickOffTeam, matchDetails)
    matchDetails.half++
    matchDetails.kickOffTeam = kickOffTeam
    matchDetails.secondTeam = secondTeam
    return matchDetails
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  initiateGame,
  playIteration,
  startSecondHalf
}
