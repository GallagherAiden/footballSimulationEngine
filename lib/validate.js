const async = require('async')

function validateTeam(team) {
  return new Promise(function(resolve, reject) {
    if (typeof (team) != 'object') team = JSON.parse(team)
    validateNumberOfPlayers(team.players).then(function() {
      let badObjects = 0
      async.each(team.players, function eachObj(player, callback) {
        validatePlayerObjects(player).then(function() {
          callback()
        }).catch(function() {
          badObjects++
          callback()
        })
      }, function afterAllObjs() {
        if (badObjects > 0) {
          const error = 'Provide skills: passing,shooting,tackling,saving,agility,strength,penalty_taking,jumping'
          reject(error)
        } else if (!team.name) {
          const error = 'No team name given.'
          reject(error)
        } else {
          resolve()
        }
      })
    }).catch(function(error) {
      reject(error)
    })
  })
}

function validateNumberOfPlayers(players) {
  return new Promise(function(resolve, reject) {
    if (players.length === 11) {
      resolve()
    } else {
      const error = 'There must be 11 players in a team'
      reject(error)
    }
  })
}

function validatePlayerObjects(player) {
  return new Promise(function(resolve, reject) {
    let playerObjects = ['name', 'position', 'rating', 'startPOS', 'injured', 'fitness']
    async.each(playerObjects, function eachObj(obj, callback) {
      if (!Object.prototype.hasOwnProperty.call(player, obj)) {
        callback(`Player must contain JSON variable: ${obj}`)
      } else {
        callback()
      }
    }, function afterAllObjs(err) {
      if (err) {
        return reject(err)
      }
      validatePlayerSkills(player.skill).then(function() {
        return resolve()
      }).catch(function(error) {
        reject(error)
      })
    })
  })
}

function validatePlayerSkills(skills) {
  return new Promise(function(resolve, reject) {
    let skillType = ['passing', 'shooting', 'tackling', 'saving', 'agility', 'strength', 'penalty_taking', 'jumping']
    let badObjects = 0
    async.each(skillType, function eachType(type, callback) {
      if (!Object.prototype.hasOwnProperty.call(skills, type)) {
        callback(`Player must contain skill: ${type}`)
        badObjects++
      } else {
        callback()
      }
    }, function afterAllSkills(err) {
      if (err) {
        reject(err)
      } else if (badObjects > 0) {
        const error = 'Provide skills: passing,shooting,tackling,saving,agility,strength,penalty_taking,jumping'
        reject(error)
      }
      return resolve()
    })
  })
}

function validatePitch(pitchDetails) {
  return new Promise(function(resolve, reject) {
    let pitchObjects = ['pitchWidth', 'pitchHeight']
    let badObjects = 0
    async.each(pitchObjects, function eachObj(obj, callback) {
      if (!Object.prototype.hasOwnProperty.call(pitchDetails, obj)) {
        callback(`Pitch Must contains: ${obj}`)
        badObjects++
      } else {
        callback()
      }
    }, function afterAllObjs(err) {
      if (err) {
        reject(err)
      } else if (badObjects > 0) {
        const error = 'Please provide pitchWidth and pitchHeight'
        reject(error)
      }
      return resolve()
    })
  })
}

function validateArguments(a, b, c) {
  return new Promise(function(resolve, reject) {
    if (a === undefined || b === undefined || c === undefined) {
      const error = 'Please provide two teams and a pitch JSON'
      reject(error)
    }
    return resolve()
  })
}

function validateMatchDetails(matchDetails) {
  return new Promise(function(resolve, reject) {
    let matchObjects = ['kickOffTeam', 'secondTeam', 'pitchSize', 'ball', 'half']
    Array.prototype.push.apply(matchObjects, ['kickOffTeamStatistics', 'secondTeamStatistics', 'iterationLog'])
    let badObjects = 0
    async.each(matchObjects, function eachObj(obj, callback) {
      if (!Object.prototype.hasOwnProperty.call(matchDetails, obj)) {
        callback(`Match Details must contain: ${obj}`)
        badObjects++
      } else {
        callback()
      }
    }, function afterAllObjs(err) {
      if (err) {
        reject(err)
      } else if (badObjects > 0) {
        const error = 'Please provide valid match details JSON'
        reject(error)
      }
      return resolve()
    })
  })
}

module.exports = {
  validateTeam,
  validatePitch,
  validateArguments,
  validateMatchDetails
}
