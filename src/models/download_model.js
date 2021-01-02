const mongoose = require('mongoose')


const downloadSchema = mongoose.Schema({
    userId: String,
    _id: String,
    link: String,
    name: String
})

module.exports = mongoose.model('Download', downloadSchema)