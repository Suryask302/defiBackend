
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
            data: listOfCoin
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

        const { coinId, rate } = req.body

        const updatedDoc = await coinPriceModel.findOneAndUpdate(

            { coinId },
            { coinPrice: rate },
            { new: true }

        )

        return res.status(200).send({

            status: 200,
            message: `Success`,
            error: false,
            data: {
                coinName: updatedDoc['coinName'],
                coinPrice: updatedDoc['coinPrice']
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