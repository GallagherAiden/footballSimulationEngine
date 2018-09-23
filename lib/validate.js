async function validateTeam(team) {
  if (typeof (team) != 'object') team = JSON.parse(team)
  if (!team.name) {
    const error = 'No team name given.'
    throw error
  }
  try {
    validateNumberOfPlayers(team.players)
  } catch (error) {
    throw error
  }
  let badObjects = 0
  for (const player of team.players) {
    badObjects += validatePlayerObjects(player)
  }
  if (badObjects > 0) {
    const error = 'Provide skills: passing,shooting,tackling,saving,agility,strength,penalty_taking,jumping'
    throw error
  }
}

function validateNumberOfPlayers(players) {
  if (players.length != 11) {
    const error = 'There must be 11 players in a team'
    throw error
  }
}

async function validatePlayerObjects(player) {
  let playerObjects = ['name', 'position', 'rating', 'startPOS', 'injured', 'fitness']
  for (const obj of playerObjects) {
    if (!Object.prototype.hasOwnProperty.call(player, obj)) {
      console.error(`Player must contain JSON variable: ${obj}`)
      return 1
    }
  }
  await validatePlayerSkills(player.skill).catch(function(error) {
    console.error(error)
    return 1
  })
  return 0
}

async function validatePlayerSkills(skills) {
  let skillType = ['passing', 'shooting', 'tackling', 'saving', 'agility', 'strength', 'penalty_taking', 'jumping']
  let badObjects = 0
  for (const type of skillType) {
    if (!Object.prototype.hasOwnProperty.call(skills, type)) {
      console.error(`Player must contain skill: ${type}`)
      badObjects++
    }
  }
  if (badObjects > 0) {
    const error = 'Provide skills: passing,shooting,tackling,saving,agility,strength,penalty_taking,jumping'
    throw error
  }
}

async function validatePitch(pitchDetails) {
  let pitchObjects = ['pitchWidth', 'pitchHeight']
  let badObjects = 0
  for (const obj of pitchObjects) {
    if (!Object.prototype.hasOwnProperty.call(pitchDetails, obj)) {
      console.error(`Pitch Must contains: ${obj}`)
      badObjects++
    }
  }
  if (badObjects > 0) {
    const error = 'Please provide pitchWidth and pitchHeight'
    throw error
  }
}

async function validateArguments(a, b, c) {
  if (a === undefined || b === undefined || c === undefined) {
    const error = 'Please provide two teams and a pitch JSON'
    throw error
  }
}

async function validateMatchDetails(matchDetails) {
  let matchObjects = ['kickOffTeam', 'secondTeam', 'pitchSize', 'ball', 'half']
  Array.prototype.push.apply(matchObjects, ['kickOffTeamStatistics', 'secondTeamStatistics', 'iterationLog'])
  let badObjects = 0
  for (const obj of matchObjects) {
    if (!Object.prototype.hasOwnProperty.call(matchDetails, obj)) {
      console.error(`Match Details must contain: ${obj}`)
      badObjects++
    }
  }
  if (badObjects > 0) {
    const error = 'Please provide valid match details JSON'
    throw error
  }
}

module.exports = {
  validateTeam,
  validatePitch,
  validateArguments,
  validateMatchDetails
}
