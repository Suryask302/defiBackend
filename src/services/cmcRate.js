const axios = require('axios')
const coinDataModel = require('../models/coinDataModel')
require('dotenv').config()

const { log } = console


async function updateRateInDb() {

    try {

        let maticRate = await axios.get(
            "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=MATIC",
            {
                headers: {
                    "X-CMC_PRO_API_KEY": process[`env`][`CMCAPINEW`],
                },
            }
        )

        if (!maticRate.data.data.MATIC[0].quote.USD.price) {
            return ({ message: `unable to get rate` })
        }

        const extractData = maticRate[`data`][`data`][`MATIC`][0]
        const { price } = extractData[`quote`][`USD`]
        const newRate = Number(price).toFixed(5)

        await coinDataModel.findOneAndUpdate(
            { symbol: 'MATIC' },
            { rateInUsd: newRate },
            { new: true }
        )
        console.log('matic rate Updated')

    } catch (error) {
        console.log(error['message'])
    }

}

const updateBnbRateInDb = async() => {

    try {

        let bnbRate = await axios.get(
            "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=BNB",
            {
                headers: {
                    "X-CMC_PRO_API_KEY": process[`env`][`CMCAPINEW`],
                },
            }
        )

        if (!bnbRate.data.data.BNB[0].quote.USD.price) {
            return ({ message: `unable to get rate` })
        }

        const extractData = bnbRate[`data`][`data`][`BNB`][0]
        const { price } = extractData[`quote`][`USD`]
        const newRate = Number(price).toFixed(5)

        await coinDataModel.findOneAndUpdate(
            { symbol: 'BNB' },
            { rateInUsd: newRate },
            { new: true }
        )

        console.log('BNB rate Updated')

    } catch (error) {
        console.log(error['message'])
    }
}



setInterval(() => {

    updateRateInDb()
    updateBnbRateInDb()

},100000 )
