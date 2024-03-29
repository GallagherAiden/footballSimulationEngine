# Football Simulation Engine
---
## Overview
This module was designed to allow the simulation of football (soccer) matches between two teams. This module allows for an iterative football match to be played out given initial "state" of players. 

The module consists of three functions that:
 - Initiate a match
 - complete an iteration / movement
 - switch team sides / start second half

For examples of how this module can be used, see:
* [A narrated video of a match.](https://youtu.be/yxTXFrAZCdY)
* [An example Node implementation of a Football Simulator with a GUI](https://github.com/GallagherAiden/footballsimulationexample) Note: not test on latest version
* [An example Node implementation for the 2018 World Cup](https://github.com/GallagherAiden/worldcup2018simulator) Note: not test on latest version
---
## Latest Version (4.0.0)
- fixed: red cards didn't send players off the pitch correctly
- fixed: player skills incorrectly assigned for tackles and slide tackles
- fixed: corners and goal kicks not correctly assigned / calculated
- fixed: intentPOS sometimes returned as null
- fixed: second half returned kickoffTeam with the ball, now secondTeam
- new: added ability to set the width of the goal to make the game more customisable
- [Full and Past changelogs are available here.](history.md)

---
## Install
Make sure your version of Node.js is at least 7.6.0. (The 'async/await' function is used)

```npm install --save footballsimulationengine```

---
## Initiate Game
This function is a promise that expects two teams and pitch information in JSON format (JSON format is described below). The function will return match details including player start positions, match statistics, ball position and an iteration log.

#### Example Call
```
initiateGame(team1, team2, pitch).then(function(matchDetails){
  console.log(matchDetails);
}).catch(function(error){
  console.error("Error: ", error);
})
```

## Play Iteration
This function is a promise that expects a single JSON input. This input will match the output of the initiate game function and will make the next move of both teams, resolving the final position of each player.

#### Example Call
```
playIteration(matchDetails).then(function (matchDetails) {
  console.log(matchDetails);
}).catch(function(error){
  console.error("Error: ", error);
}
```
## Start Second Half (Switch Sides)
This function is a promise that switches the side of each team, as happens typically at the end of a half. This uses the output from either an initiate game or a play iteration.

#### Example Call
```
startSecondHalf(matchDetails).then(function (matchDetails) {
  console.log(matchDetails);
}).catch(function(error){
  console.error("Error: ", error);
}
```
---
## Recommendations
* Users can determine how many iterations make a half
* Test data found in `init_config` is the data used for testing
* Iteration logs give an overview of what has happened in the iteration
* Uncomment console.log(output) to receive iteration by iteration information of each players iteration action, movement, original position and final position (start POS).

## Additional Information
* Get in touch with any questions [email](mailto:aiden.g@live.co.uk)
* See a match example [here](https://youtu.be/yxTXFrAZCdY)
* Raise issues in [GitHub](https://github.com/GallagherAiden/footballSimulationEngine/issues)
---
# Examples:
Examples are baked into the file system (>v2.1.0) in the `init_config` directory:
 - `index.js` : example function usages
 - `team1.json` : example json for a primary team
 - `team2.json` : example json for a secondary team
 - `pitch.json` : example json for pitch details
 - `iteration.json` : shows what the overall output given for each iteration

#### Example Team JSON
Each team must have the following information and contain 11 players.
* A start position for each player, with both teams given start positions as if they were the team at the top of a vertical pitch (shooting to the bottom of the screen). The currentPOS object should be [widthPosition, heightPosition] where the height placement should not be a greater number than half the pitch height.
* skills should not exceed 100
* skill.jumping refers to height a player can jump in centimetres (so can and probably should be greater than 100).
```
{
  "name": "Team1",
  "players": [{
      "name": "Player",
      "position": "GK",
      "rating": "99",
      "skill": {
        "passing": "99",
        "shooting": "99",
        "tackling": "99",
        "saving": "99",
        "agility": "99",
        "strength": "99",
        "penalty_taking": "99",
        "jumping": "300"
      },
      "currentPOS": [60,0],
      "fitness": 100,
      "injured": false
    }...],
  "manager": "Aiden"
}
```

#### Example Pitch JSON
Pitch has been tested for width of 120 - 680 and height of 600 - 1050 and a goal width of 90. The below is the current provided pitch size.
```
{
	"pitchWidth": 680,
	"pitchHeight": 1050,
  goalWidth: 90
}
```

#### Example Match Details
v2.1.0 - ball movement added so that a kicked ball makes movements over time. This can be seen in 'ball.ballOverIterations'. If empty, no new ball movements will occur. Deflections may occur as players move over iterations.
```
{ kickOffTeam:
   { name: 'Team1',
     players:
      [ [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object] ],
     manager: 'Aiden'
     intent: 'defend' },
  secondTeam:
   { name: 'Team2',
     players:
      [ [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object] ],
     manager: 'Joe',
     intent: 'attack' },
  pitchSize: [ 120, 600 ],
  ball:
   { position: [ 76, 314, 0 ],
     withPlayer: true,
     Player: 'Joe Bloggs',
     withTeam: 'Team2',
     direction: 'south' },
     lastTouch: {
         playerName: 'Peter Johnson',
         playerID: 78883930303030109,
         teamID: 72464187147564590
      },
     ballOverIterations: []
  half: 1,
  kickOffTeamStatistics:
   { goals: 0,
     shots: 0,
     corners: 0,
     freekicks: 0,
     penalties: 0,
     fouls: 0 },
  secondTeamStatistics:
   { goals: 0,
     shots: 0,
     corners: 0,
     freekicks: 0,
     penalties: 0,
     fouls: 0 },
  iterationLog:
   [ 'Closest Player to ball: Aiden Gallagher',
     'Closest Player to ball: Joe Bloggs' ] }
```
#### Example Player JSON (after game initiated):
Any and all player objects may be altered between iterations. Including the relative position, origin position and action.
Action should be - 'null' if the simulation is to be run normally. This can be overriden with any of the following actions:
'shoot', 'throughBall', 'pass', 'cross', 'tackle', 'intercept', 'slide', 'run', 'sprint', 'cleared', 'boot'. The player must have the ball in order to complete ball specific actions like 'shoot'. Any invalid actions will result in the simulation running as normal.
```
{ name: 'Louise Johnson',
    position: 'ST',
    rating: '88',
    skill:
     { passing: '20',
       shooting: '20',
       tackling: '20',
       saving: '20',
       agility: '20',
       strength: '20',
       penalty_taking: '20',
       jumping: '280' },
    currentPOS: [ 60, 300 ],
    fitness: 100,
    injured: false,
    originPOS: [ 70, 270 ],
    intentPOS: [ 70, 270 ],
    action: 'none',
    offside: false,
    cards: {
      yellow: 0,
      red: 0
    }
    hasBall: true }
```
---