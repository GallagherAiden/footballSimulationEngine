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
      let xBetween = common.isBetween(newPosition[0], 334, 345)
      let yBetween = common.isBetween(newPosition[1], 530, 534)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it('ball crossed 2', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[9]
      let newPosition = bMovement.ballCrossed(matchDetails, player)
      let xBetween = common.isBetween(newPosition[0], 334, 345)
      let yBetween = common.isBetween(newPosition[1], 520, 524)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it('ball crossed 3', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[4]
      let newPosition = bMovement.ballCrossed(matchDetails, player)
      let xBetween = common.isBetween(newPosition[0], 330, 340)
      let yBetween = common.isBetween(newPosition[1], 520, 524)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it('ball crossed 4', async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[4]
      let newPosition = bMovement.ballCrossed(matchDetails, player)
      let xBetween = common.isBetween(newPosition[0], 330, 345)
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
      let yBetween = common.isBetween(newPosition[1], 99, 120)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`ball passed defender - second team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let teammates = matchDetails.secondTeam
      let player = matchDetails.secondTeam.players[1]
      player.skill.passing = 1
      let newPosition = bMovement.ballPassed(matchDetails, teammates, player)
      let xBetween = common.isBetween(newPosition[0], 328, 347)
      let yBetween = common.isBetween(newPosition[1], 523, 542)
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
      let xBetween = common.isBetween(newPosition[0], 191, 222)
      let yBetween = common.isBetween(newPosition[1], 983, 999)
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
  mocha.describe('setDeflectionDirectionPos()', function() {
    mocha.it(`east`, async() => {
      let position = bMovement.setDeflectionDirectionPos(`east`, [200, 300], 75)
      let yBetween = common.isBetween(position[1], 296, 304)
      expect(position[0]).to.eql(162.5)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`west`, async() => {
      let position = bMovement.setDeflectionDirectionPos(`west`, [200, 300], 75)
      let yBetween = common.isBetween(position[1], 296, 304)
      expect(position[0]).to.eql(237.5)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`north`, async() => {
      let position = bMovement.setDeflectionDirectionPos(`north`, [200, 300], 75)
      let xBetween = common.isBetween(position[0], 196, 204)
      expect(position[1]).to.eql(337.5)
      expect(xBetween).to.eql(true)
    })
    mocha.it(`south`, async() => {
      let position = bMovement.setDeflectionDirectionPos(`south`, [200, 300], 75)
      let xBetween = common.isBetween(position[0], 196, 204)
      expect(position[1]).to.eql(262.5)
      expect(xBetween).to.eql(true)
    })
    mocha.it(`wait`, async() => {
      let position = bMovement.setDeflectionDirectionPos(`wait`, [200, 300], 75)
      let xBetween = common.isBetween(position[0], -38, 38)
      let yBetween = common.isBetween(position[1], -38, 38)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
  })
  mocha.describe('setDeflectionDirectionPos()', function() {
    mocha.it(`deflected kickoff team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let defPlayer = matchDetails.kickOffTeam.players[9]
      let defTeam = matchDetails.kickOffTeam
      bMovement.setDeflectionPlayerOffside(matchDetails, defTeam, defPlayer)
      expect(defPlayer.offside).to.eql(false)
      expect(defPlayer.hasBall).to.eql(false)
      expect(matchDetails.ball.Player).to.eql('78883930303030203')
      expect(matchDetails.ball.withPlayer).to.eql(false)
      expect(matchDetails.ball.withTeam).to.eql('78883930303030003')
    })
    mocha.it(`tesdeflected second teamt1`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let defPlayer = matchDetails.secondTeam.players[9]
      let defTeam = matchDetails.secondTeam
      bMovement.setDeflectionPlayerOffside(matchDetails, defTeam, defPlayer)
      expect(defPlayer.offside).to.eql(false)
      expect(defPlayer.hasBall).to.eql(false)
      expect(matchDetails.ball.Player).to.eql('78883930303030105')
      expect(matchDetails.ball.withPlayer).to.eql(false)
      expect(matchDetails.ball.withTeam).to.eql('78883930303030002')
    })
  })
  mocha.describe('setDeflectiionPlayerHasBall()', function() {
    mocha.it(`not offside`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let defPlayer = matchDetails.secondTeam.players[1]
      let defTeam = matchDetails.secondTeam
      bMovement.setDeflectiionPlayerHasBall(matchDetails, defPlayer, defTeam)
      expect(matchDetails.ball.Player).to.eql('78883930303030201')
      expect(matchDetails.ball.withTeam).to.eql('78883930303030003')
      expect(matchDetails.ball.position).to.eql([80, 970])
    })
    mocha.it(`offside - second team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let defPlayer = matchDetails.secondTeam.players[1]
      defPlayer.offside = true
      let defTeam = matchDetails.secondTeam
      bMovement.setDeflectiionPlayerHasBall(matchDetails, defPlayer, defTeam)
      expect(matchDetails.ball.Player).to.eql('78883930303030105')
      expect(matchDetails.ball.withTeam).to.eql('78883930303030002')
      expect(matchDetails.ball.position).to.eql([337, 527, 0])
    })
  })
  mocha.describe('resolveDeflection()', function() {
    mocha.it(`less than 75 new power`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let defPlayer = matchDetails.secondTeam.players[7]
      let defTeam = matchDetails.secondTeam
      bMovement.resolveDeflection(120, [120, 300], [200, 350], defPlayer, defTeam, matchDetails)
      expect(matchDetails.ball.Player).to.eql('78883930303030207')
      expect(matchDetails.ball.withTeam).to.eql('78883930303030003')
      expect(matchDetails.ball.position).to.eql([420, 780])
    })
    mocha.it(`over than 75 new power`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let defPlayer = matchDetails.secondTeam.players[7]
      let defTeam = matchDetails.secondTeam
      let pos = bMovement.resolveDeflection(220, [120, 300], [200, 350], defPlayer, defTeam, matchDetails)
      expect(pos).to.eql([262.830094339717, 287.169905660283])
      expect(matchDetails.ballIntended).to.eql(undefined)
      expect(defPlayer.hasBall).to.eql(false)
      expect(matchDetails.ball.Player).to.eql('')
      expect(matchDetails.ball.withPlayer).to.eql(false)
      expect(matchDetails.ball.withTeam).to.eql('')
    })
  })
  mocha.describe('setBallMovementMatchDetails()', function() {
    mocha.it(`test1 - Ball Movement`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let thisPlayer = matchDetails.secondTeam.players[7]
      let thisPos = [40, 100]
      let thisTeam = matchDetails.secondTeam
      bMovement.setBallMovementMatchDetails(matchDetails, thisPlayer, thisPos, thisTeam)
      expect(matchDetails.ball.ballOverIterations).to.eql([])
      expect(matchDetails.ball.Player).to.eql(thisPlayer.playerID)
      expect(matchDetails.ball.withPlayer).to.eql(true)
      expect(matchDetails.ball.lastTouch).to.eql(thisPlayer.name)
      expect(matchDetails.ball.position).to.eql([40, 100])
    })
  })
  mocha.describe('throughBall()', function() {
    mocha.it(`high passing skill - top team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let team = matchDetails.kickOffTeam
      let player = matchDetails.kickOffTeam.players[3]
      player.skill.passing = 101
      let endPos = bMovement.throughBall(matchDetails, team, player)
      let xBetween = common.isBetween(endPos[0], 320, 345)
      let yBetween = common.isBetween(endPos[1], 510, 535)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`high passing skill - bottom team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let team = matchDetails.secondTeam
      let player = matchDetails.secondTeam.players[3]
      player.skill.passing = 101
      let endPos = bMovement.throughBall(matchDetails, team, player)
      let xBetween = common.isBetween(endPos[0], 330, 345)
      let yBetween = common.isBetween(endPos[1], 520, 535)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`middle third - bottom team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let team = matchDetails.secondTeam
      let player = matchDetails.secondTeam.players[9]
      player.skill.passing = 1
      let endPos = bMovement.throughBall(matchDetails, team, player)
      let xBetween = common.isBetween(endPos[0], 330, 345)
      let yBetween = common.isBetween(endPos[1], 520, 535)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`bottom third - bottom team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let team = matchDetails.secondTeam
      let player = matchDetails.secondTeam.players[9]
      player.skill.passing = 1
      matchDetails.ball.position[1] = 1000
      let endPos = bMovement.throughBall(matchDetails, team, player)
      let xBetween = common.isBetween(endPos[0], 330, 345)
      let yBetween = common.isBetween(endPos[1], 990, 1007)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`top third - bottom team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let team = matchDetails.secondTeam
      let player = matchDetails.secondTeam.players[9]
      player.skill.passing = 1
      matchDetails.ball.position[1] = 100
      let endPos = bMovement.throughBall(matchDetails, team, player)
      let xBetween = common.isBetween(endPos[0], 330, 345)
      let yBetween = common.isBetween(endPos[1], 90, 110)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`middle third - top team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let team = matchDetails.kickOffTeam
      let player = matchDetails.kickOffTeam.players[9]
      player.skill.passing = 1
      let endPos = bMovement.throughBall(matchDetails, team, player)
      let xBetween = common.isBetween(endPos[0], 330, 345)
      let yBetween = common.isBetween(endPos[1], 520, 535)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`bottom third - top team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let team = matchDetails.kickOffTeam
      let player = matchDetails.kickOffTeam.players[9]
      player.skill.passing = 1
      matchDetails.ball.position[1] = 1000
      let endPos = bMovement.throughBall(matchDetails, team, player)
      let xBetween = common.isBetween(endPos[0], 330, 345)
      let yBetween = common.isBetween(endPos[1], 990, 1005)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`top third - top team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let team = matchDetails.kickOffTeam
      let player = matchDetails.kickOffTeam.players[9]
      player.skill.passing = 1
      matchDetails.ball.position[1] = 100
      let endPos = bMovement.throughBall(matchDetails, team, player)
      let xBetween = common.isBetween(endPos[0], 330, 345)
      let yBetween = common.isBetween(endPos[1], 90, 107)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
  })
  mocha.describe('moveBall()', function() {
    mocha.it(`no ballOverIterations`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      matchDetails = bMovement.moveBall(matchDetails)
      expect(matchDetails.ball.direction).to.eql('wait')
    })
    mocha.it(`ballOverIterations`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      matchDetails.ball.ballOverIterations = [[211, 100], [215, 104]]
      matchDetails = bMovement.moveBall(matchDetails)
      expect(matchDetails.ball.position).to.eql([211, 100])
      expect(matchDetails.ball.ballOverIterations.length).to.eql(1)
    })
  })
  mocha.describe('getTopKickedPosition()', function() {
    mocha.it(`getTopKickedPosition - wait`, async() => {
      let endPos = bMovement.getTopKickedPosition(`wait`, [11, 200], 10)
      let xBetween = common.isBetween(endPos[0], 10, 17)
      let yBetween = common.isBetween(endPos[1], 199, 207)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`getTopKickedPosition - north`, async() => {
      let endPos = bMovement.getTopKickedPosition(`north`, [41, 200], 10)
      let xBetween = common.isBetween(endPos[0], 20, 62)
      let yBetween = common.isBetween(endPos[1], 189, 196)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`getTopKickedPosition - east`, async() => {
      let endPos = bMovement.getTopKickedPosition(`east`, [41, 200], 10)
      let xBetween = common.isBetween(endPos[0], 45, 52)
      let yBetween = common.isBetween(endPos[1], 179, 221)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`getTopKickedPosition - west`, async() => {
      let endPos = bMovement.getTopKickedPosition(`west`, [41, 200], 10)
      let xBetween = common.isBetween(endPos[0], 30, 37)
      let yBetween = common.isBetween(endPos[1], 179, 221)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`getTopKickedPosition - northeast`, async() => {
      let endPos = bMovement.getTopKickedPosition(`northeast`, [41, 200], 10)
      let xBetween = common.isBetween(endPos[0], 40, 47)
      let yBetween = common.isBetween(endPos[1], 189, 211)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`getTopKickedPosition - northwest`, async() => {
      let endPos = bMovement.getTopKickedPosition(`northwest`, [41, 200], 10)
      let xBetween = common.isBetween(endPos[0], 35, 42)
      let yBetween = common.isBetween(endPos[1], 189, 196)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
  })
  mocha.describe('getBottomKickedPosition()', function() {
    mocha.it(`getBottomKickedPosition - wait`, async() => {
      let endPos = bMovement.getBottomKickedPosition(`wait`, [11, 200], 10)
      let xBetween = common.isBetween(endPos[0], 10, 17)
      let yBetween = common.isBetween(endPos[1], 199, 207)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`getBottomKickedPosition - south`, async() => {
      let endPos = bMovement.getBottomKickedPosition(`south`, [41, 200], 10)
      let xBetween = common.isBetween(endPos[0], 20, 62)
      let yBetween = common.isBetween(endPos[1], 189, 221)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`getBottomKickedPosition - east`, async() => {
      let endPos = bMovement.getBottomKickedPosition(`east`, [41, 200], 10)
      let xBetween = common.isBetween(endPos[0], 45, 52)
      let yBetween = common.isBetween(endPos[1], 179, 221)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`getBottomKickedPosition - west`, async() => {
      let endPos = bMovement.getBottomKickedPosition(`west`, [41, 200], 10)
      let xBetween = common.isBetween(endPos[0], 30, 37)
      let yBetween = common.isBetween(endPos[1], 179, 221)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`getBottomKickedPosition - southeast`, async() => {
      let endPos = bMovement.getBottomKickedPosition(`southeast`, [41, 200], 10)
      let xBetween = common.isBetween(endPos[0], 40, 47)
      let yBetween = common.isBetween(endPos[1], 204, 211)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`getBottomKickedPosition - southwest`, async() => {
      let endPos = bMovement.getBottomKickedPosition(`southwest`, [41, 200], 10)
      let xBetween = common.isBetween(endPos[0], 35, 42)
      let yBetween = common.isBetween(endPos[1], 204, 211)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
  })
  mocha.describe('ballKicked()', function() {
    mocha.it(`ball kicked - top team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[3]
      let endPos = bMovement.ballKicked(matchDetails, player)
      let xBetween = common.isBetween(endPos[0], 330, 345)
      let yBetween = common.isBetween(endPos[1], 519, 535)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`ball kicked - bottom team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[3]
      let endPos = bMovement.ballKicked(matchDetails, player)
      let xBetween = common.isBetween(endPos[0], 330, 345)
      let yBetween = common.isBetween(endPos[1], 519, 535)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
  })
  mocha.describe('shotMade()', function() {
    mocha.it(`shot made - top team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[3]
      let endPos = bMovement.shotMade(matchDetails, player)
      let xBetween = common.isBetween(endPos[0], 330, 345)
      let yBetween = common.isBetween(endPos[1], 519, 535)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`shot made - bottom team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[3]
      let endPos = bMovement.shotMade(matchDetails, player)
      let xBetween = common.isBetween(endPos[0], 330, 345)
      let yBetween = common.isBetween(endPos[1], 519, 535)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`shot made - low skill`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[3]
      player.skill.shooting = 1
      let endPos = bMovement.shotMade(matchDetails, player)
      let xBetween = common.isBetween(endPos[0], 330, 345)
      let yBetween = common.isBetween(endPos[1], 519, 535)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`shot made - even half`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[3]
      matchDetails.half = 2
      let endPos = bMovement.shotMade(matchDetails, player)
      let xBetween = common.isBetween(endPos[0], 330, 345)
      let yBetween = common.isBetween(endPos[1], 519, 535)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`shot made - bad half input`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[3]
      matchDetails.half = 'abc'
      try {
        let endPos = bMovement.shotMade(matchDetails, player)
      } catch (err) {
        expect(err).to.be.an('Error')
        expect(err.toString()).to.have.string('You cannot supply 0 as a half')
      }
    })
  })
  mocha.describe('penaltyTaken()', function() {
    mocha.it(`shot made - top team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.kickOffTeam.players[3]
      let endPos = bMovement.penaltyTaken(matchDetails, player)
      let xBetween = common.isBetween(endPos[0], 330, 345)
      let yBetween = common.isBetween(endPos[1], 519, 535)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`shot made - bottom team`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[3]
      let endPos = bMovement.penaltyTaken(matchDetails, player)
      let xBetween = common.isBetween(endPos[0], 330, 345)
      let yBetween = common.isBetween(endPos[1], 519, 535)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`shot made - low skill`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[3]
      player.skill.shooting = 1
      let endPos = bMovement.penaltyTaken(matchDetails, player)
      let xBetween = common.isBetween(endPos[0], 330, 345)
      let yBetween = common.isBetween(endPos[1], 519, 535)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`shot made - even half`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[3]
      matchDetails.half = 2
      let endPos = bMovement.penaltyTaken(matchDetails, player)
      let xBetween = common.isBetween(endPos[0], 330, 345)
      let yBetween = common.isBetween(endPos[1], 519, 535)
      expect(xBetween).to.eql(true)
      expect(yBetween).to.eql(true)
    })
    mocha.it(`shot made - bad half input`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/matchDetails1.json')
      let player = matchDetails.secondTeam.players[3]
      matchDetails.half = 'abc'
      try {
        let endPos = bMovement.penaltyTaken(matchDetails, player)
      } catch (err) {
        expect(err).to.be.an('Error')
        expect(err.toString()).to.have.string('You cannot supply 0 as a half')
      }
    })
  })
  mocha.describe('checkGoalScored()', function() {
    mocha.it(`koteam close to ball`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/checkGoalScored.json')
      matchDetails.kickOffTeam.players[0].skill.saving = 101
      bMovement.checkGoalScored(matchDetails)
      expect(matchDetails.kickOffTeam.players[0].hasBall).to.eql(true)
      expect(matchDetails.ball.Player).to.eql('78883930303030100')
      expect(matchDetails.kickOffTeam.intent).to.eql(`attack`)
      expect(matchDetails.secondTeam.intent).to.eql(`defend`)
    })
    mocha.it(`steam close to ball`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/checkGoalScored.json')
      matchDetails.ball.position[1] = 1048
      matchDetails.secondTeam.players[0].skill.saving = 101
      bMovement.checkGoalScored(matchDetails)
      expect(matchDetails.secondTeam.players[0].hasBall).to.eql(true)
      expect(matchDetails.ball.Player).to.eql('78883930303030200')
      expect(matchDetails.secondTeam.intent).to.eql(`attack`)
      expect(matchDetails.kickOffTeam.intent).to.eql(`defend`)
    })
    mocha.it(`second team goal scored`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/checkGoalScored.json')
      matchDetails.ball.position = [350, -1]
      bMovement.checkGoalScored(matchDetails)
      expect(matchDetails.ball.withTeam).to.eql('78883930303030002')
      expect(matchDetails.kickOffTeam.intent).to.eql(`attack`)
      expect(matchDetails.secondTeam.intent).to.eql(`defend`)
      expect(matchDetails.secondTeamStatistics.goals).to.eql(1)
    })
    mocha.it(`kickoff team goal scored`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/checkGoalScored.json')
      matchDetails.ball.position = [350, 1051]
      bMovement.checkGoalScored(matchDetails)
      expect(matchDetails.ball.withTeam).to.eql('78883930303030003')
      expect(matchDetails.secondTeam.intent).to.eql(`attack`)
      expect(matchDetails.kickOffTeam.intent).to.eql(`defend`)
      expect(matchDetails.kickOffTeamStatistics.goals).to.eql(1)
    })
    mocha.it(`kickoff team goal scored - top`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/checkGoalScored.json')
      matchDetails.ball.position = [350, -1]
      matchDetails.half = 2
      bMovement.checkGoalScored(matchDetails)
      expect(matchDetails.ball.withTeam).to.eql('78883930303030003')
      expect(matchDetails.secondTeam.intent).to.eql(`attack`)
      expect(matchDetails.kickOffTeam.intent).to.eql(`defend`)
      expect(matchDetails.kickOffTeamStatistics.goals).to.eql(1)
    })
    mocha.it(`second team goal scored - top`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/checkGoalScored.json')
      matchDetails.ball.position = [350, 1051]
      matchDetails.half = 2
      bMovement.checkGoalScored(matchDetails)
      expect(matchDetails.ball.withTeam).to.eql('78883930303030002')
      expect(matchDetails.kickOffTeam.intent).to.eql(`attack`)
      expect(matchDetails.secondTeam.intent).to.eql(`defend`)
      expect(matchDetails.secondTeamStatistics.goals).to.eql(1)
    })
    mocha.it(`top goal scored - bad half`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/checkGoalScored.json')
      matchDetails.ball.position = [350, -1]
      matchDetails.half = 0
      try {
        bMovement.checkGoalScored(matchDetails)
      } catch (err) {
        expect(err).to.be.an('Error')
        expect(err.toString()).to.have.string('cannot set half as 0')
      }
    })
    mocha.it(`bottom goal scored - bad half`, async() => {
      let matchDetails = await common.readFile('test/input/getMovement/checkGoalScored.json')
      matchDetails.ball.position = [350, 1051]
      matchDetails.half = 0
      try {
        bMovement.checkGoalScored(matchDetails)
      } catch (err) {
        expect(err).to.be.an('Error')
        expect(err.toString()).to.have.string('cannot set half as 0')
      }
    })
  })
}

module.exports = {
  runTest
}
