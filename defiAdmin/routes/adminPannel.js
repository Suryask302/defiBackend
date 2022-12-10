
const router = require('express').Router()
const { getAllCoinPrices } = require('../controller/coinPrice')

router.get('/getCoinPriceList',getAllCoinPrices)
module.exports = router