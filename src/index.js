import request from './lib/request';
import { log } from './lib/logger';
import options from './lib/extractArgs';

function signin() {
  request({
    url: `${options.vrestbaseurl}user/signin`,
    method: 'POST',
    payload: `{"email":"${options.email}","password":"${options.password}"}`,
  }).then((resp) => {
    log(resp.parsed);
  });
}

signin();
