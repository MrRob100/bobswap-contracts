const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BobswapRecords", function () {
    let contract;
    let owner;

    beforeEach(async function () {

        //get contract
        const BobswapRecords = await ethers.getContractFactory("BobswapRecords");

        //deploy contract passing in any constructor args
        const BOBSWAPRECORDS = await BobswapRecords.deploy();

        //wait till actually deployed
        contract = await BOBSWAPRECORDS.deployed();

        [owner] = await ethers.getSigners();
    });

    it("Should be able to add and retrieve a user's pairs", async function() {
        await contract.addPair("AKRO", "NULS", 1, "Single", '{"0": "0xABC", "1": "0xXYZ"}');
        await contract.addPair("POLY", "CVC", 1, "Single", '{"0": "0xABC", "1": "0xXYZ"}');

        let pairs = await contract.getUsersPairs();

        expect(pairs[0]['token0Symbol']).to.equal("AKRO");
        expect(pairs[0]['token1Symbol']).to.equal("NULS");
        expect(pairs[1]['token0Symbol']).to.equal("POLY");
        expect(pairs[1]['token1Symbol']).to.equal("CVC");
    });

    it("Should be able to add and retrieve a user's nested pairs", async function() {
        await contract.addPairNested("REN", "LINK", 1, "Single", '{"0": "0xABC", "1": "0xXYZ"}');
        let counter = await contract.getCounter();
        let pair = await contract.getUsersPairNested(counter);

        expect(pair['token0Symbol']).to.equal("REN");
        expect(pair['token1Symbol']).to.equal("LINK");
    });

    it("Should be able to add and retrieve a user's pair's record", async function() {
        await contract.addPairNested("REN", "LINK", 1, "Single", '{"0": "0xABC", "1": "0xXYZ"}');
        let counter = await contract.getCounter();
        await contract.addRecordManually(counter, 20, 0, 200, 0, '0.04', '20');
        await contract.addRecordManually(counter, 0, 30, 0, 300, '0.05', '18');
        let records = await contract.getRecords(counter);

        expect(records[0]['balance_token0']).to.equal(20);
        expect(records[0]['balance_token1']).to.equal(0);
        expect(records[1]['balance_token0']).to.equal(0);
        expect(records[1]['balance_token1']).to.equal(30);
    })
});