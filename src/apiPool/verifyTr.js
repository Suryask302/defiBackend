
const { isValid, getmaticRateByCmcApi, getBNBRateByCmcApi } = require("../utils/helper")
const axios = require('axios')
const coinPriceModel = require("../../defiAdmin/models/coinPriceModel")


const globalVerify = async (req, res) => {

    try {

        let { txHash, coinName } = req.query

        if (!txHash) {
            return res.status(200).send({
                message: `Transaction Hash is required`
            })
        }

        if (!coinName) {
            return res.status(200).send({
                message: `coinName is required`
            })
        }

        if (Object.keys(req.query).length !== 2) {
            return res.status(200).send({
                message: `Dont send useLess Query Params`
            })
        }

        if (!isValid(txHash) || !isValid(coinName)) {
            return res.status(200).json({
                message: `invalid Tx Hash or invalid CoinName`,
                status: 400
            })
        }

        let coinRate;

        if (coinName.trim().toLowerCase() === 'matic(polygon)') {
            coinRate = 0.95123
        } else

            if (coinName.trim().toLowerCase() === 'blockaura 2.0(polygon)') {
                coinRate = 16.00000
            } else

                if (coinName.trim().toLowerCase() === 'blockaura 3.0(polygon)') {
                    coinRate = 13.19425
                } else

                    if (coinName.trim().toLowerCase() === 'busd(bep20)') {
                        coinRate = 1.00000
                    } else

                        if (coinName.trim().toLowerCase() === 'bnb(bep20)') {
                            coinRate = 332.49955
                        } else

                            if (coinName.trim().toLowerCase() === 'blockaura(bep20)') {
                                coinRate = 16.00000
                            } else

                                if (coinName.trim().toLowerCase() === 'usdt(polygon)') {
                                    coinRate = 1.00000

                                } else {
                                    return res.status(400).send({
                                        message: 'invalid coin Name'
                                    })
                                }

        if (

            coinName.trim().toLowerCase() === 'matic(polygon)' ||
            coinName.trim().toLowerCase() === 'blockaura 2.0(polygon)' ||
            coinName.trim().toLowerCase() === 'usdt(polygon)' ||
            coinName.trim().toLowerCase() === 'blockaura 3.0(polygon)'

        ) {

            let result = await axios({
                method: 'post',
                url: `http://139.59.69.218:3390/api/transactionPolygon`,
                data: {
                    hash: txHash
                }
            })

            console.log(result)

            if (!result['data']['data']) {
                return res.status(200).json({
                    message: `Invalid Transaction Hash`
                })
            }

            let { Token, Amount } = result['data']['data']

            if (!coinName.toLowerCase().startsWith(Token.toLowerCase())) {

                return res.status(200).send({
                    message: `Transaction Hash is Belongs to ${Token} and selected coin is ${coinName}`
                })
            }

            let dollorPaid = Number(Amount) * coinRate

            return res.status(200).send({
                message: `Success`,
                data: dollorPaid.toFixed(2)
            })


        } else {

            let result = await axios({
                method: 'post',
                url: `http://139.59.69.218:3390/api/transactionBsc`,
                data: {
                    hash: txHash
                }
            })

            if (!result['data']['data']) {
                return res.status(200).json({
                    message: `Invalid Transaction Hash`
                })
            }


            let { Amount, Token } = result['data']['data']

            if (!coinName.toLowerCase().startsWith(Token.toLowerCase())) {
                return res.status(200).send({
                    message: `Transaction Hash is Belongs to ${Token} and selected coin is ${coinName}`
                })
            }

            let dollorPaid = Number(Amount) * coinRate

            return res.status(200).send({
                message: `Success`,
                data: dollorPaid.toFixed(2)
            })

        }


    } catch (error) {
        console.log(error)
        res.status(200).json({
            status: 200,
            message: `Invalid Transaction Hash`
        })
    }


}


const getBlockauraRate = async (req, res) => {

    try {

        let rate = await axios.get('http://139.59.69.218:3390/api/rate')
        return res.status(200).send({
            status: 200,
            message: 'Successs',
            data: rate.data

        })

    } catch (error) {

    }

}

// this Api will show total ammount to paid and rate of coin to .net app

