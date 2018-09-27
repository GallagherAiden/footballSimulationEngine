const { expect } = require('chai')
const validation = require('./validate_tests')
const setpieces = require('./set_pieces')
const mocha = require('mocha')

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
