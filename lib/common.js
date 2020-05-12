const fs = require('fs')
//---------------
//Maths Functions
//---------------
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function round(value, decimals) {
  return Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`)
}

function isBetween(num, low, high) {
  return num > low && num < high
}

function upToMax(num, max) {
  if (num > max) return max
  return num
}

function upToMin(num, min) {
  if (num < min) return min
  return num
}

function getBallTrajectory(thisPOS, newPOS, power) {
  const xMovement = (thisPOS[0] - newPOS[0]) ** 2
  const yMovement = (parseInt(thisPOS[1], 10) - parseInt(newPOS[1], 10)) ** 2
  const movementDistance = Math.round(Math.sqrt(xMovement + yMovement), 0)

  let arraySize = Math.round(thisPOS[1] - newPOS[1])

  if (movementDistance >= power) {
    power = parseInt(power, 10) + parseInt(movementDistance, 10)
  }
  const height = Math.sqrt(Math.abs((movementDistance / 2) ** 2 - (power / 2) ** 2))

  if (arraySize < 1) arraySize = 1

  const yPlaces = Array(...Array(Math.abs(arraySize))).map((x, i) => i)

  const trajectory = [
    [thisPOS[0], thisPOS[1], 0]
  ]

  const changeInX = (newPOS[0] - thisPOS[0]) / Math.abs(thisPOS[1] - newPOS[1])
  const changeInY = (thisPOS[1] - newPOS[1]) / (newPOS[1] - thisPOS[1])
  const changeInH = height / (yPlaces.length / 2)
  let elevation = 1

  yPlaces.forEach(() => {
    const lastX = trajectory[trajectory.length - 1][0]
    const lastY = trajectory[trajectory.length - 1][1]
    const lastH = trajectory[trajectory.length - 1][2]
    const xPos = round(lastX + changeInX, 5)
    let yPos = 0
    if (newPOS[1] > thisPOS[1]) yPos = parseInt(lastY, 10) - parseInt(changeInY, 10)
    else yPos = parseInt(lastY, 10) + parseInt(changeInY, 10)
    let hPos
    if (elevation === 1) {
      hPos = round(lastH + changeInH, 5)
      if (hPos >= height) {
        elevation = 0
        hPos = height
      }
    } else hPos = round(lastH - changeInH, 5)
    trajectory.push([xPos, yPos, hPos])
  })
  return trajectory
}

function calculatePower(strength) {
  let hit = getRandomNumber(1, 5)
  return parseInt(strength, 10) * hit
}

function aTimesbDividedByC(a, b, c) {
  return (a * (b / sumFrom1toX(c)))
}

function sumFrom1toX(x) {
  return (x * (x + 1)) / 2
}

function readFile(filePath) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) {
        reject(err)
      } else {
        data = JSON.parse(data)
        resolve(data)
      }
    })
  })
}

function inTopPenalty(matchDetails, item) {
  const [matchWidth, matchHeight] = matchDetails.pitchSize
  let ballInPenalyBoxX = isBetween(item[0], (matchWidth / 4) + 5, matchWidth - (matchWidth / 4) - 5)
  let ballInTopPenalyBoxY = isBetween(item[1], -1, (matchHeight / 6) + 7)
  if (ballInPenalyBoxX && ballInTopPenalyBoxY) return true
  return false
}

function inBottomPenalty(matchDetails, item) {
  const [matchWidth, matchHeight] = matchDetails.pitchSize
  let ballInPenalyBoxX = isBetween(item[0], (matchWidth / 4) + 5, matchWidth - (matchWidth / 4) - 5)
  let ballInBottomPenalyBoxY = isBetween(item[1], matchHeight - (matchHeight / 6) - 7, matchHeight + 1)
  if (ballInPenalyBoxX && ballInBottomPenalyBoxY) return true
  return false
}

function getRandomTopPenaltyPosition(matchDetails) {
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let boundaryX = [(pitchWidth / 4) + 6, (pitchWidth - (pitchWidth / 4) - 6)]
  let boundaryY = [0, (pitchHeight / 6) + 6]
  return [getRandomNumber(boundaryX[0], boundaryX[1]), getRandomNumber(boundaryY[0], boundaryY[1])]
}

function getRandomBottomPenaltyPosition(matchDetails) {
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  let boundaryX = [(pitchWidth / 4) + 6, (pitchWidth - (pitchWidth / 4) - 6)]
  let boundaryY = [pitchHeight - (pitchHeight / 6) + 6, pitchHeight]
  return [getRandomNumber(boundaryX[0], boundaryX[1]), getRandomNumber(boundaryY[0], boundaryY[1])]
}

function removeBallFromAllPlayers(matchDetails) {
  for (let player of matchDetails.kickOffTeam.players) {
    player.hasBall = false
  }
  for (let player of matchDetails.secondTeam.players) {
    player.hasBall = false
  }
}

//---------------
//Injury Functions
//---------------
function isInjured(x) {
  if (x == 23) return true
  return getRandomNumber(0, x) == 23
}

function matchInjury(matchDetails, team) {
  const player = team.players[getRandomNumber(0, 10)]

  if (isInjured(40000)) {
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
  isOdd,
  sumFrom1toX,
  aTimesbDividedByC,
  readFile,
  upToMax,
  upToMin,
  inTopPenalty,
  inBottomPenalty,
  getRandomTopPenaltyPosition,
  getRandomBottomPenaltyPosition,
  removeBallFromAllPlayers
}