const getCalculatedRates = async (req, res) => {

    try {

        let { amtInUsd, coinName } = req.body

        if (!amtInUsd) {
            return res.status(200).send({
                status: 400,
                message: 'invalid Amount Enterd'
            })

        }

        if (!coinName) {
            return res.status(200).send({
                status: 400,
                message: 'please provide coinName'
            })

        }

        const coinArr = await coinPriceModel.find()

        if (coinName.trim().toLowerCase() === 'matic(polygon)') {

            let recCoinName = coinName.replace(/ /g, '')
            let currentRate = null
            let coin = coinArr.find(x => x['coinName'].trim().toLowerCase() === recCoinName.trim().toLowerCase())

            if (coin['isRateManual']) {

                currentRate = coin['coinPrice'].toFixed(5)

                return res.status(200).json({

                    status: 200,
                    message: "Success",
                    rate: currentRate,
                    needToPay: Number(amtInUsd / currentRate).toFixed(5)

                })

            } else {

                let rate = await getmaticRateByCmcApi()

                if (!rate) {

                    return res.status(200).json({
                        status: 500,
                        message: `unable to get rate`
                    })

                }

                currentRate = rate

                return res.status(200).json({

                    status: 200,
                    message: "Success",
                    rate: currentRate,
                    needToPay: Number(amtInUsd / currentRate).toFixed(5)

                })

            }

        } else if (coinName.trim().toLowerCase() === 'blockaura 3.0(polygon)') {

            let recCoinName = coinName.replace(/ /g, '')
            let currentRate = null
            let coin = coinArr.find(x => x['coinName'].trim().toLowerCase() === recCoinName.trim().toLowerCase())

            if (coin['isRateManual']) {

                currentRate = coin['coinPrice'].toFixed(5)

                return res.status(200).json({

                    status: 200,
                    message: "Success",
                    rate: currentRate,
                    needToPay: Number(amtInUsd / currentRate).toFixed(5)

                })


            } else {

                let rate = await axios.get('http://139.59.69.218:3390/api/rate')

                if (!rate['data'] || !rate['data']['tbac_in_usd']) {

                    return res.status(200).json({
                        status: 500,
                        message: `unable to get rate`
                    })

                }

                currentRate = rate['data']['tbac_in_usd'].toFixed(5)

                return res.status(200).json({

                    status: 200,
                    message: "Success",
                    rate: currentRate,
                    needToPay: Number(amtInUsd / currentRate).toFixed(5)

                })

            }

        } else if (coinName.trim().toLowerCase() === 'bnb(bep 20)') {


            let recCoinName = coinName.replace(/ /g, '')
            let currentRate = null
            let coin = coinArr.find(x => x['coinName'].trim().toLowerCase() === recCoinName.trim().toLowerCase())

            if (coin['isRateManual']) {

                currentRate = coin['coinPrice'].toFixed(5)

                return res.status(200).json({

                    status: 200,
                    message: "Success",
                    rate: currentRate,
                    needToPay: Number(amtInUsd / currentRate).toFixed(5)

                })

            }
            else {

                let rate = await getBNBRateByCmcApi()

                if (!rate) {

                    return res.status(200).json({
                        status: 500,
                        message: `unable to get rate`
                    })

                }

                currentRate = rate

                return res.status(200).json({

                    status: 200,
                    message: "Success",
                    rate: currentRate,
                    needToPay: Number(amtInUsd / currentRate).toFixed(5)

                })

            }


        } else if (

            coinName.trim().toLowerCase() === 'busd(bep20)' ||
            coinName.trim().toLowerCase() === 'usdt(polygon)'

        ) {

            let rate = 1.00000
            return res.status(200).json({

                status: 200,
                message: "Success",
                rate: rate,
                needToPay: Number(amtInUsd / rate).toFixed(5)

            })


        } else if (coinName.trim().toLowerCase() === 'blockaura 2.0(polygon)') {

            let rate = 16.00000
            return res.status(200).json({

                status: 200,
                message: "Success",
                rate: rate,
                needToPay: Number(amtInUsd / rate).toFixed(5)

            })



        } else if (coinName.trim().toLowerCase() === 'blockaura(bep20)') {

            let rate = 16.00000
            return res.status(200).json({

                status: 200,
                message: "Success",
                rate: rate,
                needToPay: Number(amtInUsd / rate).toFixed(5)

            })

        }
        else {

            return res.status(200).json({
                status: 200,
                message: 'Invalid Coin Name Selected'

            })

        }

    } catch (error) {

        console.log(error)
        return res.status(200).json({
            status: 200,
            message: `unable to get rate`
        })

    }

}


