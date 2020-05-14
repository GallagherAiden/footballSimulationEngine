/* eslint-disable no-unused-vars */
const mocha = require('mocha')
const { expect } = require('chai')
const actions = require('../lib/actions')
const common = require('../lib/common')

function runTest() {
  mocha.describe('testFoulIntensity()', function() {
    mocha.it('Foul intensity between 0 and 100 - 1', async() => {
      let testIntensity = actions.foulIntensity()
      expect(testIntensity).to.be.gt(-1)
      expect(testIntensity).to.be.lt(101)
    })
    mocha.it('Foul intensity between 0 and 100 - 2', async() => {
      let testIntensity = actions.foulIntensity()
      expect(testIntensity).to.be.gt(-1)
      expect(testIntensity).to.be.lt(101)
    })
  })
  mocha.describe('testWasFoul()', function() {
    mocha.it('Foul returns false for (1,4)', async() => {
      let foul = actions.wasFoul(1, 4)
      expect(foul).to.be.eql(false)
    })
    mocha.it('Foul returns false for (10,18)', async() => {
      let timesTrue = 0
      let timesFalse = 0
      for (let i of new Array(1000)) {
        let foul = actions.wasFoul(10, 18)
        if (foul == true) timesTrue++
        else timesFalse++
      }
      expect(timesTrue).to.be.gt(200)
      expect(timesFalse).to.be.gt(200)
    })
    mocha.it('Foul returns false for (11,20)', async() => {
      let timesTrue = 0
      let timesFalse = 0
      let i
      for (i of new Array(1000)) {
        let foul = actions.wasFoul(11, 20)
        if (foul == true) timesTrue++
        else timesFalse++
      }
      expect(timesTrue).to.be.gt(400)
      expect(timesFalse).to.be.gt(300)
    })
  })
  mocha.describe('testSelectActions()', function() {
    mocha.it('No actions returns a wait', async() => {
      let action = actions.selectAction([])
      expect(action).to.be.eql('wait')
    })
  })
  mocha.describe('testSettingOfFoul()', function() {
    mocha.it('foul is set', async() => {
      let matchDetails = await common.readFile('init_config/iteration.json')
      let testPlayer = matchDetails.secondTeam.players[4]
      let thatPlayer = matchDetails.kickOffTeam.players[6]
      let testTackleTeam = matchDetails.secondTeam
      actions.setFoul(matchDetails, testTackleTeam, testPlayer, thatPlayer)
      expect(matchDetails.iterationLog.indexOf(`Foul against: ${thatPlayer.name}`)).to.be.greaterThan(-1)
      expect(matchDetails.secondTeam.players[4].stats.tackles.fouls).to.eql(1)
    })
    mocha.it('foul is set', async() => {
      let matchDetails = await common.readFile('init_config/iteration.json')
      let testPlayer = matchDetails.kickOffTeam.players[4]
      let thatPlayer = matchDetails.secondTeam.players[6]
      let testTackleTeam = matchDetails.kickOffTeam
      actions.setFoul(matchDetails, testTackleTeam, testPlayer, thatPlayer)
      expect(matchDetails.iterationLog.indexOf(`Foul against: ${thatPlayer.name}`)).to.be.greaterThan(-1)
      expect(matchDetails.kickOffTeam.players[4].stats.tackles.fouls).to.eql(1)
    })
    mocha.it('injury test setting', async() => {
      let matchDetails = await common.readFile('init_config/iteration.json')
      let testPlayer = matchDetails.secondTeam.players[4]
      let thatPlayer = matchDetails.kickOffTeam.players[6]
      actions.setInjury(matchDetails, thatPlayer, testPlayer, 14000, 15000)
      if (matchDetails.secondTeam.players[4].injured == true) {
        expect(matchDetails.iterationLog.indexOf(`Player Injured - ${testPlayer.name}`)).to.be.greaterThan(-1)
      }
      if (matchDetails.kickOffTeam.players[6].injured == true) {
        expect(matchDetails.iterationLog.indexOf(`Player Injured - ${thatPlayer.name}`)).to.be.greaterThan(-1)
      }
    })
    mocha.it('injury is set when already injured', async() => {
      let matchDetails = await common.readFile('init_config/iteration.json')
      let testPlayer = matchDetails.secondTeam.players[4]
      let thatPlayer = matchDetails.kickOffTeam.players[6]
      actions.setInjury(matchDetails, thatPlayer, testPlayer, 23, 23)
      if (matchDetails.secondTeam.players[4].injured == true) {
        expect(matchDetails.iterationLog.indexOf(`Player Injured - ${testPlayer.name}`)).to.be.greaterThan(-1)
      }
      if (matchDetails.kickOffTeam.players[6].injured == true) {
        expect(matchDetails.iterationLog.indexOf(`Player Injured - ${thatPlayer.name}`)).to.be.greaterThan(-1)
      }
    })
    mocha.it('injury is set', async() => {
      let matchDetails = await common.readFile('init_config/iteration.json')
      matchDetails.secondTeam.players[4].injured = true
      let testPlayer = matchDetails.secondTeam.players[4]
      let thatPlayer = matchDetails.kickOffTeam.players[6]
      actions.setInjury(matchDetails, thatPlayer, testPlayer, 23, 23)
      if (matchDetails.secondTeam.players[4].injured == true) {
        expect(matchDetails.iterationLog.indexOf(`Player Injured - ${testPlayer.name}`)).to.be.greaterThan(-1)
      }
      if (matchDetails.kickOffTeam.players[6].injured == true) {
        expect(matchDetails.iterationLog.indexOf(`Player Injured - ${thatPlayer.name}`)).to.be.greaterThan(-1)
      }
    })
  })
  mocha.describe('testSetPostTacklePosition()', function() {
    mocha.it('Set tackle position (3)', async() => {
      let matchDetails = await common.readFile('init_config/iteration.json')
      let testPlayer = matchDetails.secondTeam.players[4]
      let thatPlayer = matchDetails.kickOffTeam.players[6]
      actions.setPostTacklePosition(matchDetails, testPlayer, thatPlayer, 3)
      expect(matchDetails.secondTeam.players[4].currentPOS).to.eql([600, 967])
      expect(matchDetails.kickOffTeam.players[6].currentPOS).to.eql([230, 273])
    })
    mocha.it('Set tackle position (3) other half', async() => {
      let matchDetails = await common.readFile('init_config/iteration2.json')
      let testPlayer = matchDetails.kickOffTeam.players[4]
      let thatPlayer = matchDetails.secondTeam.players[6]
      actions.setPostTacklePosition(matchDetails, testPlayer, thatPlayer, 3)
      expect(matchDetails.kickOffTeam.players[4].currentPOS).to.eql([600, 83])
      expect(matchDetails.secondTeam.players[6].currentPOS).to.eql([230, 777])
    })
    mocha.it('Set tackle position (1)', async() => {
      let matchDetails = await common.readFile('init_config/iteration.json')
      let testPlayer = matchDetails.secondTeam.players[4]
      let thatPlayer = matchDetails.kickOffTeam.players[6]
      actions.setPostTacklePosition(matchDetails, testPlayer, thatPlayer, 1)
      expect(matchDetails.secondTeam.players[4].currentPOS).to.eql([600, 969])
      expect(matchDetails.kickOffTeam.players[6].currentPOS).to.eql([230, 271])
    })
    mocha.it('Set tackle position (1) other half', async() => {
      let matchDetails = await common.readFile('init_config/iteration2.json')
      let testPlayer = matchDetails.kickOffTeam.players[4]
      let thatPlayer = matchDetails.secondTeam.players[6]
      actions.setPostTacklePosition(matchDetails, testPlayer, thatPlayer, 1)
      expect(matchDetails.kickOffTeam.players[4].currentPOS).to.eql([600, 81])
      expect(matchDetails.secondTeam.players[6].currentPOS).to.eql([230, 779])
    })
  })
  mocha.describe('testSetPostTackleBall()', function() {
    mocha.it('Set tackle position (3)', async() => {
      let matchDetails = await common.readFile('init_config/iteration.json')
      let testPlayer = matchDetails.secondTeam.players[4]
      let testTeam = matchDetails.secondTeam
      let testOpposition = matchDetails.kickOffTeam
      actions.setPostTackleBall(matchDetails, testTeam, testOpposition, testPlayer)
      expect(matchDetails.ball.lastTouch).to.eql('Emily Smith')
      expect(matchDetails.ball.position).to.eql([600, 970])
      expect(matchDetails.ball.Player).to.eql('78883930303030204')
      expect(matchDetails.ball.withPlayer).to.eql(true)
    })
  })
  mocha.describe('testCalculationOfTackleScores()', function() {
    mocha.it('tackle score', async() => {
      let skills = {
        'tackling': 50,
        'strength': 50
      }
      let tackleScore = actions.calcTackleScore(skills, 5)
      expect(true).to.eql(common.isBetween(tackleScore, 44, 56))
    })
    mocha.it('retention score', async() => {
      let skills = {
        'agility': 50,
        'strength': 50
      }
      let retentionScore = actions.calcRetentionScore(skills, 5)
      expect(true).to.eql(common.isBetween(retentionScore, 44, 56))
    })
    mocha.it('tackler win', async() => {
      let tacklerSkills = {
        'tackling': 100,
        'strength': 80
      }
      let retentionSkills = {
        'agility': 80,
        'strength': 65
      }
      let tackleScore = actions.calcTackleScore(tacklerSkills, 5)
      let retentionScore = actions.calcRetentionScore(retentionSkills, 5)
      let result = (tackleScore > retentionScore) ? 'tackler' : 'retention'
      expect(result).to.eql('tackler')
    })
    mocha.it('retention win', async() => {
      let tacklerSkills = {
        'tackling': 60,
        'strength': 32
      }
      let retentionSkills = {
        'agility': 100,
        'strength': 43
      }
      let tackleScore = actions.calcTackleScore(tacklerSkills, 5)
      let retentionScore = actions.calcRetentionScore(retentionSkills, 5)
      let result = (tackleScore > retentionScore) ? 'tackler' : 'retention'
      expect(result).to.eql('retention')
    })
  })
  mocha.describe('testSlideTackle()', function() {
    let x = 0
    for (let i of new Array(10)) {
      mocha.it(`resolve slide tackle ${x}`, async() => {
        let matchDetails = await common.readFile('init_config/iteration.json')
        let testPlayer = matchDetails.secondTeam.players[4]
        let testTeam = matchDetails.secondTeam
        let testOpposition = matchDetails.kickOffTeam
        actions.resolveSlide(testPlayer, testTeam, testOpposition, matchDetails)
        expect(matchDetails.iterationLog.indexOf(`Slide tackle attempted by: ${testPlayer.name}`)).to.be.greaterThan(-1)
        let FTlog = matchDetails.iterationLog.indexOf(`Failed tackle by: ${testPlayer.name}`)
        let STlog = matchDetails.iterationLog.indexOf(`Successful tackle by: ${testPlayer.name}`)
        let FAlog = matchDetails.iterationLog.indexOf(`Foul against: Peter Johnson`)
        expect(FTlog + STlog + FAlog).to.be.greaterThan(-1)
        if (FTlog > -1) expect(testPlayer.stats.tackles.off).to.eql(1)
        if (STlog > -1) expect(testPlayer.stats.tackles.on).to.eql(1)
        if (FAlog > -1) expect(testPlayer.stats.tackles.fouls).to.eql(1)
      })
      mocha.it(`resolve slide tackle opposite ${x}`, async() => {
        let matchDetails = await common.readFile('test/input/opposite/iterationSwitch.json')
        let testPlayer = matchDetails.secondTeam.players[4]
        let testTeam = matchDetails.secondTeam
        let testOpposition = matchDetails.kickOffTeam
        actions.resolveSlide(testPlayer, testTeam, testOpposition, matchDetails)
        expect(matchDetails.iterationLog.indexOf(`Slide tackle attempted by: ${testPlayer.name}`)).to.be.greaterThan(-1)
        let FTlog = matchDetails.iterationLog.indexOf(`Failed tackle by: ${testPlayer.name}`)
        let STlog = matchDetails.iterationLog.indexOf(`Successful tackle by: ${testPlayer.name}`)
        let FAlog = matchDetails.iterationLog.indexOf(`Foul against: Peter Johnson`)
        expect(FTlog + STlog + FAlog).to.be.greaterThan(-1)
        if (FTlog > -1) expect(testPlayer.stats.tackles.off).to.eql(1)
        if (STlog > -1) expect(testPlayer.stats.tackles.on).to.eql(1)
        if (FAlog > -1) expect(testPlayer.stats.tackles.fouls).to.eql(1)
      })
      mocha.it(`resolve slide tackle - failed ${x}`, async() => {
        let matchDetails = await common.readFile('test/input/opposite/iterationSwitch.json')
        let testPlayer = matchDetails.secondTeam.players[4]
        testPlayer.skill.tackling = 60
        testPlayer.skill.strength = 32
        matchDetails.kickOffTeam.players[9].skill.agility = 100
        matchDetails.kickOffTeam.players[9].skill.strength = 43
        let testTeam = matchDetails.secondTeam
        let testOpposition = matchDetails.kickOffTeam
        actions.resolveSlide(testPlayer, testTeam, testOpposition, matchDetails)
        expect(matchDetails.iterationLog.indexOf(`Slide tackle attempted by: ${testPlayer.name}`)).to.be.greaterThan(-1)
        let FTlog = matchDetails.iterationLog.indexOf(`Failed tackle by: ${testPlayer.name}`)
        let STlog = matchDetails.iterationLog.indexOf(`Successful tackle by: ${testPlayer.name}`)
        let FAlog = matchDetails.iterationLog.indexOf(`Foul against: Peter Johnson`)
        expect(FTlog + STlog + FAlog).to.be.greaterThan(-1)
        if (FTlog > -1) expect(testPlayer.stats.tackles.off).to.eql(1)
        if (STlog > -1) expect(testPlayer.stats.tackles.on).to.eql(1)
        if (FAlog > -1) expect(testPlayer.stats.tackles.fouls).to.eql(1)
      })
      x++
    }
  })
  mocha.describe('testTackle()', function() {
    let x = 0
    for (let i of new Array(10)) {
      mocha.it(`resolve tackle ${x}`, async() => {
        let matchDetails = await common.readFile('init_config/iteration.json')
        let testPlayer = matchDetails.secondTeam.players[4]
        let testTeam = matchDetails.secondTeam
        let testOpposition = matchDetails.kickOffTeam
        actions.resolveTackle(testPlayer, testTeam, testOpposition, matchDetails)
        expect(matchDetails.iterationLog.indexOf(`Tackle attempted by: ${testPlayer.name}`)).to.be.greaterThan(-1)
        let FTlog = matchDetails.iterationLog.indexOf(`Failed tackle by: ${testPlayer.name}`)
        let STlog = matchDetails.iterationLog.indexOf(`Successful tackle by: ${testPlayer.name}`)
        let FAlog = matchDetails.iterationLog.indexOf(`Foul against: Peter Johnson`)
        expect(FTlog + STlog + FAlog).to.be.greaterThan(-1)
        if (FTlog > -1) expect(testPlayer.stats.tackles.off).to.eql(1)
        if (STlog > -1) expect(testPlayer.stats.tackles.on).to.eql(1)
        if (FAlog > -1) expect(testPlayer.stats.tackles.fouls).to.eql(1)
      })
      mocha.it(`resolve tackle opposite ${x}`, async() => {
        let matchDetails = await common.readFile('test/input/opposite/iterationSwitch.json')
        let testPlayer = matchDetails.secondTeam.players[4]
        let testTeam = matchDetails.secondTeam
        let testOpposition = matchDetails.kickOffTeam
        actions.resolveTackle(testPlayer, testTeam, testOpposition, matchDetails)
        expect(matchDetails.iterationLog.indexOf(`Tackle attempted by: ${testPlayer.name}`)).to.be.greaterThan(-1)
        let FTlog = matchDetails.iterationLog.indexOf(`Failed tackle by: ${testPlayer.name}`)
        let STlog = matchDetails.iterationLog.indexOf(`Successful tackle by: ${testPlayer.name}`)
        let FAlog = matchDetails.iterationLog.indexOf(`Foul against: Peter Johnson`)
        expect(FTlog + STlog + FAlog).to.be.greaterThan(-1)
        if (FTlog > -1) expect(testPlayer.stats.tackles.off).to.eql(1)
        if (STlog > -1) expect(testPlayer.stats.tackles.on).to.eql(1)
        if (FAlog > -1) expect(testPlayer.stats.tackles.fouls).to.eql(1)
      })
      mocha.it(`resolve tackle - failed ${x}`, async() => {
        let matchDetails = await common.readFile('test/input/opposite/iterationSwitch.json')
        let testPlayer = matchDetails.secondTeam.players[4]
        testPlayer.skill.tackling = 60
        testPlayer.skill.strength = 32
        matchDetails.kickOffTeam.players[9].skill.agility = 100
        matchDetails.kickOffTeam.players[9].skill.strength = 43
        let testTeam = matchDetails.secondTeam
        let testOpposition = matchDetails.kickOffTeam
        actions.resolveTackle(testPlayer, testTeam, testOpposition, matchDetails)
        expect(matchDetails.iterationLog.indexOf(`Tackle attempted by: ${testPlayer.name}`)).to.be.greaterThan(-1)
        let FTlog = matchDetails.iterationLog.indexOf(`Failed tackle by: ${testPlayer.name}`)
        let STlog = matchDetails.iterationLog.indexOf(`Successful tackle by: ${testPlayer.name}`)
        let FAlog = matchDetails.iterationLog.indexOf(`Foul against: Peter Johnson`)
        expect(FTlog + STlog + FAlog).to.be.greaterThan(-1)
        if (FTlog > -1) expect(testPlayer.stats.tackles.off).to.eql(1)
        if (STlog > -1) expect(testPlayer.stats.tackles.on).to.eql(1)
        if (FAlog > -1) expect(testPlayer.stats.tackles.fouls).to.eql(1)
      })
      x++
    }
  })
}

module.exports = {
  runTest
}
