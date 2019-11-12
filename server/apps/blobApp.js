/**
 * BlobApp
 * ID: 9
 * Draws a blob for each marker
 */
const code = state => {
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

const blobApp = {
  id: 9,
  name: 'blobApp',
  code,
}

module.exports = blobApp