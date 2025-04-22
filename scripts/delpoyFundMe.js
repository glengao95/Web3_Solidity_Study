//从hardhat中引入ethers.js
const { ethers } = require("hardhat")

async function main() {
    // 获取合约工厂
    const FundMeFactory = await ethers.getContractFactory("FundMe");
    console.log("Deploying contract...");

    // 部署合约
    const fundMe = await FundMeFactory.deploy(200); // 100 是 FundMe 初始化入参

    // 等待合约部署完成 成功入块
    await fundMe.waitForDeployment();

    // 获取合约地址
    const contractAddress = await fundMe.getAddress();
    console.log(`Contract deployed successfully, address: ${contractAddress}`);
    // 如果是spolia 网络，验证合约
    if(hre.network.config.chainId == 11155111 && process.env.ETHER_API_KEY) {
        console.log("wait for 3 confirmations")
        await fundMe.deploymentTransaction().wait(3)
        console.log("verifying contract on etherscan...")
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: [200],
          });
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });