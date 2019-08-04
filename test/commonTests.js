const mocha = require('mocha')
const { expect } = require('chai')
const common = require('../lib/common')

function runTest() {
  mocha.describe('testCommonFunction()', function() {
    mocha.it('check random number', async() => {
      let number = common.getRandomNumber(1, 1)
      expect(number).to.eql(1)
      number = common.getRandomNumber(-2, -2)
      expect(number).to.eql(-2)
      number = common.getRandomNumber(200, 200)
      expect(number).to.eql(200)
    })
    mocha.it('round a number', async() => {
      let number = common.round(0.12, 0)
      expect(number).to.eql(0)
      number = common.round(0.18, 1)
      expect(number).to.eql(0.2)
      number = common.round(0.183, 2)
      expect(number).to.eql(0.18)
    })
    mocha.it('is between', async() => {
      let number = common.isBetween(0.12, 0, 1)
      expect(number).to.eql(true)
      number = common.isBetween(-0.12, -1, 1)
      expect(number).to.eql(true)
      number = common.isBetween(1200, 0, 5000)
      expect(number).to.eql(true)
      number = common.isBetween(3, 10, 50)
      expect(number).to.eql(false)
    })
    mocha.it('up to max', async() => {
      let number = common.upToMax(120, 100)
      expect(number).to.eql(100)
      number = common.upToMax(120, 150)
      expect(number).to.eql(120)
    })
    mocha.it('up to min', async() => {
      let number = common.upToMin(120, 100)
      expect(number).to.eql(120)
      number = common.upToMin(120, 150)
      expect(number).to.eql(150)
    })
    mocha.it('calculate power', async() => {
      let number = common.calculatePower(1)
      expect(number).to.be.gt(0)
      expect(number).to.be.lt(6)
      number = common.calculatePower(10)
      expect(number).to.be.gt(0)
      expect(number).to.be.lt(51)
    })
    mocha.it('a times b divided by c', async() => {
      let number = common.aTimesbDividedByC(1, 1, 1)
      expect(number).to.eql(1)
      number = common.aTimesbDividedByC(1, 4, 2)
      expect(number).to.eql(1.3333333333333333)
      number = common.aTimesbDividedByC(10, 10, 2)
      expect(number).to.eql(33.333333333333336)
    })
    mocha.it('sum from 1 to x', async() => {
      let number = common.sumFrom1toX(1)
      expect(number).to.eql(1)
      number = common.sumFrom1toX(2)
      expect(number).to.eql(3)
      number = common.sumFrom1toX(3)
      expect(number).to.eql(6)
    })
    mocha.it('read file', async() => {
      let pitch = await common.readFile('./init_config/pitch.json')
      let testPitchData = {
        'pitchWidth': 680,
        'pitchHeight': 1050
      }
      expect(pitch).to.eql(testPitchData)
      try {
        pitch = await common.readFile('./init_config/patch.json')
        expect(pitch).to.be.an('Error')
      } catch (err) {
        expect(err).to.be.an('Error')
        let errorText = 'Error: ENOENT: no such file or directory, open \'./init_config/patch.json\''
        expect(err.toString()).to.have.string(errorText)
      }
    })
    mocha.it('is injured', async() => {
      let number = common.isInjured(1)
      expect(number).to.eql(false)
    })
    mocha.it('is even', async() => {
      let number = common.isEven(1)
      expect(number).to.eql(false)
      number = common.isEven(0)
      expect(number).to.eql(true)
      number = common.isEven(100)
      expect(number).to.eql(true)
    })
    mocha.it('is odd', async() => {
      let number = common.isOdd(2)
      expect(number).to.eql(false)
      number = common.isOdd(0)
      expect(number).to.eql(false)
      number = common.isOdd(99)
      expect(number).to.eql(true)
    })
    mocha.it('get trajectory', async() => {
      let number = common.getBallTrajectory([0, 0, 0], [10, 10, 0], 100)
      expect(number).to.eql([[0, 0, 0], [1, 1, 49.50757517794625]])
      number = common.getBallTrajectory([20, 5, 0], [1000, 100, 10], 300)
      expect(number).to.eql([[20, 5, 0], [30.31579, 6, 412.61362071555516]])
    })
  })
}

module.exports = {
  runTest
}
