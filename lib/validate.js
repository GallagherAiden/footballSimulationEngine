const common = require(`../lib/common`)

function validateTeam(team) {
  if (typeof (team) != `object`) team = JSON.parse(team)
  if (!team.name) {
    throw new Error(`No team name given.`)
  } else {
    validateNumberOfPlayers(team.players)
    for (const player of team.players) {
      validatePlayerObjects(player)
    }
  }
}

function validateTeamSecondHalf(team) {
  if (typeof (team) != `object`) team = JSON.parse(team)
  if (!team.name) {
    throw new Error(`No team name given.`)
  } else if (!team.intent) {
    throw new Error(`No team intent given.`)
  } else {
    validateNumberOfPlayers(team.players)
    for (const player of team.players) {
      validatePlayerObjectsIteration(player)
    }
  }
}

function validateNumberOfPlayers(players) {
  if (players.length != 11) {
    throw new Error(`There must be 11 players in a team`)
  }
}

function validatePlayerObjects(player) {
  let playerObjects = [`name`, `position`, `rating`, `startPOS`, `injured`, `fitness`]
  for (const obj of playerObjects) {
    if (!Object.prototype.hasOwnProperty.call(player, obj)) {
      throw new Error(`Player must contain JSON variable: ${obj}`)
    }
  }
  validatePlayerSkills(player.skill)
}

function validatePlayerObjectsIteration(player) {
  let playerObjects = [`name`, `position`, `rating`, `startPOS`, `injured`, `fitness`]
  playerObjects.push(`originPOS`, `relativePOS`, `action`, `offside`, `hasBall`, `cards`)
  for (const obj of playerObjects) {
    if (!Object.prototype.hasOwnProperty.call(player, obj)) {
      throw new Error(`Player must contain JSON variable: ${obj}`)
    }
  }
  validatePlayerSkills(player.skill)
  validateCards(player.cards)
}

function validateCards(cards) {
  let cardsObject = [`yellow`, `red`]
  let badObjects = 0
  for (const type of cardsObject) {
    if (!Object.prototype.hasOwnProperty.call(cards, type)) {
      console.error(`Player must have set card: ${type}`)
      badObjects++
    }
  }
  if (badObjects > 0) {
    throw new Error(`Provide Cards: yellow,red`)
  }
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
      console.error(`Pitch Must contain: ${obj}`)
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
    if (matchDetails) {
      if (!Object.prototype.hasOwnProperty.call(matchDetails, obj)) {
        console.error(`Match Details must contain: ${obj}`)
        badObjects++
      }
    }
    if (badObjects > 0) {
      throw new Error(`Please provide valid match details JSON`)
    }
  }
  validateBall(matchDetails.ball)
}

function validateBall(ball) {
  let ballProps = [`position`, `withPlayer`, `Player`, `withTeam`, `direction`, `ballOverIterations`]
  let badObjects = 0
  for (const prop of ballProps) {
    if (!Object.prototype.hasOwnProperty.call(ball, prop)) {
      console.error(`Ball JSON must have property: ${prop}`)
      badObjects++
    }
  }
  if (badObjects > 0) {
    throw new Error(`Provide: position,withPlayer,Player,withTeam,direction,ballOverIterations`)
  }
}

function validatePlayerPositions(matchDetails) {
  let { kickOffTeam, secondTeam } = matchDetails
  const [pitchWidth, pitchHeight] = matchDetails.pitchSize
  for (const player of kickOffTeam.players) {
    let onPitchX = (common.isBetween(player.startPOS[0], -1, pitchWidth + 1))
    let onPitchY = (common.isBetween(player.startPOS[1], -1, pitchHeight + 1))
    if (onPitchX == false) {
      throw new Error(`Player ${player.name} not on the pitch X: ${player.startPOS[0]}`)
    }
    if (onPitchY == false) {
      throw new Error(`Player ${player.name} not on the pitch Y: ${player.startPOS[1]}`)
    }
  }
  for (const player of secondTeam.players) {
    let onPitchX = (common.isBetween(player.startPOS[0], -1, pitchWidth + 1))
    let onPitchY = (common.isBetween(player.startPOS[1], -1, pitchHeight + 1))
    if (onPitchX == false) {
      throw new Error(`Player ${player.name} not on the pitch X: ${player.startPOS[0]}`)
    }
    if (onPitchY == false) {
      throw new Error(`Player ${player.name} not on the pitch Y: ${player.startPOS[1]}`)
    }
  }
}

module.exports = {
  validateTeam,
  validateTeamSecondHalf,
  validatePlayerObjectsIteration,
  validatePitch,
  validateArguments,
  validateMatchDetails,
  validatePlayerPositions
}
