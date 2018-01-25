# Football Simulation Engine
---
## Overview
This module was designed to allow the simulation of football (soccer) matches between two teams. It consists of three functions that
 - Initate a match
 - complete an iteration / movement
 - switch team sides / start second half
---
## Install *(not currently)*
```npm install footballsimulationengine```

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
      "injured": false
    }...],
  "manager": "Aiden"
}
```

#### Example Pitch JSON
Pitch currently requires a width and a height as shown in the below example.
```
{
	"pitchWidth": 120,
	"pitchHeight": 600
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
Pitch currently requires a width and a height as shown in the below example.
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
   { position: [ 76, 314 ],
     withPlayer: true,
     Player: 'Joe Bloggs',
     withTeam: 'Team2',
     direction: 'south' },
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
* Get in touch with any questions [email](mailto:windymiller.aiden@gmail.com)
* See a match example [here](youtube.com)
