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

async function getBallTrajectory(currentPOS, newPOS, power) {
  const xMovement = (currentPOS[0] - newPOS[0]) ** 2
  const yMovement = (parseInt(currentPOS[1], 10) - parseInt(newPOS[1], 10)) ** 2
  const movementDistance = Math.round(Math.sqrt(xMovement + yMovement), 0)

  let arraySize = Math.round(currentPOS[1] - newPOS[1])

  if (movementDistance >= power) {
    power = parseInt(power, 10) + parseInt(movementDistance, 10)
  }
  const height = Math.sqrt(Math.abs((movementDistance / 2) ** 2 - (power / 2) ** 2))

  if (arraySize < 1) arraySize = 1

  const yPlaces = Array(...Array(Math.abs(arraySize))).map((x, i) => i)

  const trajectory = [[currentPOS[0], currentPOS[1], 0]]

  const changeInX = (newPOS[0] - currentPOS[0]) / Math.abs(currentPOS[1] - newPOS[1])
  const changeInY = (currentPOS[1] - newPOS[1]) / (newPOS[1] - currentPOS[1])
  const changeInH = height / (yPlaces.length / 2)
  let elevation = 1

  yPlaces.forEach(() => {
    const lastX = trajectory[trajectory.length - 1][0]
    const lastY = trajectory[trajectory.length - 1][1]
    const lastH = trajectory[trajectory.length - 1][2]
    const xPos = round(lastX + changeInX, 5)
    let yPos = 0

    if (newPOS[1] > currentPOS[1]) {
      yPos = parseInt(lastY, 10) - parseInt(changeInY, 10)
    } else {
      yPos = parseInt(lastY, 10) + parseInt(changeInY, 10)
    }

    let hPos
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
  })

  return trajectory
}

function calculatePower(strength) {
  var hit = getRandomNumber(1, 5)
  return parseInt(strength, 10) * hit
}

//---------------
//Injury Functions
//---------------
function isInjured(x) {
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
  isOdd
}
