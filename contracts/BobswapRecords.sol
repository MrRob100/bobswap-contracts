// SPDX-License-Identifier: UNLICENSED
//pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

// Uncomment this line to use console.log
//import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

contract BobswapRecords {
    using Counters for Counters.Counter;

    Counters.Counter public _pairCounter;

    enum SwapType {
        Single,
        MultiHop
    }

    struct Record {
        uint256 balance_token0; // * 1000
        uint256 balance_token1; // * 1000
        uint256 balance_token0_usd; // * 1000
        uint256 balance_token1_usd; // * 1000
        string price_token_0;
        string price_token_1;
        string note;
        uint256 date;
    }

    struct Pair {
        string token0Symbol;
        string token1Symbol;
        bool active;
        uint256 automation_thresh;
        SwapType swap_type;
        string pool_addresses;
    }

    mapping(address => Pair[]) usersPairsArray;

    mapping(address => mapping(uint => Pair)) usersPairsArrayNested;

    mapping(address => mapping(uint => Record[])) addressToPairIdToPairRecordsArray;

    function addPairNested(
        string memory token0Symbol,
        string memory token1Symbol,
        uint256 automation_thresh,
        string calldata swap_type,
        string memory pool_addresses) public
    {
        _pairCounter.increment();

        usersPairsArrayNested[msg.sender][_pairCounter.current()] = Pair(
            token0Symbol,
            token1Symbol,
            true,
            automation_thresh,
            SwapType.Single,
            pool_addresses
        );
    }

    function getUsersPairNested(uint id) public view returns (Pair memory) {
        return usersPairsArrayNested[msg.sender][id];
    }

    function getCounter() public view returns (uint) {
        return _pairCounter.current();
    }

    function addPair(
        string memory token0Symbol,
        string memory token1Symbol,
        uint256 automation_thresh,
        string calldata swap_type,
        string memory pool_addresses) external
    {
        usersPairsArray[msg.sender].push(Pair(
            token0Symbol,
            token1Symbol,
            true,
            automation_thresh,
            SwapType.Single,
            pool_addresses
        ));
    }

    function getUsersPairs() public view returns (Pair[] memory) {
        return usersPairsArray[msg.sender];
    }

//    function addRecord(
//        uint256 pairId,
//        uint256 balance_token0,
//        uint256 balance_token1,
//        uint256 balance_token0_usd,
//        uint256 balance_token1_usd,
//        string price_token_0,
//        string price_token_1,
//        string note,
//        string date //'now' keyword)
//    ) external {
        //all params should be generated from the router contract apart from note which will be 'automated'
//    }

    function addRecordManually(
        uint256 pairId,
        uint256 balance_token0,
        uint256 balance_token1,
        uint256 balance_token0_usd,
        uint256 balance_token1_usd,
        string memory price_token_0,
        string memory price_token_1
    ) external {
        _pairCounter.increment();

        addressToPairIdToPairRecordsArray[msg.sender][pairId].push(Record(
            balance_token0,
            balance_token1,
            balance_token0_usd,
            balance_token1_usd,
            price_token_0,
            price_token_1,
            'manually added',
            block.timestamp
        ));
    }

    function getRecords(uint256 pairId) public view returns (Record[] memory) {
        return addressToPairIdToPairRecordsArray[msg.sender][pairId];
    }
}
