/* eslint-disable no-unused-vars */
/*eslint-disable max-len*/
const mocha = require('mocha')
const { expect } = require('chai')
const pMovement = require('../lib/playerMovement')
const common = require('../lib/common')

function runTest() {
  mocha.describe('checkOffside()', function() {
    mocha.it('1 Bottom Player offside', async() => {
      let matchDetails = await common.readFile('test/input/offsideTests/offsidePosition1.json')
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      pMovement.checkOffside(team, opposition, matchDetails)
      expect(JSON.stringify(matchDetails).split(`"offside":true`).length - 1).to.eql(1)
      expect(matchDetails.secondTeam.players[9].offside).to.eql(true)
    })
    mocha.it('1 Player top offside', async() => {
      let matchDetails = await common.readFile('test/input/offsideTests/offsideTopPosition1.json')
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      pMovement.checkOffside(team, opposition, matchDetails)
      expect(JSON.stringify(matchDetails).split(`"offside":true`).length - 1).to.eql(2)
      expect(matchDetails.kickOffTeam.players[9].offside).to.eql(true)
      expect(matchDetails.kickOffTeam.players[10].offside).to.eql(true)
    })
    mocha.it('1 Player top offside w/ ball', async() => {
      let matchDetails = await common.readFile('test/input/offsideTests/offsideTopPosition1withBall.json')
      let team = matchDetails.kickOffTeam
      let opposition = matchDetails.secondTeam
      pMovement.checkOffside(team, opposition, matchDetails)
      expect(JSON.stringify(matchDetails).split(`"offside":true`).length - 1).to.eql(0)
      expect(matchDetails.kickOffTeam.players[9].offside).to.eql(false)
      expect(matchDetails.kickOffTeam.players[10].offside).to.eql(false)
    })
    mocha.it('1 Player top offside w/ ball switched', async() => {
      let matchDetails = await common.readFile('test/input/offsideTests/offsideTopPosition1withBall.json')
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      pMovement.checkOffside(team, opposition, matchDetails)
      expect(JSON.stringify(matchDetails).split(`"offside":true`).length - 1).to.eql(0)
      expect(matchDetails.kickOffTeam.players[9].offside).to.eql(false)
      expect(matchDetails.kickOffTeam.players[10].offside).to.eql(false)
    })
    mocha.it('1 Player btm offside w/ ball', async() => {
      let matchDetails = await common.readFile('test/input/offsideTests/offsideBtmPosition1withBall.json')
      let team = matchDetails.kickOffTeam
      let opposition = matchDetails.secondTeam
      pMovement.checkOffside(team, opposition, matchDetails)
      expect(JSON.stringify(matchDetails).split(`"offside":true`).length - 1).to.eql(0)
      expect(matchDetails.kickOffTeam.players[9].offside).to.eql(false)
      expect(matchDetails.kickOffTeam.players[10].offside).to.eql(false)
    })
    mocha.it('1 Player btm offside w/ ball switched', async() => {
      let matchDetails = await common.readFile('test/input/offsideTests/offsideBtmPosition1withBall.json')
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      pMovement.checkOffside(team, opposition, matchDetails)
      expect(JSON.stringify(matchDetails).split(`"offside":true`).length - 1).to.eql(0)
      expect(matchDetails.kickOffTeam.players[9].offside).to.eql(false)
      expect(matchDetails.kickOffTeam.players[10].offside).to.eql(false)
    })
    mocha.it('2 Player offside', async() => {
      let matchDetails = await common.readFile('test/input/offsideTests/offsidePosition2.json')
      let team = matchDetails.kickOffTeam
      let opposition = matchDetails.secondTeam
      pMovement.checkOffside(team, opposition, matchDetails)
      expect(JSON.stringify(matchDetails).split(`"offside":true`).length - 1).to.eql(2)
      expect(matchDetails.secondTeam.players[9].offside).to.eql(true)
      expect(matchDetails.secondTeam.players[10].offside).to.eql(true)
    })
    mocha.it('1 offside player, same team with ball', async() => {
      let matchDetails = await common.readFile('test/input/offsideTests/onsidePosition1.json')
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      team.players[9].currentPOS[1] = 121
      matchDetails.ball.position[1] = 121
      team.players[10].currentPOS = [400, 57]
      pMovement.checkOffside(team, opposition, matchDetails)
      expect(JSON.stringify(matchDetails).split(`"offside":true`).length - 1).to.eql(1)
      expect(matchDetails.secondTeam.players[9].offside).to.eql(false)
      expect(matchDetails.secondTeam.players[10].offside).to.eql(true)
    })
    mocha.it('Team 1 at top, 1 player offside', async() => {
      let matchDetails = await common.readFile('test/input/offsideTests/offsidePosition3.json')
      let team = matchDetails.kickOffTeam
      let opposition = matchDetails.secondTeam
      pMovement.checkOffside(team, opposition, matchDetails)
      expect(JSON.stringify(matchDetails).split(`"offside":true`).length - 1).to.eql(2)
      expect(matchDetails.kickOffTeam.players[9].offside).to.eql(false)
      expect(matchDetails.kickOffTeam.players[10].offside).to.eql(true)
    })
    mocha.it('Team 1 at bottom, 1 player offside', async() => {
      let matchDetails = await common.readFile('test/input/offsideTests/offsidePosition3.json')
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      pMovement.checkOffside(team, opposition, matchDetails)
      expect(JSON.stringify(matchDetails).split(`"offside":true`).length - 1).to.eql(2)
      expect(matchDetails.kickOffTeam.players[9].offside).to.eql(false)
      expect(matchDetails.kickOffTeam.players[10].offside).to.eql(true)
    })
    mocha.it('Goalkeeper has ball, no offside positions', async() => {
      let matchDetails = await common.readFile('test/input/offsideTests/onsideBottomPosition2GK.json')
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      pMovement.checkOffside(team, opposition, matchDetails)
      expect(JSON.stringify(matchDetails).split(`"offside":true`).length - 1).to.eql(0)
      expect(matchDetails.secondTeam.players[9].offside).to.eql(false)
      expect(matchDetails.secondTeam.players[10].offside).to.eql(false)
    })
    mocha.it('Ball not with team', async() => {
      let matchDetails = await common.readFile('test/input/offsideTests/ballNotWithTeam.json')
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      pMovement.checkOffside(team, opposition, matchDetails)
      expect(JSON.stringify(matchDetails).split(`"offside":true`).length - 1).to.eql(0)
      expect(matchDetails.secondTeam.players[9].offside).to.eql(false)
      expect(matchDetails.secondTeam.players[10].offside).to.eql(false)
    })
  })
}

module.exports = {
  runTest
}
