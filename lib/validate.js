const common = require(`../lib/common`)

function validateTeam(team) {
  if (typeof (team) != `object`) team = JSON.parse(team)
  if (!team.name) {
    throw new Error(`No team name given.`)
  }
  try {
    validateNumberOfPlayers(team.players)
  } catch (error) {
    throw new Error(error)
  }
  let badObjects = 0
  for (const player of team.players) {
    badObjects += validatePlayerObjects(player)
  }
  if (badObjects > 0) {
    throw new Error(`Provide skills: passing,shooting,tackling,saving,agility,strength,penalty_taking,jumping`)
  }
}

function validateNumberOfPlayers(players) {
  if (players.length != 11) {
    throw new Error(`There must be 11 players in a team`)
  }
}

function validatePlayerObjects(player) {
  let playerObjects = [`name`, `position`, `rating`, `currentPOS`, `injured`, `fitness`]
  for (const obj of playerObjects) {
    if (!Object.prototype.hasOwnProperty.call(player, obj)) {
      console.error(`Player must contain JSON variable: ${obj}`)
      return 1
    }
  }
  try {
    validatePlayerSkills(player.skill)
  } catch (error) {
    console.error(error)
    return 1
  }
  return 0
}

function validatePlayerSkills(skills) {
  let skillType = [`passing`, `shooting`, `tackling`, `saving`, `agility`, `strength`, `penalty_taking`, `jumping`]
  let badObjects = 0
  for (const type of skillType) {
    if (!Object.prototype.hasOwnProperty.call(skills, type)) {
      console.error(`Player must contain skill: ${type}`)
      badObjects++
    }
  }
  if (badObjects > 0) {
    throw new Error(`Provide skills: passing,shooting,tackling,saving,agility,strength,penalty_taking,jumping`)
  }
}

function validatePitch(pitchDetails) {
  let pitchObjects = [`pitchWidth`, `pitchHeight`]
  let badObjects = 0
  for (const obj of pitchObjects) {
    if (!Object.prototype.hasOwnProperty.call(pitchDetails, obj)) {
      console.error(`Pitch Must contains: ${obj}`)
      badObjects++
    }
  }
  if (badObjects > 0) {
    throw new Error(`Please provide pitchWidth and pitchHeight`)
  }
}

function validateArguments(a, b, c) {
  if (a === undefined || b === undefined || c === undefined) {
    throw new Error(`Please provide two teams and a pitch JSON`)
  }
}

function validateMatchDetails(matchDetails) {
  let matchObjects = [`kickOffTeam`, `secondTeam`, `pitchSize`, `ball`, `half`]
  Array.prototype.push.apply(matchObjects, [`kickOffTeamStatistics`, `secondTeamStatistics`, `iterationLog`])
  let badObjects = 0
  for (const obj of matchObjects) {
    if (!Object.prototype.hasOwnProperty.call(matchDetails, obj)) {
      console.error(`Match Details must contain: ${obj}`)
      badObjects++
    }
  }
  if (badObjects > 0) {
    throw new Error(`Please provide valid match details JSON`)
  }
}

function validatePlayerPositions(matchDetails) {
  let { kickOffTeam, secondTeam } = matchDetails
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  for (const player of kickOffTeam.players) {
    let onPitchX = (common.isBetween(player.currentPOS[0], -1, pitchWidth + 1))
    let onPitchY = (common.isBetween(player.currentPOS[1], -1, pitchHeight + 1))
    if (onPitchX == false) {
      throw new Error(`Player ${player.name} not on the pitch X: ${player.currentPOS[0]}`)
    }
    if (onPitchY == false) {
      throw new Error(`Player ${player.name} not on the pitch Y: ${player.currentPOS[1]}`)
    }
  }
  for (const player of secondTeam.players) {
    let onPitchX = (common.isBetween(player.currentPOS[0], -1, pitchWidth + 1))
    let onPitchY = (common.isBetween(player.currentPOS[1], -1, pitchHeight + 1))
    if (onPitchX == false) {
      console.log(secondTeam.players)
      throw new Error(`Player ${player.name} not on the pitch X: ${player.currentPOS[0]}`)
    }
    if (onPitchY == false) {
      console.log(secondTeam.players)
      throw new Error(`Player ${player.name} not on the pitch Y: ${player.currentPOS[1]}`)
    }
  }
}

module.exports = {
  validateTeam,
  validatePitch,
  validateArguments,
  validateMatchDetails,
  validatePlayerPositions
}
