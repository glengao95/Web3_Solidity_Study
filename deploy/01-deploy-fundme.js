const { LOCK_TIME, devlopmentChains, networkConfig,CONFIRMATIONS } = require("../helper-hardhat-config")


module.exports= async({getNamedAccounts, deployments}) => {
    const {firstAccount} = await getNamedAccounts()
    const {deploy} = deployments

    let dataFeedAddr
    let confirmations
    //判断当前网络是否需要mock
    console.log(`network.name is ${network.name}`)
    console.log(`network.config.chainId is ${network.config.chainId}`)
    if(devlopmentChains.includes(network.name)) {
        const mockV3Aggregator = await deployments.get("MockV3Aggregator")    
        dataFeedAddr = mockV3Aggregator.address
        confirmations = 0
    } else {
        //获取不同chainId对应的不同喂价合同地址
        dataFeedAddr = networkConfig[network.config.chainId].ethUsdDataFeed
        confirmations = CONFIRMATIONS
    }

    const fundMe = await deploy("FundMe", {
        from: firstAccount,
        args: [LOCK_TIME, dataFeedAddr],
        log: true,
        waitConfirmations : confirmations,
    })

    //加上sepolia的verify
    console.log(`ETHER_API_KEY is ${process.env.ETHER_API_KEY}`)
    if(network.config.chainId == 11155111 && process.env.ETHER_API_KEY) {
        await hre.run("verify:verify", {
            address: fundMe.address,
            constructorArguments: [LOCK_TIME, dataFeedAddr],
          });        
    } else {
        console.log("Network is not sepolia, verification skipped...")
    }

}

module.exports.tags = ["all", "fundme"]