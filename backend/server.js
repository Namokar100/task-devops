const express = require('express')
require('dotenv').config()
const mongoConncect = require('./config/db')
const cookieParser = require("cookie-parser");
const cors = require('cors')


const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
      origin: "http://localhost:5173", 
      credentials: true,
    })
);

mongoConncect();

//testing
app.use('/home', (req, res) => {
    res.status(200).send("Home")
})

app.listen(process.env.PORT, () => {
    console.log("Listening at post 5000")
})