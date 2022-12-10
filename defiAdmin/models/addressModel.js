const { model, Schema } = require("mongoose")

const addressSchema = new Schema({

    recievingAddress: {
        type: String,
        required: true
    }

}, { timestamps: true })

module.exports = model('recieveraddress', addressSchema)