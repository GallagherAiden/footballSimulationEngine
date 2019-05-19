const mocha = require('mocha')
const { expect } = require('chai')
const common = require('../lib/common')
const setPos = require('../lib/setPositions')

function runTest() {
    mocha.describe('relativePositionsDefence()', function () {
        mocha.it('kickoff team defensive players move towards ball on opposite side', async () => {

        })
        mocha.it('secondteam defensive players move towards ball on opposite side', async () => {

        })
        mocha.it('kickoff team defensive players ball in own half in front', async () => {

        })
        mocha.it('kickoff team defensive players ball in own half but behind', async () => {

        })
        mocha.it('second team defensive players ball in own half in front', async () => {

        })
        mocha.it('second team defensive players ball in own half but behind', async () => {

        })
    })
    mocha.describe('relativePositionsAttacking()', function () {
        mocha.it('kickoff team attacking from behind originPOS', async () => {

        })
        mocha.it('kickoff team attacking from originPOS', async () => {

        })
        mocha.it('kickoff team attacking from ahead of originPOS', async () => {

        })
        mocha.it('second team attacking from behind originPOS', async () => {

        })
        mocha.it('second team attacking from originPOS', async () => {

        })
        mocha.it('second team attacking from ahead of originPOS', async () => {

        })
    })
    mocha.describe('relativePositionsLooseBall()', function () {
        mocha.it('kickoff team moves towards ball', async () => {

        })
        mocha.it('second team moves towards ball', async () => {

        })
    })
}

module.exports = {
    runTest
}