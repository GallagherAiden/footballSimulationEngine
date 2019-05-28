const mocha = require('mocha')
const { expect } = require('chai')
const setpieces = require('./lib/set_pieces')
const common = require('../lib/common')

function runTest() {
  mocha.describe('removeBallFromAllPlayers()', function() {
    mocha.it('check no player has the ball after its been removed from all players', async() => {
      let itlocation = './init_config/iteration.json'

      let nextJSON = await setpieces.removeBallFromAllPlayers(itlocation)

      expect(nextJSON).to.be.an('object')
      for (let player of nextJSON.kickOffTeam.players) {
        expect(player.hasBall).to.eql(false)
      }
      for (let player of nextJSON.secondTeam.players) {
        expect(player.hasBall).to.eql(false)
      }
    })
  })
  mocha.describe('switchTeamSides()', function() {
    mocha.it('check players sides are switched kickoff team', async() => {
      let itlocation = './init_config/iteration.json'
      let matchDetails = await common.readFile(itlocation)
      var testTeam = JSON.parse(JSON.stringify(matchDetails.kickOffTeam))
      let nextJSON = await setpieces.switchSide(matchDetails, matchDetails.kickOffTeam)

      for (let playerNum of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
        expect(testTeam.players[playerNum].originPOS).to.not.eql(nextJSON.kickOffTeam.players[playerNum].originPOS)
      }
    })
    mocha.it('check players sides are switched second team', async() => {
      let itlocation = './init_config/iteration.json'
      let matchDetails = await common.readFile(itlocation)
      var testTeam = JSON.parse(JSON.stringify(matchDetails.secondTeam))
      let nextJSON = await setpieces.switchSide(matchDetails, matchDetails.secondTeam)

      for (let playerNum of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
        expect(testTeam.players[playerNum].originPOS).to.not.eql(nextJSON.secondTeam.players[playerNum].originPOS)
      }
    })
    mocha.it('no origin POS set', async() => {
      let itlocation = './init_config/iteration.json'
      let matchDetails = await common.readFile(itlocation)
      delete matchDetails.secondTeam.players[0].originPOS

      try {
        let nextJSON = await setpieces.switchSide(matchDetails, matchDetails.secondTeam)
        expect(nextJSON).to.be.an(Object)
      } catch (err) {
        expect(err).to.be.an('Error')
        let expectedOutput = 'Each player must have an origin position set'
        expect(err.toString()).to.have.string(expectedOutput)
      }
    })
    mocha.it('low fitness level', async() => {
      let itlocation = './init_config/iteration.json'
      let matchDetails = await common.readFile(itlocation)
      matchDetails.secondTeam.players[0].fitness = 10
      let nextJSON = await setpieces.switchSide(matchDetails, matchDetails.secondTeam)

      expect(nextJSON.secondTeam.players[0].fitness).to.eql(60)
    })
  })
}

module.exports = {
  runTest
}
