//------------------------
//    NPM Modules
//------------------------
var common = require('./lib/common')
var setPositions = require('./lib/setPositions')
var setVariables = require('./lib/setVariables')
var playerMovement = require('./lib/playerMovement')
var validate = require('./lib/validate')

//------------------------
//    Functions
//------------------------
function initiateGame(team1, team2, pitchDetails) {
  return new Promise(function(resolve, reject) {
    validate.validateArguments(team1, team2, pitchDetails).then(function() {
      validate.validateTeam(team1).then(function() {
        validate.validateTeam(team2).then(function() {
          validate.validatePitch(pitchDetails).then(function() {
            setVariables.populateMatchDetails(team1, team2, pitchDetails).then(function(matchDetails) {
              setVariables.setGameVariables(matchDetails.kickOffTeam).then(function(kickOffTeam) {
                setVariables.setGameVariables(matchDetails.secondTeam).then(function(secondTeam) {
                  setVariables.koDecider(kickOffTeam, matchDetails).then(function(kickOffTeam) {
                    matchDetails.iterationLog.push(`Team to kick off - ${kickOffTeam.name}`)
                    matchDetails.iterationLog.push(`Second team - ${secondTeam.name}`)
                    setPositions.switchSide(secondTeam, matchDetails).then(function(secondTeam) {
                      matchDetails.kickOffTeam = kickOffTeam
                      matchDetails.secondTeam = secondTeam
                      resolve(matchDetails)
                    }).catch(function(error) {
                      console.error('Error: ', error)
                    })
                  }).catch(function(error) {
                    console.error('Error: ', error)
                  })
                }).catch(function(error) {
                  console.error('Error: ', error)
                })
              }).catch(function(error) {
                console.error('Error: ', error)
              })
            }).catch(function(error) {
              console.error('Error: ', error)
            })
          }).catch(function(error) {
            console.error('Error: ', error)
          })
        }).catch(function(error) {
          console.error('Error: ', error)
        })
      }).catch(function(error) {
        console.error('Error: ', error)
      })
    }).catch(function(error) {
      console.error('Error: ', error)
    })
  })
}

function playIteration(matchDetails) {
  return new Promise(function(resolve, reject) {
    var closestPlayerA = {
      'name': '',
      'position': 10000
    }
    var closestPlayerB = {
      'name': '',
      'position': 10000
    }
    validate.validateMatchDetails(matchDetails).then(function() {
      matchDetails.iterationLog = []
      kickOffTeam = matchDetails.kickOffTeam
      secondTeam = matchDetails.secondTeam
      common.matchInjury(matchDetails, kickOffTeam)
      common.matchInjury(matchDetails, secondTeam)
      playerMovement.closestPlayerToBall(closestPlayerA, kickOffTeam, matchDetails).then(function() {
        playerMovement.closestPlayerToBall(closestPlayerB, secondTeam, matchDetails).then(function() {
          playerMovement.decideMovement(closestPlayerA, kickOffTeam, secondTeam, matchDetails).then(function(kickOffTeam) {
            playerMovement.decideMovement(closestPlayerB, secondTeam, kickOffTeam, matchDetails).then(function(secondTeam) {
              matchDetails.kickOffTeam = kickOffTeam
              matchDetails.secondTeam = secondTeam
              resolve(matchDetails)
            }).catch(function(error) {
              console.error('Error: ', error)
            })
          }).catch(function(error) {
            console.error('Error: ', error)
          })
        }).catch(function(error) {
          console.error('Error: ', error)
        })
      }).catch(function(error) {
        console.error('Error: ', error)
      })
    }).catch(function(error) {
      console.error('Error: ', error)
    })
  })
}

function startSecondHalf(matchDetails) {
  return new Promise(function(resolve, reject) {
    validate.validateMatchDetails(matchDetails).then(function() {
      kickOffTeam = matchDetails.kickOffTeam
      secondTeam = matchDetails.secondTeam
      setPositions.switchSide(kickOffTeam, matchDetails).then(function(kickOffTeam) {
        setPositions.switchSide(secondTeam, matchDetails).then(function(secondTeam) {
          setPositions.setGoalScored(secondTeam, kickOffTeam, matchDetails).then(function() {
            matchDetails.half++
            matchDetails.kickOffTeam = kickOffTeam
            matchDetails.secondTeam = secondTeam
            resolve(matchDetails)
          })
        })
      })
    }).catch(function(error) {
      console.error('Error: ', error)
    })
  })
}

module.exports = {
  initiateGame,
  playIteration,
  startSecondHalf
}
