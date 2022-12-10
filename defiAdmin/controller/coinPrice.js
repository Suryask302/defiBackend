
const coinPriceModel = require('../models/coinPriceModel')

const getAllCoinPrices = async (req, res) => {

    try {

        const listOfCoin = await coinPriceModel.find().select({

            _id: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0

        })

        return res.status(200).send({
            status: 200,
            message: `Success`,
            error: false,
            data: listOfCoin,
        })

    } catch (error) {
        return res.status(200).send({
            status: 500,
            error: true,
            message: `something went wrong`,
            data: null
        })
    }

}

const updateCoinRate = async (req, res) => {

    try {

        const { coinId, rate, isManual } = req.body

        let updateQuery = {}



        if ('rate' in req.body) {

            if (!updateQuery.hasOwnProperty('$set')) {
                updateQuery['$set'] = {}
            }

            updateQuery['$set']['coinPrice'] = rate
        }

        if ('isManual' in req.body) {

            if (!updateQuery.hasOwnProperty('$set')) {
                updateQuery['$set'] = {}
            }

            updateQuery['$set']['isRateManual'] = isManual
        }

        const updatedDoc = await coinPriceModel.findOneAndUpdate(

            { coinId },
            updateQuery,
            { new: true }

        )

        return res.status(200).send({

            status: 200,
            message: `Success`,
            error: false,
            data: {
                coinName: updatedDoc['coinName'],
                coinPrice: updatedDoc['coinPrice'],
                isManual : updatedDoc['isRateManual']
            }

        })



    } catch (error) {

        return res.status(200).send({
            status: 500,
            error: true,
            message: `updation Failed`,
            data: null
        })

    }

}

module.exports = {
    getAllCoinPrices,
    updateCoinRate
}