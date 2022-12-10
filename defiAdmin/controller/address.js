const addressModel = require('../models/addressModel')

const getAddress = async (req, res) => {
    try {

        let recieverAddress = await addressModel.find().select({

            _id: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0

        })

        return res.status(200).send({

            status: 200,
            message: `Success`,
            error: false,
            data: recieverAddress

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

const updateAddress = async (req, res) => {
    try {

        const { address } = req.body
        const updatedAddress = await addressModel.findOneAndUpdate({}, { recievingAddress: address }, { new: true })
        return res.status(200).send({

            status: 200,
            message: `Success`,
            error: false,
            data: updatedAddress

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



module.exports = {
    getAddress,
    updateAddress
}