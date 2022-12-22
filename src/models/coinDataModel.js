const { Schema, model } = require('mongoose')

const coinDataSchema = new Schema({

    name: {
        type: String,
        trim: true
    },

    symbol: {
        type: String
    },

    slug: {
        type: String
    },

    maxSupply: {
        type: String
    },

    isActive: {
        type: Number
    },

    cmcRank: {
        type: Number
    },

    rateInUsd : {
        type : Number
    }

})

module.exports = model('cmcapidata', coinDataSchema)