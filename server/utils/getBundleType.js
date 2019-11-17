function getBundleType(bundle) {
  // All of this checking seems silly. Better way?
  if (
    bundle.packets &&
    bundle.packets.length > 0 &&
    bundle.packets[2] &&
    bundle.packets[2].args[0].value === "set"
  ) {
    return 'marker';
  }

  if (
    bundle.packets &&
    bundle.packets.length > 0 &&
    bundle.packets[0].address === '/person'
  ) {
    return 'person'
  }

  return null
}

module.exports = getBundleType
