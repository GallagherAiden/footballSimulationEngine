/* eslint-disable no-unused-vars */
/*eslint-disable max-len*/
const mocha = require('mocha')
const { expect } = require('chai')
const actions = require('../lib/actions')
const common = require('../lib/common')

function runTest() {
  mocha.describe('testPositionInTopBox()', function() {
    mocha.it('Inside Top Box Test', async() => {
      let inPosition = actions.checkPositionInTopPenaltyBox([330, 10], 680, 1050)
      expect(inPosition).to.be.eql(true)
      inPosition = actions.checkPositionInTopPenaltyBox([300, 100], 680, 1050)
      expect(inPosition).to.be.eql(true)
    })
    mocha.it('Outside Top Box Left', async() => {
      let inPosition = actions.checkPositionInTopPenaltyBox([10, 10], 680, 1050)
      expect(inPosition).to.be.eql(false)
    })
    mocha.it('Outside Top Box Right', async() => {
      let inPosition = actions.checkPositionInTopPenaltyBox([660, 100], 680, 1050)
      expect(inPosition).to.be.eql(false)
    })
    mocha.it('Outside Top Box Below', async() => {
      let inPosition = actions.checkPositionInTopPenaltyBox([300, 1000], 680, 1050)
      expect(inPosition).to.be.eql(false)
    })
  })
  mocha.describe('testPositionInTopClose()', function() {
    mocha.it('Inside Top Box Close Test', async() => {
      let inPosition = actions.checkPositionInTopPenaltyBoxClose([330, 10], 680, 1050)
      expect(inPosition).to.be.eql(true)
      inPosition = actions.checkPositionInTopPenaltyBoxClose([300, 50], 680, 1050)
      expect(inPosition).to.be.eql(true)
    })
    mocha.it('Outside Top Box Close Left', async() => {
      let inPosition = actions.checkPositionInTopPenaltyBoxClose([10, 10], 680, 1050)
      expect(inPosition).to.be.eql(false)
    })
    mocha.it('Outside Top Box Close Right', async() => {
      let inPosition = actions.checkPositionInTopPenaltyBoxClose([660, 100], 680, 1050)
      expect(inPosition).to.be.eql(false)
    })
    mocha.it('Outside Top Box Close Below', async() => {
      let inPosition = actions.checkPositionInTopPenaltyBoxClose([300, 1000], 680, 1050)
      expect(inPosition).to.be.eql(false)
    })
  })
  mocha.describe('testPositionInBottomBox()', function() {
    mocha.it('Inside Bottom Box Close Test', async() => {
      let inPosition = actions.checkPositionInBottomPenaltyBox([345, 1010], 680, 1050)
      expect(inPosition).to.be.eql(true)
      inPosition = actions.checkPositionInBottomPenaltyBox([295, 975], 680, 1050)
      expect(inPosition).to.be.eql(true)
    })
    mocha.it('Inside Bottom Box Close Left', async() => {
      let inPosition = actions.checkPositionInBottomPenaltyBox([1, 1010], 680, 1050)
      expect(inPosition).to.be.eql(false)
    })
    mocha.it('Inside Bottom Box Close Right', async() => {
      let inPosition = actions.checkPositionInBottomPenaltyBox([677, 1040], 680, 1050)
      expect(inPosition).to.be.eql(false)
    })
    mocha.it('Inside Bottom Box Close Above', async() => {
      let inPosition = actions.checkPositionInBottomPenaltyBox([677, 500], 680, 1050)
      expect(inPosition).to.be.eql(false)
    })
  })
  mocha.describe('testPositionInBottomBoxClose()', function() {
    mocha.it('Inside Bottom Box Test', async() => {
      let inPosition = actions.checkPositionInBottomPenaltyBoxClose([345, 1010], 680, 1050)
      expect(inPosition).to.be.eql(true)
      inPosition = actions.checkPositionInBottomPenaltyBoxClose([295, 975], 680, 1050)
      expect(inPosition).to.be.eql(true)
    })
    mocha.it('Inside Bottom Box Left', async() => {
      let inPosition = actions.checkPositionInBottomPenaltyBoxClose([1, 1010], 680, 1050)
      expect(inPosition).to.be.eql(false)
    })
    mocha.it('Inside Bottom Box Right', async() => {
      let inPosition = actions.checkPositionInBottomPenaltyBoxClose([677, 1040], 680, 1050)
      expect(inPosition).to.be.eql(false)
    })
    mocha.it('Inside Bottom Box Above', async() => {
      let inPosition = actions.checkPositionInBottomPenaltyBoxClose([677, 500], 680, 1050)
      expect(inPosition).to.be.eql(false)
    })
  })
  mocha.describe('noBallNotGK2CloseBallBottomTeam()', function() {
    mocha.it('Nobody has the ball, not GK, in bottom Goal (own), run or sprint towards the ball', async() => {
      let matchDetails = { 'ball': { 'withPlayer': false } }
      let parameters = actions.noBallNotGK2CloseBallBottomTeam(matchDetails, [320, 1000], 680, 1050)
      expect(parameters).to.be.eql([0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0])
    })
    mocha.it('A Player has the ball, not GK, in bottom Goal (own), tackle, slide, run or sprint', async() => {
      let matchDetails = { 'ball': { 'withPlayer': true } }
      let parameters = actions.noBallNotGK2CloseBallBottomTeam(matchDetails, [320, 1000], 680, 1050)
      expect(parameters).to.be.eql([0, 0, 0, 0, 50, 0, 10, 20, 20, 0, 0])
    })
    mocha.it('A Player has the ball, not GK, not in bottom Goal (own), run or sprint towards the ball', async() => {
      let matchDetails = { 'ball': { 'withPlayer': false } }
      let parameters = actions.noBallNotGK2CloseBallBottomTeam(matchDetails, [15, 500], 680, 1050)
      expect(parameters).to.be.eql([0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0])
    })
    mocha.it('A Player has the ball, not GK, not in bottom Goal (own), tackle, intercept and slide', async() => {
      let matchDetails = { 'ball': { 'withPlayer': true } }
      let parameters = actions.noBallNotGK2CloseBallBottomTeam(matchDetails, [604, 485], 680, 1050)
      expect(parameters).to.be.eql([0, 0, 0, 0, 70, 10, 20, 0, 0, 0, 0])
    })
  })
  mocha.describe('noBallNotGK4CloseBallBottomTeam()', function() {
    mocha.it('Nobody has the ball, not GK, in bottom Goal (own), run or sprint towards the ball', async() => {
      let matchDetails = { 'ball': { 'withPlayer': false } }
      let parameters = actions.noBallNotGK4CloseBallBottomTeam(matchDetails, [320, 1000], 680, 1050)
      expect(parameters).to.be.eql([0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0])
    })
    mocha.it('A Player has the ball, not GK, in bottom Goal (own), tackle, slide, run or sprint', async() => {
      let matchDetails = { 'ball': { 'withPlayer': true } }
      let parameters = actions.noBallNotGK4CloseBallBottomTeam(matchDetails, [320, 1000], 680, 1050)
      expect(parameters).to.be.eql([0, 0, 0, 0, 40, 0, 20, 10, 30, 0, 0])
    })
    mocha.it('A Player has the ball, not GK, not in bottom Goal (own), run or sprint towards the ball', async() => {
      let matchDetails = { 'ball': { 'withPlayer': false } }
      let parameters = actions.noBallNotGK4CloseBallBottomTeam(matchDetails, [15, 500], 680, 1050)
      expect(parameters).to.be.eql([0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0])
    })
    mocha.it('A Player has the ball, not GK, not in bottom Goal (own), tackle slide', async() => {
      let matchDetails = { 'ball': { 'withPlayer': true } }
      let parameters = actions.noBallNotGK4CloseBallBottomTeam(matchDetails, [604, 485], 680, 1050)
      expect(parameters).to.be.eql([0, 0, 0, 0, 50, 0, 50, 0, 0, 0, 0])
    })
  })
  mocha.describe('noBallNotGK2CloseBall()', function() {
    mocha.it('Nobody has the ball, not GK, in top Goal (own), run or sprint towards the ball', async() => {
      let matchDetails = { 'ball': { 'withPlayer': false } }
      let parameters = actions.noBallNotGK2CloseBall(matchDetails, [320, 15], [320, 5], 680, 1050)
      expect(parameters).to.be.eql([0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0])
    })
    mocha.it('Player has the ball, not GK, in top Goal (own), tackle, slide, run or sprint', async() => {
      let matchDetails = { 'ball': { 'withPlayer': true } }
      let parameters = actions.noBallNotGK2CloseBall(matchDetails, [320, 15], [320, 5], 680, 1050)
      expect(parameters).to.be.eql([0, 0, 0, 0, 40, 0, 20, 10, 30, 0, 0])
    })
    mocha.it('Player has the ball, not GK, in top Goal (not own), tackle, intercept and slide', async() => {
      let matchDetails = { 'ball': { 'withPlayer': true } }
      let parameters = actions.noBallNotGK2CloseBall(matchDetails, [320, 15], [320, 805], 680, 1050)
      expect(parameters).to.be.eql([0, 0, 0, 0, 70, 10, 20, 0, 0, 0, 0])
    })
    mocha.it('Nobody has the ball, not GK, not in top Goal (own), run or sprint towards the ball', async() => {
      let matchDetails = { 'ball': { 'withPlayer': false } }
      let parameters = actions.noBallNotGK2CloseBall(matchDetails, [320, 300], [320, 5], 680, 1050)
      expect(parameters).to.be.eql([0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0])
    })
    mocha.it('Player has the ball, not GK, not in top Goal (own), tackle, intercept and slide', async() => {
      let matchDetails = { 'ball': { 'withPlayer': true } }
      let parameters = actions.noBallNotGK2CloseBall(matchDetails, [320, 300], [320, 5], 680, 1050)
      expect(parameters).to.be.eql([0, 0, 0, 0, 70, 10, 20, 0, 0, 0, 0])
    })
  })
  mocha.describe('noBallNotGK4CloseBall()', function() {
    mocha.it('Nobody has the ball, not GK, in top Goal (own), run or sprint towards the ball', async() => {
      let matchDetails = { 'ball': { 'withPlayer': false } }
      let parameters = actions.noBallNotGK4CloseBall(matchDetails, [320, 15], [320, 5], 680, 1050)
      expect(parameters).to.be.eql([0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0])
    })
    mocha.it('Player has the ball, not GK, in top Goal (own), tackle, slide, run or sprint', async() => {
      let matchDetails = { 'ball': { 'withPlayer': true } }
      let parameters = actions.noBallNotGK4CloseBall(matchDetails, [320, 15], [320, 5], 680, 1050)
      expect(parameters).to.be.eql([0, 0, 0, 0, 40, 0, 20, 10, 30, 0, 0])
    })
    mocha.it('Player has the ball, not GK, in top Goal (not own), tackle slide', async() => {
      let matchDetails = { 'ball': { 'withPlayer': true } }
      let parameters = actions.noBallNotGK4CloseBall(matchDetails, [320, 15], [320, 805], 680, 1050)
      expect(parameters).to.be.eql([0, 0, 0, 0, 50, 0, 50, 0, 0, 0, 0])
    })
    mocha.it('Nobody has the ball, not GK, not in top Goal (own), run or sprint towards the ball', async() => {
      let matchDetails = { 'ball': { 'withPlayer': false } }
      let parameters = actions.noBallNotGK4CloseBall(matchDetails, [320, 300], [320, 5], 680, 1050)
      expect(parameters).to.be.eql([0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0])
    })
    mocha.it('Player has the ball, not GK, not in top Goal (own), tackle slide', async() => {
      let matchDetails = { 'ball': { 'withPlayer': true } }
      let parameters = actions.noBallNotGK4CloseBall(matchDetails, [320, 300], [320, 5], 680, 1050)
      expect(parameters).to.be.eql([0, 0, 0, 0, 50, 0, 50, 0, 0, 0, 0])
    })
  })
  mocha.describe('playerDoesNotHaveBall()', function() {
    mocha.it('Goalkeeper - run, sprint', async() => {
      let player = { 'position': 'GK', 'currentPOS': [320, 15], 'originPOS': [320, 5] }
      let matchDetails = { 'pitchSize': [680, 1050], 'ball': { 'withPlayer': false } }
      let parameters = actions.playerDoesNotHaveBall(player, 0, 1, matchDetails)
      expect(parameters).to.be.eql([0, 0, 0, 0, 0, 0, 0, 60, 40, 0, 0])
    })
    mocha.it('Defender - within 2', async() => {
      let player = { 'position': 'LB', 'currentPOS': [320, 15], 'originPOS': [320, 5] }
      let matchDetails = { 'pitchSize': [680, 1050], 'ball': { 'withPlayer': false } }
      let parameters = actions.playerDoesNotHaveBall(player, 0, 1, matchDetails)
      expect(parameters).to.be.eql([0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0])
    })
    mocha.it('Midfielder - within 4', async() => {
      let player = { 'position': 'CM', 'currentPOS': [320, 15], 'originPOS': [320, 5] }
      let matchDetails = { 'pitchSize': [680, 1050], 'ball': { 'withPlayer': false } }
      let parameters = actions.playerDoesNotHaveBall(player, 3, 3, matchDetails)
      expect(parameters).to.be.eql([0, 0, 0, 0, 0, 0, 0, 20, 80, 0, 0])
    })
    mocha.it('Midfielder - within 20 - No Player has ball - run sprint', async() => {
      let player = { 'position': 'CM', 'currentPOS': [320, 15], 'originPOS': [320, 5] }
      let matchDetails = { 'pitchSize': [680, 1050], 'ball': { 'withPlayer': false } }
      let parameters = actions.playerDoesNotHaveBall(player, 15, 12, matchDetails)
      expect(parameters).to.be.eql([0, 0, 0, 0, 0, 0, 0, 60, 40, 0, 0])
    })
    mocha.it('Midfielder - within 20 - No Player has ball - intercept run sprint', async() => {
      let player = { 'position': 'CM', 'currentPOS': [320, 15], 'originPOS': [320, 5] }
      let matchDetails = { 'pitchSize': [680, 1050], 'ball': { 'withPlayer': true } }
      let parameters = actions.playerDoesNotHaveBall(player, 15, 12, matchDetails)
      expect(parameters).to.be.eql([0, 0, 0, 0, 0, 40, 0, 30, 30, 0, 0])
    })
    mocha.it('Striker - over 20 - No Player has ball - intercept run sprint', async() => {
      let player = { 'position': 'ST', 'currentPOS': [320, 15], 'originPOS': [320, 5] }
      let matchDetails = { 'pitchSize': [680, 1050], 'ball': { 'withPlayer': true } }
      let parameters = actions.playerDoesNotHaveBall(player, 105, 88, matchDetails)
      expect(parameters).to.be.eql([0, 0, 0, 0, 0, 10, 0, 50, 30, 0, 0])
    })
  })
  mocha.describe('onTopCornerBoundary()', function() {
    mocha.it('Is on top left corner boundary', async() => {
      let isOnBoundary = actions.onTopCornerBoundary([0, 0], 680)
      expect(isOnBoundary).to.be.eql(true)
    })
    mocha.it('Is on top right corner boundary', async() => {
      let isOnBoundary = actions.onTopCornerBoundary([680, 0], 680)
      expect(isOnBoundary).to.be.eql(true)
    })
    mocha.it('Is not on any top corner boundary', async() => {
      let isOnBoundary = actions.onTopCornerBoundary([4, 680], 680)
      expect(isOnBoundary).to.be.eql(false)
      isOnBoundary = actions.onTopCornerBoundary([0, 600], 680)
      expect(isOnBoundary).to.be.eql(false)
      isOnBoundary = actions.onTopCornerBoundary([100, 600], 680)
      expect(isOnBoundary).to.be.eql(false)
    })
  })
  mocha.describe('onBottomCornerBoundary()', function() {
    mocha.it('Is on bottom left corner boundary', async() => {
      let isOnBoundary = actions.onBottomCornerBoundary([0, 1050], 680, 1050)
      expect(isOnBoundary).to.be.eql(true)
    })
    mocha.it('Is on bottom right corner boundary', async() => {
      let isOnBoundary = actions.onBottomCornerBoundary([680, 1050], 680, 1050)
      expect(isOnBoundary).to.be.eql(true)
    })
    mocha.it('Is not on any bottom corner boundary', async() => {
      let isOnBoundary = actions.onBottomCornerBoundary([4, 680], 680, 1050)
      expect(isOnBoundary).to.be.eql(false)
      isOnBoundary = actions.onBottomCornerBoundary([0, 600], 680, 1050)
      expect(isOnBoundary).to.be.eql(false)
      isOnBoundary = actions.onBottomCornerBoundary([100, 600], 680, 1050)
      expect(isOnBoundary).to.be.eql(false)
    })
  })
  mocha.describe('checkOppositionAhead()', function() {
    mocha.it('Opposition is in front left of player', async() => {
      let ahead = actions.checkOppositionAhead([335, 5], [337, 8])
      expect(ahead).to.be.eql(true)
    })
    mocha.it('Opposition is in front right of player', async() => {
      let ahead = actions.checkOppositionAhead([340, 5], [337, 8])
      expect(ahead).to.be.eql(true)
    })
    mocha.it('Opposition is not in front', async() => {
      let ahead = actions.checkOppositionAhead([337, 680], [337, 8])
      expect(ahead).to.be.eql(false)
      ahead = actions.checkOppositionAhead([330, 8], [337, 8])
      expect(ahead).to.be.eql(false)
      ahead = actions.checkOppositionAhead([342, 1], [337, 8])
      expect(ahead).to.be.eql(false)
    })
  })
  mocha.describe('checkOppositionBelow()', function() {
    mocha.it('Opposition is in front left of player', async() => {
      let ahead = actions.checkOppositionBelow([335, 12], [337, 8])
      expect(ahead).to.be.eql(true)
    })
    mocha.it('Opposition is in front right of player', async() => {
      let ahead = actions.checkOppositionBelow([340, 12], [337, 8])
      expect(ahead).to.be.eql(true)
    })
    mocha.it('Opposition is not in front', async() => {
      let ahead = actions.checkOppositionBelow([337, 3], [337, 608])
      expect(ahead).to.be.eql(false)
      ahead = actions.checkOppositionBelow([330, 8], [337, 608])
      expect(ahead).to.be.eql(false)
      ahead = actions.checkOppositionBelow([342, 1], [337, 608])
      expect(ahead).to.be.eql(false)
    })
  })
  mocha.describe('checkTeamMateProximity()', function() {
    mocha.it('Team mate is in proximity 1 - true', async() => {
      let close = actions.checkTeamMateSpaceClose([1, 1], -3, 3, -5, 5)
      expect(close).to.be.eql(true)
    })
    mocha.it('Team mate is in proximity 2 - true', async() => {
      let close = actions.checkTeamMateSpaceClose([-3, 3], -4, 4, -5, 5)
      expect(close).to.be.eql(true)
    })
    mocha.it('Team mate is in proximity 3 - false', async() => {
      let close = actions.checkTeamMateSpaceClose([-8, 1], -7, 3, -5, 5)
      expect(close).to.be.eql(false)
    })
    mocha.it('Team mate is in proximity 4 - false', async() => {
      let close = actions.checkTeamMateSpaceClose([1, 11], -10, 10, -10, 10)
      expect(close).to.be.eql(false)
    })
  })
  mocha.describe('checkPlayerIsDistanceFromPosition()', function() {
    mocha.it('Player Within Space X&Y', async() => {
      let playerInformation = { 'proxPOS': [7, 9] }
      let close = actions.oppositionNearPlayer(playerInformation, 10, 10)
      expect(close).to.be.eql(true)
    })
    mocha.it('Player Within Space X&Y - decimals', async() => {
      let playerInformation = { 'proxPOS': [7.8984, 9.666666667] }
      let close = actions.oppositionNearPlayer(playerInformation, 10, 10)
      expect(close).to.be.eql(true)
    })
    mocha.it('Player Within Space X, notY', async() => {
      let playerInformation = { 'proxPOS': [7, 12] }
      let close = actions.oppositionNearPlayer(playerInformation, 10, 10)
      expect(close).to.be.eql(false)
    })
    mocha.it('Player not within Space X, is for Y', async() => {
      let playerInformation = { 'proxPOS': [13.11, 4] }
      let close = actions.oppositionNearPlayer(playerInformation, 10, 10)
      expect(close).to.be.eql(false)
    })
    mocha.it('Player not within Space XY', async() => {
      let playerInformation = { 'proxPOS': [30.23, 30.23] }
      let close = actions.oppositionNearPlayer(playerInformation, 30, 30)
      expect(close).to.be.eql(false)
    })
  })
  mocha.describe('bottomTeamPlayerHasBallInTopPenaltyBox()', function() {
    mocha.it('Top Box Close, not within space of goal, no opposition, no team mate, half/shooting skill from goal', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      let parameters = actions.bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([60, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0])
    })
    mocha.it('Top Box Close, not within space of goal, no opposition, no team mate, 0/half skill from goal', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.currentPOS[1] = 23
      matchDetails.ball.position[1] = 23
      let parameters = actions.bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    })
    mocha.it('In Top Box Close, No opposition ahead, no close team mate, further than shooting skill distance from goal', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.skill.shooting = 3
      let parameters = actions.bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([30, 0, 0, 0, 0, 0, 0, 40, 30, 0, 0])
    })
    mocha.it('In Top Box Not close, No opposition ahead, no close team mate, further than shooting skill distance from goal', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.currentPOS[1] = 105
      matchDetails.ball.position = 105
      player.skill.shooting = 3
      let parameters = actions.bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([50, 0, 20, 20, 0, 0, 0, 10, 0, 0, 0])
    })
    mocha.it('In Top Box Not close, No opposition ahead, no close team mate, within shooting skill distance from goal', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.currentPOS[1] = 105
      matchDetails.ball.position = 105
      player.skill.shooting = 300
      let parameters = actions.bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([50, 0, 20, 0, 0, 0, 0, 30, 0, 0, 0])
    })
    mocha.it('In Top Box Not Close, no close team mate, player ahead', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.currentPOS[1] = 105
      matchDetails.ball.position = 105
      player.skill.shooting = 3
      matchDetails.kickOffTeam.players[1].currentPOS = [382, 100]
      let parameters = actions.bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([20, 0, 0, 0, 0, 0, 0, 80, 0, 0, 0])
    })
    mocha.it('In Top Box Close, player ahead, no close team mate, 0/half of shooting range', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBoxWithinGoal.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      matchDetails.kickOffTeam.players[1].currentPOS = [382, 28]
      let parameters = actions.bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    })
    mocha.it('In Top Box Not Close, player ahead, no close team mate, half/full shooting range ', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBoxWithinGoal.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.skill.shooting = 60
      matchDetails.kickOffTeam.players[1].currentPOS = [382, 28]
      let parameters = actions.bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([70, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0])
    })
    mocha.it('In Top Box Not Close, player ahead, close team mate', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBoxWithinGoal.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      matchDetails.secondTeam.players[8].currentPOS = [379, 40]
      matchDetails.kickOffTeam.players[1].currentPOS = [382, 28]
      let parameters = actions.bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([20, 0, 70, 0, 0, 0, 0, 10, 0, 0, 0])
    })
    mocha.it('In Top Box Not Close, player ahead, no close team mate, further than shooting', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBoxWithinGoal.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.skill.shooting = 20
      matchDetails.kickOffTeam.players[1].currentPOS = [382, 28]
      let parameters = actions.bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([20, 0, 0, 0, 0, 0, 0, 40, 20, 0, 0])
    })
    mocha.it('In Top Box Close, not in goal space, no player ahead, close team mate, 0/half of shooting range', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBoxWithinGoal.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      matchDetails.secondTeam.players[8].currentPOS = [379, 40]
      let parameters = actions.bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([90, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0])
    })
    mocha.it('In Top Box Close, not in goal space, no player ahead, close team mate, half/shooting range', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBoxWithinGoal.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      matchDetails.secondTeam.players[8].currentPOS = [379, 40]
      player.skill.shooting = 45
      let parameters = actions.bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([50, 0, 20, 0, 0, 0, 0, 30, 0, 0, 0])
    })
    mocha.it('In Top Box Close, not in goal space, no player ahead, close team mate, < shooting range', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBoxWithinGoal.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      matchDetails.secondTeam.players[8].currentPOS = [379, 40]
      player.skill.shooting = 5
      let parameters = actions.bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([20, 0, 30, 0, 0, 0, 0, 30, 20, 0, 0])
    })
    mocha.it('In Top Box Close, no player ahead, close team mate, 0/half of shooting range', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBoxWithinGoalLess25.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      matchDetails.kickOffTeam.players[0].currentPOS = [395, 8]
      matchDetails.secondTeam.players[8].currentPOS = [379, 27]
      let parameters = actions.bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([90, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0])
    })
    mocha.it('In Top Box Close, no player ahead, close team mate, half/shooting range', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBoxWithinGoalLess25.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      matchDetails.kickOffTeam.players[0].currentPOS = [395, 8]
      matchDetails.secondTeam.players[8].currentPOS = [379, 27]
      player.skill.shooting = 35
      let parameters = actions.bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([50, 0, 20, 0, 0, 0, 0, 30, 0, 0, 0])
    })
    mocha.it('In Top Box Close, no player ahead, close team mate, over shooting range', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBoxWithinGoalLess25.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      matchDetails.kickOffTeam.players[0].currentPOS = [395, 8]
      matchDetails.secondTeam.players[8].currentPOS = [379, 27]
      player.skill.shooting = 2
      let parameters = actions.bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([20, 0, 30, 0, 0, 0, 0, 30, 20, 0, 0])
    })
    mocha.it('In Top Box Close, opp. near, no player ahead, no close team mate, 0/half shooting range', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBoxWithinGoalLess25.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      matchDetails.kickOffTeam.players[0].currentPOS = [395, 8]
      player.skill.shooting = 80
      let parameters = actions.bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([90, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0])
    })
    mocha.it('In Top Box Close, opp. near, no player ahead, no close team mate, half/shooting range', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBoxWithinGoalLess25.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      matchDetails.kickOffTeam.players[0].currentPOS = [395, 8]
      player.skill.shooting = 35
      let parameters = actions.bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([70, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0])
    })
    mocha.it('In Top Box Close, opp. near, no player ahead, no close team mate, over shooting range', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBoxWithinGoalLess25.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      matchDetails.kickOffTeam.players[0].currentPOS = [395, 8]
      player.skill.shooting = 2
      let parameters = actions.bottomTeamPlayerHasBallInTopPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([20, 0, 0, 0, 0, 0, 0, 50, 30, 0, 0])
    })
  })
}

module.exports = {
  runTest
}
