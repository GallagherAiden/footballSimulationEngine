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
  validate.validateArguments(team1, team2, pitchDetails).catch(function(error) {
    throw error
  })
  await validate.validateTeam(team1).catch(function(error) {
    throw error
  })
  await validate.validateTeam(team2).catch(function(error) {
    throw error
  })
  await validate.validatePitch(pitchDetails).catch(function(error) {
    throw error
  })
  let matchDetails = await setVariables.populateMatchDetails(team1, team2, pitchDetails).catch(function(error) {
    throw error
  })
  let kickOffTeam = await setVariables.setGameVariables(matchDetails.kickOffTeam).catch(function(error) {
    throw error
  })
  let secondTeam = await setVariables.setGameVariables(matchDetails.secondTeam).catch(function(error) {
    throw error
  })
  kickOffTeam = await setVariables.koDecider(kickOffTeam, matchDetails).catch(function(error) {
    throw error
  })
  matchDetails.iterationLog.push(`Team to kick off - ${kickOffTeam.name}`)
  matchDetails.iterationLog.push(`Second team - ${secondTeam.name}`)
  secondTeam = await setPositions.switchSide(secondTeam, matchDetails).catch(function(error) {
    throw error
  })
  matchDetails.kickOffTeam = kickOffTeam
  matchDetails.secondTeam = secondTeam
  return matchDetails
}

async function playIteration(matchDetails) {
  var closestPlayerA = {
    'name': '',
    'position': 10000
  }
  var closestPlayerB = {
    'name': '',
    'position': 10000
  }
  await validate.validateMatchDetails(matchDetails).catch(function(error) {
    throw (error)
  })
  matchDetails.iterationLog = []
  let { kickOffTeam, secondTeam } = matchDetails
  common.matchInjury(matchDetails, kickOffTeam)
  common.matchInjury(matchDetails, secondTeam)
  await playerMovement.closestPlayerToBall(closestPlayerA, kickOffTeam, matchDetails).catch(function(error) {
    throw (error)
  })
  await playerMovement.closestPlayerToBall(closestPlayerB, secondTeam, matchDetails).catch(function(error) {
    throw (error)
  })
  matchDetails = await ballMovement.moveBall(matchDetails).catch(function(error) {
    throw (error)
  })
  kickOffTeam = await playerMovement.decideMovement(closestPlayerA, kickOffTeam, secondTeam, matchDetails)
    .catch(function(error) {
      throw (error)
    })
  secondTeam = await playerMovement.decideMovement(closestPlayerB, secondTeam, kickOffTeam, matchDetails)
    .catch(function(error) {
      throw (error)
    })
  matchDetails.kickOffTeam = kickOffTeam
  matchDetails.secondTeam = secondTeam
  if (matchDetails.ball.ballOverIterations.length == 0 || matchDetails.ball.withTeam != '') {
    playerMovement.checkOffside(kickOffTeam, secondTeam, matchDetails)
  }
  return matchDetails
}

async function startSecondHalf(matchDetails) {
  await validate.validateMatchDetails(matchDetails).catch(function(error) {
    throw error
  })
  let { kickOffTeam, secondTeam } = matchDetails
  kickOffTeam = await setPositions.switchSide(kickOffTeam, matchDetails).catch(function(error) {
    throw error
  })
  secondTeam = await setPositions.switchSide(secondTeam, matchDetails).catch(function(error) {
    throw error
  })
  await setPositions.setGoalScored(secondTeam, kickOffTeam, matchDetails).catch(function(error) {
    throw error
  })
  matchDetails.half++
  matchDetails.kickOffTeam = kickOffTeam
  matchDetails.secondTeam = secondTeam
  return matchDetails
}

module.exports = {
  initiateGame,
  playIteration,
  startSecondHalf
}
