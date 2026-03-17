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

function getBallTrajectory(thisPOS, newPOS, power, type, pitchHeight) {
  const dx = newPOS[0] - thisPOS[0]
  const dy = newPOS[1] - thisPOS[1]
  const maxPower = pitchHeight * 0.40
  const powerRatio = Math.min(1, power / maxPower)
  const minSteps = 50
  const maxSteps = 100
  const steps = Math.round(minSteps + (maxSteps - minSteps) * powerRatio)
  let maxLoftPercent = 0.03
  if (type === 'pass') maxLoftPercent = 0.01
  if (type === 'through') maxLoftPercent = 0.02
  if (type === 'shot') maxLoftPercent = 0.04
  if (type === 'cross') maxLoftPercent = 0.08
  if (type === 'kick') maxLoftPercent = 0.12
  const maxLoftHeight = pitchHeight * maxLoftPercent
  const maxHeight = maxLoftHeight * powerRatio
  const trajectory = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = thisPOS[0] + dx * t
    const y = thisPOS[1] + dy * t
    const z = 4 * maxHeight * t * (1 - t)
    trajectory.push([round(x, 0), round(y, 0), round(z, 0)])
  }
  return trajectory
}

function calculatePower(strength, pitchHeight) {
  const maxPercent = 0.40
  const maxPower = pitchHeight * maxPercent
  const strengthFactor = Math.sqrt(Math.max(0, strength) / 100)
  const variance = getRandomNumber(85, 100) / 100
  const power = maxPower * strengthFactor * variance
  return Math.min(power, maxPower)
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
  matchDetails.ball.withPlayer = false
  matchDetails.ball.withTeam = ''
  matchDetails.ball.Player = ''
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

function distance(pos1, pos2) {
  const dx = pos1[0] - pos2[0]
  const dy = pos1[1] - pos2[1]
  return Math.sqrt(dx * dx + dy * dy)
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
  removeBallFromAllPlayers,
  distance
}
