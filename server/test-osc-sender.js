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

setInterval(() => {
    const x = Math.random()
    const y = Math.random()
    const angle = 0
    const id = Math.round(Math.random() * 4)
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

