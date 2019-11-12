/**
 * LineApp
 * ID: 9
 * Draws a line between "blobs"
 */
const lineApp = state => {
  // Map from shapes to sets of coords (that can later be fed to an svg.)
  const lineCoords = Object.keys(state)
      .map(id => {
          const thing = state[id]
          return thing
      })
      .filter(thing => thing.type === 'blob')
      .map(blob => [blob.data[0], blob.data[1]])

  // Add the new line to state
  state['line-1'] = {
      id: 'line-1',
      type: 'line',
      data: lineCoords
  }

  return state
}

module.exports = lineApp