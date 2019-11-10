const osc = require("osc")

const udpPort = new osc.UDPPort({
    localAddress: "127.0.0.1",
    localPort: 3333,
    metadata: true,
})

// udpPort.on("message", function (msg) {
//     console.log(msg)
// })

udpPort.on("bundle", function (bundle) {
    console.log(bundle)
})

udpPort.on("error", function (err) {
    console.log("😬 error")
    console.log(err)
})

udpPort.open()

udpPort.on("ready", function () {
    console.log("ready")
})

