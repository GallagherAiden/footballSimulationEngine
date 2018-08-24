var async = require('async')

//---------------
//Maths Functions
//---------------
function getRandomNumber(min, max) {
  var random = Math.floor(Math.random() * (max - min + 1)) + min
  return random
}

function round(value, decimals) {
  return Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`)
}

function isBetween(num, low, high) {
  if (num > low && num < high) {
    return true
  }
  return false
}

function getBallTrajectory(currentPOS, newPOS, power) {
  return new Promise(function(resolve, reject) {
    var xMovement = Math.pow((currentPOS[0] - newPOS[0]), 2)
    var yMovement = Math.pow((parseInt(currentPOS[1]) - parseInt(newPOS[1])), 2)
    var movementDistance = Math.round(Math.sqrt(xMovement + yMovement), 0)
    var arraySize = Math.round(currentPOS[1] - newPOS[1])
    if (movementDistance >= power) {
      power = parseInt(power) + parseInt(movementDistance)
    }
    var height = Math.sqrt(Math.abs(Math.pow(movementDistance / 2, 2) - Math.pow(power / 2, 2)))
    if (arraySize < 1) {
      arraySize = 1
    }
    var yPlaces = Array(...Array(Math.abs(arraySize))).map(function(x, i) {
      return i
    })
    var trajectory = []
    trajectory.push([currentPOS[0], currentPOS[1], 0])
    var changeInX = (newPOS[0] - currentPOS[0]) / Math.abs(currentPOS[1] - newPOS[1])
    var changeInY = (currentPOS[1] - newPOS[1]) / (newPOS[1] - currentPOS[1])
    var changeInH = height / (yPlaces.length / 2)
    var elevation = 1
    async.eachSeries(yPlaces, function eachPos(thisYPos, thisYPosCallback) {
      var lastX = trajectory[trajectory.length - 1][0]
      var lastY = trajectory[trajectory.length - 1][1]
      var lastH = trajectory[trajectory.length - 1][2]
      var xPos = round(lastX + changeInX, 5)
      if (newPOS[1] > currentPOS[1]) {
        yPos = parseInt(lastY) - parseInt(changeInY)
      } else {
        yPos = parseInt(lastY) + parseInt(changeInY)
      }
      var hPos
      if (elevation === 1) {
        hPos = round(lastH + changeInH, 5)
        if (hPos >= height) {
          elevation = 0
          hPos = height
        }
      } else {
        hPos = round(lastH - changeInH, 5)
      }
      trajectory.push([xPos, yPos, hPos])
      thisYPosCallback()
    }, function afterAllYPos() {
      resolve(trajectory)
    })
  })
}

function calculatePower(strength) {
  var hit = getRandomNumber(1, 5)
  var power = parseInt(strength) * hit
  return power
}

//---------------
//Injury Functions
//---------------
function isInjured(x) {
  var injury = getRandomNumber(0, x)
  if (injury === 23) {
    return true
  }
  return false
}

function matchInjury(matchDetails, team) {
  var player = team.players[getRandomNumber(0, 10)]
  if (isInjured(40000) === true) {
    player.injured = true
    matchDetails.iterationLog.push(`Player Injured - ${player.name}`)
  }
}

function isEven(n) {
  return n % 2 == 0
}

function isOdd(n) {
  return Math.abs(n % 2) == 1
}

module.exports = {
  getRandomNumber,
  round,
  isInjured,
  matchInjury,
  getBallTrajectory,
  isBetween,
  calculatePower,
  isEven,
  isOdd
}
