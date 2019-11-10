const WebSocket = require('ws');
const osc = require('osc')

const WS_PORT = 1234 
const OSC_PORT = 3333

const wss = new WebSocket.Server({ port: WS_PORT});

const udpPort = new osc.UDPPort({
    localAddress: '127.0.0.1',
    localPort: OSC_PORT,
    metadata: true,
})

udpPort.on('ready', function() {
    wss.on('connection', function connection(ws) {
        console.log('a browser connected')
        const msg = JSON.stringify({
            type: 'string',
            payload: 'web socket server has connected'
        })
        ws.send(msg);

        ws.on('message', function incoming(message) {
            console.log('received: %s', message);
        });

        udpPort.on('bundle', function(bundle) {
            const shape = parseBundle(bundle)
            if (shape) {
                const msg = JSON.stringify({
                    type: 'shape',
                    payload: shape
                })
                ws.send(msg)
            }
        })
    });
})

udpPort.on('error', function(err) {
    console.log('error......... oh nooooooooooo') 
    console.log(err) 
})

udpPort.open()

function parseBundle(bundle) {
    const marker = {}
    if (isMarker()) {
        // See TUIO docs to make sense of these args
        // http://www.tuio.org/?specification
        // /tuio/2Dobj set s i x y a X Y A m r
        //     index     0 1 2 3 4 5 6 7 8 9 10
        marker.id = bundle.packets[2].args[2].value
        marker.x  = bundle.packets[2].args[3].value
        marker.y  = bundle.packets[2].args[4].value
        marker.a  = bundle.packets[2].args[5].value
    }
    function isMarker() {
        return bundle.packets[2].args[0].value === 'set'
    }
    return marker.hasOwnProperty('id') && marker 
}