//send All coins rate

const sendAllCoinRates = async (req, res) => {

    try {


        let maticRate = await getmaticRateByCmcApi()

        if (!maticRate) {

            return res.status(200).json({
                status: 500,
                message: `unable to get rate`
            })

        }

        let MaticLiveRate = maticRate


        let blockAuraRate = await axios.get('http://139.59.69.218:3390/api/rate')

        if (!blockAuraRate['data'] || !blockAuraRate['data']['tbac_in_usd']) {

            return res.status(200).json({
                status: 500,
                message: `unable to get rate`
            })

        }

        let blockAuraLiveRate = blockAuraRate['data']['tbac_in_usd'].toFixed(5)


        let bnbRate = await getBNBRateByCmcApi()

        if (!bnbRate) {

            return res.status(200).json({
                status: 500,
                message: `unable to get rate`
            })
        }

        let bnbLiveRate = bnbRate

        return res.status(200).send({
            status: 200,
            message: `Success`,
            data: [
                {
                    coinName: `Matic(Polygon)`,
                    rate: MaticLiveRate
                },
                {
                    coinName: `blockAura 3.0(Polygon)`,
                    rate: blockAuraLiveRate
                },
                {
                    coinName: `bnb(bep 20)`,
                    rate: bnbLiveRate
                },
                {
                    coinName: `usdt(polygon)`,
                    rate: `1.00000`
                },
                {
                    coinName: `busd(bep 20)`,
                    rate: `1.00000`
                }

            ]
        })

    } catch (error) {

        return res.status(200).json({
            status: 200,
            message: `unable to get rate`
        })
    }

}




const xyz = async (req, res) => {

    try {

        let { txHash, coinName } = req.body

        if (!txHash) {
            return res.status(200).send({
                message: `Transaction Hash is required`
            })
        }

        if (!coinName) {
            return res.status(200).send({
                message: `coinName is required`
            })
        }

        if (Object.keys(req.body).length !== 2) {
            return res.status(200).send({
                message: `Dont send useLess Query Params`
            })
        }

        if (!isValid(txHash) || !isValid(coinName)) {
            return res.status(200).json({
                message: `invalid Tx Hash or invalid CoinName`,
                status: 400
            })
        }


        if (

            coinName.trim().toLowerCase() === 'matic(polygon)' ||
            coinName.trim().toLowerCase() === 'blockaura 2.0(polygon)' ||
            coinName.trim().toLowerCase() === 'usdt(polygon)' ||
            coinName.trim().toLowerCase() === 'blockaura 3.0(polygon)'

        ) {

            let result = await axios({
                method: 'post',
                url: `http://139.59.69.218:3390/api/transactionPolygon`,
                data: {
                    hash: txHash
                }
            })

            let apiResp = result['data']

            if (!result['data']['data']) {
                return res.status(200).json({
                    message: `Invalid Transaction Hash`
                })
            }

            let { Token, Amount } = result['data']['data']

            if (!coinName.toLowerCase().startsWith(Token.toLowerCase())) {

                return res.status(200).send({
                    message: `Transaction Hash is Belongs to ${Token} and selected coin is ${coinName}`
                })
            }

            const coinRate = await getmaticRateByCmcApi()
            let dollorPaid = Number(Amount) * coinRate

            return res.status(200).send({
                message: `Success`,
                data: {
                    dollorPaid: dollorPaid.toFixed(2),
                    ...apiResp['data']
                }
            })


        } else {

            let result = await axios({
                method: 'post',
                url: `http://139.59.69.218:3390/api/transactionBsc`,
                data: {
                    hash: txHash
                }
            })

            if (!result['data']['data']) {
                return res.status(200).json({
                    message: `Invalid Transaction Hash`
                })
            }


            let { Amount, Token } = result['data']['data']

            if (!coinName.toLowerCase().startsWith(Token.toLowerCase())) {
                return res.status(200).send({
                    message: `Transaction Hash is Belongs to ${Token} and selected coin is ${coinName}`
                })
            }

            let dollorPaid = Number(Amount) * coinRate

            return res.status(200).send({
                message: `Success`,
                data: dollorPaid.toFixed(2)
            })

        }


    } catch (error) {
        console.log(error)
        res.status(200).json({
            status: 200,
            message: `Invalid Transaction Hash`
        })
    }


}



