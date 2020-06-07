const common = require('../../lib/common')
const setPos = require('../../lib/setPositions')

async function setupTopPenalty(iterationFile) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  return setPos.setTopPenalty(matchDetails)
}

async function setupBottomPenalty(iterationFile) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  return setPos.setBottomPenalty(matchDetails)
}

async function setupTopLeftCorner(iterationFile) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  return setPos.setTopLeftCornerPositions(matchDetails)
}

async function setupTopRightCorner(iterationFile) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  return setPos.setTopRightCornerPositions(matchDetails)
}

async function setupBottomLeftCorner(iterationFile) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  return setPos.setBottomLeftCornerPositions(matchDetails)
}

async function setupBottomRightCorner(iterationFile) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  return setPos.setBottomRightCornerPositions(matchDetails)
}

async function keepInBoundaries(iterationFile, kickersSide, ballIntended) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  setPos.keepInBoundaries(matchDetails, kickersSide, ballIntended)
  return matchDetails
}

async function removeBallFromAllPlayers(iterationFile) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  common.removeBallFromAllPlayers(matchDetails)
  return matchDetails
}

async function setSetpieceKickOffTeam(iterationFile) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  setPos.setSetpieceKickOffTeam(matchDetails)
  return matchDetails
}

async function setSetpieceSecondTeam(iterationFile) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  setPos.setSetpieceSecondTeam(matchDetails)
  return matchDetails
}

async function setTopGoalKick(iterationFile) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  setPos.setTopGoalKick(matchDetails)
  return matchDetails
}

async function setBottomGoalKick(iterationFile) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  setPos.setBottomGoalKick(matchDetails)
  return matchDetails
}

async function switchSide(matchDetails, team) {
  return setPos.switchSide(matchDetails, team)
}

async function setKickOffTeamGoalScored(iterationFile) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  setPos.setKickOffTeamGoalScored(matchDetails)
  return matchDetails
}

async function setSecondTeamGoalScored(iterationFile) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  setPos.setSecondTeamGoalScored(matchDetails)
  return matchDetails
}

async function setLeftKickOffTeamThrowIn(iterationFile, ballIntended) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  setPos.setLeftKickOffTeamThrowIn(matchDetails, ballIntended)
  return matchDetails
}

async function setLeftSecondTeamThrowIn(iterationFile, ballIntended) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  setPos.setLeftSecondTeamThrowIn(matchDetails, ballIntended)
  return matchDetails
}

async function setRightKickOffTeamThrowIn(iterationFile, ballIntended) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  setPos.setRightKickOffTeamThrowIn(matchDetails, ballIntended)
  return matchDetails
}

async function setRightSecondTeamThrowIn(iterationFile, ballIntended) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  setPos.setRightSecondTeamThrowIn(matchDetails, ballIntended)
  return matchDetails
}

async function inTopPenalty(iterationFile) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  return common.inTopPenalty(matchDetails, matchDetails.ball.position)
}

async function inBottomPenalty(iterationFile) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  return common.inBottomPenalty(matchDetails, matchDetails.ball.position)
}

async function goalieHasBall(iterationFile) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  return setPos.setGoalieHasBall(matchDetails, matchDetails.kickOffTeam.players[0])
}


module.exports = {
  setupTopPenalty,
  setupBottomPenalty,
  setupTopLeftCorner,
  setupTopRightCorner,
  setupBottomLeftCorner,
  setupBottomRightCorner,
  keepInBoundaries,
  removeBallFromAllPlayers,
  setSetpieceKickOffTeam,
  setSetpieceSecondTeam,
  setTopGoalKick,
  setBottomGoalKick,
  switchSide,
  setKickOffTeamGoalScored,
  setSecondTeamGoalScored,
  setLeftKickOffTeamThrowIn,
  setLeftSecondTeamThrowIn,
  setRightKickOffTeamThrowIn,
  setRightSecondTeamThrowIn,
  inTopPenalty,
  inBottomPenalty,
  goalieHasBall
}
