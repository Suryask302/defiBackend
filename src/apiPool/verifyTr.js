
const { isValid } = require("../utils/helper")
const axios = require('axios')


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
                    coinRate = 61.00000
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
        console.log(rate)
        return res.status(200).send({
            status: 200,
            message: 'Successs',
            data: rate.data

        })
    } catch (error) {

    }

}

module.exports = {
    globalVerify,
    getBlockauraRate
} 
