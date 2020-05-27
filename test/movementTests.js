/* eslint-disable no-unused-vars */
const mocha = require('mocha')
const { expect } = require('chai')
const pMovement = require('../lib/playerMovement')
const common = require('../lib/common')

function runTest() {
  mocha.describe('getMovement()', function() {
    mocha.it('Has Ball - runs', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[9]
      let opposition = matchDetails.secondTeam
      let movement = pMovement.getMovement(player, 'run', opposition, 0, 0, matchDetails)
      expect(true).to.eql(common.isBetween(movement[0], -3, 1))
      expect(true).to.eql(common.isBetween(movement[1], -3, 1))
    })
    mocha.it('Has Ball - sprint', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[9]
      let opposition = matchDetails.secondTeam
      let movement = pMovement.getMovement(player, 'sprint', opposition, 0, 0, matchDetails)
      expect(true).to.eql(common.isBetween(movement[0], -5, 5))
      expect(true).to.eql(common.isBetween(movement[1], 1, 5))
    })
    mocha.it('Has Ball - shoot', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[9]
      let opposition = matchDetails.secondTeam
      let movement = pMovement.getMovement(player, 'shoot', opposition, 0, 0, matchDetails)
      expect(movement).to.eql([0, 0])
    })
    mocha.it('Has Ball - throughball', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[9]
      let opposition = matchDetails.secondTeam
      let movement = pMovement.getMovement(player, 'throughBall', opposition, 0, 0, matchDetails)
      expect(movement).to.eql([0, 0])
    })
    mocha.it('Has Ball - pass', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[9]
      let opposition = matchDetails.secondTeam
      let movement = pMovement.getMovement(player, 'pass', opposition, 0, 0, matchDetails)
      expect(movement).to.eql([0, 0])
    })
    mocha.it('Has Ball - cross', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[9]
      let opposition = matchDetails.secondTeam
      let movement = pMovement.getMovement(player, 'cross', opposition, 0, 0, matchDetails)
      expect(movement).to.eql([0, 0])
    })
    mocha.it('Has Ball - cleared', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[9]
      let opposition = matchDetails.secondTeam
      let movement = pMovement.getMovement(player, 'cleared', opposition, 0, 0, matchDetails)
      expect(movement).to.eql([0, 0])
    })
    mocha.it('Has Ball - boot', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[9]
      let opposition = matchDetails.secondTeam
      let movement = pMovement.getMovement(player, 'boot', opposition, 0, 0, matchDetails)
      expect(movement).to.eql([0, 0])
    })
    mocha.it('Has Ball - penalty', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[9]
      let opposition = matchDetails.secondTeam
      let movement = pMovement.getMovement(player, 'penalty', opposition, 0, 0, matchDetails)
      expect(movement).to.eql([0, 0])
    })
    mocha.it('No Ball - tackle +/+', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[4]
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.getMovement(player, 'tackle', opposition, 265, 444, matchDetails)
      expect(movement).to.eql([-1, -1])
    })
    mocha.it('No Ball - tackle 0/0', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[4]
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.getMovement(player, 'tackle', opposition, 0, 0, matchDetails)
      expect(movement).to.eql([0, 0])
    })
    mocha.it('No Ball - tackle -/-', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[4]
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.getMovement(player, 'tackle', opposition, -10, -10, matchDetails)
      expect(movement).to.eql([1, 1])
    })
    mocha.it('No Ball - tackle +/-', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[4]
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.getMovement(player, 'tackle', opposition, 10, -10, matchDetails)
      expect(movement).to.eql([-1, 1])
    })
    mocha.it('No Ball - slide', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[4]
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.getMovement(player, 'slide', opposition, 265, 444, matchDetails)
      expect(movement).to.eql([-1, -1])
    })
    mocha.it('No Ball - intercept +/0', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[4]
      player.currentPOS[1] += 2
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.getMovement(player, 'intercept', opposition, 265, 448, matchDetails)
      expect(movement).to.eql([-1, 0])
    })
    mocha.it('No Ball - intercept -/-', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails2.json')
      let player = matchDetails.secondTeam.players[4]
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.getMovement(player, 'intercept', opposition, -327, -522, matchDetails)
      expect(movement).to.eql([1, 1])
    })
    mocha.it('No Ball - intercept 0/-', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[5]
      player.currentPOS[0] = 337
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.getMovement(player, 'intercept', opposition, 0, -255, matchDetails)
      expect(movement).to.eql([0, 1])
    })
    mocha.it('No Ball - intercept 0/0', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[5]
      player.currentPOS[0] = 337
      player.currentPOS[1] = 527
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.getMovement(player, 'intercept', opposition, 0, 0, matchDetails)
      expect(movement).to.eql([0, 0])
    })
    mocha.it('No Ball - intercept 0/+', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[5]
      player.currentPOS[0] = 337
      player.currentPOS[1] = 957
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.getMovement(player, 'intercept', opposition, 0, 430, matchDetails)
      expect(movement).to.eql([0, -1])
    })
    mocha.it('No Ball - intercept +/+', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[5]
      player.currentPOS[0] = 537
      player.currentPOS[1] = 1357
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.getMovement(player, 'intercept', opposition, 0, 430, matchDetails)
      expect(movement).to.eql([-1, -1])
    })
    mocha.it('No Ball - intercept +/-', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[5]
      player.currentPOS[0] = 537
      player.currentPOS[1] = 1
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.getMovement(player, 'intercept', opposition, 0, 430, matchDetails)
      expect(movement).to.eql([-1, 1])
    })
    mocha.it('No Ball - intercept -/+', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[5]
      player.currentPOS[0] = 1
      player.currentPOS[1] = 1357
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.getMovement(player, 'intercept', opposition, 0, 430, matchDetails)
      expect(movement).to.eql([1, -1])
    })
    mocha.it('No Ball - run', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[4]
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.getMovement(player, 'run', opposition, 265, 444, matchDetails)
      expect(movement).to.eql([0, 0])
    })
    mocha.it('No Ball - sprint', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[4]
      let opposition = matchDetails.kickOffTeam
      let movement = pMovement.getMovement(player, 'sprint', opposition, 265, 444, matchDetails)
      expect(movement).to.eql([0, 0])
    })
  })
  mocha.describe('misc()', function() {
    mocha.it('updateInformation', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let newPosition = [12, 32]
      pMovement.updateInformation(matchDetails, newPosition)
      expect(matchDetails.ball.position).to.eql([12, 32, 0])
    })
    mocha.it('ballMoved', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.secondTeam.players[4]
      thisPlayer.hasBall = true
      let team = matchDetails.secondTeam
      let opp = matchDetails.kickOffTeam
      pMovement.ballMoved(matchDetails, thisPlayer, team, opp)
      expect(matchDetails.ball.withPlayer).to.eql(false)
      expect(matchDetails.ball.Player).to.eql(``)
      expect(matchDetails.ball.withTeam).to.eql(``)
      expect(matchDetails.secondTeam.players[4].hasBall).to.eql(false)
      expect(matchDetails.secondTeam.intent).to.eql(`attack`)
      expect(matchDetails.kickOffTeam.intent).to.eql(`attack`)
    })
    mocha.it('ballPlayerActions - cleared', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[9]
      let team = matchDetails.kickOffTeam
      let opp = matchDetails.secondTeam
      pMovement.handleBallPlayerActions(matchDetails, thisPlayer, team, opp, `cleared`)
      expect(matchDetails.ball.withPlayer).to.eql(false)
      expect(matchDetails.ball.Player).to.eql(``)
      expect(matchDetails.ball.withTeam).to.eql(``)
      expect(matchDetails.kickOffTeam.players[9].hasBall).to.eql(false)
      expect(matchDetails.ball.position).to.not.eql(thisPlayer.currentPOS)
    })
    mocha.it('ballPlayerActions - boot', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[9]
      let team = matchDetails.kickOffTeam
      let opp = matchDetails.secondTeam
      pMovement.handleBallPlayerActions(matchDetails, thisPlayer, team, opp, `boot`)
      expect(matchDetails.ball.withPlayer).to.eql(false)
      expect(matchDetails.ball.Player).to.eql(``)
      expect(matchDetails.ball.withTeam).to.eql(``)
      expect(matchDetails.kickOffTeam.players[9].hasBall).to.eql(false)
      expect(matchDetails.ball.position).to.not.eql(thisPlayer.currentPOS)
    })
    mocha.it('ballPlayerActions - pass', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[9]
      let team = matchDetails.kickOffTeam
      let opp = matchDetails.secondTeam
      pMovement.handleBallPlayerActions(matchDetails, thisPlayer, team, opp, `pass`)
      expect(matchDetails.ball.withPlayer).to.eql(false)
      expect(matchDetails.ball.Player).to.eql(``)
      expect(matchDetails.ball.withTeam).to.eql(``)
      expect(matchDetails.kickOffTeam.players[9].hasBall).to.eql(false)
      expect(matchDetails.ball.position).to.not.eql(thisPlayer.currentPOS)
      let ballLog = matchDetails.iterationLog[3].indexOf(`passed to new position:`)
      expect(ballLog).to.be.greaterThan(-1)
    })
    mocha.it('ballPlayerActions - cross', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[9]
      let team = matchDetails.kickOffTeam
      let opp = matchDetails.secondTeam
      pMovement.handleBallPlayerActions(matchDetails, thisPlayer, team, opp, `cross`)
      expect(matchDetails.ball.withPlayer).to.eql(false)
      expect(matchDetails.ball.Player).to.eql(``)
      expect(matchDetails.ball.withTeam).to.eql(``)
      expect(matchDetails.kickOffTeam.players[9].hasBall).to.eql(false)
      expect(matchDetails.ball.position).to.not.eql(thisPlayer.currentPOS)
      let ballLog = matchDetails.iterationLog[3].indexOf(`crossed to new position:`)
      expect(ballLog).to.be.greaterThan(-1)
    })
    mocha.it('ballPlayerActions - throughball', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[9]
      let team = matchDetails.kickOffTeam
      let opp = matchDetails.secondTeam
      pMovement.handleBallPlayerActions(matchDetails, thisPlayer, team, opp, `throughBall`)
      expect(matchDetails.ball.withPlayer).to.eql(false)
      expect(matchDetails.ball.Player).to.eql(``)
      expect(matchDetails.ball.withTeam).to.eql(``)
      expect(matchDetails.kickOffTeam.players[9].hasBall).to.eql(false)
      expect(matchDetails.ball.position).to.not.eql(thisPlayer.currentPOS)
    })
    mocha.it('ballPlayerActions - shoot', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[9]
      let team = matchDetails.kickOffTeam
      let opp = matchDetails.secondTeam
      pMovement.handleBallPlayerActions(matchDetails, thisPlayer, team, opp, `shoot`)
      expect(matchDetails.ball.withPlayer).to.eql(false)
      expect(matchDetails.ball.Player).to.eql(``)
      expect(matchDetails.ball.withTeam).to.eql(``)
      expect(matchDetails.kickOffTeam.players[9].hasBall).to.eql(false)
      expect(matchDetails.ball.position).to.not.eql(thisPlayer.currentPOS)
    })
    mocha.it('ballPlayerActions - penalty', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[9]
      let team = matchDetails.kickOffTeam
      let opp = matchDetails.secondTeam
      pMovement.handleBallPlayerActions(matchDetails, thisPlayer, team, opp, `penalty`)
      expect(matchDetails.ball.withPlayer).to.eql(false)
      expect(matchDetails.ball.Player).to.eql(``)
      expect(matchDetails.ball.withTeam).to.eql(``)
      expect(matchDetails.kickOffTeam.players[9].hasBall).to.eql(false)
      expect(matchDetails.ball.position).to.not.eql(thisPlayer.currentPOS)
    })
    mocha.it('checkProvidedAction - no ball, valid provided action', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[7]
      thisPlayer.action = `tackle`
      let action = `run`
      action = pMovement.checkProvidedAction(matchDetails, thisPlayer, action)
      expect(action).to.eql(`tackle`)
    })
    mocha.it('checkProvidedAction - no ball, provided ball action', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[7]
      let action = `run`
      thisPlayer.action = `pass`
      action = pMovement.checkProvidedAction(matchDetails, thisPlayer, action)
      expect(action).to.eql(`run`)
    })
    mocha.it('checkProvidedAction - has ball, provided none ball action', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[9]
      let action = `run`
      thisPlayer.action = `slide`
      action = pMovement.checkProvidedAction(matchDetails, thisPlayer, action)
      expect(action).to.not.eql(`slide`)
    })
    mocha.it('checkProvidedAction - has ball, provided none ball action intercept', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[9]
      let action = `run`
      thisPlayer.action = `intercept`
      action = pMovement.checkProvidedAction(matchDetails, thisPlayer, action)
      expect(action).to.not.eql(`intercept`)
    })
    mocha.it('checkProvidedAction - has ball, provided ball action', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[9]
      let action = `run`
      thisPlayer.action = `shoot`
      action = pMovement.checkProvidedAction(matchDetails, thisPlayer, action)
      expect(action).to.eql(`shoot`)
    })
    mocha.it('checkProvidedAction - none', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[7]
      let action = `run`
      thisPlayer.action = `none`
      action = pMovement.checkProvidedAction(matchDetails, thisPlayer, action)
      expect(action).to.eql(`run`)
    })
    mocha.it('checkProvidedAction - nothing', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[7]
      let action = `run`
      thisPlayer.action = ``
      try {
        action = pMovement.checkProvidedAction(matchDetails, thisPlayer, action)
      } catch (err) {
        expect(err).to.be.an('Error')
        expect(err.toString()).to.have.string('Invalid player action for Cameron Johnson')
      }
    })
    mocha.it('checkProvidedAction - invalid action', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[7]
      let action = `run`
      thisPlayer.action = `megs`
      try {
        action = pMovement.checkProvidedAction(matchDetails, thisPlayer, action)
      } catch (err) {
        expect(err).to.be.an('Error')
        expect(err.toString()).to.have.string('Invalid player action for Cameron Johnson')
      }
    })
  })
}

module.exports = {
  runTest
}
