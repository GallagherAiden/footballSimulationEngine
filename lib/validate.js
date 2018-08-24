var async = require('async')

function validateTeam(team) {
  return new Promise(function(resolve, reject) {
    team = JSON.parse(team)
    var errorMessage = ''
    validateNumberOfPlayers(team.players).then(function() {
      var badObjects = 0
      async.each(team.players, function eachObj(player, callback) {
        validatePlayerObjects(player).then(function() {
          callback()
        }).catch(function(error) {
          badObjects++
          errorMessage += ` ${error}`
          callback()
        })
      }, function afterAllObjs(err) {
        if (badObjects > 0) {
          reject('Please provide all player skills: passing, shooting, tackling, saving, agility, strength, penalty_taking, jumping')
        } else if (!team.name) {
          reject('No team name given.')
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
      reject('There must be 11 players in a team')
    }
  })
}

function validatePlayerObjects(player) {
  return new Promise(function(resolve, reject) {
    var playerObjects = ['name', 'position', 'rating', 'startPOS', 'injured']
    async.each(playerObjects, function eachObj(obj, callback) {
      if (!player.hasOwnProperty(obj)) {
        callback(`Player must contain JSON variable: ${obj}`)
      } else {
        callback()
      }
    }, function afterAllObjs(err) {
      if (err) {
        reject(err)
      } else {
        validatePlayerSkills(player.skill).then(function() {
          resolve()
        }).catch(function(error) {
          reject(error)
        })
      }
    })
  })
}

function validatePlayerSkills(skills) {
  return new Promise(function(resolve, reject) {
    var skillType = ['passing', 'shooting', 'tackling', 'saving', 'agility', 'strength', 'penalty_taking', 'jumping']
    var badObjects = 0
    async.each(skillType, function eachType(type, callback) {
      if (!skills.hasOwnProperty(type)) {
        callback(`Player must contain skill: ${type}`)
        badObjects++
      } else {
        callback()
      }
    }, function afterAllSkills(err) {
      if (err) {
        reject(err)
      } else if (badObjects > 0) {
        reject('Please provide all player skills: passing, shooting, tackling, saving, agility, strength, penalty_taking, jumping')
      } else {
        resolve()
      }
    })
  })
}

function validatePitch(pitchDetails) {
  return new Promise(function(resolve, reject) {
    var pitchObjects = ['pitchWidth', 'pitchHeight']
    var badObjects = 0
    async.each(pitchObjects, function eachObj(obj, callback) {
      if (!pitchDetails.hasOwnProperty(obj)) {
        callback(`Pitch Must contains: ${obj}`)
        badObjects++
      } else {
        callback()
      }
    }, function afterAllObjs(err) {
      if (err) {
        reject(err)
      } else if (badObjects > 0) {
        reject('Please provide pitchWidth and pitchHeight')
      } else {
        resolve()
      }
    })
  })
}

function validateArguments(a, b, c) {
  return new Promise(function(resolve, reject) {
    if (a === undefined || b === undefined || c === undefined) {
      reject('Please provide two teams and a pitch JSON')
    } else {
      resolve()
    }
  })
}

function validateMatchDetails(matchDetails) {
  return new Promise(function(resolve, reject) {
    var matchObjects = ['kickOffTeam', 'secondTeam', 'pitchSize', 'ball', 'half', 'kickOffTeamStatistics', 'secondTeamStatistics', 'iterationLog']
    var badObjects = 0
    async.each(matchObjects, function eachObj(obj, callback) {
      if (!matchDetails.hasOwnProperty(obj)) {
        callback(`Match Details must contain: ${obj}`)
        badObjects++
      } else {
        callback()
      }
    }, function afterAllObjs(err) {
      if (err) {
        reject(err)
      } else if (badObjects > 0) {
        reject('Please provide valid match details JSON')
      } else {
        resolve()
      }
    })
  })
}

module.exports = {
  validateTeam,
  validatePitch,
  validateArguments,
  validateMatchDetails
}
