import assert from 'assert'
const request = require(`../${process.env.TEST_DIR||'src'}/lib/request`).default

describe('GET', () => {
  describe('simplest', () => {
    it('https', (done) => {
      request('http://vrest.io/health',(err,resp)=>{
        assert.equal(err,null);
        assert(resp);
        assert.deepEqual(resp.parsed,{ok:true});
        done();
      })
    })
  });
})