const showTrData = async (req, res) => {

    try {

        let { txHash, coinName } = req.body

        if (!txHash) {
            return res.status(200).send({
                message: `Transaction Hash is required`
            })
        }

        if (!coinName) {
            return res.status(200).send({
                message: `coinName is required`
            })
        }

        if (Object.keys(req.body).length !== 2) {
            return res.status(200).send({
                message: `Dont send useLess Params`
            })
        }

        if (!isValid(txHash) || !isValid(coinName)) {
            return res.status(200).json({
                message: `invalid Tx Hash or invalid CoinName`,
                status: 400
            })
        }

        let coinRate;

        if (coinName.trim().toLowerCase() === 'matic(polygon)') {
            coinRate = await getmaticRateByCmcApi()
        } else

            if (coinName.trim().toLowerCase() === 'blockaura 2.0(polygon)') {
                coinRate = 16.00000
            } else

                if (coinName.trim().toLowerCase() === 'blockaura 3.0(polygon)') {
                    let blockAuraRate = await axios.get('http://139.59.69.218:3390/api/rate')
                    coinRate = blockAuraRate['data']['tbac_in_usd'].toFixed(5)

                } else

                    if (coinName.trim().toLowerCase() === 'busd(bep20)') {
                        coinRate = 1.00000
                    } else

                        if (coinName.trim().toLowerCase() === 'bnb(bep20)') {
                            coinRate = getBNBRateByCmcApi()
                        } else

                            if (coinName.trim().toLowerCase() === 'blockaura(bep20)') {
                                coinRate = 16.00000
                            } else

                                if (coinName.trim().toLowerCase() === 'usdt(polygon)') {
                                    coinRate = 1.00000

                                } else {
                                    return res.status(400).send({
                                        message: 'invalid coin Name'
                                    })
                                }

        if (

            coinName.trim().toLowerCase() === 'matic(polygon)' ||
            coinName.trim().toLowerCase() === 'blockaura 2.0(polygon)' ||
            coinName.trim().toLowerCase() === 'usdt(polygon)' ||
            coinName.trim().toLowerCase() === 'blockaura 3.0(polygon)'

        ) {

            let result = await axios({
                method: 'post',
                url: `http://139.59.69.218:3390/api/transactionPolygon`,
                data: {
                    hash: txHash
                }
            })


            if (!result['data']['data']) {
                return res.status(200).json({
                    message: `Invalid Transaction Hash`
                })
            }

            let apiResp = result['data']

            let { Token, Amount } = result['data']['data']

            if (!coinName.toLowerCase().startsWith(Token.toLowerCase())) {

                return res.status(200).send({
                    message: `Transaction Hash is Belongs to ${Token} and selected coin is ${coinName}`
                })
            }

            let dollorPaid = Number(Amount) * coinRate

            return res.status(200).send({
                message: `Success`,
                data: {
                    dollorPaid: dollorPaid.toFixed(2),
                    rate: coinRate,
                    ...apiResp[`data`]
                }
            })


        } else {

            let result = await axios({
                method: 'post',
                url: `http://139.59.69.218:3390/api/transactionBsc`,
                data: {
                    hash: txHash
                }
            })

            if (!result['data']['data']) {
                return res.status(200).json({
                    message: `Invalid Transaction Hash`
                })
            }

            let apiResp = result[`data`]

            let { Amount, Token } = result['data']['data']

            if (!coinName.toLowerCase().startsWith(Token.toLowerCase())) {
                return res.status(200).send({
                    message: `Transaction Hash is Belongs to ${Token} and selected coin is ${coinName}`
                })
            }

            let dollorPaid = Number(Amount) * coinRate

            return res.status(200).send({
                message: `Success`,
                data: {
                    dollorPaid: dollorPaid.toFixed(2),
                    rate: coinRate,
                    ...apiResp[`data`]
                }
            })

        }


    } catch (error) {
        console.log(error)
        res.status(200).json({
            status: 200,
            message: `Invalid Transaction Hash`
        })
    }



}




module.exports = {

    globalVerify,
    getBlockauraRate,
    getCalculatedRates,
    sendAllCoinRates,
    showTrData

} 
