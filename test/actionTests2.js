const mocha = require('mocha')
const { expect } = require('chai')
const actions = require('../lib/actions')
const common = require('../lib/common')

function runTest() {
  mocha.describe('bottomTeamPlayerHasBallInMiddle()', function() {
    mocha.it('In middle of pitch, no opp. near, shooting over 85', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInMiddle.json')
      let player = matchDetails.secondTeam.players[9]
      let playerInformation = { 'proxPOS': [218, -464] }
      let parameters = actions.bottomTeamPlayerHasBallInMiddle(playerInformation, player.position, player.skill)
      expect(parameters).to.eql([10, 10, 30, 0, 0, 0, 0, 50, 0, 0, 0])
    })
    mocha.it('In middle of pitch, no opp. near, shooting below 85, striker', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInMiddle.json')
      let player = matchDetails.secondTeam.players[9]
      player.skill.shooting = 30
      let playerInformation = { 'proxPOS': [218, -464] }
      let parameters = actions.bottomTeamPlayerHasBallInMiddle(playerInformation, player.position, player.skill)
      expect(parameters).to.eql([0, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0])
    })
    mocha.it('In middle of pitch, no opp. near, shooting below 85, midfielder', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInMiddle.json')
      let player = matchDetails.secondTeam.players[9]
      player.skill.shooting = 30
      player.position = 'CM'
      let playerInformation = { 'proxPOS': [218, -464] }
      let parameters = actions.bottomTeamPlayerHasBallInMiddle(playerInformation, player.position, player.skill)
      expect(parameters).to.eql([0, 10, 10, 10, 0, 0, 0, 30, 40, 0, 0])
    })
    mocha.it('In middle of pitch, no opp. near, shooting below 85, defender', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInMiddle.json')
      let player = matchDetails.secondTeam.players[9]
      player.skill.shooting = 30
      player.position = 'CB'
      let playerInformation = { 'proxPOS': [218, -464] }
      let parameters = actions.bottomTeamPlayerHasBallInMiddle(playerInformation, player.position, player.skill)
      expect(parameters).to.eql([0, 0, 10, 0, 0, 0, 0, 60, 20, 0, 10])
    })
    mocha.it('In middle of pitch, opp. near, shooting over 85', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInMiddle.json')
      let player = matchDetails.secondTeam.players[9]
      let playerInformation = { 'proxPOS': [5, -5] }
      let parameters = actions.bottomTeamPlayerHasBallInMiddle(playerInformation, player.position, player.skill)
      expect(parameters).to.eql([0, 20, 30, 20, 0, 0, 0, 20, 0, 0, 10])
    })
  })
  mocha.describe('bottomTeamPlayerHasBall()', function() {
    mocha.it('bottomTeamPlayerHasBallInMiddle', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInMiddle.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      let parameters = actions.bottomTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([10, 10, 30, 0, 0, 0, 0, 50, 0, 0, 0])
    })
    mocha.it('bottomTeamPlayerHasBallInTopPenaltyBox', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      let parameters = actions.bottomTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([60, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0])
    })
    mocha.it('onTopCornerBoundary', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      player.currentPOS = [0, 0]
      matchDetails.ball.position = [0, 0]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      let parameters = actions.bottomTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([0, 0, 20, 80, 0, 0, 0, 0, 0, 0, 0])
    })
    mocha.it('bottomTeamPlayerHasBall, GK, opposition near', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      player.position = 'GK'
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      matchDetails.kickOffTeam.players[7].currentPOS = [385, 70]
      let parameters = actions.bottomTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([0, 0, 10, 0, 0, 0, 0, 10, 0, 40, 40])
    })
    mocha.it('bottomTeamPlayerHasBall, GK, opposition not near', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      player.position = 'GK'
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      let parameters = actions.bottomTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([0, 0, 50, 0, 0, 0, 0, 10, 0, 20, 20])
    })
    mocha.it('Top Thrd, opposition not near', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopThird.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      let parameters = actions.bottomTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([70, 10, 10, 0, 0, 0, 0, 10, 0, 0, 0])
    })
    mocha.it('Top Third, opposition near', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopThird.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      matchDetails.kickOffTeam.players[7].currentPOS = [385, 205]
      let parameters = actions.bottomTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([30, 20, 20, 10, 0, 0, 0, 20, 0, 0, 0])
    })
    mocha.it('Bottom Third, opposition near', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInBottomThird.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      matchDetails.kickOffTeam.players[4].currentPOS = [385, 982]
      let parameters = actions.bottomTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([0, 0, 0, 0, 0, 0, 0, 10, 0, 70, 20])
    })
    mocha.it('Bottom Third, no opposition near, midfielder', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInBottomThird.json')
      let player = matchDetails.secondTeam.players[9]
      player.position = 'LM'
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      let parameters = actions.bottomTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([0, 0, 30, 0, 0, 0, 0, 30, 40, 0, 0])
    })
    mocha.it('Bottom Third, no opposition near, defender', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInBottomThird.json')
      let player = matchDetails.secondTeam.players[9]
      player.position = 'LB'
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      let parameters = actions.bottomTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([0, 0, 30, 0, 0, 0, 0, 50, 0, 10, 10])
    })
    mocha.it('Bottom Third, no opposition near, striker', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInBottomThird.json')
      let player = matchDetails.secondTeam.players[9]
      player.position = 'ST'
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      let parameters = actions.bottomTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([0, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0])
    })
  })
  mocha.describe('topTeamPlayerHasBallInBottomPenaltyBox()', function() {
    mocha.it('Close, no opposition near, no team mate close, further than shooting skills', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      let parameters = actions.topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([60, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0])
    })
    mocha.it('Close, no opposition near, no team mate close, half/shooting skills', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.skill.shooting = 1
      let parameters = actions.topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([30, 0, 0, 0, 0, 0, 0, 40, 30, 0, 0])
    })
    mocha.it('Close, no opposition near, no team mate close, 0/half shooting skills', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.skill.shooting = 500
      let parameters = actions.topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    })
    mocha.it('Not Close, opposition near, within shooting skills', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      player.currentPOS[1] = 875
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      opposition.players[3].currentPOS = [377, 880]
      let parameters = actions.topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([10, 0, 70, 0, 0, 0, 0, 20, 0, 0, 0])
    })
    mocha.it('Not Close, opposition near, further than shooting skills', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      player.currentPOS[1] = 875
      player.skill.shooting = 1000
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      let parameters = actions.topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([50, 0, 20, 0, 0, 0, 0, 30, 0, 0, 0])
    })
    mocha.it('Not Close, opposition near, further than shooting skills', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      player.currentPOS[1] = 910
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      let parameters = actions.topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([70, 0, 20, 0, 0, 0, 0, 10, 0, 0, 0])
    })
    mocha.it('Close, opp. near not ahead, no tmate close, half/shooting skills', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.skill.shooting = 250
      opposition.players[3].currentPOS = [275, 991]
      matchDetails.ball.position = [280, 995]
      matchDetails.secondTeam.players[10].currentPOS = [385, 998]
      let parameters = actions.topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([90, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0])
    })
    mocha.it('Close, opp. near not ahead, no tmate close, 0/half skills', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      opposition.players[3].currentPOS = [275, 991]
      matchDetails.ball.position = [280, 995]
      matchDetails.secondTeam.players[10].currentPOS = [385, 998]
      let parameters = actions.topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([50, 0, 20, 0, 0, 0, 0, 30, 0, 0, 0])
    })
    mocha.it('Close, opp. near not ahead, no tmate close, further than shooting skills', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.skill.shooting = 5
      opposition.players[3].currentPOS = [275, 991]
      matchDetails.ball.position = [280, 995]
      matchDetails.secondTeam.players[10].currentPOS = [385, 998]
      let parameters = actions.topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([20, 0, 30, 0, 0, 0, 0, 30, 20, 0, 0])
    })
    mocha.it('Close, no opposition ahead, tmate close, 0/shooting skills', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.skill.shooting = 250
      opposition.players[3].currentPOS = [375, 991]
      matchDetails.secondTeam.players[10].currentPOS = [382, 997]
      let parameters = actions.topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([90, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0])
    })
    mocha.it('Close, no opposition ahead, tmate close, half/shooting skills', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      opposition.players[3].currentPOS = [375, 991]
      matchDetails.secondTeam.players[10].currentPOS = [382, 997]
      let parameters = actions.topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([50, 0, 20, 0, 0, 0, 0, 30, 0, 0, 0])
    })
    mocha.it('Close, no opposition ahead, tmate close, further than shooting skills', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.skill.shooting = 2
      opposition.players[3].currentPOS = [375, 991]
      matchDetails.secondTeam.players[10].currentPOS = [382, 997]
      let parameters = actions.topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([20, 0, 30, 0, 0, 0, 0, 30, 20, 0, 0])
    })
    mocha.it('Close, no opposition ahead, no tmate close, further than shooting skills', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.skill.shooting = 2
      opposition.players[3].currentPOS = [375, 991]
      let parameters = actions.topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([20, 0, 0, 0, 0, 0, 0, 50, 30, 0, 0])
    })
    mocha.it('Close, no opposition ahead, no tmate close, half/shooting skills', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      opposition.players[3].currentPOS = [375, 991]
      let parameters = actions.topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([70, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0])
    })
    mocha.it('Close, no opposition ahead, no tmate close, 0/half shooting skills', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.skill.shooting = 250
      opposition.players[3].currentPOS = [375, 991]
      let parameters = actions.topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([90, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0])
    })
    mocha.it('Close, opposition ahead, no tmate close, 0/half shooting skills', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.skill.shooting = 250
      opposition.players[3].currentPOS = [380, 999]
      let parameters = actions.topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    })
    mocha.it('Close, opposition ahead, no tmate close, half/shooting skills', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      opposition.players[3].currentPOS = [380, 999]
      let parameters = actions.topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([70, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0])
    })
    mocha.it('Close, opposition ahead, no tmate close, further than shooting skills', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.skill.shooting = 2
      opposition.players[3].currentPOS = [380, 999]
      let parameters = actions.topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([20, 0, 0, 0, 0, 0, 0, 40, 20, 0, 0])
    })
    mocha.it('Close, opposition ahead, tmate close, further than shooting skills', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      opposition.players[3].currentPOS = [380, 999]
      matchDetails.secondTeam.players[10].currentPOS = [382, 997]
      let parameters = actions.topTeamPlayerHasBallInBottomPenaltyBox(matchDetails, player, team, opposition)
      expect(parameters).to.eql([20, 0, 70, 0, 0, 0, 0, 10, 0, 0, 0])
    })
  })
  mocha.describe('topTeamPlayerHasBall()', function() {
    mocha.it('GK - opposition not near', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.position = 'GK'
      let parameters = actions.topTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([0, 0, 50, 0, 0, 0, 0, 10, 0, 20, 20])
    })
    mocha.it('GK - opposition near', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.position = 'GK'
      opposition.players[3].currentPOS = [380, 999]
      let parameters = actions.topTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([0, 0, 10, 0, 0, 0, 0, 10, 0, 40, 40])
    })
    mocha.it('Not GK - bottom corner boundary', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.currentPOS = [0, 1050]
      matchDetails.ball.position = [0, 1050]
      let parameters = actions.topTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([0, 0, 20, 80, 0, 0, 0, 0, 0, 0, 0])
    })
    mocha.it('Not GK - In Bottom Penalty Box', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      let parameters = actions.topTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([60, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0])
    })
    mocha.it('Not GK - In Bottom Third - no opp near', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomThird.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      let parameters = actions.topTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([70, 10, 10, 0, 0, 0, 0, 10, 0, 0, 0])
    })
    mocha.it('Not GK - In Bottom Third - opp near', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInBottomThird.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      matchDetails.kickOffTeam.players[6].currentPOS = [378, 815]
      let parameters = actions.topTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([30, 20, 20, 10, 0, 0, 0, 20, 0, 0, 0])
    })
    mocha.it('Middle Third - opp near', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInMiddleThird.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      matchDetails.kickOffTeam.players[6].currentPOS = [378, 532]
      let parameters = actions.topTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([0, 20, 30, 20, 0, 0, 20, 0, 0, 0, 10])
    })
    mocha.it('Middle Third - no opp near - shooting > 85', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInMiddleThird.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      let parameters = actions.topTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([10, 10, 30, 0, 0, 0, 50, 0, 0, 0, 0])
    })
    mocha.it('Middle Third - no opp near - shooting < 85, LM', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInMiddleThird.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.skill.shooting = 50
      player.position = 'LM'
      let parameters = actions.topTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([0, 10, 10, 10, 0, 0, 0, 30, 40, 0, 0])
    })
    mocha.it('Middle Third - no opp near - shooting < 85, Striker', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInMiddleThird.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.skill.shooting = 50
      let parameters = actions.topTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([0, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0])
    })
    mocha.it('Middle Third - no opp near - shooting < 85, Defender', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInMiddleThird.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.skill.shooting = 50
      player.position = 'LB'
      let parameters = actions.topTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([0, 0, 10, 0, 0, 0, 0, 60, 20, 0, 10])
    })
    mocha.it('Own Third - opp near', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInOwnThird.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      matchDetails.kickOffTeam.players[6].currentPOS = [378, 182]
      let parameters = actions.topTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([0, 0, 0, 0, 0, 0, 0, 10, 0, 70, 20])
    })
    mocha.it('Own Third - no opp near - midfielder', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInOwnThird.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.position = 'LM'
      let parameters = actions.topTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([0, 0, 30, 0, 0, 0, 0, 30, 40, 0, 0])
    })
    mocha.it('Own Third - no opp near - striker', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInOwnThird.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.position = 'ST'
      let parameters = actions.topTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([0, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0])
    })
    mocha.it('Own Third - no opp near - defender', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInOwnThird.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      player.position = 'RB'
      let parameters = actions.topTeamPlayerHasBall(matchDetails, player, team, opposition)
      expect(parameters).to.eql([0, 0, 40, 0, 0, 0, 0, 30, 0, 20, 10])
    })
  })
  mocha.describe('findPossActions()', function() {
    mocha.it('From Bottom', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/bottomTeamHasBallInTopPenaltyBox.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      let output = actions.findPossActions(player, team, opposition, 10, 10, matchDetails)
      expect(output).to.eql([
        { name: 'shoot', points: 60 },
        { name: 'throughBall', points: 0 },
        { name: 'pass', points: 0 },
        { name: 'cross', points: 0 },
        { name: 'tackle', points: 0 },
        { name: 'intercept', points: 0 },
        { name: 'slide', points: 0 },
        { name: 'run', points: 40 },
        { name: 'sprint', points: 0 },
        { name: 'cleared', points: 0 },
        { name: 'boot', points: 0 }
      ])
    })
    mocha.it('From Bottom', async() => {
      let matchDetails = await common.readFile('test/input/actionInputs/topTeamHasBallInOwnThird.json')
      let player = matchDetails.secondTeam.players[9]
      let team = matchDetails.secondTeam
      let opposition = matchDetails.kickOffTeam
      let output = actions.findPossActions(player, team, opposition, 10, 10, matchDetails)
      expect(output).to.eql([
        { name: 'shoot', points: 0 },
        { name: 'throughBall', points: 0 },
        { name: 'pass', points: 0 },
        { name: 'cross', points: 0 },
        { name: 'tackle', points: 0 },
        { name: 'intercept', points: 0 },
        { name: 'slide', points: 0 },
        { name: 'run', points: 50 },
        { name: 'sprint', points: 50 },
        { name: 'cleared', points: 0 },
        { name: 'boot', points: 0 }
      ])
    })
  })
}

module.exports = {
  runTest
}
