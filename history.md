# History of footballSimulationEngine

## Version 3.0.1
- added new test scripts
- code fixes for assigning actions
- code fixes for determining offside
- code fixes for setting positions 
- code fixes for when ball moving

## Version 3.0.0
- altered 'startPOS' to 'currentPOS' to better reflect what the variable is used for
- altered 'relativePOS' to 'intentPOS' to better reflect what what the variable is used for
- added 100+ test cases
- cleaned 'setPositions.js' and created/cleaned 'setFreekicks.js' to improve readability and reduce duplication
- improvement to corners by putting players in the box
- players with red cards are removed from the pitch
- penalty taking improvements
- skills used more intensively i.e. shooting can be both on/off target determined by skill
- add player specific stats including tackles, passes, shots, saves and goals
---
## Version 2.2.0
- fix closestPlayer Report
- enhance test cases
- keep ball with player when they run or sprint
- improve run/sprint direction
- improve passing
- improve Error reporting
- track shot over time
- add saving
- add simple player marking
- add test simulation data
---
## Version 2.1.2
- security fix for https://nvd.nist.gov/vuln/detail/CVE-2018-16487
- limit ability for players to become 'stuck'
- checks to reduce occurances of players.hasBall = true when the ball is not with the player
---
## Version 2.1.0
- Added to allow more tackles and fouls
- Added fitness measure (currently has no affect on the game - see later versions)
- Remove promises from the internal functions (still required for three main functions as above)
- Includes a test suite (still in development)
- Improvements to ball movement to give movement over time instead of a 'jump'
- refactoring to improve source code readability
- Removed dependency on async function
- Resolved error where players leave pitch
- Provided setup data - e.g. a pitch JSON and two team JSONs for easier setup
- Allow interception of the ball whilst in transit
- Included ability to set a players action for each iteration to enforce a specific move
- Added Offside logic
---
## Version 1.x
- initial creation of the FSE node module
