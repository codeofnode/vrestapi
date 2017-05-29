import request from './lib/request';
import { pick } from './lib/util';
import { error, log } from './lib/logger';
import options from './lib/extractArgs';

function signin() {
  return request({
    url: `${options.vrestbaseurl}user/signin`,
    method: 'POST',
    payload: pick(options, 'email', 'password'),
  });
}

async function main() {
  await signin;
  return signin();
}
