const common = require('../../lib/common')

let inputIteration = 'looseBall3'

runUpdate(inputIteration)

async function runUpdate(inputIteration) {
  let inputJson = await common.readFile('./test/input/boundaryPositions/' + inputIteration + '.json')
  inputJson.matchID = "78883930303030001"
  inputJson.kickOffTeam.teamID = "78883930303030002"
  inputJson.secondTeam.teamID = "78883930303030003"
  if(inputJson.ball.withTeam == inputJson.kickOffTeam.name) inputJson.ball.withTeam = "78883930303030002"
  if(inputJson.ball.withTeam == inputJson.secondTeam.name) inputJson.ball.withTeam = "78883930303030003"

  inputJson.kickOffTeam.players[0].playerID = "78883930303030100"
  inputJson.kickOffTeam.players[1].playerID = "78883930303030101"
  inputJson.kickOffTeam.players[2].playerID = "78883930303030102"
  inputJson.kickOffTeam.players[3].playerID = "78883930303030103"
  inputJson.kickOffTeam.players[4].playerID = "78883930303030104"
  inputJson.kickOffTeam.players[5].playerID = "78883930303030105"
  inputJson.kickOffTeam.players[6].playerID = "78883930303030106"
  inputJson.kickOffTeam.players[7].playerID = "78883930303030107"
  inputJson.kickOffTeam.players[8].playerID = "78883930303030108"
  inputJson.kickOffTeam.players[9].playerID = "78883930303030109"
  inputJson.kickOffTeam.players[10].playerID = "78883930303030110"

  inputJson.secondTeam.players[0].playerID = "78883930303030200"
  inputJson.secondTeam.players[1].playerID = "78883930303030201"
  inputJson.secondTeam.players[2].playerID = "78883930303030202"
  inputJson.secondTeam.players[3].playerID = "78883930303030203"
  inputJson.secondTeam.players[4].playerID = "78883930303030204"
  inputJson.secondTeam.players[5].playerID = "78883930303030205"
  inputJson.secondTeam.players[6].playerID = "78883930303030206"
  inputJson.secondTeam.players[7].playerID = "78883930303030207"
  inputJson.secondTeam.players[8].playerID = "78883930303030208"
  inputJson.secondTeam.players[9].playerID = "78883930303030209"
  inputJson.secondTeam.players[10].playerID = "78883930303030210"

  if(inputJson.ball.Player == inputJson.kickOffTeam.players[0].name) inputJson.ball.Player = inputJson.kickOffTeam.players[0].playerID
  if(inputJson.ball.Player == inputJson.kickOffTeam.players[1].name) inputJson.ball.Player = inputJson.kickOffTeam.players[1].playerID
  if(inputJson.ball.Player == inputJson.kickOffTeam.players[2].name) inputJson.ball.Player = inputJson.kickOffTeam.players[2].playerID
  if(inputJson.ball.Player == inputJson.kickOffTeam.players[3].name) inputJson.ball.Player = inputJson.kickOffTeam.players[3].playerID
  if(inputJson.ball.Player == inputJson.kickOffTeam.players[4].name) inputJson.ball.Player = inputJson.kickOffTeam.players[4].playerID
  if(inputJson.ball.Player == inputJson.kickOffTeam.players[5].name) inputJson.ball.Player = inputJson.kickOffTeam.players[5].playerID
  if(inputJson.ball.Player == inputJson.kickOffTeam.players[6].name) inputJson.ball.Player = inputJson.kickOffTeam.players[6].playerID
  if(inputJson.ball.Player == inputJson.kickOffTeam.players[7].name) inputJson.ball.Player = inputJson.kickOffTeam.players[7].playerID
  if(inputJson.ball.Player == inputJson.kickOffTeam.players[8].name) inputJson.ball.Player = inputJson.kickOffTeam.players[8].playerID
  if(inputJson.ball.Player == inputJson.kickOffTeam.players[9].name) inputJson.ball.Player = inputJson.kickOffTeam.players[9].playerID
  if(inputJson.ball.Player == inputJson.kickOffTeam.players[10].name) inputJson.ball.Player = inputJson.kickOffTeam.players[10].playerID

  if(inputJson.ball.Player == inputJson.secondTeam.players[0].name) inputJson.ball.Player = inputJson.secondTeam.players[0].playerID
  if(inputJson.ball.Player == inputJson.secondTeam.players[1].name) inputJson.ball.Player = inputJson.secondTeam.players[1].playerID
  if(inputJson.ball.Player == inputJson.secondTeam.players[2].name) inputJson.ball.Player = inputJson.secondTeam.players[2].playerID
  if(inputJson.ball.Player == inputJson.secondTeam.players[3].name) inputJson.ball.Player = inputJson.secondTeam.players[3].playerID
  if(inputJson.ball.Player == inputJson.secondTeam.players[4].name) inputJson.ball.Player = inputJson.secondTeam.players[4].playerID
  if(inputJson.ball.Player == inputJson.secondTeam.players[5].name) inputJson.ball.Player = inputJson.secondTeam.players[5].playerID
  if(inputJson.ball.Player == inputJson.secondTeam.players[6].name) inputJson.ball.Player = inputJson.secondTeam.players[6].playerID
  if(inputJson.ball.Player == inputJson.secondTeam.players[7].name) inputJson.ball.Player = inputJson.secondTeam.players[7].playerID
  if(inputJson.ball.Player == inputJson.secondTeam.players[8].name) inputJson.ball.Player = inputJson.secondTeam.players[8].playerID
  if(inputJson.ball.Player == inputJson.secondTeam.players[9].name) inputJson.ball.Player = inputJson.secondTeam.players[9].playerID
  if(inputJson.ball.Player == inputJson.secondTeam.players[10].name) inputJson.ball.Player = inputJson.secondTeam.players[10].playerID

  console.log(JSON.stringify(inputJson))
}
