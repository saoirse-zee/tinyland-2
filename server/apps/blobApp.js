/**
 * BlobApp
 * ID: 7
 * Draws a blob for each marker
 */
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

module.exports = blobApp