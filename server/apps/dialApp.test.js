import test from 'ava';
import dialApp from './dialApp'

test('dial appears when dialApp is active', t => {
  const previousSpace = {
    virtualObjects: {},
    appMarkers: {
      '1': {
        id: 1,
        x: 0,
        y: 0,
        a: 3,
      }
    }
  }
  const nextSpace = dialApp.code(previousSpace)
  const expectedSpace = {
    virtualObjects: {
      'dial': {
        id: 'dial',
        appId: 1,
        type: 'dial',
        point: [0, 0],
        angle: 3
      }
    },
    appMarkers: {
      '1': {
        id: 1,
        x: 0,
        y: 0,
        a: 3,
      }
    }
  }
	t.deepEqual(nextSpace, expectedSpace);
});

test('dial does not appear when dialApp is inactive', t => {
  const previousSpace = {
    virtualObjects: {},
    appMarkers: {
      '666': {
        id: 666,
        x: 0,
        y: 0,
        a: 0,
      }
    }
  }
  const nextSpace = dialApp.code(previousSpace)
  t.deepEqual(nextSpace, previousSpace);
})