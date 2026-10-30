import test from 'node:test';
import assert from 'node:assert/strict';

import * as source from '../ts/src/canonical.js';
import * as shipped from '../dist/canonical.js';

const sparseCases: { name: string; make: () => unknown; path: string }[] = [
  { name: 'one missing element', make: () => Array(1), path: '[0]' },
  { name: 'all missing elements', make: () => Array(3), path: '[0]' },
  { name: 'leading hole', make: () => [, 1], path: '[0]' },
  { name: 'interior hole', make: () => [1, , 2], path: '[1]' },
  { name: 'trailing hole', make: () => [1, ,], path: '[1]' },
  {
    name: 'deleted element',
    make: () => { const a = [1, 2]; delete a[0]; return a; },
    path: '[0]',
  },
  { name: 'nested array hole', make: () => [[1, ,]], path: '[0][1]' },
  { name: 'object-nested hole', make: () => ({ items: [1, , 2] }), path: '.items[1]' },
  { name: 'explicit undefined', make: () => [undefined], path: '[0]' },
];

for (const [name, api] of Object.entries({ source, shipped })) {
  for (const c of sparseCases) {
    test(`${name}: reject ${c.name} with its index path`, () => {
      assert.throws(() => api.canonicalJson(c.make()), (error: unknown) => {
        assert.ok(error instanceof api.CanonicalJsonError);
        assert.equal(error.path, c.path);
        assert.equal(error.message, `undefined value at ${c.path}`);
        return true;
      });
    });
  }

  test(`${name}: an inherited numeric property cannot fill a hole`, () => {
    let reads = 0;
    const prototype = Object.create(Array.prototype);
    Object.defineProperty(prototype, '0', { get() { reads += 1; return 42; } });
    const value = Object.setPrototypeOf(Array(1), prototype);
    assert.throws(() => api.canonicalJson(value), api.CanonicalJsonError);
    assert.equal(reads, 0, 'do not read an inherited value for a missing element');
  });

  test(`${name}: inputFingerprint rejects sparse-array aliases`, () => {
    for (const items of [Array(1), [1, ,], [1, , 2]]) {
      assert.throws(() => api.inputFingerprint({ items }), api.CanonicalJsonError);
    }
    assert.notEqual(api.inputFingerprint({ items: [] }), api.inputFingerprint({ items: [null] }));
  });

  test(`${name}: array traversal keeps its original length when a getter appends`, () => {
    const value: number[] = [0];
    Object.defineProperty(value, '0', { get() { value.push(2); return 1; } });
    assert.equal(api.canonicalJson(value), '[1]');
    assert.equal(value.length, 2);
  });

  test(`${name}: a getter cannot hide a hole by truncating the original array`, () => {
    const value = [0, 2];
    Object.defineProperty(value, '0', { get() { value.length = 1; return 1; } });
    assert.throws(() => api.canonicalJson(value), (error: unknown) => {
      assert.ok(error instanceof api.CanonicalJsonError);
      assert.equal(error.path, '[1]');
      return true;
    });
  });

  test(`${name}: dense, empty and null-valued arrays retain canonical bytes`, () => {
    const value = { z: [null, false, 0, '', [1, 2], {}], a: [] };
    const before = JSON.stringify(value);
    assert.equal(api.canonicalJson(value), '{"a":[],"z":[null,false,0,"",[1,2],{}]}');
    assert.equal(JSON.stringify(value), before);
    assert.equal(api.canonicalJson(Object.setPrototypeOf([1, null], null)), '[1,null]');
    assert.equal(api.canonicalJsonText(' [null, 1, []] '), '[null,1,[]]');
  });
}
