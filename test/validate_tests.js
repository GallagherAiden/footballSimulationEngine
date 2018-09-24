/* eslint-disable */
const common = require('../lib/common')
const engine = require('../engine')

async function initGame(t1, t2, p) {
  let team1 = await common.readFile(t1)
    .catch(function(err) {
      throw err.stack
    })
  let team2 = await common.readFile(t2)
    .catch(function(err) {
      throw err.stack
    })
  let pitch = await common.readFile(p)
    .catch(function(err) {
      throw err.stack
    })
  let matchSetup = engine.initiateGame(team1, team2, pitch)
    .catch(function(err) {
      throw err.stack
    })
  return matchSetup
}

async function playIteration(inputIteration) {
  let inputJson = await common.readFile(inputIteration)
    .catch(function(err) {
      throw err.stack
    })
  let outputIteration = await engine.playIteration(inputJson)
    .catch(function(err) {
      throw err.stack
    })
  return outputIteration
}

async function setupSecondHalf(inputIteration) {
  let inputJson = await common.readFile(inputIteration)
    .catch(function(err) {
      throw err.stack
    })
  let outputJSON = await engine.startSecondHalf(inputJson)
    .catch(function(err) {
      throw err.stack
    })
  return outputJSON
}

module.exports = {
  initGame,
  playIteration,
  setupSecondHalf
}
