const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    console.log('connected to db')
}).catch((error) => {
    console.log(error)
})
const downloadSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
})
const downloadStatusSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    guid: {
        type: String,
        required: true
    },
    status: {
        types: Number,
        required: true
    },
    downloadPath: {
        type: String,
        required: true
    }
})

const userSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

const downloads = mongoose.model('downloads', downloadSchema)
const downloadStatuses = mongoose.model('downloadStatus', downloadStatusSchema)
const users = mongoose.model('users', userSchema)