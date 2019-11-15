/**
 * LineApp
 * ID: 7
 * Draws a line between "blobs"
 */
const appId = 7
const code = state => {
  // Map from shapes to sets of coords (that can later be fed to an svg.)
  const lineCoords = Object.values(state.virtualObjects)
      .filter(virtualObject => virtualObject.type === 'blob')
      .map(blob => [blob.data[0], blob.data[1]])

  // Add the new line to state
  state.virtualObjects['line-1'] = {
      id: 'line-1',
      appId,
      type: 'line',
      data: lineCoords
  }

  return state
}

const lineApp = {
  id: appId,
  name: 'lineApp',
  code,
}

module.exports = lineApp