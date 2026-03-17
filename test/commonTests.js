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
      let number = common.calculatePower(1, 1055)
      expect(number).to.be.gt(0)
      expect(number).to.be.lt(50)
      number = common.calculatePower(10, 1055)
      expect(number).to.be.gt(0)
      expect(number).to.be.lt(150)
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
        'pitchHeight': 1050,
        'goalWidth': 90
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
      let number = common.getBallTrajectory([0, 0, 0], [10, 10, 0], 100, 'shot', 1050)
      expect(number).to.eql([
        [0, 0, 0], [0, 0, 1], [0, 0, 1], [0, 0, 2],
        [1, 1, 2], [1, 1, 3], [1, 1, 3], [1, 1, 4],
        [1, 1, 4], [1, 1, 5], [2, 2, 5], [2, 2, 6],
        [2, 2, 6], [2, 2, 7], [2, 2, 7], [2, 2, 7],
        [3, 3, 8], [3, 3, 8], [3, 3, 8], [3, 3, 9],
        [3, 3, 9], [3, 3, 9], [4, 4, 9], [4, 4, 9],
        [4, 4, 9], [4, 4, 10], [4, 4, 10], [4, 4, 10],
        [5, 5, 10], [5, 5, 10], [5, 5, 10], [5, 5, 10],
        [5, 5, 10], [5, 5, 10], [5, 5, 10], [6, 6, 10],
        [6, 6, 10], [6, 6, 10], [6, 6, 9], [6, 6, 9],
        [6, 6, 9], [7, 7, 9], [7, 7, 9], [7, 7, 9],
        [7, 7, 8], [7, 7, 8], [7, 7, 8], [8, 8, 7],
        [8, 8, 7], [8, 8, 7], [8, 8, 6], [8, 8, 6],
        [8, 8, 5], [9, 9, 5], [9, 9, 4], [9, 9, 4],
        [9, 9, 3], [9, 9, 3], [9, 9, 2], [10, 10, 2],
        [10, 10, 1], [10, 10, 1], [10, 10, 0]
      ])
      number = common.getBallTrajectory([20, 5, 0], [1000, 100, 10], 300, 'shot', 1050)
      expect(number).to.eql([
        [20, 5, 0], [31, 6, 1], [43, 7, 3], [54, 8, 4],
        [66, 9, 5], [77, 11, 7], [88, 12, 8], [100, 13, 9],
        [111, 14, 10], [123, 15, 11], [134, 16, 12], [145, 17, 13],
        [157, 18, 14], [168, 19, 15], [180, 20, 16], [191, 22, 17],
        [202, 23, 18], [214, 24, 19], [225, 25, 20], [237, 26, 21],
        [248, 27, 21], [259, 28, 22], [271, 29, 23], [282, 30, 24],
        [293, 32, 24], [305, 33, 25], [316, 34, 25], [328, 35, 26],
        [339, 36, 26], [350, 37, 27], [362, 38, 27], [373, 39, 28],
        [385, 40, 28], [396, 41, 28], [407, 43, 29], [419, 44, 29],
        [430, 45, 29], [442, 46, 29], [453, 47, 30], [464, 48, 30],
        [476, 49, 30], [487, 50, 30], [499, 51, 30], [510, 53, 30],
        [521, 54, 30], [533, 55, 30], [544, 56, 30], [556, 57, 30],
        [567, 58, 30], [578, 59, 29], [590, 60, 29], [601, 61, 29],
        [613, 62, 29], [624, 64, 28], [635, 65, 28], [647, 66, 28],
        [658, 67, 27], [670, 68, 27], [681, 69, 26], [692, 70, 26],
        [704, 71, 25], [715, 72, 25], [727, 73, 24], [738, 75, 24],
        [749, 76, 23], [761, 77, 22], [772, 78, 21], [783, 79, 21],
        [795, 80, 20], [806, 81, 19], [818, 82, 18], [829, 83, 17],
        [840, 85, 16], [852, 86, 15], [863, 87, 14], [875, 88, 13],
        [886, 89, 12], [897, 90, 11], [909, 91, 10], [920, 92, 9],
        [932, 93, 8], [943, 94, 7], [954, 96, 5], [966, 97, 4],
        [977, 98, 3], [989, 99, 1], [1000, 100, 0]
      ])
    })
  })
}

module.exports = {
  runTest
}
