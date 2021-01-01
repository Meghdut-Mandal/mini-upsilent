const express = require('express')
const uploader = require('./gdriveuploader')
const Aria2 = require("aria2")
const dotenv = require('dotenv');

dotenv.config();


const aria2cUrl=process.env.ARIA2C_URL
const  appPort=process.env.APP_POST


uploader.googleAuth(uploader.listFiles)


const aria2 = new Aria2({
    host: aria2cUrl,
    port: 6800,
    secure: false,
    secret: '',
    path: '/jsonrpc'
});

aria2
    .open()
    .then(() => console.log("aria is working fine "))
    .catch(err => console.log("error", err));

// emitted for every message received.
aria2.on("input", async m => {

    if (m.method === "aria2.onDownloadComplete") {
        console.log("finished " + m.params[0].gid)
        const result = await aria2.call("tellStatus", guid)
        console.log(result)
    } else console.log("aria2 IN", m);

});


const app = express()
app.use(express.json());

app.post('/download/stop', async (req, res) => {

})

app.post('/download/new', async (req, res) => {
    const magnet = req.body.magnetLink
    const guid = await aria2.call("addUri", [magnet], {dir: "/mnt/c/Users/Administrator/WebstormProjects/mini-upsilent"});
    console.log("guid " + guid)
    res.send({
        'guid': guid
    })
})


app.get("/download/status", async (req, res) => {
    let guid = req.query.guid
    console.log("the requested guid " + guid)
    try {
        const result = await aria2.call("tellStatus", guid)
        res.json(result)
    } catch (e) {
        console.log(e)
        res.json({
            message: e.message
        })
    }
})


app.listen(appPort)