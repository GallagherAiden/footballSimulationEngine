const mocha = require('mocha')
const { expect } = require('chai')
const setpieces = require('./lib/set_pieces')

function runTest() {
  mocha.describe('testPenalties()', function() {
    mocha.it('penalty returns players in the correct positions: top', async() => {
      let itlocation = './init_config/iteration.json'

      let nextJSON = await setpieces.setupPenalty(itlocation, 'top')
      let pitchWidth = nextJSON.pitchSize[0]

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.ball.position).to.eql([pitchWidth / 2, 58, 0])
    })
    mocha.it('penalty returns players in the correct positions: bottom', async() => {
      let itlocation = './init_config/iteration.json'

      let nextJSON = await setpieces.setupPenalty(itlocation, 'bottom')
      let [pitchWidth, pitchHeight] = nextJSON.pitchSize

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.ball.position).to.eql([pitchWidth / 2, pitchHeight - 58, 0])
    })
  })
}

module.exports = {
  runTest
}
