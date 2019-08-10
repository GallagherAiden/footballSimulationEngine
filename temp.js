const common = require('./lib/common')

main()

async function main() {
  let thisJSON = await common.readFile('./test/input/boundaryPositions/kickoffteamtoppenalty.json')
  await updatePlayers(thisJSON.kickOffTeam)
  await updatePlayers(thisJSON.secondTeam)
  console.log(JSON.stringify(thisJSON))
}

async function updatePlayers(team) {
  for (let player of team.players) {
    player.stats = {
      'goals': 0,
      'shots': {
        'total': 0,
        'on': 0,
        'off': 0
      },
      'cards': {
        'yellow': 0,
        'red': 0
      },
      'passes': {
        'total': 0,
        'on': 0,
        'off': 0
      },
      'tackles': {
        'total': 0,
        'on': 0,
        'off': 0,
        'fouls': 0
      }
    }
    delete player.cards
    delete player.goals
  }
}
