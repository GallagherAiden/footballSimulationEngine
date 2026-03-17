const mocha = require('mocha')
const { expect } = require('chai')
const common = require('../lib/common')
const setPos = require('../lib/setPositions')

function runTest() {
  mocha.describe('intentPOSitionsDefence()', function() {
    mocha.it('kickoff team defensive shape shifts toward ball', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/intentPositionATTinOwnHalf2.json')
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerKOTInput.json')
      setPos.setIntentPosition(matchDetails, closestPlayer)
      const ball = matchDetails.ball.position.slice(0, 2)
      for (let player of matchDetails.kickOffTeam.players) {
        const intent = player.intentPOS
        const base = player.originPOS
        if (player.playerID === closestPlayer.playerID) {
          expect(intent[0]).to.not.eql(player.currentPOS[0])
          expect(intent[1]).to.not.eql(player.currentPOS[1])
        } else {
          expect(Math.abs(intent[0] - ball[0])).to.be.at.most(Math.abs(base[0] - ball[0]))
          expect(Math.abs(intent[1] - ball[1])).to.be.at.most(Math.abs(base[1] - ball[1]))
        }
      }
    })
    mocha.it('defensive players closer to ball move more', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/intentPositionATTinOwnHalf3.json')
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerKOTInput.json')
      setPos.setIntentPosition(matchDetails, closestPlayer)
      const ball = matchDetails.ball.position.slice(0, 2)
      for (let player of matchDetails.kickOffTeam.players) {
        const beforeDelta = ball[1] - player.originPOS[1]
        const afterDelta = ball[1] - player.intentPOS[1]
        expect(Math.abs(afterDelta)).to.be.at.most(Math.abs(beforeDelta))
      }
    })
    mocha.it('second team defensive shape shifts toward ball', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/intentPositionATTinOwnHalf.json')
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerSTInput.json')
      setPos.setIntentPosition(matchDetails, closestPlayer)
      const ball = matchDetails.ball.position.slice(0, 2)
      for (let player of matchDetails.secondTeam.players) {
        const intent = player.intentPOS
        const base = player.originPOS
        if (player.playerID === closestPlayer.playerID) continue
        expect(Math.abs(intent[1] - ball[1])).to.be.lessThan(Math.abs(base[1] - ball[1]))
      }
    })
    mocha.it('defensive shape remains compact when ball in own half', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/intentPositionATTinDEFHalf2.json')
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerKOTInput.json')
      setPos.setIntentPosition(matchDetails, closestPlayer)
      for (let player of matchDetails.kickOffTeam.players) {
        const move = Math.abs(player.intentPOS[1] - player.originPOS[1])
        expect(move).to.be.lessThan(150)
      }
    })
    mocha.it('second team defensive compactness in own half', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/intentPositionATTinDEFHalf.json')
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerSTInput.json')
      setPos.setIntentPosition(matchDetails, closestPlayer)
      for (let player of matchDetails.secondTeam.players) {
        const move = Math.abs(player.intentPOS[1] - player.originPOS[1])
        expect(move).to.be.lessThan(100)
      }
    })
  })
  mocha.describe('intentPOSitionsLooseBall()', function() {
    mocha.it('kickoff team moves towards ball', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/looseBall.json')
      let { kickOffTeam } = matchDetails
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerKOTInput.json')
      setPos.setIntentPosition(matchDetails, closestPlayer)
      expect(matchDetails).to.be.an('object')
      expect(kickOffTeam.players[0].intentPOS).to.eql([350, 150])
      expect(kickOffTeam.players[1].intentPOS).to.eql([380, 1000])
      expect(kickOffTeam.players[2].intentPOS).to.eql([267.5, 218])
      expect(kickOffTeam.players[3].intentPOS).to.eql([410, 218])
      expect(kickOffTeam.players[4].intentPOS).to.eql([545, 218])
      expect(kickOffTeam.players[5].intentPOS).to.eql([155, 379.5])
      expect(kickOffTeam.players[6].intentPOS).to.eql([267.5, 379.5])
      expect(kickOffTeam.players[7].intentPOS).to.eql([410, 379.5])
      expect(kickOffTeam.players[8].intentPOS).to.eql([545, 379.5])
      expect(kickOffTeam.players[9].intentPOS).to.eql([305, 575])
      expect(kickOffTeam.players[10].intentPOS).to.eql([425, 575])
    })
    mocha.it('second team moves towards ball', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/looseBall2.json')
      let { secondTeam } = matchDetails
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerSTInput.json')
      setPos.setIntentPosition(matchDetails, closestPlayer)
      expect(matchDetails).to.be.an('object')
      expect(secondTeam.players[0].intentPOS).to.eql([340.25, 894])
      expect(secondTeam.players[1].intentPOS).to.eql([145.25, 826])
      expect(secondTeam.players[2].intentPOS).to.eql([257.75, 826])
      expect(secondTeam.players[3].intentPOS).to.eql([441.5, 826])
      expect(secondTeam.players[4].intentPOS).to.eql([535.25, 826])
      expect(secondTeam.players[5].intentPOS).to.eql([145.25, 664.5])
      expect(secondTeam.players[6].intentPOS).to.eql([257.75, 664.5])
      expect(secondTeam.players[7].intentPOS).to.eql([441.5, 664.5])
      expect(secondTeam.players[8].intentPOS).to.eql([535.25, 664.5])
      expect(secondTeam.players[9].intentPOS).to.eql([295.25, 469])
      expect(secondTeam.players[10].intentPOS).to.eql([415.25, 469])
    })
    mocha.it('second team moves towards ball player near ball', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/looseBall3.json')
      let { secondTeam } = matchDetails
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerSTInput.json')
      setPos.setIntentPosition(matchDetails, closestPlayer)
      expect(matchDetails).to.be.an('object')
      expect(secondTeam.players[0].intentPOS).to.eql([340.25, 894])
      expect(secondTeam.players[1].intentPOS).to.eql([145.25, 826])
      expect(secondTeam.players[2].intentPOS).to.eql([257.75, 826])
      expect(secondTeam.players[3].intentPOS).to.eql([441.5, 826])
      expect(secondTeam.players[4].intentPOS).to.eql([535.25, 826])
      expect(secondTeam.players[5].intentPOS).to.eql([145.25, 664.5])
      expect(secondTeam.players[6].intentPOS).to.eql([257.75, 664.5])
      expect(secondTeam.players[7].intentPOS).to.eql([441.5, 664.5])
      expect(secondTeam.players[8].intentPOS).to.eql([535.25, 664.5])
      expect(secondTeam.players[9].intentPOS).to.eql([295.25, 469])
      expect(secondTeam.players[10].intentPOS).to.eql([340.39403715206, 8.788074304120002])
    })
  })
}

module.exports = {
  runTest
}
