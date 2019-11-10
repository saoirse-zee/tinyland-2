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

const state = {}

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

        // 1. Receive bundles of data about the physical world
        udpPort.on('bundle', function(bundle) {
            const shape = parseBundle(bundle)
            if (shape) {
                state[shape.id] = {...shape, type: 'shape'}
            }
            
            // 2. Run apps
            // This app just draws a line between "shapes"
            const thingLine = Object.keys(state)
            .map(id => {
                const thing = state[id]
                return thing
            })
            .filter(thing => thing.type === 'shape')
            .map(shape => [shape.x, shape.y])

            state['line-1'] = {
                id: 'line-1',
                type: 'line',
                data: thingLine
            }
    
            // 3. Send state to React app to be rendered
            Object.keys(state).forEach(key => {
                const item = state[key]
                if (item.type === 'shape') {
                    const msg = JSON.stringify({
                        type: 'shape',
                        payload: item
                    })
                    ws.send(msg)
                }
                if (item.type === 'line') {
                    const msg = JSON.stringify({
                        type: 'line',
                        payload: item
                    })
                    ws.send(msg)
                }
            })
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

