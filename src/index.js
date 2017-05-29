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

function callApi(cook) {
  switch(options.apicall){
    case 'export' :
      return request({
        url: options.url.replace('/g/','/f/json/'),
        method: 'GET',
        headers: { Cookie: cook },
      });
    case 'import' :
  }
}

async function main() {
  try {
    let data = await signin();
    data = extractCookie(data);
    await callApi(data);
  } catch (erm) {
    error(erm);
  }
}

main();
