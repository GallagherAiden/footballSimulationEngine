const mocha = require('mocha')
const { expect } = require('chai')
const setpieces = require('./lib/set_pieces')

function runTest() {
  mocha.describe('testBoundariesForBottomGoal()', function() {
    mocha.it('expected Bottom Goal', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setpieces.setBottomGoalKick(itlocation)
      let insideHalf = parseInt(nextJSON.pitchSize[1] / 2, 10)
      let goalKick = nextJSON.iterationLog.indexOf('Goal Kick to - ThatTeam')

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.kickOffTeam.players[0].currentPOS[1]).to.be.lessThan(insideHalf)
      expect(goalKick).to.be.greaterThan(-1)
      for (let player of nextJSON.secondTeam.players) {
        if (player.playerID != nextJSON.secondTeam.players[0].playerID) {
          expect(player.currentPOS).to.eql([player.originPOS[0], player.originPOS[1] - 80])
        }
      }
    })
  })
  mocha.describe('testBoundariesForTopGoal()', function() {
    mocha.it('expected Top Goal', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setpieces.setTopGoalKick(itlocation)
      let insideHalf = parseInt(nextJSON.pitchSize[1] / 2, 10)
      let goalKick = nextJSON.iterationLog.indexOf('Goal Kick to - ThisTeam')

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.secondTeam.players[0].currentPOS[1]).to.be.gt(insideHalf)
      expect(goalKick).to.be.greaterThan(-1)
      for (let player of nextJSON.kickOffTeam.players) {
        if (player.playerID != nextJSON.kickOffTeam.players[0].playerID) {
          expect(player.currentPOS).to.eql([player.originPOS[0], player.originPOS[1] + 80])
        }
      }
    })
  })
  mocha.describe('testBoundariesForBottomGoalSecondHalf()', function() {
    mocha.it('expected Bottom Goal', async() => {
      let itlocation = './test/input/boundaryPositions/secondHalfGoalKick.json'
      let nextJSON = await setpieces.setBottomGoalKick(itlocation)
      let insideHalf = parseInt(nextJSON.pitchSize[1] / 2, 10)
      let goalKick = nextJSON.iterationLog.indexOf('Goal Kick to - ThisTeam')

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.secondTeam.players[0].currentPOS[1]).to.be.lessThan(insideHalf)
      expect(goalKick).to.be.greaterThan(-1)
      for (let player of nextJSON.kickOffTeam.players) {
        if (player.playerID != nextJSON.kickOffTeam.players[0].playerID) {
          expect(player.currentPOS).to.eql([player.originPOS[0], player.originPOS[1] - 80])
        }
      }
    })
  })
  mocha.describe('testBoundariesForTopGoalSecondHalf()', function() {
    mocha.it('expected Top Goal', async() => {
      let itlocation = './test/input/boundaryPositions/secondHalfGoalKick.json'
      let nextJSON = await setpieces.setTopGoalKick(itlocation)
      let insideHalf = parseInt(nextJSON.pitchSize[1] / 2, 10)
      let goalKick = nextJSON.iterationLog.indexOf('Goal Kick to - ThatTeam')

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.kickOffTeam.players[0].currentPOS[1]).to.be.gt(insideHalf)
      expect(goalKick).to.be.greaterThan(-1)
      for (let player of nextJSON.secondTeam.players) {
        if (player.playerID != nextJSON.secondTeam.players[0].playerID) {
          expect(player.currentPOS).to.eql([player.originPOS[0], player.originPOS[1] + 80])
        }
      }
    })
  })
  mocha.describe('setKickOffTeamGoalScored()', function() {
    mocha.it('kickOff team in same position', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setpieces.setKickOffTeamGoalScored(itlocation)
      expect(nextJSON.kickOffTeamStatistics.goals).to.eql(1)
      for (let player of nextJSON.kickOffTeam.players) {
        expect(player.currentPOS).to.eql(player.originPOS)
      }
      for (let player of nextJSON.secondTeam.players) {
        if (player.name == 'Aiden Smith') {
          expect(player.currentPOS[1]).to.eql(nextJSON.ball.position[1])
          expect(player.currentPOS[0]).to.within(nextJSON.ball.position[0], nextJSON.ball.position[0] + 20)
        } else if (player.name == 'Wayne Smith') {
          expect(player.currentPOS[1]).to.eql(nextJSON.ball.position[1])
          expect(player.currentPOS[0]).to.within(nextJSON.ball.position[0], nextJSON.ball.position[0] + 20)
        } else {
          expect(player.currentPOS).to.eql(player.originPOS)
        }
      }
    })
  })
  mocha.describe('setSecondTeamGoalScored()', function() {
    mocha.it('second team in same position', async() => {
      let itlocation = './init_config/iteration2.json'
      let nextJSON = await setpieces.setSecondTeamGoalScored(itlocation)
      expect(nextJSON.secondTeamStatistics.goals).to.eql(1)
      for (let player of nextJSON.secondTeam.players) {
        expect(player.currentPOS).to.eql(player.originPOS)
      }
      for (let player of nextJSON.secondTeam.players) {
        if (player.name == 'Peter Johnson') {
          expect(player.currentPOS[1]).to.eql(nextJSON.ball.position[1])
          expect(player.currentPOS[0]).to.within(nextJSON.ball.position[0], nextJSON.ball.position[0] + 20)
        } else if (player.name == 'Louise Johnson') {
          expect(player.currentPOS[1]).to.eql(nextJSON.ball.position[1])
          expect(player.currentPOS[0]).to.within(nextJSON.ball.position[0], nextJSON.ball.position[0] + 20)
        } else {
          expect(player.currentPOS).to.eql(player.originPOS)
        }
      }
    })
  })
  mocha.describe('setFreekick()', function() {
    mocha.it('kickoff team assigned a freekick', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setpieces.setSetpieceKickOffTeam(itlocation)

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.kickOffTeamStatistics.freekicks).to.eql(1)
    })
    mocha.it('second team assigned a freekick', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setpieces.setSetpieceSecondTeam(itlocation)

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.secondTeamStatistics.freekicks).to.eql(1)
    })
  })
  mocha.describe('setPenalties()', function() {
    mocha.it('kickoff team assigned a bottom penalty', async() => {
      let itlocation = './test/input/boundaryPositions/kickoffteambottompenalty.json'
      let nextJSON = await setpieces.setSetpieceKickOffTeam(itlocation)
      let penaltyLog = nextJSON.iterationLog.indexOf('penalty to: ThisTeam')

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.kickOffTeamStatistics.penalties).to.eql(1)
      expect(penaltyLog).to.be.greaterThan(-1)
    })
    mocha.it('second team assigned a bottom penalty', async() => {
      let itlocation = './test/input/boundaryPositions/secondteambottompenalty.json'
      let nextJSON = await setpieces.setSetpieceSecondTeam(itlocation)
      let penaltyLog = nextJSON.iterationLog.indexOf('penalty to: ThatTeam')

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.secondTeamStatistics.penalties).to.eql(1)
      expect(penaltyLog).to.be.greaterThan(-1)
    })
    mocha.it('kickoff team assigned a top penalty', async() => {
      let itlocation = './test/input/boundaryPositions/kickoffteamtoppenalty.json'
      let nextJSON = await setpieces.setSetpieceKickOffTeam(itlocation)
      let penaltyLog = nextJSON.iterationLog.indexOf('penalty to: ThisTeam')

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.kickOffTeamStatistics.penalties).to.eql(1)
      expect(penaltyLog).to.be.greaterThan(-1)
    })
    mocha.it('second team assigned a top penalty', async() => {
      let itlocation = './test/input/boundaryPositions/secondteamtoppenalty.json'
      let nextJSON = await setpieces.setSetpieceSecondTeam(itlocation)
      let penaltyLog = nextJSON.iterationLog.indexOf('penalty to: ThatTeam')

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.secondTeamStatistics.penalties).to.eql(1)
      expect(penaltyLog).to.be.greaterThan(-1)
    })
  })
  mocha.describe('testPenalties()', function() {
    mocha.it('top penalty returns kick off team players in the positions', async() => {
      let itlocation = './test/input/boundaryPositions/kickoffteamtoppenalty.json'
      let nextJSON = await setpieces.setupTopPenalty(itlocation)
      let pitchWidth = nextJSON.pitchSize[0]

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.kickOffTeam.teamID).to.eql(nextJSON.ball.withTeam)
      expect(nextJSON.ball.position).to.eql([pitchWidth / 2, 60])
      expect(nextJSON.ball.direction).to.eql('north')
      expect(nextJSON.kickOffTeam.players[10].currentPOS).to.eql([pitchWidth / 2, 60])
      for (let player of nextJSON.kickOffTeam.players) {
        if (player.playerID != nextJSON.kickOffTeam.players[10].playerID) {
          expect(player.currentPOS[1]).to.be.gt(nextJSON.kickOffTeam.players[10].currentPOS[1])
        }
      }
      for (let player of nextJSON.secondTeam.players) {
        if (player.playerID != nextJSON.secondTeam.players[0].playerID) {
          expect(player.currentPOS[1]).to.be.gt(nextJSON.kickOffTeam.players[10].currentPOS[1])
        }
      }
    })
    mocha.it('bottom penalty returns kick off team players in the correct positions', async() => {
      let itlocation = './test/input/boundaryPositions/kickoffteambottompenalty.json'
      let nextJSON = await setpieces.setupBottomPenalty(itlocation)
      let [pitchWidth, pitchHeight] = nextJSON.pitchSize

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.kickOffTeam.teamID).to.eql(nextJSON.ball.withTeam)
      expect(nextJSON.ball.position).to.eql([pitchWidth / 2, pitchHeight - 60])
      expect(nextJSON.ball.direction).to.eql('south')
      expect(nextJSON.kickOffTeam.players[10].currentPOS).to.eql([pitchWidth / 2, pitchHeight - 60])
      for (let player of nextJSON.kickOffTeam.players) {
        if (player.playerID != nextJSON.kickOffTeam.players[10].playerID) {
          expect(player.currentPOS[1]).to.be.lt(nextJSON.kickOffTeam.players[10].currentPOS[1])
        }
      }
      for (let player of nextJSON.secondTeam.players) {
        if (player.playerID != nextJSON.secondTeam.players[0].playerID) {
          expect(player.currentPOS[1]).to.be.lt(nextJSON.kickOffTeam.players[10].currentPOS[1])
        }
      }
    })
    mocha.it('top penalty returns second team players in the correct positions', async() => {
      let itlocation = './test/input/boundaryPositions/secondteamtoppenalty.json'
      let nextJSON = await setpieces.setupTopPenalty(itlocation)
      let pitchWidth = nextJSON.pitchSize[0]

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.secondTeam.teamID).to.eql(nextJSON.ball.withTeam)
      expect(nextJSON.ball.position).to.eql([pitchWidth / 2, 60])
      expect(nextJSON.ball.direction).to.eql('north')
      expect(nextJSON.secondTeam.players[10].currentPOS).to.eql([pitchWidth / 2, 60])
      for (let player of nextJSON.secondTeam.players) {
        if (player.playerID != nextJSON.secondTeam.players[10].playerID) {
          expect(player.currentPOS[1]).to.be.gt(nextJSON.secondTeam.players[10].currentPOS[1])
        }
      }
      for (let player of nextJSON.kickOffTeam.players) {
        if (player.playerID != nextJSON.kickOffTeam.players[0].playerID) {
          expect(player.currentPOS[1]).to.be.gt(nextJSON.secondTeam.players[10].currentPOS[1])
        }
      }
    })
    mocha.it('bottom penalty returns second team players in the correct positions', async() => {
      let itlocation = './test/input/boundaryPositions/secondteambottompenalty.json'
      let nextJSON = await setpieces.setupBottomPenalty(itlocation)
      let [pitchWidth, pitchHeight] = nextJSON.pitchSize

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.secondTeam.teamID).to.eql(nextJSON.ball.withTeam)
      expect(nextJSON.ball.position).to.eql([pitchWidth / 2, pitchHeight - 60])
      expect(nextJSON.ball.direction).to.eql('south')
      expect(nextJSON.secondTeam.players[10].currentPOS).to.eql([pitchWidth / 2, pitchHeight - 60])
      for (let player of nextJSON.secondTeam.players) {
        if (player.playerID != nextJSON.secondTeam.players[10].playerID) {
          expect(player.currentPOS[1]).to.be.lt(nextJSON.secondTeam.players[10].currentPOS[1])
        }
      }
      for (let player of nextJSON.kickOffTeam.players) {
        if (player.playerID != nextJSON.kickOffTeam.players[0].playerID) {
          expect(player.currentPOS[1]).to.be.lt(nextJSON.secondTeam.players[10].currentPOS[1])
        }
      }
    })
  })

  mocha.describe('testCorners()', function() {
    mocha.it('attacking team players are in relevant halves top left corner', async() => {
      let itlocation = './init_config/iteration.json'

      let nextJSON = await setpieces.setupTopLeftCorner(itlocation)
      let insideHalf = parseInt(nextJSON.pitchSize[1] / 2, 10)
      const [pitchWidth, pitchHeight] = nextJSON.pitchSize
      expect(nextJSON).to.be.an('object')
      for (let player of nextJSON.secondTeam.players) {
        if (player.position == 'GK' || player.position == 'CB') {
          expect(player.currentPOS[1]).to.be.greaterThan(insideHalf)
        } else if (player.position != 'LB' && player.position != 'RB') {
          expect(player.currentPOS[0]).to.be.greaterThan((pitchWidth / 4) + 5)
          expect(player.currentPOS[0]).to.be.lessThan((pitchWidth - (pitchWidth / 4) - 5))
          expect(player.currentPOS[1]).to.be.greaterThan(-1)
          expect(player.currentPOS[1]).to.be.lessThan((pitchHeight / 6) + 7)
        }
      }
    })
    mocha.it('attacking team players are in relevant halves bottom Left corner', async() => {
      let itlocation = './init_config/iteration.json'

      let nextJSON = await setpieces.setupBottomLeftCorner(itlocation)
      let insideHalf = parseInt(nextJSON.pitchSize[1] / 2, 10)
      const [pitchWidth, pitchHeight] = nextJSON.pitchSize
      expect(nextJSON).to.be.an('object')
      for (let player of nextJSON.kickOffTeam.players) {
        if (player.position == 'GK' || player.position == 'CB') {
          expect(player.currentPOS[1]).to.be.lessThan(insideHalf)
        } else if (player.position != 'LB' && player.position != 'RB') {
          expect(player.currentPOS[0]).to.be.greaterThan((pitchWidth / 4) + 5)
          expect(player.currentPOS[0]).to.be.lessThan((pitchWidth - (pitchWidth / 4) - 5))
          expect(player.currentPOS[1]).to.be.greaterThan(pitchHeight - (pitchHeight / 6) + 5)
          expect(player.currentPOS[1]).to.be.lessThan(pitchHeight + 1)
        }
      }
    })
    mocha.it('attacking team players are in relevant halves bottom right corner', async() => {
      let itlocation = './test/input/boundaryPositions/setCorners2.json'

      let nextJSON = await setpieces.setupBottomRightCorner(itlocation)
      let insideHalf = parseInt(nextJSON.pitchSize[1] / 2, 10)
      const [pitchWidth, pitchHeight] = nextJSON.pitchSize
      expect(nextJSON).to.be.an('object')
      for (let player of nextJSON.secondTeam.players) {
        if (player.position == 'GK' || player.position == 'CB') {
          expect(player.currentPOS[1]).to.be.lessThan(insideHalf)
        } else if (player.position != 'LB' && player.position != 'RB') {
          expect(player.currentPOS[0]).to.be.greaterThan((pitchWidth / 4) + 5)
          expect(player.currentPOS[0]).to.be.lessThan((pitchWidth - (pitchWidth / 4) - 5))
          expect(player.currentPOS[1]).to.be.greaterThan(pitchHeight - (pitchHeight / 6) + 5)
          expect(player.currentPOS[1]).to.be.lessThan(pitchHeight + 1)
        }
      }
    })
    mocha.it('attacking team players are in relevant halves top right corner', async() => {
      let itlocation = './test/input/boundaryPositions/setCorners2.json'

      let nextJSON = await setpieces.setupTopRightCorner(itlocation)
      let insideHalf = parseInt(nextJSON.pitchSize[1] / 2, 10)
      const [pitchWidth, pitchHeight] = nextJSON.pitchSize
      expect(nextJSON).to.be.an('object')
      for (let player of nextJSON.kickOffTeam.players) {
        if (player.position == 'GK' || player.position == 'CB') {
          expect(player.currentPOS[1]).to.be.greaterThan(insideHalf)
        } else if (player.position != 'LB' && player.position != 'RB') {
          expect(player.currentPOS[0]).to.be.greaterThan((pitchWidth / 4) + 5)
          expect(player.currentPOS[0]).to.be.lessThan((pitchWidth - (pitchWidth / 4) - 5))
          expect(player.currentPOS[1]).to.be.greaterThan(-1)
          expect(player.currentPOS[1]).to.be.lessThan((pitchHeight / 6) + 7)
        }
      }
    })
  })
  mocha.describe('testThrowIns()', function() {
    mocha.it('kick off team left throw in', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setpieces.setLeftKickOffTeamThrowIn(itlocation, [-5, 120])

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.kickOffTeam.players[0].currentPOS).to.eql([340, 0])
      expect(nextJSON.kickOffTeam.players[1].currentPOS).to.eql([80, 230])
      expect(nextJSON.kickOffTeam.players[2].currentPOS).to.eql([230, 230])
      expect(nextJSON.kickOffTeam.players[3].currentPOS).to.eql([420, 230])
      expect(nextJSON.kickOffTeam.players[4].currentPOS).to.eql([600, 230])
      expect(nextJSON.kickOffTeam.players[5].currentPOS).to.eql([0, 120])
      expect(nextJSON.kickOffTeam.players[6].currentPOS).to.eql([230, 420])
      expect(nextJSON.kickOffTeam.players[7].currentPOS).to.eql([10, 130])
      expect(nextJSON.kickOffTeam.players[8].currentPOS).to.eql([15, 120])
      expect(nextJSON.kickOffTeam.players[9].currentPOS).to.eql([10, 110])
      expect(nextJSON.kickOffTeam.players[10].currentPOS).to.eql([440, 650])
      expect(nextJSON.secondTeam.players[0].currentPOS).to.eql([340, 1050])
      expect(nextJSON.secondTeam.players[1].currentPOS).to.eql([80, 820])
      expect(nextJSON.secondTeam.players[2].currentPOS).to.eql([230, 820])
      expect(nextJSON.secondTeam.players[3].currentPOS).to.eql([420, 820])
      expect(nextJSON.secondTeam.players[4].currentPOS).to.eql([600, 820])
      expect(nextJSON.secondTeam.players[5].currentPOS).to.eql([20, 120])
      expect(nextJSON.secondTeam.players[6].currentPOS).to.eql([230, 630])
      expect(nextJSON.secondTeam.players[7].currentPOS).to.eql([30, 125])
      expect(nextJSON.secondTeam.players[8].currentPOS).to.eql([25, 105])
      expect(nextJSON.secondTeam.players[9].currentPOS).to.eql([10, 90])
      expect(nextJSON.secondTeam.players[10].currentPOS).to.eql([440, 400])
    })
    mocha.it('second off team left throw in', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setpieces.setLeftSecondTeamThrowIn(itlocation, [-5, 120])

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.kickOffTeam.players[0].currentPOS).to.eql([340, 0])
      expect(nextJSON.kickOffTeam.players[1].currentPOS).to.eql([80, 80])
      expect(nextJSON.kickOffTeam.players[2].currentPOS).to.eql([230, 80])
      expect(nextJSON.kickOffTeam.players[3].currentPOS).to.eql([420, 80])
      expect(nextJSON.kickOffTeam.players[4].currentPOS).to.eql([600, 80])
      expect(nextJSON.kickOffTeam.players[5].currentPOS).to.eql([20, 120])
      expect(nextJSON.kickOffTeam.players[6].currentPOS).to.eql([230, 270])
      expect(nextJSON.kickOffTeam.players[7].currentPOS).to.eql([30, 125])
      expect(nextJSON.kickOffTeam.players[8].currentPOS).to.eql([25, 105])
      expect(nextJSON.kickOffTeam.players[9].currentPOS).to.eql([10, 90])
      expect(nextJSON.kickOffTeam.players[10].currentPOS).to.eql([440, 500])
      expect(nextJSON.secondTeam.players[0].currentPOS).to.eql([340, 1050])
      expect(nextJSON.secondTeam.players[1].currentPOS).to.eql([80, 970])
      expect(nextJSON.secondTeam.players[2].currentPOS).to.eql([230, 970])
      expect(nextJSON.secondTeam.players[3].currentPOS).to.eql([420, 970])
      expect(nextJSON.secondTeam.players[4].currentPOS).to.eql([600, 970])
      expect(nextJSON.secondTeam.players[5].currentPOS).to.eql([0, 120])
      expect(nextJSON.secondTeam.players[6].currentPOS).to.eql([230, 780])
      expect(nextJSON.secondTeam.players[7].currentPOS).to.eql([10, 130])
      expect(nextJSON.secondTeam.players[8].currentPOS).to.eql([15, 120])
      expect(nextJSON.secondTeam.players[9].currentPOS).to.eql([10, 110])
      expect(nextJSON.secondTeam.players[10].currentPOS).to.eql([440, 550])
    })
    mocha.it('kick off team right throw in', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setpieces.setRightKickOffTeamThrowIn(itlocation, [1200, 120])

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.kickOffTeam.players[0].currentPOS).to.eql([340, 0])
      expect(nextJSON.kickOffTeam.players[1].currentPOS).to.eql([80, 230])
      expect(nextJSON.kickOffTeam.players[2].currentPOS).to.eql([230, 230])
      expect(nextJSON.kickOffTeam.players[3].currentPOS).to.eql([420, 230])
      expect(nextJSON.kickOffTeam.players[4].currentPOS).to.eql([600, 230])
      expect(nextJSON.kickOffTeam.players[5].currentPOS).to.eql([680, 120])
      expect(nextJSON.kickOffTeam.players[6].currentPOS).to.eql([230, 420])
      expect(nextJSON.kickOffTeam.players[7].currentPOS).to.eql([670, 130])
      expect(nextJSON.kickOffTeam.players[8].currentPOS).to.eql([665, 120])
      expect(nextJSON.kickOffTeam.players[9].currentPOS).to.eql([670, 110])
      expect(nextJSON.kickOffTeam.players[10].currentPOS).to.eql([440, 650])
      expect(nextJSON.secondTeam.players[0].currentPOS).to.eql([340, 1050])
      expect(nextJSON.secondTeam.players[1].currentPOS).to.eql([80, 820])
      expect(nextJSON.secondTeam.players[2].currentPOS).to.eql([230, 820])
      expect(nextJSON.secondTeam.players[3].currentPOS).to.eql([420, 820])
      expect(nextJSON.secondTeam.players[4].currentPOS).to.eql([600, 820])
      expect(nextJSON.secondTeam.players[5].currentPOS).to.eql([660, 120])
      expect(nextJSON.secondTeam.players[6].currentPOS).to.eql([230, 630])
      expect(nextJSON.secondTeam.players[7].currentPOS).to.eql([650, 125])
      expect(nextJSON.secondTeam.players[8].currentPOS).to.eql([655, 105])
      expect(nextJSON.secondTeam.players[9].currentPOS).to.eql([670, 90])
      expect(nextJSON.secondTeam.players[10].currentPOS).to.eql([440, 400])
    })
    mocha.it('second off team right throw in', async() => {
      let itlocation = './init_config/iteration.json'
      let nextJSON = await setpieces.setRightSecondTeamThrowIn(itlocation, [1200, 120])

      expect(nextJSON).to.be.an('object')
      expect(nextJSON.kickOffTeam.players[0].currentPOS).to.eql([340, 0])
      expect(nextJSON.kickOffTeam.players[1].currentPOS).to.eql([80, 80])
      expect(nextJSON.kickOffTeam.players[2].currentPOS).to.eql([230, 80])
      expect(nextJSON.kickOffTeam.players[3].currentPOS).to.eql([420, 80])
      expect(nextJSON.kickOffTeam.players[4].currentPOS).to.eql([600, 80])
      expect(nextJSON.kickOffTeam.players[5].currentPOS).to.eql([660, 120])
      expect(nextJSON.kickOffTeam.players[6].currentPOS).to.eql([230, 270])
      expect(nextJSON.kickOffTeam.players[7].currentPOS).to.eql([650, 125])
      expect(nextJSON.kickOffTeam.players[8].currentPOS).to.eql([655, 105])
      expect(nextJSON.kickOffTeam.players[9].currentPOS).to.eql([670, 90])
      expect(nextJSON.kickOffTeam.players[10].currentPOS).to.eql([440, 500])
      expect(nextJSON.secondTeam.players[0].currentPOS).to.eql([340, 1050])
      expect(nextJSON.secondTeam.players[1].currentPOS).to.eql([80, 970])
      expect(nextJSON.secondTeam.players[2].currentPOS).to.eql([230, 970])
      expect(nextJSON.secondTeam.players[3].currentPOS).to.eql([420, 970])
      expect(nextJSON.secondTeam.players[4].currentPOS).to.eql([600, 970])
      expect(nextJSON.secondTeam.players[5].currentPOS).to.eql([680, 120])
      expect(nextJSON.secondTeam.players[6].currentPOS).to.eql([230, 780])
      expect(nextJSON.secondTeam.players[7].currentPOS).to.eql([670, 130])
      expect(nextJSON.secondTeam.players[8].currentPOS).to.eql([665, 120])
      expect(nextJSON.secondTeam.players[9].currentPOS).to.eql([670, 110])
      expect(nextJSON.secondTeam.players[10].currentPOS).to.eql([440, 550])
    })
  })
  mocha.describe('setPenalties()', function() {
    mocha.it('in bottom penalty area', async() => {
      let itlocation = './test/input/boundaryPositions/kickoffteambottompenalty.json'
      let isInBottomPenaltyArea = await setpieces.inBottomPenalty(itlocation)
      expect(isInBottomPenaltyArea).to.eql(true)
    })
    mocha.it('in top penalty area', async() => {
      let itlocation = './test/input/boundaryPositions/kickoffteamtoppenalty.json'
      let isInBottomPenaltyArea = await setpieces.inTopPenalty(itlocation)
      expect(isInBottomPenaltyArea).to.eql(true)
    })
    mocha.it('not in bottom penalty area', async() => {
      let itlocation = './test/input/boundaryPositions/intentPositionATTinOwnHalf.json'
      let isInBottomPenaltyArea = await setpieces.inBottomPenalty(itlocation)
      expect(isInBottomPenaltyArea).to.eql(false)
    })
    mocha.it('not in top penalty area', async() => {
      let itlocation = './test/input/boundaryPositions/intentPositionATTinOwnHalf.json'
      let isInBottomPenaltyArea = await setpieces.inTopPenalty(itlocation)
      expect(isInBottomPenaltyArea).to.eql(false)
    })
  })

  mocha.describe('setGoalieHasBall()', function() {
    mocha.it('checkGoalieHasBall', async() => {
      let itlocation = './init_config/iteration.json'
      let goalieHasBallSetup = await setpieces.goalieHasBall(itlocation)
      expect(goalieHasBallSetup.kickOffTeam.players[0].hasBall).to.eql(true)
      expect(goalieHasBallSetup.ball.withPlayer).to.eql(true)
      expect(goalieHasBallSetup.ball.withTeam).to.eql('78883930303030002')
      expect(goalieHasBallSetup.kickOffTeam.players[0].currentPOS).to.be.eql(goalieHasBallSetup.ball.position)
    })
  })
}

module.exports = {
  runTest
}
