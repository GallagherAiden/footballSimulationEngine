const common = require('../lib/common')
const engine = require('../engine')

async function initGame(t1, t2, p) {
  try {
    let team1 = await common.readFile(t1)
    let team2 = await common.readFile(t2)
    let pitch = await common.readFile(p)
    let matchSetup = engine.initiateGame(team1, team2, pitch)
    return matchSetup
  } catch (err) {
    throw new Error(err)
  }
}

async function playIteration(inputIteration) {
  try {
    let inputJson = await common.readFile(inputIteration)
    let outputIteration = await engine.playIteration(inputJson)
    return outputIteration
  } catch (err) {
    throw new Error(err)
  }
}

async function setupSecondHalf(inputIteration) {
  try {
    let inputJson = await common.readFile(inputIteration)
    let outputJSON = await engine.startSecondHalf(inputJson)
    return outputJSON
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  initGame,
  playIteration,
  setupSecondHalf
}
