const mocha = require('mocha')
const { expect } = require('chai')
const pMovement = require('../lib/playerMovement')
const common = require('../lib/common')
const engine = require('../engine')

function runTest() {
  mocha.describe('makeMovement()', function () {
    mocha.it('Has Ball - runs', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let movement = engine.playIteration(matchDetails)
    })
    mocha.it('Has Ball - runs', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[9]
      let opposition = matchDetails.secondTeam
      let movement = pMovement.makeMovement(player, 'run', opposition, 0, 0, matchDetails)
      expect(true).to.eql(common.isBetween(movement[0], -3, 1))
      expect(true).to.eql(common.isBetween(movement[1], -3, 1))
    })
    mocha.it('Has Ball - sprint', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[9]
      let opposition = matchDetails.secondTeam
      let movement = pMovement.makeMovement(player, 'sprint', opposition, 0, 0, matchDetails)
      expect(true).to.eql(common.isBetween(movement[0], -5, 5))
      expect(true).to.eql(common.isBetween(movement[1], 1, 5))
    })
    mocha.it('Has Ball - shoot', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[9]
      let opposition = matchDetails.secondTeam
      let movement = pMovement.makeMovement(player, 'shoot', opposition, 0, 0, matchDetails)
      expect(movement).to.eql([0, 0])
    })
    mocha.it('Has Ball - throughball', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[9]
      let opposition = matchDetails.secondTeam
      let movement = pMovement.makeMovement(player, 'throughBall', opposition, 0, 0, matchDetails)
      expect(movement).to.eql([0, 0])
    })
    mocha.it('Has Ball - pass', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[9]
      let opposition = matchDetails.secondTeam
      let movement = pMovement.makeMovement(player, 'pass', opposition, 0, 0, matchDetails)
      expect(movement).to.eql([0, 0])
    })
    mocha.it('Has Ball - cross', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[9]
      let opposition = matchDetails.secondTeam
      let movement = pMovement.makeMovement(player, 'cross', opposition, 0, 0, matchDetails)
      expect(movement).to.eql([0, 0])
    })
    mocha.it('Has Ball - cleared', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[9]
      let opposition = matchDetails.secondTeam
      let movement = pMovement.makeMovement(player, 'cleared', opposition, 0, 0, matchDetails)
      expect(movement).to.eql([0, 0])
    })
    mocha.it('Has Ball - boot', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[9]
      let opposition = matchDetails.secondTeam
      let movement = pMovement.makeMovement(player, 'boot', opposition, 0, 0, matchDetails)
      expect(movement).to.eql([0, 0])
    })
    mocha.it('Has Ball - penalty', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[9]
      let opposition = matchDetails.secondTeam
      let movement = pMovement.makeMovement(player, 'penalty', opposition, 0, 0, matchDetails)
      expect(movement).to.eql([0, 0])
    })
    mocha.it('No Ball - tackle +/+', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[4]
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.makeMovement(player, 'tackle', opposition, 265, 444, matchDetails)
      expect(movement).to.eql([-1, -1])
    })
    mocha.it('No Ball - tackle 0/0', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[4]
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.makeMovement(player, 'tackle', opposition, 0, 0, matchDetails)
      expect(movement).to.eql([0, 0])
    })
    mocha.it('No Ball - tackle -/-', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[4]
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.makeMovement(player, 'tackle', opposition, -10, -10, matchDetails)
      expect(movement).to.eql([1, 1])
    })
    mocha.it('No Ball - tackle +/-', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[4]
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.makeMovement(player, 'tackle', opposition, 10, -10, matchDetails)
      expect(movement).to.eql([-1, 1])
    })
    mocha.it('No Ball - slide', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[4]
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.makeMovement(player, 'slide', opposition, 265, 444, matchDetails)
      expect(movement).to.eql([-1, -1])
    })
    mocha.it('No Ball - intercept +/0', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[4]
      player.currentPOS[1]+= 2
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.makeMovement(player, 'intercept', opposition, 265, 448, matchDetails)
      expect(movement).to.eql([-1, 0])
    })
    mocha.it('No Ball - intercept -/-', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails2.json')
      let player = matchDetails.secondTeam.players[4]
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.makeMovement(player, 'intercept', opposition, -327, -522, matchDetails)
      expect(movement).to.eql([1, 1])
    })
    mocha.it('No Ball - intercept 0/-', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[5]
      player.currentPOS[0] = 337
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.makeMovement(player, 'intercept', opposition, 0, -255, matchDetails)
      expect(movement).to.eql([0, 1])
    })
    mocha.it('No Ball - intercept 0/0', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[5]
      player.currentPOS[0] = 337
      player.currentPOS[1] = 527
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.makeMovement(player, 'intercept', opposition, 0, 0, matchDetails)
      expect(movement).to.eql([0, 0])
    })
    mocha.it('No Ball - intercept 0/+', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[5]
      player.currentPOS[0] = 337
      player.currentPOS[1] = 957
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.makeMovement(player, 'intercept', opposition, 0, 430, matchDetails)
      expect(movement).to.eql([0, -1])
    })
    mocha.it('No Ball - intercept +/+', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[5]
      player.currentPOS[0] = 537
      player.currentPOS[1] = 1357
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.makeMovement(player, 'intercept', opposition, 0, 430, matchDetails)
      expect(movement).to.eql([-1, -1])
    })
    mocha.it('No Ball - intercept +/-', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[5]
      player.currentPOS[0] = 537
      player.currentPOS[1] = 1
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.makeMovement(player, 'intercept', opposition, 0, 430, matchDetails)
      expect(movement).to.eql([-1, 1])
    })
    mocha.it('No Ball - intercept -/+', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[5]
      player.currentPOS[0] = 1
      player.currentPOS[1] = 1357
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.makeMovement(player, 'intercept', opposition, 0, 430, matchDetails)
      expect(movement).to.eql([1, -1])
    })
    mocha.it('No Ball - run', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[4]
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.makeMovement(player, 'run', opposition, 265, 444, matchDetails)
      expect(movement).to.eql([0, 0])
    })
    mocha.it('No Ball - sprint', async () => {
      let matchDetails = await common.readFile('test/input/makeMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[4]
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.makeMovement(player, 'sprint', opposition, 265, 444, matchDetails)
      expect(movement).to.eql([0, 0])
    })
  })
}

module.exports = {
  runTest
}
