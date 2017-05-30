import assert from 'assert'
const util = require(`../${process.env.TEST_DIR||'src'}/lib/util`)
const { noop, isObject, ifNoCaseKeyExists, pick } = util;

describe('isObject', () => {
  it('string', () => {
    assert.equal(isObject('owier'), false)
  })
  it('object', () => {
    assert.equal(isObject({}), true)
  })
  it('array', () => {
    assert.equal(isObject([]), false)
  })
  it('null', () => {
    assert.equal(isObject(null), false)
  })
})

describe('ifNoCaseKeyExists', () => {
  it('+', () => {
    assert.equal(ifNoCaseKeyExists({ 'A' :1 },'a'), true);
  })
  it('-', () => {
    assert.equal(ifNoCaseKeyExists({ 'b' :1 },'a'), false);
  })
})

describe('pick', () => {
  describe('object', () => {
    it('1', () => {
      assert.deepEqual(pick({ 'A' :1 },'A'), { A : 1 });
    })
    it('mul', () => {
      assert.deepEqual(pick({ B : 'owerwer','A' :1, prop : 12 },'A', 'prop'),{ A : 1, prop : 12 });
    })
  })
  describe('array', () => {
    it('1', () => {
      assert.deepEqual(pick([1,2],0), [1]);
    })
    it('mul', () => {
      assert.deepEqual(pick([1,2,3,4],1,3),{ '1': 2, '3': 4 });
    })
    it('reverse mul', () => {
      assert.deepEqual(pick([1,2,3,4],3,1),{ '1': 2, '3': 4 });
    })
  })
})
