import request from './lib/request';
import { pick } from './lib/util';
import { error } from './lib/logger';
import options from './lib/extractArgs';

function signin() {
  return request({
    url: `${options.vrestbaseurl}user/signin`,
    method: 'POST',
    payload: pick(options, 'email', 'password'),
  });
}

function extractCookie(data) {
  return data.headers['set-cookie'][0];
}

function callFetchApi(cook) {
  return request({
    url: options.url,
    method: 'GET',
    headers: { Cookie: cook },
  });
}

async function main() {
  try {
    let data = await signin();
    data = extractCookie(data);
    await callFetchApi(data);
  } catch (erm) {
    error(erm);
  }
}

main();
