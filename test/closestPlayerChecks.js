const mocha = require('mocha')
const { expect } = require('chai')
const playerMovement = require('../lib/playerMovement')
const common = require('../lib/common')

function runTest() {
  mocha.describe('testClosestPlayer()', function() {
    mocha.it('find the closest player to the ball - test 1', async() => {
      let inputIteration = './test/input/closestPositions/closest1.json'
      let matchInfo = await common.readFile(inputIteration)
      let closestPlayerA = {
        'name': '',
        'position': 10000
      }
      let closestPlayerB = {
        'name': '',
        'position': 10000
      }
      playerMovement.closestPlayerToBall(closestPlayerA, matchInfo.kickOffTeam, matchInfo)
      expect(closestPlayerA).to.eql({ name: 'Arthur Johnson', position: 101 })
      playerMovement.closestPlayerToBall(closestPlayerB, matchInfo.secondTeam, matchInfo)
      expect(closestPlayerB).to.eql({ name: 'Wayne Smith', position: 229 })
    })
    mocha.it('find the closest player to the ball - test 2', async() => {
      let inputIteration = './test/input/closestPositions/closest2.json'
      let matchInfo = await common.readFile(inputIteration)
      let closestPlayerA = {
        'name': '',
        'position': 10000
      }
      let closestPlayerB = {
        'name': '',
        'position': 10000
      }
      playerMovement.closestPlayerToBall(closestPlayerA, matchInfo.kickOffTeam, matchInfo)
      expect(closestPlayerA).to.eql({ name: 'Arthur Johnson', position: 97 })
      playerMovement.closestPlayerToBall(closestPlayerB, matchInfo.secondTeam, matchInfo)
      expect(closestPlayerB).to.eql({ name: 'Wayne Smith', position: 227 })
    })
    mocha.it('find the closest player to the ball - test 3', async() => {
      let inputIteration = './test/input/closestPositions/closest3.json'
      let matchInfo = await common.readFile(inputIteration)
      let closestPlayerA = {
        'name': '',
        'position': 10000
      }
      let closestPlayerB = {
        'name': '',
        'position': 10000
      }
      playerMovement.closestPlayerToBall(closestPlayerA, matchInfo.kickOffTeam, matchInfo)
      expect(closestPlayerA).to.eql({ name: 'Louise Johnson', position: 162.5 })
      playerMovement.closestPlayerToBall(closestPlayerB, matchInfo.secondTeam, matchInfo)
      expect(closestPlayerB).to.eql({ name: 'Emily Smith', position: 66.5 })
    })
    mocha.it('find the closest player to the ball - test 4', async() => {
      let inputIteration = './test/input/closestPositions/closest4.json'
      let matchInfo = await common.readFile(inputIteration)
      let closestPlayerA = {
        'name': '',
        'position': 10000
      }
      let closestPlayerB = {
        'name': '',
        'position': 10000
      }
      playerMovement.closestPlayerToBall(closestPlayerA, matchInfo.kickOffTeam, matchInfo)
      expect(closestPlayerA).to.eql({ name: 'George Johnson', position: 110 })
      playerMovement.closestPlayerToBall(closestPlayerB, matchInfo.secondTeam, matchInfo)
      expect(closestPlayerB).to.eql({ name: 'Wayne Smith', position: 305.5 })
    })
  })
}

module.exports = {
  runTest
}
