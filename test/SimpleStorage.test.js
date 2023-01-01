const { assert } = require('chai');
const { ethers } = require('hardhat');

describe('SimpleStorage', function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.

    let simpleStorageFactory;
    let simpleStorage;

    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory('SimpleStorage');
        simpleStorage = await simpleStorageFactory.deploy();
    });

    it('should start with a favorite number of 0', async function () {
        const actual = await simpleStorage.retrieve();
        const expected = '0';
        assert.equal(actual.toString(), expected);
    });

    it('should update favorite number', async function () {
        const expected = '10';
        const storeTransaction = await simpleStorage.store(expected);
        await storeTransaction.wait(1);

        const actual = await simpleStorage.retrieve();
        assert.equal(actual.toString(), expected);
    });

    it('should add person and their favorite number', async function () {
        const expectedPerson = 'Patrick';
        const expectedFavoriteNumber = '16';
        const addPersonTransaction = await simpleStorage.addPerson(
            expectedPerson,
            expectedFavoriteNumber
        );
        await addPersonTransaction.wait(1);

        const { favoriteNumber, name } = await simpleStorage.people(0);
        assert.equal(name, expectedPerson);
        assert.equal(favoriteNumber, expectedFavoriteNumber);
    });
});
