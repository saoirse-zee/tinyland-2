/**
 * dialApp
 * ID: 1
 * Draws a blob for each marker
 */
const appId = 1

const code = space => {
  // Find marker that corresponds to dialApp, i.e. marker #1
  const dialAppMarker = space.appMarkers[`${appId}`]
  if (!dialAppMarker) return space
  // Draw a line on it with angle of marker
  const dial = {
    id: 'dial',
    appId,
    type: 'dial',
    point: [0.2, 0.2],
    value: Math.round(dialAppMarker.a / (2 * Math.PI) * 100)
  }
  const nextVirtualObjects = {
    ...space.virtualObjects,
    'dial': dial
  }
  const nextSpace = {
    ...space,
    virtualObjects: nextVirtualObjects
  }
  return nextSpace
}

const dialApp = {
  id: appId,
  name: 'dialApp',
  code,
}

module.exports = dialApp