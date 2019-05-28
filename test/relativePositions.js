const mocha = require('mocha')
const { expect } = require('chai')
const common = require('../lib/common')
const setPos = require('../lib/setPositions')

function runTest() {
  mocha.describe('relativePositionsDefence()', function() {
    mocha.it('kickoff team defensive players move towards ball on opposite side', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/relativePositionATTinOwnHalf2.json')
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerInput.json')
      setPos.setRelativePosition(matchDetails, closestPlayer)
      expect(matchDetails).to.be.an('object')
      for (let player of matchDetails.kickOffTeam.players) {
        expect(player.relativePOS).to.eql([player.originPOS[0], player.startPOS[1] - 20])
      }
    })
    mocha.it('kickoff team defensive players move towards ball on opposite side with player near', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/relativePositionATTinOwnHalf3.json')
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerInput.json')
      setPos.setRelativePosition(matchDetails, closestPlayer)
      expect(matchDetails).to.be.an('object')
      for (let player of matchDetails.kickOffTeam.players) {
        if (player.name == 'Mitch Johnson') {
          expect(player.relativePOS).to.eql([600, 221])
        } else {
          expect(player.relativePOS).to.eql([player.originPOS[0], player.startPOS[1] - 20])
        }
      }
    })
    mocha.it('secondteam defensive players move towards ball on opposite side', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/relativePositionATTinOwnHalf.json')
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerInput.json')
      setPos.setRelativePosition(matchDetails, closestPlayer)
      let ballPosition = matchDetails.ball.position 
      ballPosition.pop()
      expect(matchDetails).to.be.an('object')
      for (let player of matchDetails.secondTeam.players) {
        if(player.name == closestPlayer.name) expect(player.relativePOS).to.eql(ballPosition)
        else expect(player.relativePOS).to.eql([player.originPOS[0], player.startPOS[1] - 20])
      }
    })
    mocha.it('kickoff team defensive players ball in own half', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/relativePositionATTinDEFHalf2.json')
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerInput.json')
      setPos.setRelativePosition(matchDetails, closestPlayer)
      expect(matchDetails).to.be.an('object')
      for (let playerNum of [0, 1, 2, 3, 4]) {
        let thisPlayer = matchDetails.kickOffTeam.players[playerNum]
        expect(thisPlayer.relativePOS).to.eql(thisPlayer.originPOS)
      }
      for (let playerNum of [5, 6, 7, 8, 9, 10]) {
        let thisPlayer = matchDetails.kickOffTeam.players[playerNum]
        expect(thisPlayer.relativePOS).to.eql(thisPlayer.originPOS)
      }
    })
    mocha.it('second team defensive players ball in own half', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/relativePositionATTinDEFHalf.json')
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerInput.json')
      setPos.setRelativePosition(matchDetails, closestPlayer)
      let ballPosition = matchDetails.ball.position
      ballPosition.pop()
      expect(matchDetails).to.be.an('object')
      for (let player of matchDetails.secondTeam.players) {
        if(player.name == closestPlayer.name) expect(player.relativePOS).to.eql(ballPosition)
        else expect(player.relativePOS).to.eql(player.originPOS)
      }
    })
  })
  mocha.describe('relativePositionsAttacking()', function() {
    mocha.it('kickoff team attacking from behind originPOS', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/relativePositionATTbehindOrigin.json')
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerInput.json')
      setPos.setRelativePosition(matchDetails, closestPlayer)
      for (let player of matchDetails.kickOffTeam.players) {
        expect(player.relativePOS).to.eql([player.originPOS[0], player.startPOS[1] + 20])
      }
    })
    mocha.it('kickoff team attacking from originPOS', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/relativePositionATTfromOrigin.json')
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerInput.json')
      setPos.setRelativePosition(matchDetails, closestPlayer)
      for (let player of matchDetails.kickOffTeam.players) {
        expect(player.relativePOS).to.eql([player.originPOS[0], player.startPOS[1] + 20])
      }
    })
    mocha.it('kickoff team attacking from ahead of originPOS', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/relativePositionATTaheadOfOrigin.json')
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerInput.json')
      setPos.setRelativePosition(matchDetails, closestPlayer)
      for (let player of matchDetails.kickOffTeam.players) {
        expect(player.relativePOS).to.eql([player.originPOS[0], player.startPOS[1] + 20])
      }
    })
    mocha.it('second team attacking from behind originPOS', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/relativePositionATTbehindOrigin2.json')
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerInput.json')
      setPos.setRelativePosition(matchDetails, closestPlayer)
      for (let player of matchDetails.secondTeam.players) {
        expect(player.relativePOS).to.eql([player.originPOS[0], player.startPOS[1] - 20])
      }
    })
    mocha.it('second team attacking from originPOS', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/relativePositionATTfromOrigin2.json')
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerInput.json')
      setPos.setRelativePosition(matchDetails, closestPlayer)
      for (let player of matchDetails.secondTeam.players) {
        expect(player.relativePOS).to.eql([player.originPOS[0], player.startPOS[1] - 20])
      }
    })
    mocha.it('second team attacking from ahead of originPOS', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/relativePositionATTaheadOfOrigin2.json')
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerInput.json')
      setPos.setRelativePosition(matchDetails, closestPlayer)
      for (let player of matchDetails.secondTeam.players) {
        expect(player.relativePOS).to.eql([player.originPOS[0], player.startPOS[1] - 20])
      }
    })
    mocha.it('kickoff team attacking in own half from top', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/relativePositionATTinOwnHalf4.json')
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerInput.json')
      setPos.setRelativePosition(matchDetails, closestPlayer)
      expect(matchDetails).to.be.an('object')
      for (let player of matchDetails.kickOffTeam.players) {
        if (!player.hasBall) {
          expect(player.relativePOS).to.eql([player.originPOS[0], player.startPOS[1] + 20])
        }
      }
    })
    mocha.it('kickoff team deep in opposition half do not exceed forward limits', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/relativePositionATTdeep.json')
      let [, pitchHeight] = matchDetails.pitchSize
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerInput.json')
      setPos.setRelativePosition(matchDetails, closestPlayer)
      expect(matchDetails).to.be.an('object')
      for (let player of matchDetails.kickOffTeam.players) {
        if (player.position == 'GK') {
          expect(player.relativePOS).to.eql([player.originPOS[0], parseInt(pitchHeight * 0.15, 10)])
        } else if (player.position == 'CB') {
          expect(player.relativePOS).to.eql([player.originPOS[0], parseInt(pitchHeight * 0.25, 10)])
        } else if (player.position == 'LB' || player.position == 'RB') {
          expect(player.relativePOS).to.eql([player.originPOS[0], parseInt(pitchHeight * 0.66, 10)])
        } else if (player.position == 'CM') {
          expect(player.relativePOS).to.eql([player.originPOS[0], parseInt(pitchHeight * 0.75, 10)])
        } else {
          expect(player.relativePOS).to.eql([player.originPOS[0], 985])
        }
      }
    })
    mocha.it('second team deep in opposition half do not exceed forward limits', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/relativePositionATTdeep2.json')
      let [, pitchHeight] = matchDetails.pitchSize
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerInput.json')
      setPos.setRelativePosition(matchDetails, closestPlayer)
      expect(matchDetails).to.be.an('object')
      for (let player of matchDetails.secondTeam.players) {
        if (player.position == 'GK') {
          expect(player.relativePOS).to.eql([player.originPOS[0], parseInt(pitchHeight * 0.85, 10)])
        } else if (player.position == 'CB') {
          expect(player.relativePOS).to.eql([player.originPOS[0], parseInt(pitchHeight * 0.75, 10)])
        } else if (player.position == 'LB' || player.position == 'RB') {
          expect(player.relativePOS).to.eql([player.originPOS[0], parseInt(pitchHeight * 0.33, 10)])
        } else if (player.position == 'CM') {
          expect(player.relativePOS).to.eql([player.originPOS[0], parseInt(pitchHeight * 0.25, 10)])
        } else {
          expect(player.relativePOS).to.eql([player.originPOS[0], 30])
        }
      }
    })
  })
  mocha.describe('relativePositionsLooseBall()', function() {
    mocha.it('kickoff team moves towards ball', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/looseBall.json')
      let { kickOffTeam } = matchDetails
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerInput.json')
      setPos.setRelativePosition(matchDetails, closestPlayer)
      expect(matchDetails).to.be.an('object')
      expect(kickOffTeam.players[0].relativePOS).to.eql([kickOffTeam.players[0].originPOS[0], 20])
      expect(kickOffTeam.players[1].relativePOS).to.eql([kickOffTeam.players[1].originPOS[0], 290])
      expect(kickOffTeam.players[2].relativePOS).to.eql([380, 1000])
      expect(kickOffTeam.players[3].relativePOS).to.eql([kickOffTeam.players[3].originPOS[0], 101])
      expect(kickOffTeam.players[4].relativePOS).to.eql([kickOffTeam.players[4].originPOS[0], 287])
      expect(kickOffTeam.players[5].relativePOS).to.eql([kickOffTeam.players[5].originPOS[0], 465])
      expect(kickOffTeam.players[6].relativePOS).to.eql([kickOffTeam.players[6].originPOS[0], 484])
      expect(kickOffTeam.players[7].relativePOS).to.eql([kickOffTeam.players[7].originPOS[0], 482])
      expect(kickOffTeam.players[8].relativePOS).to.eql([kickOffTeam.players[8].originPOS[0], 481])
      expect(kickOffTeam.players[9].relativePOS).to.eql([kickOffTeam.players[9].originPOS[0], 724])
      expect(kickOffTeam.players[10].relativePOS).to.eql([kickOffTeam.players[10].originPOS[0], 733])
    })
    mocha.it('second team moves towards ball', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/looseBall2.json')
      let { secondTeam } = matchDetails
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerInput.json')
      setPos.setRelativePosition(matchDetails, closestPlayer)
      expect(matchDetails).to.be.an('object')
      expect(secondTeam.players[0].relativePOS).to.eql([secondTeam.players[0].originPOS[0], 1030])
      expect(secondTeam.players[1].relativePOS).to.eql([secondTeam.players[1].originPOS[0], 485])
      expect(secondTeam.players[2].relativePOS).to.eql([341, 10])
      expect(secondTeam.players[3].relativePOS).to.eql([secondTeam.players[3].originPOS[0], 950])
      expect(secondTeam.players[4].relativePOS).to.eql([secondTeam.players[4].originPOS[0], 537])
      expect(secondTeam.players[5].relativePOS).to.eql([secondTeam.players[5].originPOS[0], 415])
      expect(secondTeam.players[6].relativePOS).to.eql([secondTeam.players[6].originPOS[0], 414])
      expect(secondTeam.players[7].relativePOS).to.eql([secondTeam.players[7].originPOS[0], 412])
      expect(secondTeam.players[8].relativePOS).to.eql([secondTeam.players[8].originPOS[0], 455])
      expect(secondTeam.players[9].relativePOS).to.eql([secondTeam.players[9].originPOS[0], 205])
      expect(secondTeam.players[10].relativePOS).to.eql([secondTeam.players[10].originPOS[0], 205])
    })
    mocha.it('second team moves towards ball player near ball', async() => {
      let matchDetails = await common.readFile('./test/input/boundaryPositions/looseBall3.json')
      let { secondTeam } = matchDetails
      let closestPlayer = await common.readFile('./test/input/closestPositions/closestPlayerInput.json')
      setPos.setRelativePosition(matchDetails, closestPlayer)
      expect(matchDetails).to.be.an('object')
      expect(secondTeam.players[0].relativePOS).to.eql([secondTeam.players[0].originPOS[0], 1030])
      expect(secondTeam.players[1].relativePOS).to.eql([secondTeam.players[1].originPOS[0], 485])
      expect(secondTeam.players[2].relativePOS).to.eql([341, 10])
      expect(secondTeam.players[3].relativePOS).to.eql([secondTeam.players[3].originPOS[0], 950])
      expect(secondTeam.players[4].relativePOS).to.eql([secondTeam.players[4].originPOS[0], 537])
      expect(secondTeam.players[5].relativePOS).to.eql([secondTeam.players[5].originPOS[0], 415])
      expect(secondTeam.players[6].relativePOS).to.eql([secondTeam.players[6].originPOS[0], 414])
      expect(secondTeam.players[7].relativePOS).to.eql([secondTeam.players[7].originPOS[0], 412])
      expect(secondTeam.players[8].relativePOS).to.eql([secondTeam.players[8].originPOS[0], 455])
      expect(secondTeam.players[9].relativePOS).to.eql([secondTeam.players[9].originPOS[0], 205])
      expect(secondTeam.players[10].relativePOS).to.eql([341, 10])
    })
  })
}

module.exports = {
  runTest
}
