# Football Simulation Engine
---
## Overview
This module was designed to allow the simulation of football (soccer) matches between two teams. It consists of three functions that
 - Initiate a match
 - complete an iteration / movement
 - switch team sides / start second half
---
## Latest Version
- Added to allow more tackles and fouls
- Added fitness measure (currently has no affect on the game - see later versions)
---
## Install
Make sure your version of Node.js is at least 7.6.0.

```npm install --save footballsimulationengine```

---
## Initiate Game
This function is a promise that expects two teams and pitch information in JSON format. The function will return match details including player start positions, match statistics, ball position and an iteration log.

#### Example Call
```
initiateGame(team1, team2, pitch).then(function(matchDetails){
  console.log(matchDetails);
}).catch(function(error){
  console.error("Error: ", error);
})
```
#### Example Team JSON
Teams must have the following information and must have 11 players included in it.
* A start position for each player, with both teams given start positions as if they were the team at the top of a vertical pitch (shooting to the bottom of the screen). The startPOS object should be [widthPosition, heightPosition] where the height placement should not be a greater number than half the pitch height.
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
      "startPOS": [60,0],
      "fitness": 100,
      "injured": false
    }...],
  "manager": "Aiden"
}
```

#### Example Pitch JSON
Pitch currently requires a width and a height as shown in the below example.
```
{
	"pitchWidth": 300,
	"pitchHeight": 450
}
```
---
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
Example Player JSON:
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
    startPOS: [ 60, 300 ],
    fitness: 100,
    injured: false,
    originPOS: [ 70, 270 ],
    relativePOS: [ 70, 270 ],
    action: 'none',
    hasBall: true }
```
---
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
* Iteration Logs give an overview of what has happened in the iteration
* Uncomment console.log(output) to receive iteration by iteration information of each players iteration action, movement, original position and final position (start POS).

## Additional Information
* Get in touch with any questions [email](mailto:aiden.g@live.co.uk)
* See a match example [here](https://youtu.be/yxTXFrAZCdY)
