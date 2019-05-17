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

async function keepInBoundaries(ballIntended, kickersSide, iterationFile){
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  setPos.keepInBoundaries(ballIntended, kickersSide, matchDetails)
  return matchDetails
}

async function removeBallFromAllPlayers(iterationFile){
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  setPos.removeBallFromAllPlayers(matchDetails)
  return matchDetails
}

async function setSetpieceKickOffTeam(iterationFile){
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  setPos.setSetpieceKickOffTeam(matchDetails)
  return matchDetails
}

async function setSetpieceSecondTeam(iterationFile){
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  setPos.setSetpieceSecondTeam(matchDetails)
  return matchDetails
}

async function setTopGoalKick(iterationFile){
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  setPos.setTopGoalKick(matchDetails)
  return matchDetails
}

async function setBottomGoalKick(iterationFile){
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  setPos.setBottomGoalKick(matchDetails)
  return matchDetails
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
  setBottomGoalKick
}
