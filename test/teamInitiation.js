const mocha = require('mocha')
const { expect } = require('chai')
const initteams = require('./lib/initiate_team')

function runTest() {
  mocha.describe('testTeamSetup()', function() {
    mocha.it('check all players origin positions are the same as the start positions', async() => {
      let t1location = './init_config/team1.json'

      let teamOutput = await initteams.setTeam(t1location)

      expect(teamOutput).to.be.an('object')
      expect(teamOutput.players[0].originPOS).to.eql(teamOutput.players[0].startPOS)
      expect(teamOutput.players[1].originPOS).to.eql(teamOutput.players[1].startPOS)
      expect(teamOutput.players[2].originPOS).to.eql(teamOutput.players[2].startPOS)
      expect(teamOutput.players[3].originPOS).to.eql(teamOutput.players[3].startPOS)
      expect(teamOutput.players[4].originPOS).to.eql(teamOutput.players[4].startPOS)
      expect(teamOutput.players[5].originPOS).to.eql(teamOutput.players[5].startPOS)
      expect(teamOutput.players[6].originPOS).to.eql(teamOutput.players[6].startPOS)
      expect(teamOutput.players[7].originPOS).to.eql(teamOutput.players[7].startPOS)
      expect(teamOutput.players[8].originPOS).to.eql(teamOutput.players[8].startPOS)
      expect(teamOutput.players[9].originPOS).to.eql(teamOutput.players[9].startPOS)
      expect(teamOutput.players[10].originPOS).to.eql(teamOutput.players[10].startPOS)
    })
    mocha.it('check all players relative positions are the same as the start positions', async() => {
      let t1location = './init_config/team1.json'

      let teamOutput = await initteams.setTeam(t1location)

      expect(teamOutput).to.be.an('object')
      expect(teamOutput.players[0].relativePOS).to.eql(teamOutput.players[0].startPOS)
      expect(teamOutput.players[1].relativePOS).to.eql(teamOutput.players[1].startPOS)
      expect(teamOutput.players[2].relativePOS).to.eql(teamOutput.players[2].startPOS)
      expect(teamOutput.players[3].relativePOS).to.eql(teamOutput.players[3].startPOS)
      expect(teamOutput.players[4].relativePOS).to.eql(teamOutput.players[4].startPOS)
      expect(teamOutput.players[5].relativePOS).to.eql(teamOutput.players[5].startPOS)
      expect(teamOutput.players[6].relativePOS).to.eql(teamOutput.players[6].startPOS)
      expect(teamOutput.players[7].relativePOS).to.eql(teamOutput.players[7].startPOS)
      expect(teamOutput.players[8].relativePOS).to.eql(teamOutput.players[8].startPOS)
      expect(teamOutput.players[9].relativePOS).to.eql(teamOutput.players[9].startPOS)
      expect(teamOutput.players[10].relativePOS).to.eql(teamOutput.players[10].startPOS)
    })
  })
}

module.exports = {
  runTest
}
