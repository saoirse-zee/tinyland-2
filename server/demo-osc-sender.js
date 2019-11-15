const osc = require("osc")

const udpPort = new osc.UDPPort({
    localAddress: "127.0.0.1",
    localPort: 20002,
    metadata: true,
})

udpPort.open()

// udpPort.send({
//     address: "/hello",
//     args: [
//         {
//             type: "s",
//             value: "hi"
//         },
//     ]
// }, "127.0.0.1", 20001);

function sampleData(id, x, y, angle) {
    return ({
        timeTag: { raw: [ 0, 1 ], native: 1573183934504 },
        packets: [
            { address: '/tuio/2Dobj', args: [
                { type: 's', value: 'source' },
                { type: 's', value: 'reacTIVision' }
            ] },
            { address: '/tuio/2Dobj', args: [
                { type: 's', value: 'alive' }, { type: 'i', value: 1 }
            ] },
            { address: '/tuio/2Dobj', args: [
                { type: 's', value: 'set' },
                { type: 'i', value: 1 },
                { type: 'i', value: id },
                { type: 'f', value: x},
                { type: 'f', value: y},
                { type: 'f', value: angle},
                { type: 'f', value: 0 },
                { type: 'f', value: 0 },
                { type: 'f', value: 0 },
                { type: 'f', value: 0 },
                { type: 'f', value: 0 }
            ] },
            { address: '/tuio/2Dobj', args: [
                { type: 's', value: 'fseq' }, { type: 'i', value: 69 }
            ] }
        ]
    })
}

// udpPort.send(sampleData(9, 0, 0, 0), "127.0.0.1", 3333);

const appIds = [7, 9, 1]
setInterval(() => {
    const x = Math.random()
    const y = Math.random()
    const angle = Math.random() * 2 * Math.PI
    const i = Math.round(Math.random() * (appIds.length - 1))
    const id = appIds[i]
    console.log(`sending: ${id}`)
    udpPort.send(sampleData(id, x, y, angle), "127.0.0.1", 3333);
}, 1000)

// udpPort.send({
//     timeTag: osc.timeTag(60), 
//     packets: [
//         {
//             address: "/hello/bundle",
//             args: [
//                 {
//                     type: "f",
//                     value: 440
//                 }
//             ]
//         },
//         {
//             address: "/carrier/amplitude",
//             args: [
//                 {
//                     type: "f",
//                     value: 0.5
//                 }
//             ]
//         }
//     ]
// }, "127.0.0.1", 3333);

