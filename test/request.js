import assert from 'assert'
import request from '../src/lib/request'

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
