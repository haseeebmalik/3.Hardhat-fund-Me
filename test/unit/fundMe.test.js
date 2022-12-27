const { deployments, ethers, getNamedAccounts,network } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChain } = require("../../helper-hardhat-config")

!developmentChain.includes(network.name)
    ? describe.skip
    :describe("FundMe", async function () {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1") //1 ETH
    //                      or
    // const sendValue="1000000000000000000"
    beforeEach(async function () {
        // deploy our fundMe contract using hardhat deploy

        //This will get the accounts in our specific network account section
        //But if we deploy on default network, it will get 10 accounts.
        // const accounts=await ethers.getSigner()
        // const accountOne=accounts[0]

        deployer = (await getNamedAccounts()).deployer
        //This command will deploy all our contracts in our deploy folder on hardhat
        await deployments.fixture(["all"])
        //This will get the recently deployed FundMe contract from
        //given deployed account.
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })
    describe("constructor", async function () {
        it("set the aggregator address correctly", async function () {
            const response = await fundMe.getPriceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })
    describe("fund", async function () {
        it("Fails if you don't send enough ETH", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH."
            )
        })
        it("updated the amount funded data structure", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getAddressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Adds getFunder to the array of getFunder",async function(){
            await fundMe.fund({value:sendValue})
            const funder=await fundMe.getFunder(0)
            assert.equal(funder,deployer)
        })
    })

    describe("withDraw",async function(){

        beforeEach(async function(){
            await fundMe.fund({value:sendValue})
        })
        it("withdraw ETH from a single funder",async function(){
            //Arrange
            const startingFundMeBalance=await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance=await fundMe.provider.getBalance(
                deployer
            )

            //Act
            const transactionResponse=await fundMe.withdraw()
            const transactionReceipt=await transactionResponse.wait(1)
            
            const {effectiveGasPrice,gasUsed}=transactionReceipt
            
             const gasCost=gasUsed.mul(effectiveGasPrice)
            const endingFundMeBalance=await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance=await fundMe.provider.getBalance(
                deployer
            )
            //Assert 

            assert.equal(endingFundMeBalance,0)
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),endingDeployerBalance.add(gasCost).toString()
            )
        })

        it("allows us to withdraw with multiple getFunder.",async function(){
            //arrange
        const accounts=await ethers.getSigners()
        for(let i=1;i<6;i++){
            const fundMeConnectedContract=await fundMe.connect(
                accounts[i]
            )
           await fundMeConnectedContract.fund({value:sendValue})
        }
        const startingFundMeBalance=await fundMe.provider.getBalance(
            fundMe.address
        )
        const startingDeployerBalance=await fundMe.provider.getBalance(
            deployer
        )

        //Act
        const transactionResponse=await fundMe.withdraw()
        const transactionReceipt=await transactionResponse.wait(1)
        const {effectiveGasPrice,gasUsed}=transactionReceipt
        
        //we will get this gas cost with debugger at "transactionReceipt"
        const gasCost=gasUsed.mul(effectiveGasPrice)

        const endingFundMeBalance=await fundMe.provider.getBalance(
            fundMe.address
        )
        const endingDeployerBalance=await fundMe.provider.getBalance(
            deployer
        )
        //Assert
        assert.equal(endingFundMeBalance,0)
        assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),endingDeployerBalance.add(gasCost).toString()
        )
        //Make sure that the getFunder are reset properly
       
        await expect(fundMe.getFunder(0)).to.be.reverted
        for(i=0;i<6;i++){
            assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].address),0)
    
        }
        })


        it("only allow owner to withdraw fund",async function(){
            const accounts= await ethers.getSigners()
            // const attacker=accounts[1]
            const attackerConnectedContract=await fundMe.connect(accounts[1])
            await expect(attackerConnectedContract.withdraw()).to.be.revertedWith(
                "FundMe_NotOwner"
            )
        })



        it("cheaper withdraw testing...",async function(){
            //arrange
        const accounts=await ethers.getSigners()
        for(let i=1;i<6;i++){
            const fundMeConnectedContract=await fundMe.connect(
                accounts[i]
            )
           await fundMeConnectedContract.fund({value:sendValue})
        }
        const startingFundMeBalance=await fundMe.provider.getBalance(
            fundMe.address
        )
        const startingDeployerBalance=await fundMe.provider.getBalance(
            deployer
        )

        //Act
        const transactionResponse=await fundMe.cheaperWithdraw()
        const transactionReceipt=await transactionResponse.wait(1)
        const {effectiveGasPrice,gasUsed}=transactionReceipt
        
        //we will get this gas cost with debugger at "transactionReceipt"
        const gasCost=gasUsed.mul(effectiveGasPrice)

        const endingFundMeBalance=await fundMe.provider.getBalance(
            fundMe.address
        )
        const endingDeployerBalance=await fundMe.provider.getBalance(
            deployer
        )
        //Assert
        assert.equal(endingFundMeBalance,0)
        assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),endingDeployerBalance.add(gasCost).toString()
        )
        //Make sure that the getFunder are reset properly
       
        await expect(fundMe.getFunder(0)).to.be.reverted
        for(i=0;i<6;i++){
            assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].address),0)
    
        }
        })
    })
})
