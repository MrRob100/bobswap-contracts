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
});