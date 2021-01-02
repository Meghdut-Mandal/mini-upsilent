const Download = require('../models/download_model');
const DownloadStatus = require('../models/download_status_model');
const cryptographic = require('crypto')
const Aria2 = require("aria2")
const dotenv = require('dotenv');
dotenv.config()

const aria2cUrl = process.env.ARIA2C_URL


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
        // const result = await aria2.call("tellStatus", m.params[0].gid)
    } else console.log("aria2 IN", m);

});
exports.addDownload = async (req, res, next) => {

    const fullId = cryptographic.randomBytes(8).toString("hex")
    const download = new Download({
        _id: fullId,
        userId: req.body.userId,
        link: req.body.link,
        name: req.body.name
    })

    const downloadLocation = process.env.LOCAL_DOWNLOAD_ROOT + "/" + fullId

    await download.save();
    const g = await aria2.call("addUri", [req.body.link], {dir: downloadLocation});
    res.json({
        'guid': g
    })
    const status = new DownloadStatus({
        _id: fullId,
        guid: g,
        status: 1,
        downloadPath: downloadLocation
    })
    await status.save()
}

exports.getStatus = async (req, res) => {
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
}