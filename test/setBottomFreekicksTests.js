const mocha = require('mocha')
const { expect } = require('chai')
const setfreekicks = require('./lib/set_freekicks')
const common = require('../lib/common')

function runTest() {
//   mocha.describe('testFreekicksBottomOwnHalf()', function() {
//     mocha.it('freekick in own half - Bottom origin positions', async() => {
//       let itlocation = './init_config/iteration.json'
//       let nextJSON = await setfreekicks.setBottomFreekick(itlocation)
//       let { kickOffTeam, secondTeam } = nextJSON
//       expect(nextJSON).to.be.an('object')
//       expect(nextJSON.ball.direction).to.eql('north')
//       expect(nextJSON.ball.position).to.eql([340, 1000])
//       expect(secondTeam.players[0].startPOS).to.eql([340, 1000])
//       for (let player of secondTeam.players) {
//         if (!player.position == 'GK') {
//           expect(player.startPOS).to.eql([player.originPOS[0], player.originPOS[1] - 300])
//         }
//       }
//       for (let player of kickOffTeam.players) {
//         if (player.position == 'GK') {
//           expect(player.startPOS).to.eql(player.originPOS)
//         } else {
//           expect(player.startPOS).to.eql(player.originPOS[0], player.originPOS[1] + 100)
//         }
//       }
//     })
//     mocha.it('freekick in own half - Bottom boundary', async() => {
//       let itlocation = './init_config/iteration.json'
//       let nextJSON = await setfreekicks.setBottomFreekick(itlocation)
//       let { kickOffTeam, secondTeam } = nextJSON
//       let [,pitchHeight] = nextJSON.pitchSize
//       expect(nextJSON).to.be.an('object')
//       expect(nextJSON.ball.direction).to.eql('northeast')
//       expect(nextJSON.ball.position).to.eql([340, pitchHeight - 1])
//       expect(secondTeam.players[0].startPOS).to.eql([340, pitchHeight - 1])
//       for (let player of secondTeam.players) {
//         expect(player.startPOS).to.eql(player.originPOS)
//       }
//       for (let player of kickOffTeam.players) {
//         if (player.position == 'GK') {
//           expect(player.startPOS).to.eql(player.originPOS)
//         } else {
//           expect(player.startPOS).to.eql(player.originPOS[0], player.originPOS[1] + 100)
//         }
//       }
//     })
//     mocha.it('freekick in own half - halfway boundary', async() => {
//       let itlocation = './init_config/iteration.json'
//       let nextJSON = await setfreekicks.setBottomFreekick(itlocation)
//       let [, pitchHeight] = nextJSON.pitchSize
//       let { kickOffTeam, secondTeam } = nextJSON
//       let STgoalie = secondTeam.players[0]

//       expect(nextJSON).to.be.an('object')
//       expect(nextJSON.ball.direction).to.eql('north')
//       expect(nextJSON.ball.position).to.eql([340, 526])
//       expect(secondTeam.players[3].startPOS).to.eql([340, 526])
//       expect(kickOffTeam.players[3].startPOS).to.eql(secondTeam.players[3].originPOS)
//       expect(STgoalie.startPOS).to.eql([STgoalie.originPOS[0], parseInt(pitchHeight * 0.75, 10)])
//       for (let num of [1, 2, 4]) {
//         let thisPlayer = secondTeam.players[num]
//         let thatPlayer = kickOffTeam.players[num]

//         expect(thisPlayer.startPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10)])
//         expect(thatPlayer.startPOS).to.eql(thatPlayer.originPOS)
//       }
//       for (let num of [5, 6, 7, 8]) {
//         let thisPlayer = secondTeam.players[num]
//         let thatPlayer = kickOffTeam.players[num]

//         expect(thisPlayer.startPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.25, 10)])
//         expect(thatPlayer.startPOS).to.eql(thatPlayer.originPOS[0], parseInt(pitchHeight * 0.25, 10) - 5)
//       }
//       for (let num of [9, 10]) {
//         let thisPlayer = secondTeam.players[num]
//         let thatPlayer = kickOffTeam.players[num]

//         expect(thisPlayer.startPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.1, 10)])
//         expect(thatPlayer.startPOS).to.eql(thatPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10))
//       }
//     })
//   })
//   mocha.describe('testFreekicksBottomThirdQuarter()', function() {
//     mocha.it('freekick between halfway and last sixth - Bottom center', async() => {
//       let itlocation = './init_config/iteration.json'
//       let nextJSON = await setfreekicks.setBottomFreekick(itlocation)
//       let [, pitchHeight] = nextJSON.pitchSize
//       let { kickOffTeam, secondTeam } = nextJSON
//       let KOTgoalie = kickOffTeam.players[0]
//       let STgoalie = secondTeam.players[0]

//       expect(nextJSON).to.be.an('object')
//       expect(nextJSON.ball.direction).to.eql('north')
//       expect(nextJSON.ball.position).to.eql([400, 500])
//       expect(secondTeam.players[5].startPOS).to.eql([400, 500])
//       expect(kickOffTeam.players[5].startPOS).to.eql([340, parseInt(pitchHeight * 0.25, 10)])
//       expect(STgoalie.startPOS).to.eql(STgoalie.originPOS[0], parseInt(pitchHeight * 0.75, 10))
//       expect(KOTgoalie.startPOS).to.eql(KOTgoalie.originPOS)
//       for (let num of [1, 2, 3, 4]) {
//         let thisPlayer = secondTeam.players[num]
//         let thatPlayer = kickOffTeam.players[num]

//         expect(thisPlayer.startPOS).to.eql(thisPlayer.originPOS[0], 600)
//         expect(thatPlayer.startPOS).to.eql(thatPlayer.originPOS)
//       }
//       for (let num of [6, 7, 8]) {
//         let thisPlayer = secondTeam.players[num]
//         let thatPlayer = kickOffTeam.players[num]

//         expect(thisPlayer.startPOS[1]).to.lt(300)
//         expect(thatPlayer.startPOS).to.eql(thatPlayer.originPOS[0], parseInt(pitchHeight * 0.25, 10))
//       }
//       for (let num of [9, 10]) {
//         let thisPlayer = secondTeam.players[num]
//         let thatPlayer = kickOffTeam.players[num]

//         expect(thisPlayer.startPOS[1]).to.gt(parseInt((pitchHeight * 0.25) + 50, 10))
//         expect(thatPlayer.startPOS).to.eql(thatPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10))
//       }
//     })
//     mocha.it('freekick between halfway and last sixth - Bottom left', async() => {
//       let itlocation = './init_config/iteration.json'
//       let nextJSON = await setfreekicks.setBottomFreekick(itlocation)
//       let [, pitchHeight] = nextJSON.pitchSize
//       let { kickOffTeam, secondTeam } = nextJSON
//       let KOTgoalie = kickOffTeam.players[0]
//       let STgoalie = secondTeam.players[0]

//       expect(nextJSON).to.be.an('object')
//       expect(nextJSON.ball.direction).to.eql('northeast')
//       expect(nextJSON.ball.position).to.eql([29, 500])
//       expect(kickOffTeam.players[5].startPOS).to.eql([29, 500])
//       expect(secondTeam.players[5].startPOS).to.eql([340, parseInt((pitchHeight * 0.25) + 30, 10)])
//       expect(STgoalie.startPOS).to.eql(STgoalie.originPOS[0], parseInt(pitchHeight * 0.75, 10))
//       expect(KOTgoalie.startPOS).to.eql(STgKOTgoalieoalie.originPOS)
//       for (let num of [1, 2, 3, 4]) {
//         let thisPlayer = secondTeam.players[num]
//         let thatPlayer = kickOffTeam.players[num]

//         expect(thisPlayer.startPOS).to.eql(thisPlayer.originPOS[0], 600)
//         expect(thatPlayer.startPOS).to.eql(thatPlayer.originPOS)
//       }
//       for (let num of [6, 7, 8]) {
//         let thisPlayer = secondTeam.players[num]
//         let thatPlayer = kickOffTeam.players[num]

//         expect(thisPlayer.startPOS[1]).to.lt(300)
//         expect(thatPlayer.startPOS).to.eql(thatPlayer.originPOS[0], parseInt(pitchHeight * 0.25, 10))
//       }
//       for (let num of [9, 10]) {
//         let thisPlayer = secondTeam.players[num]
//         let thatPlayer = kickOffTeam.players[num]

//         expect(thisPlayer.startPOS[1]).to.gt(parseInt((pitchHeight * 0.25) - 50, 10))
//         expect(thatPlayer.startPOS).to.eql(thatPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10))
//       }
//     })
//     mocha.it('freekick between halfway and last sixth - Bottom right', async() => {
//       let itlocation = './init_config/iteration.json'
//       let nextJSON = await setfreekicks.setBottomFreekick(itlocation)
//       let [, pitchHeight] = nextJSON.pitchSize
//       let { kickOffTeam, secondTeam } = nextJSON
//       let KOTgoalie = kickOffTeam.players[0]
//       let STgoalie = secondTeam.players[0]

//       expect(nextJSON).to.be.an('object')
//       expect(nextJSON.ball.direction).to.eql('northwest')
//       expect(nextJSON.ball.position).to.eql([655, 500])
//       expect(kickOffTeam.players[5].startPOS).to.eql([655, 500])
//       expect(secondTeam.players[5].startPOS).to.eql([340, parseInt((pitchHeight * 0.25) + 30, 10)])
//       expect(STgoalie.startPOS).to.eql(STgoalie.originPOS[0], parseInt(pitchHeight * 0.75, 10))
//       expect(KOTgoalie.startPOS).to.eql(KOTgoalie.originPOS)
//       for (let num of [1, 2, 3, 4]) {
//         let thisPlayer = secondTeam.players[num]
//         let thatPlayer = kickOffTeam.players[num]

//         expect(thisPlayer.startPOS).to.eql(thisPlayer.originPOS[0], 600)
//         expect(thatPlayer.startPOS).to.eql(thatPlayer.originPOS)
//       }
//       for (let num of [6, 7, 8]) {
//         let thisPlayer = secondTeam.players[num]
//         let thatPlayer = kickOffTeam.players[num]

//         expect(thisPlayer.startPOS[1]).to.lt(300)
//         expect(thatPlayer.startPOS).to.eql(thatPlayer.originPOS[0], parseInt(pitchHeight * 0.25, 10))
//       }
//       for (let num of [9, 10]) {
//         let thisPlayer = secondTeam.players[num]
//         let thatPlayer = kickOffTeam.players[num]

//         expect(thisPlayer.startPOS[1]).to.gt(parseInt((pitchHeight * 0.25) - 50, 10))
//         expect(thatPlayer.startPOS).to.eql(thatPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10))
//       }
//     })
//   })
//   mocha.describe('testFreekicksBottomLastQuarter()', function() {
//     mocha.it('freekick last sixth - top center', async() => {
//       let itlocation = './init_config/iteration.json'
//       let nextJSON = await setfreekicks.setBottomFreekick(itlocation)
//       let [pitchWidth, pitchHeight] = nextJSON.pitchSize
//       let { kickOffTeam, secondTeam } = nextJSON
//       let KOTgoalie = kickOffTeam.players[0]
//       let STgoalie = secondTeam.players[0]
//       let playerSpace = -3

//       expect(nextJSON).to.be.an('object')
//       expect(nextJSON.ball.direction).to.eql('north')
//       expect(nextJSON.ball.position).to.eql([340, parseInt((pitchHeight / 6) + 35, 10)])
//       expect(secondTeam.players[5].startPOS).to.eql([340, parseInt((pitchHeight / 6) + 35, 10)])
//       expect(STgoalie.startPOS).to.eql(STgoalie.originPOS[0], parseInt(pitchHeight * 0.25, 10))
//       expect(KOTgoalie.startPOS).to.eql(KOTgoalie.originPOS)
//       for (let num of [1, 2, 3, 4]) {
//         let thisPlayer = secondTeam.players[num].startPOS
//         let thatPlayer = kickOffTeam.players[num].startPOS
//         let ballDistanceFromGoalX = nextJSON.ball.position[0] - (pitchWidth / 2)
//         let midWayFromBalltoGoalX = parseInt((nextJSON.ball.position[0] - ballDistanceFromGoalX) / 2, 10)
//         let ballDistanceFromGoalY = nextJSON.ball.position[1]
//         let midWayFromBalltoGoalY = parseInt((nextJSON.ball.position[1] - ballDistanceFromGoalY) / 2, 10)
//         if (thisPlayer.position == 'CB') {
//           expect(thisPlayer.startPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10)])
//         } else if (thisPlayer.position == 'LB' || thisPlayer.position == 'RB') {
//           expect(thisPlayer.startPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.33, 10)])
//         }
//         expect(thatPlayer.startPOS).to.eql([midWayFromBalltoGoalX + playerSpace, midWayFromBalltoGoalY])
//         playerSpace += 2
//       }
//       let boundaryX = [(pitchWidth / 4) - 5, (pitchWidth - (pitchWidth / 4) + 5)]
//       let boundaryY = [0, (pitchHeight / 6) + 5]
//       for (let num of [5, 6, 7, 8, 9, 10]) {
//         let thisXPOSKOT = secondTeam.players[num].startPOS[0]
//         let thisYPOSKOT = secondTeam.players[num].startPOS[1]
//         let thisXPOSST = kickOffTeam.players[num].startPOS[0]
//         let thisYPOSST = kickOffTeam.players[num].startPOS[1]

//         if (num != 5) {
//           expect(true).to.eql(common.isBetween(thisXPOSKOT, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSKOT, boundaryY[0], boundaryY[1]))
//         } else {
//           expect(true).to.eql(common.isBetween(thisXPOSST, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSST, boundaryY[0], boundaryY[1]))
//         }
//         if ([6, 7].includes(num)) {
//           expect(true).to.eql(common.isBetween(thisXPOSST, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSST, boundaryY[0], boundaryY[1]))
//         }
//         if ([8, 9, 10].includes(num)) {
//           expect(true).to.eql(common.isBetween(thisXPOSST, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSST, boundaryY[0], boundaryY[1]))
//         }
//       }
//     })
//     mocha.it('freekick last sixth - Bottom edge of penalty box', async() => {
//       let itlocation = './init_config/iteration.json'
//       let nextJSON = await setfreekicks.setBottomFreekick(itlocation)
//       let [pitchWidth, pitchHeight] = nextJSON.pitchSize
//       let { kickOffTeam, secondTeam } = nextJSON
//       let KOTgoalie = kickOffTeam.players[0]
//       let STgoalie = secondTeam.players[0]
//       let playerSpace = -3

//       expect(nextJSON).to.be.an('object')
//       expect(nextJSON.ball.direction).to.eql('north')
//       expect(nextJSON.ball.position).to.eql([340, parseInt((pitchHeight / 6) - 4, 10)])
//       expect(secondTeam.players[5].startPOS).to.eql([340, parseInt((pitchHeight / 6) - 4, 10)])
//       expect(STgoalie.startPOS).to.eql(STgoalie.originPOS[0], parseInt(pitchHeight * 0.75, 10))
//       expect(KOTgoalie.startPOS).to.eql(KOTgoalie.originPOS)
//       for (let num of [1, 2, 3, 4]) {
//         let thisPlayer = secondTeam.players[num].startPOS
//         let thatPlayer = kickOffTeam.players[num].startPOS
//         let ballDistanceFromGoalX = nextJSON.ball.position[0] - (pitchWidth / 2)
//         let midWayFromBalltoGoalX = parseInt((nextJSON.ball.position[0] - ballDistanceFromGoalX) / 2, 10)
//         let ballDistanceFromGoalY = nextJSON.ball.position[1]
//         let midWayFromBalltoGoalY = parseInt((nextJSON.ball.position[1] - ballDistanceFromGoalY) / 2, 10)
//         if (thisPlayer.position == 'CB') {
//           expect(thisPlayer.startPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10)])
//         } else if (thisPlayer.position == 'LB' || thisPlayer.position == 'RB') {
//           expect(thisPlayer.startPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.33, 10)])
//         }
//         expect(thatPlayer.startPOS).to.eql([midWayFromBalltoGoalX + playerSpace, midWayFromBalltoGoalY])
//         playerSpace += 2
//       }
//       let boundaryX = [(pitchWidth / 4) - 5, (pitchWidth - (pitchWidth / 4) + 5)]
//       let boundaryY = [0, (pitchHeight / 6) + 5]
//       for (let num of [5, 6, 7, 8, 9, 10]) {
//         let thisXPOSKOT = secondTeam.players[num].startPOS[0]
//         let thisYPOSKOT = secondTeam.players[num].startPOS[1]
//         let thisXPOSST = kickOffTeam.players[num].startPOS[0]
//         let thisYPOSST = kickOffTeam.players[num].startPOS[1]

//         if (num != 5) {
//           expect(true).to.eql(common.isBetween(thisXPOSKOT, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSKOT, boundaryY[0], boundaryY[1]))
//         } else {
//           expect(true).to.eql(common.isBetween(thisXPOSST, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSST, boundaryY[0], boundaryY[1]))
//         }
//         if ([6, 7].includes(num)) {
//           expect(true).to.eql(common.isBetween(thisXPOSST, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSST, boundaryY[0], boundaryY[1]))
//         }
//         if ([8, 9, 10].includes(num)) {
//           expect(true).to.eql(common.isBetween(thisXPOSST, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSST, boundaryY[0], boundaryY[1]))
//         }
//       }
//     })
//     mocha.it('freekick last sixth - Bottom team top left', async() => {
//       let itlocation = './init_config/iteration.json'
//       let nextJSON = await setfreekicks.setBottomFreekick(itlocation)
//       let [pitchWidth, pitchHeight] = nextJSON.pitchSize
//       let { kickOffTeam, secondTeam } = nextJSON
//       let KOTgoalie = kickOffTeam.players[0]
//       let STgoalie = secondTeam.players[0]
//       let playerSpace = -3

//       expect(nextJSON).to.be.an('object')
//       expect(nextJSON.ball.direction).to.eql('east')
//       expect(nextJSON.ball.position).to.eql([10, 47])
//       expect(secondTeam.players[5].startPOS).to.eql([10, 47])
//       expect(STgoalie.startPOS).to.eql(STgoalie.originPOS[0], parseInt(pitchHeight * 0.75, 10))
//       expect(KOTgoalie.startPOS).to.eql(KOTgoalie.originPOS)
//       for (let num of [1, 2, 3, 4]) {
//         let thisPlayer = secondTeam.players[num].startPOS
//         let thatPlayer = kickOffTeam.players[num].startPOS
//         let ballDistanceFromGoalX = nextJSON.ball.position[0] - (pitchWidth / 2)
//         let midWayFromBalltoGoalX = parseInt((nextJSON.ball.position[0] - ballDistanceFromGoalX) / 2, 10)
//         let ballDistanceFromGoalY = nextJSON.ball.position[1]
//         let midWayFromBalltoGoalY = parseInt((nextJSON.ball.position[1] - ballDistanceFromGoalY) / 2, 10)
//         if (thisPlayer.position == 'CB') {
//           expect(thisPlayer.startPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10)])
//         } else if (thisPlayer.position == 'LB' || thisPlayer.position == 'RB') {
//           expect(thisPlayer.startPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.33, 10)])
//         }
//         expect(thatPlayer.startPOS).to.eql([midWayFromBalltoGoalX, midWayFromBalltoGoalY + playerSpace])
//         playerSpace += 2
//       }
//       let boundaryX = [(pitchWidth / 4) - 5, (pitchWidth - (pitchWidth / 4) + 5)]
//       let boundaryY = [0, (pitchHeight / 6) + 5]
//       for (let num of [5, 6, 7, 8, 9, 10]) {
//         let thisXPOSKOT = kickOffTeam.players[num].startPOS[0]
//         let thisYPOSKOT = kickOffTeam.players[num].startPOS[1]
//         let thisXPOSST = secondTeam.players[num].startPOS[0]
//         let thisYPOSST = secondTeam.players[num].startPOS[1]

//         if (num != 5) {
//           expect(true).to.eql(common.isBetween(thisXPOSST, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSST, boundaryY[0], boundaryY[1]))
//         } else {
//           expect(true).to.eql(common.isBetween(thisXPOSKOT, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSKOT, boundaryY[0], boundaryY[1]))
//         }
//         if ([6, 7].includes(num)) {
//           expect(true).to.eql(common.isBetween(thisXPOSKOT, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSKOT, boundaryY[0], boundaryY[1]))
//         }
//         if ([8, 9, 10].includes(num)) {
//           expect(true).to.eql(common.isBetween(thisXPOSKOT, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSKOT, boundaryY[0], boundaryY[1]))
//         }
//       }
//     })
//     mocha.it('freekick and last sixth - Bottom team bottom right', async() => {
//       let itlocation = './init_config/iteration.json'
//       let nextJSON = await setfreekicks.setBottomFreekick(itlocation)
//       let [pitchWidth, pitchHeight] = nextJSON.pitchSize
//       let { kickOffTeam, secondTeam } = nextJSON
//       let KOTgoalie = kickOffTeam.players[0]
//       let STgoalie = secondTeam.players[0]
//       let playerSpace = -3

//       expect(nextJSON).to.be.an('object')
//       expect(nextJSON.ball.direction).to.eql('west')
//       expect(nextJSON.ball.position).to.eql([600, 27])
//       expect(secondTeam.players[5].startPOS).to.eql([600, 27])
//       expect(STgoalie.startPOS).to.eql(STgoalie.originPOS[0], parseInt(pitchHeight * 0.25, 10))
//       expect(KOTgoalie.startPOS).to.eql(KOTgoalie.originPOS)
//       for (let num of [1, 2, 3, 4]) {
//         let thisPlayer = secondTeam.players[num].startPOS
//         let thatPlayer = kickOffTeam.players[num].startPOS
//         let ballDistanceFromGoalX = nextJSON.ball.position[0] - (pitchWidth / 2)
//         let midWayFromBalltoGoalX = parseInt((nextJSON.ball.position[0] - ballDistanceFromGoalX) / 2, 10)
//         let ballDistanceFromGoalY = nextJSON.ball.position[1]
//         let midWayFromBalltoGoalY = parseInt((nextJSON.ball.position[1] - ballDistanceFromGoalY) / 2, 10)
//         if (thisPlayer.position == 'CB') {
//           expect(thisPlayer.startPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10)])
//         } else if (thisPlayer.position == 'LB' || thisPlayer.position == 'RB') {
//           expect(thisPlayer.startPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.33, 10)])
//         }
//         expect(thatPlayer.startPOS).to.eql([midWayFromBalltoGoalX, midWayFromBalltoGoalY + playerSpace])
//         playerSpace += 2
//       }
//       let boundaryX = [(pitchWidth / 4) - 5, (pitchWidth - (pitchWidth / 4) + 5)]
//       let boundaryY = [0, (pitchHeight / 6) + 5]
//       for (let num of [5, 6, 7, 8, 9, 10]) {
//         let thisXPOSKOT = secondTeam.players[num].startPOS[0]
//         let thisYPOSKOT = secondTeam.players[num].startPOS[1]
//         let thisXPOSST = kickOffTeam.players[num].startPOS[0]
//         let thisYPOSST = kickOffTeam.players[num].startPOS[1]

//         if (num != 5) {
//           expect(true).to.eql(common.isBetween(thisXPOSST, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSST, boundaryY[0], boundaryY[1]))
//         } else {
//           expect(true).to.eql(common.isBetween(thisXPOSKOT, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSKOT, boundaryY[0], boundaryY[1]))
//         }
//         if ([6, 7].includes(num)) {
//           expect(true).to.eql(common.isBetween(thisXPOSKOT, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSKOT, boundaryY[0], boundaryY[1]))
//         }
//         if ([8, 9, 10].includes(num)) {
//           expect(true).to.eql(common.isBetween(thisXPOSKOT, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSKOT, boundaryY[0], boundaryY[1]))
//         }
//       }
//     })
//     mocha.it('freekick last sixth - Bottom team bottom left goal line', async() => {
//       let itlocation = './init_config/iteration.json'
//       let nextJSON = await setfreekicks.setBottomFreekick(itlocation)
//       let [pitchWidth, pitchHeight] = nextJSON.pitchSize
//       let { kickOffTeam, secondTeam } = nextJSON
//       let KOTgoalie = kickOffTeam.players[0]
//       let STgoalie = secondTeam.players[0]
//       let firstWallPosition = 1

//       expect(nextJSON).to.be.an('object')
//       expect(nextJSON.ball.direction).to.eql('east')
//       expect(nextJSON.ball.position).to.eql([10, 1])
//       expect(secondTeam.players[5].startPOS).to.eql([10, 1])
//       expect(STgoalie.startPOS).to.eql(STgoalie.originPOS[0], parseInt(pitchHeight * 0.75, 10))
//       expect(KOTgoalie.startPOS).to.eql(KOTgoalie.originPOS)
//       for (let num of [1, 2, 3, 4]) {
//         let thisPlayer = secondTeam.players[num].startPOS
//         let thatPlayer = kickOffTeam.players[num].startPOS
//         let ballDistanceFromGoalX = nextJSON.ball.position[0] - (pitchWidth / 2)
//         let midWayFromBalltoGoalX = parseInt((nextJSON.ball.position[0] - ballDistanceFromGoalX) / 2, 10)
//         if (thisPlayer.position == 'CB') {
//           expect(thisPlayer.startPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10)])
//         } else if (thisPlayer.position == 'LB' || thisPlayer.position == 'RB') {
//           expect(thisPlayer.startPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.33, 10)])
//         }
//         expect(thatPlayer.startPOS).to.eql([midWayFromBalltoGoalX, firstWallPosition])
//         firstWallPosition += 2
//       }
//       let boundaryX = [(pitchWidth / 4) - 5, (pitchWidth - (pitchWidth / 4) + 5)]
//       let boundaryY = [0, (pitchHeight / 6) + 5]
//       for (let num of [5, 6, 7, 8, 9, 10]) {
//         let thisXPOSKOT = secondTeam.players[num].startPOS[0]
//         let thisYPOSKOT = secondTeam.players[num].startPOS[1]
//         let thisXPOSST = kickOffTeam.players[num].startPOS[0]
//         let thisYPOSST = kickOffTeam.players[num].startPOS[1]

//         if (num != 5) {
//           expect(true).to.eql(common.isBetween(thisXPOSST, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSST, boundaryY[0], boundaryY[1]))
//         } else {
//           expect(true).to.eql(common.isBetween(thisXPOSKOT, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSKOT, boundaryY[0], boundaryY[1]))
//         }
//         if ([6, 7].includes(num)) {
//           expect(true).to.eql(common.isBetween(thisXPOSKOT, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSKOT, boundaryY[0], boundaryY[1]))
//         }
//         if ([8, 9, 10].includes(num)) {
//           expect(true).to.eql(common.isBetween(thisXPOSKOT, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSKOT, boundaryY[0], boundaryY[1]))
//         }
//       }
//     })
//     mocha.it('freekick last sixth - Bottom team bottom right goal line', async() => {
//       let itlocation = './init_config/iteration.json'
//       let nextJSON = await setfreekicks.setBottomFreekick(itlocation)
//       let [pitchWidth, pitchHeight] = nextJSON.pitchSize
//       let { kickOffTeam, secondTeam } = nextJSON
//       let KOTgoalie = kickOffTeam.players[0]
//       let STgoalie = secondTeam.players[0]
//       let firstWallPosition = 1

//       expect(nextJSON).to.be.an('object')
//       expect(nextJSON.ball.direction).to.eql('west')
//       expect(nextJSON.ball.position).to.eql([600, 1])
//       expect(secondTeam.players[5].startPOS).to.eql([600, 1])
//       expect(STgoalie.startPOS).to.eql(STgoalie.originPOS[0], parseInt(pitchHeight * 0.75, 10))
//       expect(KOTgoalie.startPOS).to.eql(KOTgoalie.originPOS)
//       for (let num of [1, 2, 3, 4]) {
//         let thisPlayer = secondTeam.players[num].startPOS
//         let thatPlayer = kickOffTeam.players[num].startPOS
//         let ballDistanceFromGoalX = nextJSON.ball.position[0] - (pitchWidth / 2)
//         let midWayFromBalltoGoalX = parseInt((nextJSON.ball.position[0] - ballDistanceFromGoalX) / 2, 10)
//         if (thisPlayer.position == 'CB') {
//           expect(thisPlayer.startPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.5, 10)])
//         } else if (thisPlayer.position == 'LB' || thisPlayer.position == 'RB') {
//           expect(thisPlayer.startPOS).to.eql([thisPlayer.originPOS[0], parseInt(pitchHeight * 0.33, 10)])
//         }
//         expect(thatPlayer.startPOS).to.eql([midWayFromBalltoGoalX, firstWallPosition])
//         firstWallPosition += 2
//       }
//       let boundaryX = [(pitchWidth / 4) - 5, (pitchWidth - (pitchWidth / 4) + 5)]
//       let boundaryY = [0, (pitchHeight / 6) + 5]
//       for (let num of [5, 6, 7, 8, 9, 10]) {
//         let thisXPOSKOT = secondTeam.players[num].startPOS[0]
//         let thisYPOSKOT = secondTeam.players[num].startPOS[1]
//         let thisXPOSST = kickOffTeam.players[num].startPOS[0]
//         let thisYPOSST = kickOffTeam.players[num].startPOS[1]

//         if (num != 5) {
//           expect(true).to.eql(common.isBetween(thisXPOSST, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSST, boundaryY[0], boundaryY[1]))
//         } else {
//           expect(true).to.eql(common.isBetween(thisXPOSKOT, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSKOT, boundaryY[0], boundaryY[1]))
//         }
//         if ([6, 7].includes(num)) {
//           expect(true).to.eql(common.isBetween(thisXPOSKOT, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSKOT, boundaryY[0], boundaryY[1]))
//         }
//         if ([8, 9, 10].includes(num)) {
//           expect(true).to.eql(common.isBetween(thisXPOSKOT, boundaryX[0], boundaryX[1]))
//           expect(true).to.eql(common.isBetween(thisYPOSKOT, boundaryY[0], boundaryY[1]))
//         }
//       }
//     })
//   })
}

module.exports = {
  runTest
}
