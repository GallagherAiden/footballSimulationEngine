const common = require('../../lib/common')
const setFreekick = require('../../lib/setFreekicks')

async function setTopFreekick(iterationFile, ballPosition) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  matchDetails.ball.position = ballPosition.map(x => x)
  return setFreekick.setTopFreekick(matchDetails)
}
async function setBottomFreekick(iterationFile, ballPosition) {
  let matchDetails = await common.readFile(iterationFile)
    .catch(function(err) {
      throw err.stack
    })
  matchDetails.ball.position = ballPosition.map(x => x)
  return setFreekick.setBottomFreekick(matchDetails)
}

module.exports = {
  setTopFreekick,
  setBottomFreekick
}
