const getBundleType = require('./getBundleType')

function parseBundle(bundle) {
  const bundleType = getBundleType(bundle)
  if (bundleType === 'marker') {
    const thing = {};
    // See TUIO docs to make sense of these args
    // http://www.tuio.org/?specification
    // /tuio/2Dobj set s i x y a X Y A m r
    //     index     0 1 2 3 4 5 6 7 8 9 10
    thing.type = 'marker'
    thing.id = bundle.packets[2].args[2].value;
    thing.x = bundle.packets[2].args[3].value;
    thing.y = bundle.packets[2].args[4].value;
    thing.a = bundle.packets[2].args[5].value;
    return thing.hasOwnProperty("id") && thing;
  }

  if (bundleType === 'person') {
    const thing = {}
    thing.type = 'person'
    thing.id = bundle.packets[1].args[0].value
    return thing
  }

  return null
}

module.exports = parseBundle
