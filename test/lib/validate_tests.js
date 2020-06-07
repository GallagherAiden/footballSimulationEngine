const common = require('../../lib/common')
const engine = require('../../engine')
const validate = require('../../lib/validate')
const fs = require('fs')

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

function validateArguments(a, b, c) {
  return validate.validateArguments(a, b, c)
}

function validateTeam(team) {
  validate.validateTeam(team)
}

function validateTeamSecondHalf(team) {
  validate.validateTeamSecondHalf(team)
}

function readFile(filePath) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

module.exports = {
  initGame,
  playIteration,
  setupSecondHalf,
  validateArguments,
  validateTeam,
  validateTeamSecondHalf,
  readFile
}
