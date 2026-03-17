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
## Version 5.0.0
- new: added player height to the game and made jumping additional height reached
- new: added player skill perception
- new: added handball
- new: improved z-axis for gravity over time and friction
- new: state which part of the body was hit during deflection and normal play
- updated: scaled ball power, gravity and roll on grass. All ball movement now linked to kick power
- new: linked kick power to player strength and scaled to pitchHeight
- updated: separated player movement decisions from ball actions to prevent multiple players interacting with the ball in the same iteration
- new: added logic to ensure only one player can execute a ball action per iteration
- updated: ball actions are now blocked while the ball is already travelling (ballOverIterations)
- updated: improved possession handling so ball ownership is cleared correctly after kicks
- updated: refactored iteration flow to process:
   - ball movement
   - player movement
   - single ball interaction
- updated: improved penalty setup to guarantee the taker is on the pitch and correctly assigned the ball
- fixed: players could attempt ball actions while the ball was already in flight
- fixed: multiple ball kicks could be triggered in the same iteration
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
      "name": "Bill Johnson",
      "position": "GK",
      "rating": "75",
      "skill": {
        "passing": "20",
        "shooting": "12",
        "tackling": "20",
        "saving": "20",
        "agility": "20",
        "strength": "20",
        "penalty_taking": "43",
        "perception": "75",
        "jumping": "30",
        "control": "60"
      },
      "currentPOS": [
        340,
        0
      ],
      "fitness": 100,
      "height": 200,
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
  ball: {
      position: [
         340,
         525,
         0
      ],
      withPlayer: true,
      Player: 78883930303030109,
      withTeam: 78883930303030002,
      direction: south,
      lastTouch: {
         playerName: Peter Johnson,
         playerID: 78883930303030109,
         teamID: 72464187147564590,
         bodyPart: shin,
         deflection: true,
         iterations: null
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
{
  playerID: 78883930303030210,
  name: Aiden Smith,
  position: ST,
  rating: 88,
  skill: {
     passing: 73,
     shooting: 61,
     tackling: 44,
     saving: 10,
     agility: 43,
     strength: 88,
     penalty_taking: 77,
     perception: 75,
     jumping: 52,
     control: 60
  },
  currentPOS: [440,550],
  fitness: 100,
  height: 175,
  injured: false,
  originPOS: [440,550],
  intentPOS: [440,550],
  action: none,
  offside: false,
  hasBall: false,
  stats: {
     goals: 0,
     shots: {
        total: 0,
        on: 0,
        off: 0
     },
     cards: {
        yellow: 0,
        red: 0
     },
     passes: {
        total: 0,
        on: 0,
        off: 0
    },
     tackles: {
        total: 0,
        on: 0,
        off: 0,
        fouls: 0
   }
  }
}
```
---