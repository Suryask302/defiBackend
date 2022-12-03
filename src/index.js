const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const route = require("./routes/route");
const cors = require("cors");

dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors("*"))

let PORT = process.env.PORT || 4000
const Data_Base_Url = "mongodb+srv://admin:admin123@siamaq.h4fjfrg.mongodb.net/dapp100Matic"

//MongoDB Connection
mongoose
  .connect(Data_Base_Url, {
    useNewUrlParser: true,
  })

  .then(() => console.log("mongoDb Is Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send('hello from server')
});

app.use("/", route)

app.listen(PORT, (_) => console.log(`server is running on port ${PORT}`))