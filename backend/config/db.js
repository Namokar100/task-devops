const mongoose = require('mongoose')
require('dotenv').config()

function mongoConncect() {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to mongodb"))
    .catch((error) => console.error("Error", error))
}

module.exports = mongoConncect;