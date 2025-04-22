const DECIMAL = 8
const INITIAL_ANSWER = 300000000000
const LOCK_TIME = 180
const devlopmentChains = ["hardhat", "local"]
//对应不同链的配置
const networkConfig = {
    11155111: {
        ethUsdDataFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    },
    97: {
        ethUsdDataFeed: "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7"
    }
}

//需要等待确认的数量
const CONFIRMATIONS = 5

module.exports = {
    DECIMAL,
    INITIAL_ANSWER,
    LOCK_TIME,
    devlopmentChains,
    networkConfig,
    CONFIRMATIONS
}