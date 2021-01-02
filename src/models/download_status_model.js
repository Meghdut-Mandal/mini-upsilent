const mongoose = require('mongoose')

const downloadStatusSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    guid: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    downloadPath: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('DownloadStatus', downloadStatusSchema)