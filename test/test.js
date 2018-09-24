const expect = require('chai').expect;
const common = require('../lib/common')
const validation = require('./validate_tests');

describe('testValidationOfInputData()', function () {
  it('init game returns an object', async () => {
    // 1. ARRANGE
    let t1location = "./init_config/team1.json"
    let t2location = "./init_config/team2.json"
    let plocation = "./init_config/pitch.json"

    // 2. ACT
    let initJSON = await validation.initGame(t1location, t2location, plocation)

    // 3. ASSERT
    expect(initJSON).to.be.an('object')
  })
  it('playIteration returns an Object', async () => {
    // 1. ARRANGE
  let providedItJson = "./init_config/iteration.json"

    // 2. ACT
    let outputIteration = await validation.playIteration(providedItJson)

    // 3. ASSERT
    expect(outputIteration).to.be.an('object')
  })
  it('start second half returns an Object', async () => {
    // 1. ARRANGE
   let providedItJson = "./init_config/iteration.json"

    // 2. ACT
    let shJSON = await validation.setupSecondHalf(providedItJson)

    // 3. ASSERT
    expect(shJSON).to.be.an('object')
  })
});