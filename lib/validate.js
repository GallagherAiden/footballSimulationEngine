function validateTeam(team) {
  team = JSON.parse(team)

  validateNumberOfPlayers(team.players)

  team.players.forEach(validatePlayerObjects)

  if (!team.name) throw new Error('No team name given.')
}

function validateNumberOfPlayers(players) {
  if (players.length != 11) {
    throw new Error('There must be 11 players in a team')
  }
}

function validatePlayerObjects(player) {
  const playerObjects = ['name', 'position', 'rating', 'startPOS', 'injured']

  playerObjects.forEach(obj => {
    if (!player.hasOwnProperty(obj)) throw new Error(`Player must contain JSON variable: ${obj}`)
  })

  validatePlayerSkills(player.skill)
}

function validatePlayerSkills(skills) {
  const skillType = ['passing', 'shooting', 'tackling', 'saving', 'agility', 'strength', 'penalty_taking', 'jumping']

  skillType.forEach(type => {
    if (!skills.hasOwnProperty(type)) throw new Error(`Player must contain skill: ${type}`)
  })
}

function validatePitch(pitchDetails) {
  const pitchObjects = ['pitchWidth', 'pitchHeight']

  pitchObjects.forEach(obj => {
    if (!pitchDetails.hasOwnProperty(obj)) throw new Error(`Pitch Must contain: ${obj}`)
  })
}

function validateArguments(a, b, c) {
  if (a === undefined || b === undefined || c === undefined) {
    throw new Error('Please provide two teams and a pitch JSON')
  }
}

function validateMatchDetails(matchDetails) {
  const matchObjects = ['kickOffTeam', 'secondTeam', 'pitchSize', 'ball', 'half', 'kickOffTeamStatistics', 'secondTeamStatistics', 'iterationLog']

  const good = matchObjects.every(obj => matchDetails.hasOwnProperty(obj))

  if (!good) throw new Error('Please provide valid match details JSON')
}

module.exports = {
  validateTeam,
  validatePitch,
  validateArguments,
  validateMatchDetails
}
