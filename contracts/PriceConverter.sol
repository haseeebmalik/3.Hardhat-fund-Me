//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


// a library can also have state variables and can send ethers
// All the functions in a library are internal.
library PriceConverter {


    function getPrice(AggregatorV3Interface priceFeed) internal returns(uint256){
        //ABI
        //Address 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
    //  AggregatorV3Interface priceFeed=AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
    
      (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        //ETH in term of USD.
        //3000.00000000
        //here uint256 is type casting from int to uint256 because message.value is uint.
        //remember that not all type are castable, some types including int256 and uint256 are convertable into eachother. 
        //we multipy the price with 1e10 because it already have 8 decimals and we take it to 18 decimals because 1eth=1e18
        return uint256(price * 1e10);
    }
    function getConversionRate(uint256 ethAmount,AggregatorV3Interface priceFeed) internal returns(uint256) {
        uint256 ethPrice=getPrice(priceFeed);
        uint256 ethAmountInUsd=(ethPrice*ethAmount)/1e18;
        return ethAmountInUsd;
    }
   


}