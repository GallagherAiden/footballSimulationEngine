const common = require('../../lib/common')
const setPos = require('../../lib/setPositions')

async function setupPenalty(iterationFile, side) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  let { kickOffTeam, secondTeam } = matchDetails
  setPos.setPenalty(kickOffTeam, secondTeam, side, matchDetails)
  return matchDetails
}

module.exports = {
  setupPenalty
}
