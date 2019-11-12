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

// This app just draws a line between "shapes"
const lineApp = state => {
    // Map from shapes to sets of coords (that can later be fed to an svg.)
    const lineCoords = Object.keys(state)
        .map(id => {
            const thing = state[id]
            return thing
        })
        .filter(thing => thing.type === 'marker')
        .map(shape => [shape.x, shape.y])

    // Add the new line to state
    state['line-1'] = {
        id: 'line-1',
        type: 'line',
        data: lineCoords
    }

    return state
}

const blobApp = state => {
    Object.keys(state).forEach(id => {
        const thing = state[id]
        if (thing.type === 'marker') {
            state[`blob-${id}`] = {
                id: `blob-${id}`,
                type: 'blob',
                data: [thing.x, thing.y] // Put blob in center of marker
            }
        }
    })
    
    return state
}

let state = {
}

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
            const marker = parseBundle(bundle)
            if (marker) {
                state[marker.id] = {...marker, type: 'marker'}
            }
            
            // 2. Run apps
            state = lineApp(state)
            state = blobApp(state)

            console.log(state)
            console.log("=======")

    
            // 3. Send state to React app to be rendered
            Object.keys(state).forEach(key => {
                const item = state[key]
                // if (item.type === 'shape') {
                //     const msg = JSON.stringify({
                //         type: 'shape',
                //         payload: item
                //     })
                //     ws.send(msg)
                // }
                if (item.type === 'line') {
                    const msg = JSON.stringify({
                        type: 'line',
                        payload: item
                    })
                    ws.send(msg)
                }
                if (item.type === 'blob') {
                    const msg = JSON.stringify({
                        type: 'blob',
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
        // All of this checking seems silly. Better way?
        return bundle.packets &&
            bundle.packets.length > 0 &&
            bundle.packets[2] &&
            bundle.packets[2].args[0].value === 'set'
    }
    return marker.hasOwnProperty('id') && marker 
}

