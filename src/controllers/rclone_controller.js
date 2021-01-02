const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config()


const rcloneCopyUrl = "http://" + process.env.RCLONE_HOST + ":" + process.env.RCLONE_PORT + "/sync/copy"

exports.triggerCopy = async function (downloadID) {
    const body = {
        "srcFs": process.env.LOCAL_DOWNLOAD_ROOT + "/" + downloadID+"/",
        "dstFs": "gdrive:/" + downloadID + "/"
    }

    const res = await fetch(rcloneCopyUrl, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    })
    console.log(res)
}