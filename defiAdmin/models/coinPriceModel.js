const { model, Schema } = require("mongoose")

const coinPriceModel = new Schema({

    coinId: {
        type: Number,
        required: true
    },

    coinPrice: {
        type: Number
    },

    coinName: {
        type: String
    },

    coinNetwork: {
        type: String,
        required: true,
        trim: true
    },

    isRateManual: {
        type: Boolean,
        required: true,
        default: false
    }

}, { timestamps: true })

module.exports = model('coinprice', coinPriceModel)