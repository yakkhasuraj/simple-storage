// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, network, run } = require('hardhat');

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        'SimpleStorage'
    );
    console.log('Deploying contract...');

    const simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.deployed();

    console.log(`Deployed contract to: ${simpleStorage.address}`);

    if (network.config.chainId === 5 && ETHERSCAN_API_KEY) {
        console.log('Waiting for block confirmations...');
        await simpleStorage.deployTransaction.wait(6);
        await verify(simpleStorage.address, []);
    }

    const favoriteNumber = await simpleStorage.retrieve();
    console.log(`Favorite value is: ${favoriteNumber}`);

    const storeTransaction = await simpleStorage.store(7);
    await storeTransaction.wait(1);
    const newFavoriteNumber = await simpleStorage.retrieve();
    console.log(`New favorite value is: ${newFavoriteNumber}`);
}

async function verify(contractAddress, args) {
    console.log('Verifying contract...');
    try {
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (error) {
        if (error.message.toLowerCase().includes('already verified')) {
            console.log('Already Verified!');
        } else {
            console.log(error);
        }
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
