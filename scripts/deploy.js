//imports
const { ethers, run, network } = require("hardhat");
require("@nomiclabs/hardhat-etherscan");

//async main
async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying Contract.......");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log(`Deploying contract to: ${simpleStorage.address}`);
  console.log(network.config)
  // checks if we are deplying to rinkaby test net and will verify if true
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    console.log ("Wating for block txes...")
    await simpleStorage.deployTransaction.wait(6)  
    await verify(simpleStorage.address, [])
  } 
  //gets current value
  const currentVale = await simpleStorage.retrieve()
  console.log(`Current Value is: ${currentVale}`)

  // update current value
  const transactionResponse = await simpleStorage.store(7)
  await transactionResponse.wait(1)
  const updatedValue = await simpleStorage.retrieve()
  console.log(`Updated Vale is: ${updatedValue}`)



}
// varify contract
async function verify(contractAddress, args) {
  console.log("verifying contract!!.....");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
}

//calling main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
