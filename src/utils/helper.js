//Required field validation

const axios = require('axios');
const coinDataModel = require('../models/coinDataModel');

const isValid = (value) => {
  if (typeof value == "undefined" || value == null) return false;
  if (typeof value == "String" && value.trim().length === 0) return false;
  if (typeof value == "Number" && value.toString().length === 0) return false;
  return true;
};

//Empty requestBody validation
const isValidRequestBody = (requestBody) => {
  if (Object.keys(requestBody).length > 0) return true;
  return false;
};

const getmaticRateByCmcApi = async () => {

  try {

    let maticRate = await coinDataModel.findOne({ symbol: 'MATIC' }).select({ rateInUsd: 1 })
    return maticRate[`rateInUsd`]

  } catch (error) {
    return error.message
  }

}

const getBNBRateByCmcApi = async () => {

  try {

    let bnbRate = await coinDataModel.findOne({ symbol: 'BNB' }).select({ rateInUsd: 1 })
    return bnbRate[`rateInUsd`]
    
  } catch (error) {
    return error[`message`]
  }
}



module.exports = { isValid, isValidRequestBody, getmaticRateByCmcApi, getBNBRateByCmcApi };