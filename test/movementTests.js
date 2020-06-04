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
      let ballLog = matchDetails.iterationLog[4].indexOf(`passed to new position:`)
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
      let ballLog = matchDetails.iterationLog[4].indexOf(`crossed to new position:`)
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
  mocha.describe('getSprintMovement()', function() {
    mocha.it('Move NorthEast - close to ball ', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[7]
      let move = pMovement.getSprintMovement(matchDetails, thisPlayer, 20, 20)
      let betweenX = common.isBetween(move[0], -3, 1)
      let betweenY = common.isBetween(move[1], -3, 1)
      expect(betweenX).to.eql(true)
      expect(betweenY).to.eql(true)
      expect(thisPlayer.fitness).to.eql(99.98)
    })
    mocha.it('Move SouthWest - close to ball ', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[7]
      let move = pMovement.getSprintMovement(matchDetails, thisPlayer, -20, -20)
      let betweenX = common.isBetween(move[0], -1, 3)
      let betweenY = common.isBetween(move[1], -1, 3)
      expect(betweenX).to.eql(true)
      expect(betweenY).to.eql(true)
      expect(thisPlayer.fitness).to.eql(99.98)
    })
    mocha.it('Move Wait - close to ball ', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[7]
      thisPlayer.fitness = 29
      let move = pMovement.getSprintMovement(matchDetails, thisPlayer, 0, 0)
      let betweenX = common.isBetween(move[0], -1, 1)
      let betweenY = common.isBetween(move[1], -1, 1)
      expect(betweenX).to.eql(true)
      expect(betweenY).to.eql(true)
      expect(thisPlayer.fitness).to.eql(29)
    })
    mocha.it('Top player with ball', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[9]
      thisPlayer.fitness = 29
      let move = pMovement.getSprintMovement(matchDetails, thisPlayer, -20, 10)
      let betweenX = common.isBetween(move[0], -5, 5)
      let betweenY = common.isBetween(move[1], 1, 5)
      expect(betweenX).to.eql(true)
      expect(betweenY).to.eql(true)
      expect(thisPlayer.fitness).to.eql(29)
    })
    mocha.it('Bottom player with ball', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[9]
      thisPlayer.fitness = 31
      thisPlayer.originPOS[1] = 720
      let move = pMovement.getSprintMovement(matchDetails, thisPlayer, -20, 10)
      let betweenX = common.isBetween(move[0], -5, 5)
      let betweenY = common.isBetween(move[1], -5, -1)
      expect(betweenX).to.eql(true)
      expect(betweenY).to.eql(true)
      expect(thisPlayer.fitness).to.eql(30.99)
    })
    mocha.it('Move SouthEast - keep in formation', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[6]
      thisPlayer.currentPOS = [10, 100]
      let move = pMovement.getSprintMovement(matchDetails, thisPlayer, 40, 40)
      let betweenX = common.isBetween(move[0], -1, 3)
      let betweenY = common.isBetween(move[1], -1, 3)
      expect(betweenX).to.eql(true)
      expect(betweenY).to.eql(true)
      expect(thisPlayer.fitness).to.eql(99.985)
    })
    mocha.it('Move NorthWest - keep in formation', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[6]
      thisPlayer.currentPOS = [600, 1000]
      let move = pMovement.getSprintMovement(matchDetails, thisPlayer, 40, 40)
      let betweenX = common.isBetween(move[0], -3, 1)
      let betweenY = common.isBetween(move[1], -3, 1)
      expect(betweenX).to.eql(true)
      expect(betweenY).to.eql(true)
      expect(thisPlayer.fitness).to.eql(99.985)
    })
    mocha.it('Wait - keep in formation', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[6]
      thisPlayer.currentPOS = [230, 290]
      let move = pMovement.getSprintMovement(matchDetails, thisPlayer, 40, 40)
      let betweenX = common.isBetween(move[0], -1, 1)
      let betweenY = common.isBetween(move[1], -1, 1)
      expect(betweenX).to.eql(true)
      expect(betweenY).to.eql(true)
      expect(thisPlayer.fitness).to.eql(99.985)
    })
  })
  mocha.describe('getRunMovement()', function() {
    mocha.it('Move NorthEast - close to ball ', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[7]
      let move = pMovement.getRunMovement(matchDetails, thisPlayer, 20, 20)
      let betweenX = common.isBetween(move[0], -2, 1)
      let betweenY = common.isBetween(move[1], -2, 1)
      expect(betweenX).to.eql(true)
      expect(betweenY).to.eql(true)
      expect(thisPlayer.fitness).to.eql(99.985)
    })
    mocha.it('Move SouthWest - close to ball ', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[7]
      let move = pMovement.getRunMovement(matchDetails, thisPlayer, -20, -20)
      let betweenX = common.isBetween(move[0], -1, 2)
      let betweenY = common.isBetween(move[1], -1, 2)
      expect(betweenX).to.eql(true)
      expect(betweenY).to.eql(true)
      expect(thisPlayer.fitness).to.eql(99.985)
    })
    mocha.it('Move Wait - close to ball ', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[7]
      thisPlayer.fitness = 29
      let move = pMovement.getRunMovement(matchDetails, thisPlayer, 0, 0)
      let betweenX = common.isBetween(move[0], -1, 1)
      let betweenY = common.isBetween(move[1], -1, 1)
      expect(betweenX).to.eql(true)
      expect(betweenY).to.eql(true)
      expect(thisPlayer.fitness).to.eql(28.995)
    })
    mocha.it('Top player with ball', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[9]
      thisPlayer.fitness = 19
      let move = pMovement.getRunMovement(matchDetails, thisPlayer, -20, 10)
      let betweenX = common.isBetween(move[0], -3, 1)
      let betweenY = common.isBetween(move[1], -3, 1)
      expect(betweenX).to.eql(true)
      expect(betweenY).to.eql(true)
      expect(thisPlayer.fitness).to.eql(19)
    })
    mocha.it('Bottom player with ball', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[9]
      thisPlayer.fitness = 31
      thisPlayer.originPOS[1] = 720
      let move = pMovement.getRunMovement(matchDetails, thisPlayer, -20, 10)
      let betweenX = common.isBetween(move[0], -1, 3)
      let betweenY = common.isBetween(move[1], -1, 3)
      expect(betweenX).to.eql(true)
      expect(betweenY).to.eql(true)
      expect(thisPlayer.fitness).to.eql(30.995)
    })
    mocha.it('Move SouthEast - keep in formation', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[6]
      thisPlayer.currentPOS = [10, 100]
      let move = pMovement.getRunMovement(matchDetails, thisPlayer, 40, 40)
      let betweenX = common.isBetween(move[0], -1, 3)
      let betweenY = common.isBetween(move[1], -1, 3)
      expect(betweenX).to.eql(true)
      expect(betweenY).to.eql(true)
      expect(thisPlayer.fitness).to.eql(99.99)
    })
    mocha.it('Move NorthWest - keep in formation', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[6]
      thisPlayer.currentPOS = [600, 1000]
      let move = pMovement.getRunMovement(matchDetails, thisPlayer, 40, 40)
      let betweenX = common.isBetween(move[0], -3, 1)
      let betweenY = common.isBetween(move[1], -3, 1)
      expect(betweenX).to.eql(true)
      expect(betweenY).to.eql(true)
      expect(thisPlayer.fitness).to.eql(99.99)
    })
    mocha.it('Wait - keep in formation', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.kickOffTeam.players[6]
      thisPlayer.currentPOS = [230, 290]
      let move = pMovement.getRunMovement(matchDetails, thisPlayer, 40, 40)
      let betweenX = common.isBetween(move[0], -1, 1)
      let betweenY = common.isBetween(move[1], -1, 1)
      expect(betweenX).to.eql(true)
      expect(betweenY).to.eql(true)
      expect(thisPlayer.fitness).to.eql(99.99)
    })
  })
  mocha.describe('decideMovement()', function() {
    mocha.it('completeSlide and same position as ball', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails3.json')
      let closestPlayer = { name: 'Peter Johnson', position: 0 }
      matchDetails.kickOffTeam.players[10].action = `slide`
      let team = matchDetails.kickOffTeam
      let opp = matchDetails.secondTeam
      matchDetails.kickOffTeam = pMovement.decideMovement(closestPlayer, team, opp, matchDetails)
      let slideInfo = matchDetails.iterationLog[2].indexOf(`Slide tackle attempted by: Louise Johnson`)
      expect(slideInfo).to.be.greaterThan(-1)
    })
    mocha.it('completeTackle and same position as ball', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails3.json')
      let closestPlayer = { name: 'Peter Johnson', position: 0 }
      matchDetails.kickOffTeam.players[10].action = `tackle`
      let team = matchDetails.kickOffTeam
      let opp = matchDetails.secondTeam
      matchDetails.kickOffTeam = pMovement.decideMovement(closestPlayer, team, opp, matchDetails)
      let tackleInfo = matchDetails.iterationLog[2].indexOf(`Tackle attempted by: Louise Johnson`)
      expect(tackleInfo).to.be.greaterThan(-1)
    })
    mocha.it('completeSlide and wiithin 3 of ball', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails3.json')
      let closestPlayer = { name: 'Peter Johnson', position: 0 }
      matchDetails.kickOffTeam.players[10].action = `slide`
      matchDetails.kickOffTeam.players[10].currentPOS = [402, 519]
      let team = matchDetails.kickOffTeam
      let opp = matchDetails.secondTeam
      matchDetails.kickOffTeam = pMovement.decideMovement(closestPlayer, team, opp, matchDetails)
      let slideInfo = matchDetails.iterationLog[2].indexOf(`Slide tackle attempted by: Louise Johnson`)
      expect(slideInfo).to.be.greaterThan(-1)
    })
    mocha.it('same position as ball not slide or tackle - setClosePlayerTakesBall', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails3.json')
      let closestPlayer = { name: 'Peter Johnson', position: 0 }
      matchDetails.ball.withPlayer = false
      let team = matchDetails.kickOffTeam
      let opp = matchDetails.secondTeam
      matchDetails.kickOffTeam = pMovement.decideMovement(closestPlayer, team, opp, matchDetails)
      expect(matchDetails.kickOffTeam.players[10].hasBall).to.eql(true)
      expect(matchDetails.ball.lastTouch).to.eql(`Louise Johnson`)
    })
    mocha.it('within 2 of ball not slide or tackle - setClosePlayerTakesBall', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails3.json')
      let closestPlayer = { name: 'Peter Johnson', position: 0 }
      matchDetails.kickOffTeam.players[10].currentPOS = [402, 519]
      matchDetails.ball.withPlayer = false
      let team = matchDetails.kickOffTeam
      let opp = matchDetails.secondTeam
      matchDetails.kickOffTeam = pMovement.decideMovement(closestPlayer, team, opp, matchDetails)
      expect(matchDetails.kickOffTeam.players[10].hasBall).to.eql(true)
      expect(matchDetails.ball.lastTouch).to.eql(`Louise Johnson`)
    })
    mocha.it('far from, not slide or tackle - setClosePlayerTakesBall', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails3.json')
      let closestPlayer = { name: 'Louise Johnson', position: 0 }
      matchDetails.kickOffTeam.players[10].currentPOS = [402, 519]
      matchDetails.ball.withTeam = `78883930303030002`
      matchDetails.ball.withPlayer = false
      let team = matchDetails.kickOffTeam
      let opp = matchDetails.secondTeam
      matchDetails.kickOffTeam = pMovement.decideMovement(closestPlayer, team, opp, matchDetails)
      expect(matchDetails.kickOffTeam.players[10].hasBall).to.eql(true)
      expect(matchDetails.ball.lastTouch).to.eql(`Louise Johnson`)
    })
    mocha.it('far from, not slide or tackle - setClosePlayerTakesBall and offside true', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails3.json')
      let closestPlayer = { name: 'Louise Johnson', position: 0 }
      matchDetails.kickOffTeam.players[10].currentPOS = [402, 519]
      matchDetails.kickOffTeam.players[10].offside = true
      matchDetails.ball.withTeam = `78883930303030002`
      matchDetails.ball.withPlayer = false
      let team = matchDetails.kickOffTeam
      let opp = matchDetails.secondTeam
      matchDetails.kickOffTeam = pMovement.decideMovement(closestPlayer, team, opp, matchDetails)
      let offsideInfo = matchDetails.iterationLog[2].indexOf(`Louise Johnson is offside`)
      expect(offsideInfo).to.be.greaterThan(-1)
    })
    mocha.it('far from, not slide or tackle - setClosePlayerTakesBall and offside true', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails3.json')
      let thisPlayer = matchDetails.kickOffTeam.players[10]
      matchDetails.kickOffTeam.players[10].offside = true
      let team = JSON.parse(JSON.stringify(matchDetails.kickOffTeam))
      team.name = `aaaa`
      let opp = matchDetails.secondTeam
      pMovement.setClosePlayerTakesBall(matchDetails, thisPlayer, team, opp)
      let offsideInfo = matchDetails.iterationLog[2].indexOf(`Louise Johnson is offside`)
      expect(offsideInfo).to.be.greaterThan(-1)
    })
  })
  mocha.describe('closestPlayerAction()', function() {
    mocha.it('over 30', async() => {
      let ballX = 31
      let ballY = 31
      ballX = pMovement.closestPlayerActionBallX(ballX)
      ballY = pMovement.closestPlayerActionBallY(ballY)
      expect(ballX).to.eql(29)
      expect(ballY).to.eql(29)
    })
    mocha.it('under -30', async() => {
      let ballX = -33
      let ballY = -31
      ballX = pMovement.closestPlayerActionBallX(ballX)
      ballY = pMovement.closestPlayerActionBallY(ballY)
      expect(ballX).to.eql(-29)
      expect(ballY).to.eql(-29)
    })
    mocha.it('within 30s', async() => {
      let ballX = -15
      let ballY = 15
      ballX = pMovement.closestPlayerActionBallX(ballX)
      ballY = pMovement.closestPlayerActionBallY(ballY)
      expect(ballX).to.eql(-15)
      expect(ballY).to.eql(15)
    })
  })
}

module.exports = {
  runTest
}
