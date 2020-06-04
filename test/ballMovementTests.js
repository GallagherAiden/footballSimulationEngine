/* eslint-disable no-unused-vars */
const mocha = require('mocha')
const { expect } = require('chai')
const bMovement = require('../lib/ballMovement')
const common = require('../lib/common')

function runTest() {
  mocha.describe('ArrayStuffs()', function() {
    mocha.it('merging arrays', async() => {
      let xArray = [-10, -10, -10, -10, -10, -10, -10, -10, -10, -10]
      let yArray = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
      let pArray = [2, 2, 2, 2, 1, 1, 1, 1, 1, 1]
      let newArray = bMovement.mergeArrays(10, [337, 527, 0], [237, 557], xArray, yArray, pArray)
      expect(newArray[0]).to.eql([327, 532, 2])
      expect(newArray[5]).to.eql([277, 557, 1])
      expect(newArray[8]).to.eql([247, 572, 1])
      expect(newArray[9]).to.eql([237, 557, 1])
    })
    mocha.it('split numbers', async() => {
      let array = bMovement.splitNumberIntoN(24, 8)
      expect(array).to.eql([5, 5, 4, 3, 3, 2, 1, 1])
    })
    mocha.it('calcBallMovementOverTime', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[9]
      let newPosition = bMovement.calcBallMovementOverTime(matchDetails, 30, [200, 300], player)
      try {
        expect(newPosition).to.eql([335, 523])
      } catch (err) {
        expect(newPosition).to.eql([333, 521])
      }
    })
    mocha.it('ball crossed 1', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[9]
      let newPosition = bMovement.ballCrossed(matchDetails, player)
      let xBetween = common.isBetween(newPosition[0], 335, 345)
      let yBetween = common.isBetween(newPosition[1], 530, 534)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it('ball crossed 2', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[9]
      let newPosition = bMovement.ballCrossed(matchDetails, player)
      let xBetween = common.isBetween(newPosition[0], 335, 345)
      let yBetween = common.isBetween(newPosition[1], 520, 524)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it('ball crossed 3', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[4]
      let newPosition = bMovement.ballCrossed(matchDetails, player)
      let xBetween = common.isBetween(newPosition[0], 331, 340)
      let yBetween = common.isBetween(newPosition[1], 520, 524)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it('ball crossed 4', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[4]
      let newPosition = bMovement.ballCrossed(matchDetails, player)
      let xBetween = common.isBetween(newPosition[0], 332, 345)
      let yBetween = common.isBetween(newPosition[1], 528, 534)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
  })
  mocha.describe('targetPlayers()', function() {
    for (let i of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) {
      mocha.it(`target Players top ${i}`, async() => {
        let playersArray = await common.readFile('test/input/ballMovements/targetPlayersArray.json')
        let thisPlayer = bMovement.getTargetPlayer(playersArray.thisArray, `top`)
        let playerValid = JSON.stringify(playersArray).indexOf(thisPlayer.name)
        let positionValid = JSON.stringify(playersArray).indexOf(thisPlayer.position)
        expect(playerValid).to.be.greaterThan(-1)
        expect(positionValid).to.be.greaterThan(-1)
      })
    }
    for (let i of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) {
      mocha.it(`target Players bottom ${i}`, async() => {
        let playersArray = await common.readFile('test/input/ballMovements/targetPlayersArray.json')
        let thisPlayer = bMovement.getTargetPlayer(playersArray.thisArray, `bottom`)
        let playerValid = JSON.stringify(playersArray).indexOf(thisPlayer.name)
        let positionValid = JSON.stringify(playersArray).indexOf(thisPlayer.position)
        expect(playerValid).to.be.greaterThan(-1)
        expect(positionValid).to.be.greaterThan(-1)
      })
    }
    mocha.it('set target player position', async() => {
      let output = bMovement.setTargetPlyPos([3, 4], 1, 1, 2, 2)
      expect(output).to.eql([4, 6])
    })
    mocha.it('set target player position - negative', async() => {
      let output = bMovement.setTargetPlyPos([3, 4], -1, -1, -2, -2)
      expect(output).to.eql([2, 2])
    })
    mocha.it('set B Player', async() => {
      let bPlayer = await common.readFile('test/input/ballMovements/bPlayer.json')
      let thisPlayer = bMovement.setBPlayer([0, 200])
      expect(thisPlayer).to.eql(bPlayer)
    })
  })
  mocha.describe('ballPassed()', function() {
    mocha.it(`ball passed defender`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let teammates = matchDetails.kickOffTeam
      let player = matchDetails.kickOffTeam.players[1]
      player.skill.passing = 1
      let newPosition = bMovement.ballPassed(matchDetails, teammates, player)
      let xBetween = common.isBetween(newPosition[0], 330, 355)
      let yBetween = common.isBetween(newPosition[1], 520, 540)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`ball passed midfielder`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let teammates = matchDetails.kickOffTeam
      let player = matchDetails.kickOffTeam.players[6]
      player.skill.passing = 1
      matchDetails.ball.position = [200, 995]
      let newPosition = bMovement.ballPassed(matchDetails, teammates, player)
      let xBetween = common.isBetween(newPosition[0], 195, 225)
      let yBetween = common.isBetween(newPosition[1], 985, 995)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`ball passed forward`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let teammates = matchDetails.kickOffTeam
      let player = matchDetails.kickOffTeam.players[9]
      player.skill.passing = 1
      matchDetails.ball.position = [200, 105]
      let newPosition = bMovement.ballPassed(matchDetails, teammates, player)
      let xBetween = common.isBetween(newPosition[0], 190, 220)
      let yBetween = common.isBetween(newPosition[1], 100, 120)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`ball passed defender - second team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let teammates = matchDetails.secondTeam
      let player = matchDetails.secondTeam.players[1]
      player.skill.passing = 1
      let newPosition = bMovement.ballPassed(matchDetails, teammates, player)
      let xBetween = common.isBetween(newPosition[0], 330, 345)
      let yBetween = common.isBetween(newPosition[1], 525, 540)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`ball passed midfielder - second team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let teammates = matchDetails.secondTeam
      let player = matchDetails.secondTeam.players[6]
      player.skill.passing = 1
      matchDetails.ball.position = [200, 105]
      let newPosition = bMovement.ballPassed(matchDetails, teammates, player)
      let xBetween = common.isBetween(newPosition[0], 195, 210)
      let yBetween = common.isBetween(newPosition[1], 100, 115)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`ball passed forward - second team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let teammates = matchDetails.secondTeam
      let player = matchDetails.secondTeam.players[9]
      player.skill.passing = 1
      matchDetails.ball.position = [200, 995]
      let newPosition = bMovement.ballPassed(matchDetails, teammates, player)
      let xBetween = common.isBetween(newPosition[0], 193, 220)
      let yBetween = common.isBetween(newPosition[1], 985, 995)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`ball passed forward - second team - high shooting`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let teammates = matchDetails.secondTeam
      let player = matchDetails.secondTeam.players[9]
      let newPosition = bMovement.ballPassed(matchDetails, teammates, player)
      let xBetween = common.isBetween(newPosition[0], 330, 345)
      let yBetween = common.isBetween(newPosition[1], 525, 540)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
  })
  mocha.describe('direction()', function() {
    mocha.it(`south`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      bMovement.getBallDirection(matchDetails, [337, 530])
      expect(matchDetails.ball.direction).to.eql('south')
    })
    mocha.it(`north`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      bMovement.getBallDirection(matchDetails, [337, 520])
      expect(matchDetails.ball.direction).to.eql('north')
    })
    mocha.it(`east`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      bMovement.getBallDirection(matchDetails, [340, 527])
      expect(matchDetails.ball.direction).to.eql('east')
    })
    mocha.it(`west`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      bMovement.getBallDirection(matchDetails, [320, 527])
      expect(matchDetails.ball.direction).to.eql('west')
    })
    mocha.it(`wait`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      bMovement.getBallDirection(matchDetails, [337, 527])
      expect(matchDetails.ball.direction).to.eql('wait')
    })
    mocha.it(`northeast`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      bMovement.getBallDirection(matchDetails, [340, 520])
      expect(matchDetails.ball.direction).to.eql('northeast')
    })
    mocha.it(`northwest`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      bMovement.getBallDirection(matchDetails, [320, 520])
      expect(matchDetails.ball.direction).to.eql('northwest')
    })
    mocha.it(`southeast`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      bMovement.getBallDirection(matchDetails, [340, 530])
      expect(matchDetails.ball.direction).to.eql('southeast')
    })
    mocha.it(`southwest`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      bMovement.getBallDirection(matchDetails, [320, 530])
      expect(matchDetails.ball.direction).to.eql('southwest')
    })
  })
  mocha.describe('setLowNewPower()', function() {
    mocha.it(`not offside`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let { kickOffTeam } = matchDetails
      let defPlayer = matchDetails.secondTeam.players[1]
      let defTeam = matchDetails.secondTeam
      bMovement.setLowNewPower(matchDetails, kickOffTeam, defPlayer, defTeam)
      expect(matchDetails.ball.Player).to.eql('78883930303030201')
      expect(matchDetails.ball.withTeam).to.eql('78883930303030003')
      expect(matchDetails.ball.position).to.eql([80, 970])
    })
    mocha.it(`offside - second team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let { kickOffTeam } = matchDetails
      let defPlayer = matchDetails.secondTeam.players[1]
      defPlayer.offside = true
      let defTeam = matchDetails.secondTeam
      bMovement.setLowNewPower(matchDetails, kickOffTeam, defPlayer, defTeam)
      expect(matchDetails.ball.Player).to.eql('78883930303030105')
      expect(matchDetails.ball.withTeam).to.eql('78883930303030002')
      expect(matchDetails.ball.position).to.eql([337, 527, 0])
    })
    mocha.it(`offside - kickoff team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let { kickOffTeam } = matchDetails
      let defPlayer = matchDetails.kickOffTeam.players[9]
      defPlayer.offside = true
      let defTeam = matchDetails.kickOffTeam
      bMovement.setLowNewPower(matchDetails, kickOffTeam, defPlayer, defTeam)
      expect(matchDetails.ball.Player).to.eql('78883930303030203')
      expect(matchDetails.ball.withTeam).to.eql('78883930303030003')
      expect(matchDetails.ball.position).to.eql([337, 527, 0])
    })
  })
}

module.exports = {
  runTest
}
