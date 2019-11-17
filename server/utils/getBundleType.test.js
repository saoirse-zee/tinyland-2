import test from 'ava';
import getBundleType from './getBundleType'

const personBundle = {
  "timeTag":{"raw":[0,1],"native":1573947421641},
  "packets":[
    {"address":"/person","args":[{"type":"s","value":"source"},{"type":"s","value":"helloBeautiful"}]},
    {"address":"/person","args":[{"type":"s","value":"emma"}]}]}

test('recognizes person bundles', t => {
  const type = getBundleType(personBundle)
  t.is(type, 'person')
})