# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
here we use npx hardhat deploy to deploy contracts.


**
This is basically demonistration that how to work and test with interfaces on
test networks.

Here we also do a brief testing of the contract.
Here we also see a good way to debug the solidity test and contract.
Here we also see some good practices for writing a good solidity contract.
Here we also learn how to minimize gas cost.By updating and reading the state variable as possible.

There are three main gas optamization techniques:
  1: do less read and update state variables.
  2: make more use of revert with errorcode,instead of writing string in require.
  3:Memory constant and immutable variables dont go to storage.
**


For hardhat deploy we need to run a command:

  
also install hardhat-deploy package.
 and also run this to override @nomiclabs/hardhat-ethers with @npm:hardhat-deploy-ethers

npm i --save-dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers --legacy-peer-deps  

Now create a depoy folder.
Now add diff. contracts in it so that you can deploy different contracts with commands.

now run npx hardhat deploy

What if you have two files in deploy folder ,and you only want to deploy one contract.
 
 for this add this at the end of file:
   module.exports.tags=["all","mocks"]
   now you have to specify one word from tag, at in deploy script,it it will deploy your specific contract in that script file.

   For deploy run command:
    it will run a specific deploy file with specified tags
    npx hardhat deploy --tags mocks

    but after you also complete your deploy-fund-me.js 

    Now if you run "npx hardhat deploy" it will automatically runs all hardhat deploy folder files. 

    Now if we run npx hardhat node it will show us out previous tx.
    history.


                 Good solidity practice:

  In fundMe.sol we will do commenting that how to write a good contract.




                                Debugging and unit testing:
*note that we are doing all this in fundme.test.js

click on Run and debug on the right most menu.
Then click on javascript debug terminal
then click on red dot on the line you want to debug.
then run npx hardhat test.

you can also write console.log in solidity and while running test you can get logs from solidity files.
For this please view https://hardhat.org/tutorial/debugging-with-hardhat-network .


                      ===>  Staging test  <=== 
      
    This is the test we do after unit testing with test network.

    For this we first have to deploy it on test network by:
    npx hardhat deploy --network goerli
      then 
    npx hardhat test --network goerli



                       Running scripts on local node:
  First create a folder scripts and add files in it as i do,

  The file fund.js is for is the future if we want to fund our project really quickly then we will run this script.
  other file i.e withdraw is for if we want to withdraw the fund we use this script.

  Now if you want to run it locally ,then first make a local node by:

   npx hardhat node 

   Then open a new side terninal and run

   npx hardhat run scripts/fund.js --network localhost



  











