const mocha = require('mocha')
const { expect } = require('chai')
const setfreekicks = require('./lib/set_freekicks')
const common = require('../lib/common')

function runTest() {
  mocha.describe('testFreekicksTopOwnHalf()', function() {
    mocha.it('freekick in own half - top boundary', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setfreekicks.setTopFreekick(itlocation, [340, 1])
      let { kickOffTeam, secondTeam } = nextJSON
      expect(nextJSON).to.be.an('object')
      expect(nextJSON.ball.direction).to.eql('south')
      expect(nextJSON.ball.position).to.eql([340, 1])
      expect(kickOffTeam.players[0].currentPOS).to.eql([340, 1])
      for (let player of kickOffTeam.players) {
        if (player.position != 'GK') expect(player.currentPOS).to.eql(player.originPOS)
      }
      for (let player of secondTeam.players) {
        if (player.position == 'GK') expect(player.currentPOS).to.eql(player.originPOS)
        if (player.position != 'GK') expect(player.currentPOS).to.eql([player.originPOS[0], player.originPOS[1] - 100])
      }
    })
    mocha.it('freekick in own half - top origin positions', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setfreekicks.setTopFreekick(itlocation, [340, 101])
      let { kickOffTeam, secondTeam } = nextJSON
      expect(nextJSON).to.be.an('object')
      expect(nextJSON.ball.direction).to.eql('south')
      expect(nextJSON.ball.position).to.eql([340, 101])
      expect(kickOffTeam.players[0].currentPOS).to.eql([340, 101])
      for (let player of kickOffTeam.players) {
        if (player.position != 'GK') {
          expect(player.currentPOS).to.eql([player.originPOS[0], player.originPOS[1] + 300])
        }
      }
      for (let player of secondTeam.players) {
        if (player.position == 'GK') {
          expect(player.currentPOS).to.eql(player.originPOS)
        } else {
          expect(player.currentPOS).to.eql([player.originPOS[0], player.originPOS[1] - 100])
        }
      }
    })
    mocha.it('freekick in own half - halfway boundary', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setfreekicks.setTopFreekick(itlocation, [340, 524])
      let [, pitchHeight] = nextJSON.pitchSize
      let { kickOffTeam, secondTeam } = nextJSON
      let KOTgoalie = kickOffTeam.players[0]

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.ball.direction).to.eql('south')
      expect(nextJSON.ball.position).to.eql([340, 524])
      expect(kickOffTeam.players[3].currentPOS).to.eql([340, 524])
      expect(secondTeam.players[3].currentPOS).to.eql(secondTeam.players[3].originPOS)
      expect(KOTgoalie.currentPOS).to.eql([KOTgoalie.originPOS[0], parseInt(pitchHeight * 0.25, 10)])
      for (let num of [1, 2, 4]) {
        let thisPlayer = kickOffTeam.players[num]
        let thatPlayer = secondTeam.players[num]
        expect(thisPlayer.currentPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10)])
        expect(thatPlayer.currentPOS).to.eql(thatPlayer.originPOS)
      }
      for (let num of [5, 6, 7, 8]) {
        let thisPlayer = kickOffTeam.players[num]
        let thatPlayer = secondTeam.players[num]
        expect(thisPlayer.currentPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.75, 10)])
        expect(thatPlayer.currentPOS).to.eql([thatPlayer.originPOS[0], parseInt(pitchHeight * 0.75, 10) + 5])
      }
      for (let num of [9, 10]) {
        let thisPlayer = kickOffTeam.players[num]
        let thatPlayer = secondTeam.players[num]
        expect(thisPlayer.currentPOS).to.eql([thisPlayer.originPOS[0], 824])
        expect(thatPlayer.currentPOS).to.eql([thatPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10)])
      }
    })
  })
  mocha.describe('testFreekicksTopHalfwayToThirdQuarter()', function() {
    mocha.it('freekick between halfway and last quarter - top center', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setfreekicks.setTopFreekick(itlocation, [400, 550])
      let [, pitchHeight] = nextJSON.pitchSize
      let { kickOffTeam, secondTeam } = nextJSON
      let KOTgoalie = kickOffTeam.players[0]
      let STgoalie = secondTeam.players[0]

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.ball.direction).to.eql('south')
      expect(nextJSON.ball.position).to.eql([400, 550])
      expect(kickOffTeam.players[5].currentPOS).to.eql([400, 550])
      expect(secondTeam.players[5].currentPOS).to.eql([80, parseInt(pitchHeight * 0.75, 10)])
      expect(KOTgoalie.currentPOS).to.eql([KOTgoalie.originPOS[0], parseInt(pitchHeight * 0.25, 10)])
      expect(STgoalie.currentPOS).to.eql(STgoalie.originPOS)
      for (let num of [1, 2, 3, 4]) {
        let thisPlayer = kickOffTeam.players[num]
        let thatPlayer = secondTeam.players[num]

        expect(thisPlayer.currentPOS).to.eql([thisPlayer.originPOS[0], 450])
        expect(thatPlayer.currentPOS).to.eql(thatPlayer.originPOS)
      }
      for (let num of [6, 7, 8]) {
        let thisPlayer = kickOffTeam.players[num]
        let thatPlayer = secondTeam.players[num]

        expect(thisPlayer.currentPOS[1]).to.gt(699)
        expect(thatPlayer.currentPOS).to.eql([thatPlayer.originPOS[0], parseInt(pitchHeight * 0.75, 10)])
      }
      for (let num of [9, 10]) {
        let thisPlayer = kickOffTeam.players[num]
        let thatPlayer = secondTeam.players[num]

        expect(thisPlayer.currentPOS[1]).to.gt(849)
        expect(thatPlayer.currentPOS).to.eql([thatPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10)])
      }
    })
    mocha.it('freekick between halfway and last quarter - top left', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setfreekicks.setTopFreekick(itlocation, [29, 550])
      let [, pitchHeight] = nextJSON.pitchSize
      let { kickOffTeam, secondTeam } = nextJSON
      let KOTgoalie = kickOffTeam.players[0]
      let STgoalie = secondTeam.players[0]

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.ball.direction).to.eql('southeast')
      expect(nextJSON.ball.position).to.eql([29, 550])
      expect(kickOffTeam.players[5].currentPOS).to.eql([29, 550])
      expect(secondTeam.players[5].currentPOS).to.eql([80, parseInt((pitchHeight * 0.75), 10)])
      expect(KOTgoalie.currentPOS).to.eql([KOTgoalie.originPOS[0], parseInt(pitchHeight * 0.25, 10)])
      expect(STgoalie.currentPOS).to.eql(STgoalie.originPOS)
      for (let num of [1, 2, 3, 4]) {
        let thisPlayer = kickOffTeam.players[num]
        let thatPlayer = secondTeam.players[num]

        expect(thisPlayer.currentPOS).to.eql([thisPlayer.originPOS[0], 450])
        expect(thatPlayer.currentPOS).to.eql(thatPlayer.originPOS)
      }
      for (let num of [6, 7, 8]) {
        let thisPlayer = kickOffTeam.players[num]
        let thatPlayer = secondTeam.players[num]

        expect(thisPlayer.currentPOS[1]).to.gt(699)
        expect(thatPlayer.currentPOS).to.eql([thatPlayer.originPOS[0], parseInt(pitchHeight * 0.75, 10)])
      }
      for (let num of [9, 10]) {
        let thisPlayer = kickOffTeam.players[num]
        let thatPlayer = secondTeam.players[num]

        expect(thisPlayer.currentPOS[1]).to.gt(849)
        expect(thatPlayer.currentPOS).to.eql([thatPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10)])
      }
    })
    mocha.it('freekick between halfway and last quarter - top right', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setfreekicks.setTopFreekick(itlocation, [655, 550])
      let [, pitchHeight] = nextJSON.pitchSize
      let { kickOffTeam, secondTeam } = nextJSON
      let KOTgoalie = kickOffTeam.players[0]
      let STgoalie = secondTeam.players[0]

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.ball.direction).to.eql('southwest')
      expect(nextJSON.ball.position).to.eql([655, 550])
      expect(kickOffTeam.players[5].currentPOS).to.eql([655, 550])
      expect(secondTeam.players[5].currentPOS).to.eql([80, parseInt((pitchHeight * 0.75), 10)])
      expect(KOTgoalie.currentPOS).to.eql([KOTgoalie.originPOS[0], parseInt(pitchHeight * 0.25, 10)])
      expect(STgoalie.currentPOS).to.eql(STgoalie.originPOS)
      for (let num of [1, 2, 3, 4]) {
        let thisPlayer = kickOffTeam.players[num]
        let thatPlayer = secondTeam.players[num]

        expect(thisPlayer.currentPOS).to.eql([thisPlayer.originPOS[0], 450])
        expect(thatPlayer.currentPOS).to.eql(thatPlayer.originPOS)
      }
      for (let num of [6, 7, 8]) {
        let thisPlayer = kickOffTeam.players[num]
        let thatPlayer = secondTeam.players[num]

        expect(thisPlayer.currentPOS[1]).to.gt(699)
        expect(thatPlayer.currentPOS).to.eql([thatPlayer.originPOS[0], parseInt(pitchHeight * 0.75, 10)])
      }
      for (let num of [9, 10]) {
        let thisPlayer = kickOffTeam.players[num]
        let thatPlayer = secondTeam.players[num]

        expect(thisPlayer.currentPOS[1]).to.gt(849)
        expect(thatPlayer.currentPOS).to.eql([thatPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10)])
      }
    })
  })
  mocha.describe('testFreekicksTopLastQuarter()', function() {
    mocha.it('freekick last quarter - top center', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setfreekicks.setTopFreekick(itlocation, [340, 840])
      let [pitchWidth, pitchHeight] = nextJSON.pitchSize
      let { kickOffTeam, secondTeam } = nextJSON
      let KOTgoalie = kickOffTeam.players[0]
      let STgoalie = secondTeam.players[0]
      let playerSpace = -3

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.ball.direction).to.eql('south')
      expect(nextJSON.ball.position).to.eql([340, parseInt(pitchHeight - (pitchHeight / 6) - 35, 10)])
      expect(kickOffTeam.players[5].currentPOS).to.eql([340, parseInt(pitchHeight - (pitchHeight / 6) - 35, 10)])
      expect(KOTgoalie.currentPOS).to.eql([KOTgoalie.originPOS[0], parseInt(pitchHeight * 0.25, 10)])
      expect(STgoalie.currentPOS).to.eql(STgoalie.originPOS)
      for (let num of [1, 2, 3, 4]) {
        let thisPlayer = kickOffTeam.players[num]
        let thatPlayer = secondTeam.players[num]
        let ballDistanceFromGoalX = nextJSON.ball.position[0] - (pitchWidth / 2)
        let midWayFromBalltoGoalX = parseInt((nextJSON.ball.position[0] - ballDistanceFromGoalX) / 2, 10)
        let ballDistanceFromGoalY = (pitchHeight - nextJSON.ball.position[1])
        let midWayFromBalltoGoalY = parseInt((nextJSON.ball.position[1] - ballDistanceFromGoalY) / 2, 10)
        if (thisPlayer.position == 'CB') {
          expect(thisPlayer.currentPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10)])
        } else if (thisPlayer.position == 'LB' || thisPlayer.position == 'RB') {
          expect(thisPlayer.currentPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.66, 10)])
        }
        expect(thatPlayer.currentPOS).to.eql([midWayFromBalltoGoalX + playerSpace, midWayFromBalltoGoalY])
        playerSpace += 2
      }
      let boundaryX = [(pitchWidth / 4) - 7, (pitchWidth - (pitchWidth / 4) + 7)]
      let boundaryY = [pitchHeight - (pitchHeight / 6) - 5, pitchHeight + 1]
      for (let num of [5, 6, 7, 8, 9, 10]) {
        let thisXPOSKOT = kickOffTeam.players[num].currentPOS[0]
        let thisYPOSKOT = kickOffTeam.players[num].currentPOS[1]
        let thisXPOSST = secondTeam.players[num].currentPOS[0]
        let thisYPOSST = secondTeam.players[num].currentPOS[1]

        if (num != 5) {
          expect(true).to.eql(common.isBetween(thisXPOSKOT, boundaryX[0], boundaryX[1]))
          expect(true).to.eql(common.isBetween(thisYPOSKOT, boundaryY[0], boundaryY[1]))
        } else {
          expect(true).to.eql(common.isBetween(thisXPOSST, boundaryX[0], boundaryX[1]))
          expect(true).to.eql(common.isBetween(thisYPOSST, boundaryY[0], boundaryY[1]))
        }
      }
    })
    mocha.it('freekick last quarter - top edge of penalty box', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setfreekicks.setTopFreekick(itlocation, [340, 869])
      let [pitchWidth, pitchHeight] = nextJSON.pitchSize
      let { kickOffTeam, secondTeam } = nextJSON
      let KOTgoalie = kickOffTeam.players[0]
      let STgoalie = secondTeam.players[0]
      let playerSpace = -3

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.ball.direction).to.eql('south')
      expect(nextJSON.ball.position).to.eql([340, 869])
      expect(kickOffTeam.players[5].currentPOS).to.eql([340, 869])
      expect(KOTgoalie.currentPOS).to.eql([KOTgoalie.originPOS[0], parseInt(pitchHeight * 0.25, 10)])
      expect(STgoalie.currentPOS).to.eql(STgoalie.originPOS)
      for (let num of [1, 2, 3, 4]) {
        let thisPlayer = kickOffTeam.players[num]
        let thatPlayer = secondTeam.players[num]
        let ballDistanceFromGoalX = nextJSON.ball.position[0] - (pitchWidth / 2)
        let midWayFromBalltoGoalX = parseInt((nextJSON.ball.position[0] - ballDistanceFromGoalX) / 2, 10)
        let ballDistanceFromGoalY = (pitchHeight - nextJSON.ball.position[1])
        let midWayFromBalltoGoalY = parseInt((nextJSON.ball.position[1] - ballDistanceFromGoalY) / 2, 10)
        if (thisPlayer.position == 'CB') {
          expect(thisPlayer.currentPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10)])
        } else if (thisPlayer.position == 'LB' || thisPlayer.position == 'RB') {
          expect(thisPlayer.currentPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.66, 10)])
        }
        expect(thatPlayer.currentPOS).to.eql([midWayFromBalltoGoalX + playerSpace, midWayFromBalltoGoalY])
        playerSpace += 2
      }
      let boundaryX = [(pitchWidth / 4) - 7, (pitchWidth - (pitchWidth / 4) + 7)]
      let boundaryY = [pitchHeight - (pitchHeight / 6) + 4, pitchHeight + 1]
      for (let num of [5, 6, 7, 8, 9, 10]) {
        let thisXPOSKOT = kickOffTeam.players[num].currentPOS[0]
        let thisYPOSKOT = kickOffTeam.players[num].currentPOS[1]
        let thisXPOSST = secondTeam.players[num].currentPOS[0]
        let thisYPOSST = secondTeam.players[num].currentPOS[1]

        if (num != 5) {
          expect(true).to.eql(common.isBetween(thisXPOSKOT, boundaryX[0], boundaryX[1]))
          expect(true).to.eql(common.isBetween(thisYPOSKOT, boundaryY[0], boundaryY[1]))
        } else {
          expect(true).to.eql(common.isBetween(thisXPOSST, boundaryX[0], boundaryX[1]))
          expect(true).to.eql(common.isBetween(thisYPOSST, boundaryY[0], boundaryY[1]))
        }
      }
    })
    mocha.it('freekick last quarter - top team bottom left', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setfreekicks.setTopFreekick(itlocation, [10, 850])
      let [pitchWidth, pitchHeight] = nextJSON.pitchSize
      let { kickOffTeam, secondTeam } = nextJSON
      let KOTgoalie = kickOffTeam.players[0]
      let STgoalie = secondTeam.players[0]
      let playerSpace = -3

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.ball.direction).to.eql('southeast')
      expect(nextJSON.ball.position).to.eql([10, 850])
      expect(kickOffTeam.players[5].currentPOS).to.eql([10, 850])
      expect(KOTgoalie.currentPOS).to.eql([KOTgoalie.originPOS[0], parseInt(pitchHeight * 0.25, 10)])
      expect(STgoalie.currentPOS).to.eql(STgoalie.originPOS)
      for (let num of [1, 2, 3, 4]) {
        let thisPlayer = kickOffTeam.players[num]
        let thatPlayer = secondTeam.players[num]
        let ballDistanceFromGoalX = nextJSON.ball.position[0] - (pitchWidth / 2)
        let midWayFromBalltoGoalX = parseInt((nextJSON.ball.position[0] - ballDistanceFromGoalX) / 2, 10)
        let ballDistanceFromGoalY = (pitchHeight - nextJSON.ball.position[1])
        let midWayFromBalltoGoalY = parseInt((nextJSON.ball.position[1] - ballDistanceFromGoalY) / 2, 10)
        if (thisPlayer.position == 'CB') {
          expect(thisPlayer.currentPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10)])
        } else if (thisPlayer.position == 'LB' || thisPlayer.position == 'RB') {
          expect(thisPlayer.currentPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.66, 10)])
        }
        expect(thatPlayer.currentPOS).to.eql([midWayFromBalltoGoalX + playerSpace, midWayFromBalltoGoalY])
        playerSpace += 2
      }
      let boundaryX = [(pitchWidth / 4) - 7, (pitchWidth - (pitchWidth / 4) + 7)]
      let boundaryY = [pitchHeight - (pitchHeight / 6) + 4, pitchHeight + 1]
      for (let num of [5, 6, 7, 8, 9, 10]) {
        let thisXPOSKOT = kickOffTeam.players[num].currentPOS[0]
        let thisYPOSKOT = kickOffTeam.players[num].currentPOS[1]
        let thisXPOSST = secondTeam.players[num].currentPOS[0]
        let thisYPOSST = secondTeam.players[num].currentPOS[1]

        if (num != 5) {
          expect(true).to.eql(common.isBetween(thisXPOSKOT, boundaryX[0], boundaryX[1]))
          expect(true).to.eql(common.isBetween(thisYPOSKOT, boundaryY[0], boundaryY[1]))
        } else {
          expect(true).to.eql(common.isBetween(thisXPOSST, boundaryX[0], boundaryX[1]))
          expect(true).to.eql(common.isBetween(thisYPOSST, boundaryY[0], boundaryY[1]))
        }
      }
    })
    mocha.it('freekick and last quarter - top team bottom right', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setfreekicks.setTopFreekick(itlocation, [600, 826])
      let [pitchWidth, pitchHeight] = nextJSON.pitchSize
      let { kickOffTeam, secondTeam } = nextJSON
      let KOTgoalie = kickOffTeam.players[0]
      let STgoalie = secondTeam.players[0]
      let playerSpace = -3

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.ball.direction).to.eql('southwest')
      expect(nextJSON.ball.position).to.eql([600, 826])
      expect(kickOffTeam.players[5].currentPOS).to.eql([600, 826])
      expect(KOTgoalie.currentPOS).to.eql([KOTgoalie.originPOS[0], parseInt(pitchHeight * 0.25, 10)])
      expect(STgoalie.currentPOS).to.eql(STgoalie.originPOS)
      for (let num of [1, 2, 3, 4]) {
        let thisPlayer = kickOffTeam.players[num]
        let thatPlayer = secondTeam.players[num]
        let ballDistanceFromGoalX = nextJSON.ball.position[0] - (pitchWidth / 2)
        let midWayFromBalltoGoalX = parseInt((nextJSON.ball.position[0] - ballDistanceFromGoalX) / 2, 10)
        let ballDistanceFromGoalY = (pitchHeight - nextJSON.ball.position[1])
        let midWayFromBalltoGoalY = parseInt((nextJSON.ball.position[1] - ballDistanceFromGoalY) / 2, 10)
        if (thisPlayer.position == 'CB') {
          expect(thisPlayer.currentPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10)])
        } else if (thisPlayer.position == 'LB' || thisPlayer.position == 'RB') {
          expect(thisPlayer.currentPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.66, 10)])
        }
        expect(thatPlayer.currentPOS).to.eql([midWayFromBalltoGoalX + playerSpace, midWayFromBalltoGoalY])
        playerSpace += 2
      }
      let boundaryX = [(pitchWidth / 4) - 7, (pitchWidth - (pitchWidth / 4) + 7)]
      let boundaryY = [pitchHeight - (pitchHeight / 6) + 4, pitchHeight + 1]
      for (let num of [5, 6, 7, 8, 9, 10]) {
        let thisXPOSKOT = kickOffTeam.players[num].currentPOS[0]
        let thisYPOSKOT = kickOffTeam.players[num].currentPOS[1]
        let thisXPOSST = secondTeam.players[num].currentPOS[0]
        let thisYPOSST = secondTeam.players[num].currentPOS[1]

        if (num != 5) {
          expect(true).to.eql(common.isBetween(thisXPOSKOT, boundaryX[0], boundaryX[1]))
          expect(true).to.eql(common.isBetween(thisYPOSKOT, boundaryY[0], boundaryY[1]))
        } else {
          expect(true).to.eql(common.isBetween(thisXPOSST, boundaryX[0], boundaryX[1]))
          expect(true).to.eql(common.isBetween(thisYPOSST, boundaryY[0], boundaryY[1]))
        }
      }
    })
    mocha.it('freekick last quarter - top team bottom left goal line', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setfreekicks.setTopFreekick(itlocation, [10, 1049])
      let [pitchWidth, pitchHeight] = nextJSON.pitchSize
      let { kickOffTeam, secondTeam } = nextJSON
      let KOTgoalie = kickOffTeam.players[0]
      let STgoalie = secondTeam.players[0]
      let firstWallPosition = pitchHeight

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.ball.direction).to.eql('east')
      expect(nextJSON.ball.position).to.eql([10, pitchHeight - 1])
      expect(kickOffTeam.players[5].currentPOS).to.eql([10, pitchHeight - 1])
      expect(KOTgoalie.currentPOS).to.eql([KOTgoalie.originPOS[0], parseInt(pitchHeight * 0.25, 10)])
      expect(STgoalie.currentPOS).to.eql(STgoalie.originPOS)
      for (let num of [1, 2, 3, 4]) {
        let thisPlayer = kickOffTeam.players[num]
        let thatPlayer = secondTeam.players[num]
        let ballDistanceFromGoalX = nextJSON.ball.position[0] - (pitchWidth / 2)
        let midWayFromBalltoGoalX = parseInt((nextJSON.ball.position[0] - ballDistanceFromGoalX) / 2, 10)
        if (thisPlayer.position == 'CB') {
          expect(thisPlayer.currentPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10)])
        } else if (thisPlayer.position == 'LB' || thisPlayer.position == 'RB') {
          expect(thisPlayer.currentPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.66, 10)])
        }
        expect(thatPlayer.currentPOS).to.eql([midWayFromBalltoGoalX, firstWallPosition])
        firstWallPosition -= 2
      }
      for (let num of [5, 6, 7, 8, 9, 10]) {
        let kotCurrentPOS = kickOffTeam.players[num].currentPOS
        let stCurrentPOS = secondTeam.players[num].currentPOS

        if (num != 5) {
          expect(true).to.eql(common.inBottomPenalty(nextJSON, kotCurrentPOS))
        } else {
          expect(true).to.eql(common.inBottomPenalty(nextJSON, stCurrentPOS))
        }
      }
    })
    mocha.it('freekick last quarter - top team bottom right goal line', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setfreekicks.setTopFreekick(itlocation, [600, 1049])
      let [pitchWidth, pitchHeight] = nextJSON.pitchSize
      let { kickOffTeam, secondTeam } = nextJSON
      let KOTgoalie = kickOffTeam.players[0]
      let STgoalie = secondTeam.players[0]
      let firstWallPosition = pitchHeight

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.ball.direction).to.eql('west')
      expect(nextJSON.ball.position).to.eql([600, 1049])
      expect(kickOffTeam.players[5].currentPOS).to.eql([600, 1049])
      expect(KOTgoalie.currentPOS).to.eql([KOTgoalie.originPOS[0], parseInt(pitchHeight * 0.25, 10)])
      expect(STgoalie.currentPOS).to.eql(STgoalie.originPOS)
      for (let num of [1, 2, 3, 4]) {
        let thisPlayer = kickOffTeam.players[num]
        let thatPlayer = secondTeam.players[num]
        let ballDistanceFromGoalX = nextJSON.ball.position[0] - (pitchWidth / 2)
        let midWayFromBalltoGoalX = parseInt((nextJSON.ball.position[0] - ballDistanceFromGoalX) / 2, 10)
        if (thisPlayer.position == 'CB') {
          expect(thisPlayer.currentPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10)])
        } else if (thisPlayer.position == 'LB' || thisPlayer.position == 'RB') {
          expect(thisPlayer.currentPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.66, 10)])
        }
        expect(thatPlayer.currentPOS).to.eql([midWayFromBalltoGoalX, firstWallPosition])
        firstWallPosition -= 2
      }
      for (let num of [5, 6, 7, 8, 9, 10]) {
        let thisXPOSKOT = kickOffTeam.players[num].currentPOS[0]
        let thisYPOSKOT = kickOffTeam.players[num].currentPOS[1]
        let thisXPOSST = secondTeam.players[num].currentPOS[0]
        let thisYPOSST = secondTeam.players[num].currentPOS[1]
        let boundaryX = [(pitchWidth / 4) - 7, (pitchWidth - (pitchWidth / 4) + 7)]
        let boundaryY = [pitchHeight - (pitchHeight / 6) + 4, pitchHeight + 1]

        if (num != 5) {
          expect(true).to.eql(common.isBetween(thisXPOSKOT, boundaryX[0], boundaryX[1]))
          expect(true).to.eql(common.isBetween(thisYPOSKOT, boundaryY[0], boundaryY[1]))
        } else {
          expect(true).to.eql(common.isBetween(thisXPOSST, boundaryX[0], boundaryX[1]))
          expect(true).to.eql(common.isBetween(thisYPOSST, boundaryY[0], boundaryY[1]))
        }
        if ([6, 7].includes(num)) {
          expect(true).to.eql(common.isBetween(thisXPOSST, boundaryX[0], boundaryX[1]))
          expect(true).to.eql(common.isBetween(thisYPOSST, boundaryY[0], boundaryY[1]))
        }
        if ([8, 9, 10].includes(num)) {
          expect(true).to.eql(common.isBetween(thisXPOSST, boundaryX[0], boundaryX[1]))
          expect(true).to.eql(common.isBetween(thisYPOSST, boundaryY[0], boundaryY[1]))
        }
      }
    })
  })
}

module.exports = {
  runTest
}
