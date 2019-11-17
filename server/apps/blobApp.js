/**
 * BlobApp
 * ID: 9
 * Draws a blob for each marker
 */
const appId = 9

const code = space => {
  const { dial } = space.virtualObjects
  const dialValue = dial && dial.value
  const size = dialValue | 10
  Object.keys(space.appMarkers).forEach(markerId => {
    const people = Object.values(space.people)
    const marker = space.appMarkers[markerId]
    const x = marker.x
    const y = people.length > 0
      ? 0.9
      : marker.y
    
    space.virtualObjects[`blob-${markerId}`] = {
        id: `blob-${markerId}`,
        appId,
        type: 'blob',
        point: [x, y],
        size,
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