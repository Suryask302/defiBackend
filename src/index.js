
require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const route = require("./routes/route");
const cors = require("cors");
const adminRoutes = require('../defiAdmin/routes/adminPannel')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors("*"))

let PORT = process.env.PORT || 4000
const Data_Base_Url = "mongodb+srv://admin:admin123@siamaq.h4fjfrg.mongodb.net/dapp100Matic"

//MongoDB Connection
require('../defiAdmin/db/connect')

app.get("/", (req, res) => {
  res.send('hello from server')
});

app.use("/", route)
app.use('/', adminRoutes)

app.listen(PORT, (_) => console.log(`server is running on port ${PORT}`))