const mongoose = require('mongoose')
const express = require('express')
const uploader = require('./src/controllers/gdriveuploader')
const dotenv = require('dotenv');
const donwloadControler =require('./src/controllers/download_controller')

dotenv.config();

const  appPort=process.env.APP_PORT

uploader.googleAuth(uploader.listFiles)

const app = express()
app.use(express.json());

app.post('/download/stop', async (req, res) => {

})

app.post('/download/new',donwloadControler.addDownload);

app.get("/download/status", donwloadControler.getStatus)


mongoose.connect('mongodb://localhost:27017/upsilent', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    console.log('connected to db')
}).catch((error) => {
    console.log(error)
})

app.listen(appPort)