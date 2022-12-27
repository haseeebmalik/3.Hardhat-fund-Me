const { networkConfig, developmentChain } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const {verify}=require("../utils/verify")
//import
//main function
//calling of main function

// function deployFunc(hre){
//     console.log("Hi!")
// }

// module.exports.default=deployFunc
//or
module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //if chainId is x use address y
    //if chainId is z use address a
    // const ethUsdPriceFeedAddress=networkConfig[chainId].ethUsdPriceFeed

    let ethUsdPriceFeedAddress
    if (developmentChain.includes(network.name)) {
        //it will get our most recent deployment with contract name
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    //well what happens when we are going to change the chain,like chainlink price feeds have different values against each chain
    //when going to localhost or hardhat network we want to use a mock

    //FundMe is the name of contract
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [
            /* put constructor arguments here */
            /* address ?*/
            ethUsdPriceFeedAddress,
        ], //put price feed address
        log: true,
        waitConfirmations:network.config.blockConfirmations||1
    })

    if (
        !developmentChain.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ){
      //verify our contract
      //args are the contructor of the contract
      let args=[ethUsdPriceFeedAddress]
      await verify(fundMe.address,args)
    }
        log("---------------------------------------")
}
module.exports.tags = ["all", "fundme"]
