const { model, Schema } = require("mongoose")

const coinPriceModel = new Schema({

    coinId: {

        type: Number,
        required: true

    },

    coinName: {

        type: String,
        required: true

    },

    coinNetwork: {

        type: String,
        required: true

    },

    recievingAddress: {

        type: String,
        required: true

    },

}, { timestamps: true })

module.exports = model('coinprice', coinPriceModel)