
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
        console.log(error)
        return res.send({
            status: 500,
            error: true,
            message: `something went wrong`,
            data: null
        })
    }

}



module.exports = {
    getAllCoinPrices
}