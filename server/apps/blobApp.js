/**
 * BlobApp
 * ID: 9
 * Draws a blob for each marker
 */
const appId = 9

const code = state => {
  Object.keys(state.appMarkers).forEach(markerId => {
    const marker = state.appMarkers[markerId]
    state.virtualObjects[`blob-${markerId}`] = {
        id: `blob-${markerId}`,
        appId,
        type: 'blob',
        point: [marker.x, marker.y] // Put blob in center of marker
    }
  })
  
  return state
}

const blobApp = {
  id: appId,
  name: 'blobApp',
  code,
}

module.exports = blobApp