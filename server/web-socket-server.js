const { DateTime, Duration } = require("luxon");
const WebSocket = require("ws");
const osc = require("osc");
const blobApp = require("./apps/blobApp");
const lineApp = require("./apps/lineApp");

const apps = [blobApp, lineApp];

const WS_PORT = 1234;
const OSC_PORT = 3333;

const wss = new WebSocket.Server({ port: WS_PORT });

const udpPort = new osc.UDPPort({
  localAddress: "127.0.0.1",
  localPort: OSC_PORT,
  metadata: true
});

let state = {
  virtualObjects: {},
  appMarkers: {}
};
const MARKER_LIFETIME = Duration.fromObject({ seconds: 3 });

udpPort.on("ready", function() {
  wss.on("connection", function connection(ws) {
    console.log("a browser connected");
    const msg = JSON.stringify({
      type: "string",
      payload: "web socket server has connected"
    });
    ws.send(msg);

    ws.on("message", function incoming(message) {
      console.log("received: %s", message);
    });

    // 1. Receive bundles of data about the physical world
    udpPort.on("bundle", function(bundle) {
      const appMarker = parseBundle(bundle);
      if (appMarker) {
        state.appMarkers[appMarker.id] = {
          ...appMarker,
          deathDate: DateTime.local().plus(MARKER_LIFETIME)
        };
      }

      // 2. Run apps
      const activeMarkers = Object.values(state.appMarkers).filter(
        marker => marker.deathDate >= DateTime.local()
      ); // Deathdate must be in future to be alive
      const activeMarkerIds = activeMarkers.map(m => m.id);
      const newAppMarkers = activeMarkers.reduce((prev, curr) => {
        prev[curr.id] = curr;
        return prev;
      }, {});
      state.appMarkers = newAppMarkers;

      const activeApps = apps.filter(app => activeMarkerIds.includes(app.id));
      console.log("apps:");
      activeApps.forEach(a => console.log(a.name));

      // 2b. Clean up
      Object.keys(state.virtualObjects).forEach(itemId => {
        const item = state.virtualObjects[itemId];
        if (!activeMarkerIds.includes(item.appId)) {
          delete state.virtualObjects[itemId];
        }
      });

      activeApps.forEach(app => {
        state = app.code(state);
      });

      // 3. Send state to React app to be rendered
      console.log("====");

      Object.keys(state.virtualObjects).forEach(key => {
        const item = state.virtualObjects[key];
        console.log("item: ", item.id);
        if (item.type === "line") {
          const msg = JSON.stringify({
            type: "line",
            payload: item
          });
          ws.send(msg);
        }
        if (item.type === "blob") {
          const msg = JSON.stringify({
            type: "blob",
            payload: item
          });
          ws.send(msg);
        }
      });
    });
  });
});

udpPort.on("error", function(err) {
  console.log("error......... oh nooooooooooo");
  console.log(err);
});

udpPort.open();

function parseBundle(bundle) {
  const marker = {};
  if (isMarker()) {
    // See TUIO docs to make sense of these args
    // http://www.tuio.org/?specification
    // /tuio/2Dobj set s i x y a X Y A m r
    //     index     0 1 2 3 4 5 6 7 8 9 10
    marker.id = bundle.packets[2].args[2].value;
    marker.x = bundle.packets[2].args[3].value;
    marker.y = bundle.packets[2].args[4].value;
    marker.a = bundle.packets[2].args[5].value;
  }
  function isMarker() {
    // All of this checking seems silly. Better way?
    return (
      bundle.packets &&
      bundle.packets.length > 0 &&
      bundle.packets[2] &&
      bundle.packets[2].args[0].value === "set"
    );
  }
  return marker.hasOwnProperty("id") && marker;
}
