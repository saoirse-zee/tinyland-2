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
        a: 1, // dial is rotated 1 radian
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
        point: [0.2, 0.2],
        value: 16 // 1 radian is 16% of 2 pi
      }
    },
    appMarkers: {
      '1': {
        id: 1,
        x: 0,
        y: 0,
        a: 1,
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