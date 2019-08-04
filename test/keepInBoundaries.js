const mocha = require('mocha')
const { expect } = require('chai')
const setpieces = require('./lib/set_pieces')
const common = require('../lib/common')

function runTest() {
  mocha.describe('testBoundariesForCorners1()', function() {
    mocha.it('expected Top Left Corner', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThisTeam', [15, -1])
      let insideHalf = parseInt(nextJSON.pitchSize[1] / 2, 10)
      let cornerLog = nextJSON.iterationLog.indexOf('Corner to - ThatTeam')

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.kickOffTeam.players[0].currentPOS[1]).to.be.lessThan(insideHalf)
      expect(cornerLog).to.be.greaterThan(-1)
    })
    mocha.it('expected Top Right Corner', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThisTeam', [400, -1])
      let insideHalf = parseInt(nextJSON.pitchSize[1] / 2, 10)
      let cornerLog = nextJSON.iterationLog.indexOf('Corner to - ThatTeam')

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.kickOffTeam.players[0].currentPOS[1]).to.be.lessThan(insideHalf)
      expect(cornerLog).to.be.greaterThan(-1)
    })
    mocha.it('expected Bottom Left Corner', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThatTeam', [15, 100000])
      let insideHalf = parseInt(nextJSON.pitchSize[1] / 2, 10)
      let cornerLog = nextJSON.iterationLog.indexOf('Corner to - ThisTeam')

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.secondTeam.players[0].currentPOS[1]).to.be.greaterThan(insideHalf)
      expect(cornerLog).to.be.greaterThan(-1)
    })
    mocha.it('expected Bottom Right Corner', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThatTeam', [400, 100000])
      let insideHalf = parseInt(nextJSON.pitchSize[1] / 2, 10)
      let cornerLog = nextJSON.iterationLog.indexOf('Corner to - ThisTeam')

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.secondTeam.players[0].currentPOS[1]).to.be.greaterThan(insideHalf)
      expect(cornerLog).to.be.greaterThan(-1)
    })
  })
  mocha.describe('testBoundariesForCorners2()', function() {
    mocha.it('expected Top Left Corner', async() => {
      let itlocation = './test/input/boundaryPositions/setCorners2.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThatTeam', [15, -1])
      let insideHalf = parseInt(nextJSON.pitchSize[1] / 2, 10)
      let cornerLog = nextJSON.iterationLog.indexOf('Corner to - ThisTeam')

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.secondTeam.players[0].currentPOS[1]).to.be.lessThan(insideHalf)
      expect(cornerLog).to.be.greaterThan(-1)
    })
    mocha.it('expected Top Right Corner', async() => {
      let itlocation = './test/input/boundaryPositions/setCorners2.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThatTeam', [400, -1])
      let insideHalf = parseInt(nextJSON.pitchSize[1] / 2, 10)
      let cornerLog = nextJSON.iterationLog.indexOf('Corner to - ThisTeam')

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.secondTeam.players[0].currentPOS[1]).to.be.lessThan(insideHalf)
      expect(cornerLog).to.be.greaterThan(-1)
    })
    mocha.it('expected Bottom Left Corner', async() => {
      let itlocation = './test/input/boundaryPositions/setCorners2.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThisTeam', [15, 100000])
      let insideHalf = parseInt(nextJSON.pitchSize[1] / 2, 10)
      let cornerLog = nextJSON.iterationLog.indexOf('Corner to - ThatTeam')

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.kickOffTeam.players[0].currentPOS[1]).to.be.greaterThan(insideHalf)
      expect(cornerLog).to.be.greaterThan(-1)
    })
    mocha.it('expected Bottom Right Corner', async() => {
      let itlocation = './test/input/boundaryPositions/setCorners2.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThisTeam', [400, 100000])
      let insideHalf = parseInt(nextJSON.pitchSize[1] / 2, 10)
      let cornerLog = nextJSON.iterationLog.indexOf('Corner to - ThatTeam')

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.kickOffTeam.players[0].currentPOS[1]).to.be.greaterThan(insideHalf)
      expect(cornerLog).to.be.greaterThan(-1)
    })
  })
  mocha.describe('set throw in()', function() {
    mocha.it('expected kick off team throw in left', async() => {
      let itlocation = './test/input/boundaryPositions/setCorners2.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThatTeam', [-1, 200])
      let throwLog = nextJSON.iterationLog.indexOf('Throw in to - ThisTeam')

      expect(nextJSON).to.be.an('object')
      expect(throwLog).to.be.greaterThan(-1)
    })
    mocha.it('expected kick off team throw in right', async() => {
      let itlocation = './test/input/boundaryPositions/setCorners2.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThatTeam', [8000, 200])
      let throwLog = nextJSON.iterationLog.indexOf('Throw in to - ThisTeam')

      expect(nextJSON).to.be.an('object')
      expect(throwLog).to.be.greaterThan(-1)
    })
    mocha.it('expected second team throw in left', async() => {
      let itlocation = './test/input/boundaryPositions/setCorners2.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThisTeam', [-1, 200])
      let throwLog = nextJSON.iterationLog.indexOf('Throw in to - ThatTeam')

      expect(nextJSON).to.be.an('object')
      expect(throwLog).to.be.greaterThan(-1)
    })
    mocha.it('expected second team throw in right', async() => {
      let itlocation = './test/input/boundaryPositions/setCorners2.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThisTeam', [8000, 200])
      let throwLog = nextJSON.iterationLog.indexOf('Throw in to - ThatTeam')

      expect(nextJSON).to.be.an('object')
      expect(throwLog).to.be.greaterThan(-1)
    })
  })
  mocha.describe('goalKicks()', function() {
    mocha.it('expected Top Goal Kick', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThatTeam', [10, -1])
      let cornerLog = nextJSON.iterationLog.indexOf('Goal Kick to - ThisTeam')

      expect(nextJSON).to.be.an('object')
      expect(cornerLog).to.be.greaterThan(-1)
    })
    mocha.it('expected Bottom Goal Kick', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThisTeam', [10, 1500])
      let cornerLog = nextJSON.iterationLog.indexOf('Goal Kick to - ThatTeam')

      expect(nextJSON).to.be.an('object')
      expect(cornerLog).to.be.greaterThan(-1)
    })
    mocha.it('expected Top Goal Kick 2', async() => {
      let itlocation = './test/input/boundaryPositions/kickoffteamtoppenalty.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThisTeam', [500, -1])
      let cornerLog = nextJSON.iterationLog.indexOf('Goal Kick to - ThatTeam')

      expect(nextJSON).to.be.an('object')
      expect(cornerLog).to.be.greaterThan(-1)
    })
    mocha.it('expected Bottom Goal Kick 2', async() => {
      let itlocation = './test/input/boundaryPositions/kickoffteamtoppenalty.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThatTeam', [500, 1500])
      let cornerLog = nextJSON.iterationLog.indexOf('Goal Kick to - ThisTeam')

      expect(nextJSON).to.be.an('object')
      expect(cornerLog).to.be.greaterThan(-1)
    })
    mocha.it('expected Top Goal Kick 3', async() => {
      let itlocation = './test/input/boundaryPositions/kickoffteamtoppenalty.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThisTeam', [50, -1])
      let cornerLog = nextJSON.iterationLog.indexOf('Goal Kick to - ThatTeam')

      expect(nextJSON).to.be.an('object')
      expect(cornerLog).to.be.greaterThan(-1)
    })
    mocha.it('expected Top Goal Kick 4', async() => {
      let itlocation = './test/input/boundaryPositions/kickoffteambottompenalty.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThatTeam', [400, -1])
      let cornerLog = nextJSON.iterationLog.indexOf('Goal Kick to - ThisTeam')

      expect(nextJSON).to.be.an('object')
      expect(cornerLog).to.be.greaterThan(-1)
    })
    mocha.it('expected Bottom Goal Kick 5', async() => {
      let itlocation = './test/input/boundaryPositions/kickoffteambottompenalty.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThisTeam', [500, 1500])
      let cornerLog = nextJSON.iterationLog.indexOf('Goal Kick to - ThatTeam')

      expect(nextJSON).to.be.an('object')
      expect(cornerLog).to.be.greaterThan(-1)
    })
    mocha.it('expected Top Goal Kick 6', async() => {
      let itlocation = './test/input/boundaryPositions/secondteambottompenalty.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThatTeam', [40, 1100])
      let cornerLog = nextJSON.iterationLog.indexOf('Goal Kick to - ThisTeam')

      expect(nextJSON).to.be.an('object')
      expect(cornerLog).to.be.greaterThan(-1)
    })
  })
  mocha.describe('goalScored()', function() {
    mocha.it('expected second team goal scored', async() => {
      let itlocation = './init_config/iteration2.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThisTeam', [330, -1])
      let goalLog = nextJSON.iterationLog.indexOf('Goal Scored by - Emily Smith - (ThatTeam)')

      expect(nextJSON).to.be.an('object')
      expect(goalLog).to.be.greaterThan(-1)
    })
    mocha.it('expected kick off team goal scored', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThatTeam', [330, 1500])
      let goalLog = nextJSON.iterationLog.indexOf('Goal Scored by - Peter Johnson - (ThisTeam)')

      expect(nextJSON).to.be.an('object')
      expect(goalLog).to.be.greaterThan(-1)
    })
    mocha.it('expected kick off team goal scored 2', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThatTeam', [352, 1500])
      let goalLog = nextJSON.iterationLog.indexOf('Goal Scored by - Peter Johnson - (ThisTeam)')

      expect(nextJSON).to.be.an('object')
      expect(goalLog).to.be.greaterThan(-1)
    })
    mocha.it('expected kick off team goal scored 3', async() => {
      let itlocation = './test/input/boundaryPositions/kickoffteamtoppenalty.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThatTeam', [330, -1])
      let goalLog = nextJSON.iterationLog.indexOf('Goal Scored by - Peter Johnson - (ThisTeam)')

      expect(nextJSON).to.be.an('object')
      expect(goalLog).to.be.greaterThan(-1)
    })
    mocha.it('expected second team goal scored - own goal', async() => {
      let itlocation = './test/input/boundaryPositions/kickoffteamtoppenalty.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThisTeam', [349, 1500])
      let goalLog = nextJSON.iterationLog.indexOf('Goal Scored by - Peter Johnson - (ThatTeam)')

      expect(nextJSON).to.be.an('object')
      expect(goalLog).to.be.greaterThan(-1)
    })
  })
  mocha.describe('no boundary()', function() {
    mocha.it('returns unchanged matchDetails', async() => {
      let itlocation = './test/input/boundaryPositions/kickoffteamtoppenalty.json'
      let nextJSON = await setpieces.keepInBoundaries(itlocation, 'ThisTeam', [349, 200])
      let matchDetails = await common.readFile(itlocation)
      expect(nextJSON).to.be.an('object')
      expect(nextJSON.ballIntended).to.eql([349, 200])
      delete nextJSON.ballIntended
      expect(matchDetails).to.eql(nextJSON)
    })
  })
}

module.exports = {
  runTest
}
