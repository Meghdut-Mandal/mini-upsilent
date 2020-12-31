const express = require('express')

const app = express()
app.use(express.json());


const Aria2 = require("aria2")
const aria2 = new Aria2({
    host: '52.66.207.145',
    port: 6800,
    secure: false,
    secret: '',
    path: '/jsonrpc'
})


aria2
    .open()
    .then(() => console.log("aria is open "))
    .catch(err => console.log("error", err));

// emitted for every message sent.
aria2.on("output", m => {
    console.log("aria2 OUT", m);
});

// emitted for every message received.
aria2.on("input", m => {
    console.log("aria2 IN", m);
});



app.post('/download/stop', async (req, res) => {

})

app.post('/download/new', async (req, res) => {
    const magnet = req.body.magnetLink
    const guid = await aria2.call("addUri", [magnet], {dir: "/home/ubuntu/download"});
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


app.listen(8080)