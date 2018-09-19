//------------------------
//    NPM Modules
//------------------------
const common = require('./lib/common')
const setPositions = require('./lib/setPositions')
const setVariables = require('./lib/setVariables')
const playerMovement = require('./lib/playerMovement')
const ballMovement = require('./lib/ballMovement')
const validate = require('./lib/validate')

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
                      reject(error)
                    })
                  }).catch(function(error) {
                    reject(error)
                  })
                }).catch(function(error) {
                  reject(error)
                })
              }).catch(function(error) {
                reject(error)
              })
            }).catch(function(error) {
              reject(error)
            })
          }).catch(function(error) {
            reject(error)
          })
        }).catch(function(error) {
          reject(error)
        })
      }).catch(function(error) {
        reject(error)
      })
    }).catch(function(error) {
      reject(error)
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
      let { kickOffTeam, secondTeam } = matchDetails
      common.matchInjury(matchDetails, kickOffTeam)
      common.matchInjury(matchDetails, secondTeam)
      playerMovement.closestPlayerToBall(closestPlayerA, kickOffTeam, matchDetails).then(function() {
        playerMovement.closestPlayerToBall(closestPlayerB, secondTeam, matchDetails).then(function() {
          ballMovement.moveBall(matchDetails).then(function(matchDetails) {
            playerMovement.decideMovement(closestPlayerA, kickOffTeam, secondTeam, matchDetails)
              .then(function(kickOffTeam) {
                playerMovement.decideMovement(closestPlayerB, secondTeam, kickOffTeam, matchDetails)
                  .then(function(secondTeam) {
                    matchDetails.kickOffTeam = kickOffTeam
                    matchDetails.secondTeam = secondTeam
                    if (matchDetails.ball.ballOverIterations.length == 0 || matchDetails.ball.withTeam != '') {
                      playerMovement.checkOffside(kickOffTeam, secondTeam, matchDetails).then(function() {
                        resolve(matchDetails)
                      }).catch(function(error) {
                        reject(error)
                      })
                    } else {
                      resolve(matchDetails)
                    }
                    // console.log(matchDetails)
                  }).catch(function(error) {
                    reject(error)
                  })
              }).catch(function(error) {
                reject(error)
              })
          }).catch(function(error) {
            reject(error)
          })
        }).catch(function(error) {
          reject(error)
        })
      }).catch(function(error) {
        reject(error)
      })
    }).catch(function(error) {
      reject(error)
    })
  })
}

function startSecondHalf(matchDetails) {
  return new Promise(function(resolve, reject) {
    validate.validateMatchDetails(matchDetails).then(function() {
      let { kickOffTeam, secondTeam } = matchDetails
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
      reject(error)
    })
  })
}

module.exports = {
  initiateGame,
  playIteration,
  startSecondHalf
}
