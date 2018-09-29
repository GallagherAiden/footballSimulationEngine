const mocha = require('mocha')
const { expect } = require('chai')
const validation = require('./lib/validate_tests')

function runTest() {
  mocha.describe('testValidationOfInputData()', function() {
    mocha.it('init game returns an object', async() => {
      let t1location = './init_config/team1.json'
      let t2location = './init_config/team2.json'
      let plocation = './init_config/pitch.json'

      let initJSON = await validation.initGame(t1location, t2location, plocation)

      expect(initJSON).to.be.an('object')
    })
    mocha.it('playIteration returns an Object', async() => {
      let providedItJson = './init_config/iteration.json'

      let outputIteration = await validation.playIteration(providedItJson)

      expect(outputIteration).to.be.an('object')
    })
    mocha.it('start second half returns an Object', async() => {
      let providedItJson = './init_config/iteration.json'

      let shJSON = await validation.setupSecondHalf(providedItJson)

      expect(shJSON).to.be.an('object')
    })
  })
}

module.exports = {
  runTest
}
