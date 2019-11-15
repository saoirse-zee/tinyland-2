/**
 * BlobApp
 * ID: 9
 * Draws a blob for each marker
 */
const appId = 9

const code = space => {
  Object.keys(space.appMarkers).forEach(markerId => {
    const marker = space.appMarkers[markerId]
    space.virtualObjects[`blob-${markerId}`] = {
        id: `blob-${markerId}`,
        appId,
        type: 'blob',
        point: [marker.x, marker.y] // Put blob in center of marker
    }
  })
  
  return space
}

const blobApp = {
  id: appId,
  name: 'blobApp',
  code,
}

module.exports = blobApp