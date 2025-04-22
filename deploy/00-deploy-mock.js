const { DECIMAL,INITIAL_ANSWER,devlopmentChains  } = require("../helper-hardhat-config")

module.exports= async({getNamedAccounts, deployments}) => {
    const {firstAccount} = await getNamedAccounts()
    const {deploy} = deployments
    //判断当前网络是否需要mock
    if(devlopmentChains.includes(network.name)) {
        await deploy("MockV3Aggregator", {
            from: firstAccount,
            args: [DECIMAL, INITIAL_ANSWER],
            log: true
        })
    }else{
        console.log("Network is not sepolia, MockV3Aggregator skipped...")
    }
    
}

module.exports.tags = ["all", "mock"]