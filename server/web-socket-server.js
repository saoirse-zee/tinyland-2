const { DateTime, Duration } = require("luxon");
const WebSocket = require("ws");
const osc = require("osc");
const parseBundle = require("./utils/parseBundle");
const blobApp = require("./apps/blobApp");
const lineApp = require("./apps/lineApp");
const dialApp = require("./apps/dialApp");

const apps = [blobApp, lineApp, dialApp];

const WS_PORT = 1234;
const OSC_PORT = 3333;

const wss = new WebSocket.Server({ port: WS_PORT });

const udpPort = new osc.UDPPort({
  localAddress: "127.0.0.1",
  localPort: OSC_PORT,
  metadata: true
});

let space = {
  virtualObjects: {},
  appMarkers: {},
  people: {}
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
      const thing = parseBundle(bundle);
      if (thing && thing.type === 'marker') {
        space.appMarkers[thing.id] = {
          ...thing,
          deathDate: DateTime.local().plus(MARKER_LIFETIME)
        };
      }

      if (thing && thing.type === 'person') {
        space.people[thing.id] = {
          ...thing,
          deathDate: DateTime.local().plus(MARKER_LIFETIME)
        }
      }
      
      // 2. Run apps
      const activeMarkers = Object.values(space.appMarkers).filter(
        marker => marker.deathDate >= DateTime.local()
      ); // Deathdate must be in future to be alive
      const activeMarkerIds = activeMarkers.map(m => m.id);
      const newAppMarkers = activeMarkers.reduce((prev, curr) => {
        prev[curr.id] = curr;
        return prev;
      }, {});
      space.appMarkers = newAppMarkers;

      // Does this work? if so, could we do it for the apps 👆🏻
      const newPeople = Object.values(space.people)
        .filter(person => person.deathDate >= DateTime.local())
      space.people = newPeople

      const activeApps = apps.filter(app => activeMarkerIds.includes(app.id));
      console.log("apps:");
      activeApps.forEach(a => console.log(a.name));
      const people = Object.values(space.people)
      console.log("people:");
      people.forEach(person => console.log(person.id))

      // 2b. Clean up
      Object.keys(space.virtualObjects).forEach(itemId => {
        const item = space.virtualObjects[itemId];
        if (!activeMarkerIds.includes(item.appId)) {
          delete space.virtualObjects[itemId];
        }
      });

      activeApps.forEach(app => {
        space = app.code(space);
      });

      // 3. Send state to React app to be rendered
      console.log("====");
      const renderMsg = JSON.stringify({
          type: 'render',
          payload: space.virtualObjects
      })
      ws.send(renderMsg)
    });
  });
});

udpPort.on("error", function(err) {
  console.log("error......... oh nooooooooooo");
  console.log(err);
});

udpPort.open();
