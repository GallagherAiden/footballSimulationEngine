const common = require('../../lib/common')
const engine = require('../../engine')

async function initGame(t1, t2, p) {
  let team1 = await common.readFile(t1)
  let team2 = await common.readFile(t2)
  let pitch = await common.readFile(p)
  let matchSetup = engine.initiateGame(team1, team2, pitch)
  return matchSetup
}

async function playIteration(inputIteration) {
  let inputJson = await common.readFile(inputIteration)
  let outputIteration = await engine.playIteration(inputJson)
  return outputIteration
}

async function setupSecondHalf(inputIteration) {
  let inputJson = await common.readFile(inputIteration)
  let outputJSON = await engine.startSecondHalf(inputJson)
  return outputJSON
}

module.exports = {
  initGame,
  playIteration,
  setupSecondHalf
}
