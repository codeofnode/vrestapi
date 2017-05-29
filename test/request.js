import assert from 'assert'
const request = require(`../${process.env.TEST_DIR||'src'}/lib/request`).default

describe('GET', () => {
  describe('simplest', () => {
    it('https', (done) => {
      request('http://vrest.io/health').then(parsed => {
        assert(resp);
        assert.deepEqual(resp.parsed,{ok:true});
        done();
      }).catch(err => {
        assert(err, null);
        done();
      });
    })
  });
})
