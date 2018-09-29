const setVariables = require('../../lib/setVariables')
const common = require('../../lib/common')

async function setTeam(teamLocation) {
  let team = await common.readFile(teamLocation)
    .catch(function(err) {
      throw err.stack
    })
  let teamReady = setVariables.setGameVariables(team)
  return teamReady
}

module.exports = {
  setTeam
}
