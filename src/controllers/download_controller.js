const Download = require('../models/download_model');
const DownloadStatus = require('../models/download_status_model');
const cryptographic = require('crypto')
const Aria2 = require("aria2")
const dotenv = require('dotenv');
const rsyncController = require('../controllers/rclone_controller')
dotenv.config()

const aria2cUrl = process.env.ARIA2C_HOST
DownloadStatus.createIndexes({guid: 1}).then(value => console.log("guid indexed"))

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
        const result = await aria2.call("tellStatus", m.params[0].gid)
        if (result.files[0].path.indexOf("METADATA") === 1) {
            const newGID = result.followedBy[0]
            console.log("metadata download followed by " + newGID)
            let updater = {}
            updater.guid = newGID
            updater.status = 2
            updater = {$set: updater}
            DownloadStatus.updateOne({guid: m.params[0].gid}, updater).then(() => {
                console.log("updated " + m.params[0].gid + "  to " + newGID)
            })
        } else {
            DownloadStatus.find({guid: m.params[0].gid}).then(async fresult => {
                let updater = {}
                updater.status =12
                updater = {$set: updater}
                DownloadStatus.updateOne({guid: m.params[0].gid}, updater).then(() => {
                    console.log("updated status of " + m.params[0].gid + "  to " + 12)
                })
                await rsyncController.triggerCopy(fresult[0]._id)
                console.log("Uploading done !!")
                updater.status =13
                updater = {$set: updater}
                DownloadStatus.updateOne({guid: m.params[0].gid}, updater).then(() => {
                    console.log("updated status of " + m.params[0].gid + "  to " + 13)
                })
            })

        }

        console.log("result")
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
        status: 0,
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