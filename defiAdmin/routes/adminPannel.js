
const router = require('express').Router()
const { getAddress, updateAddress } = require('../controller/address')
const { getAllCoinPrices, updateCoinRate } = require('../controller/coinPrice')

router
    .get('/getCoinPriceList', getAllCoinPrices)
    .post('/updatePrice', updateCoinRate)
    .get('/getAddress', getAddress)
    .post('/updateReceiverAddress', updateAddress)

module.exports = router