import fs from 'fs';
import urlp from 'url';
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

function saveToFile(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(options.filepath, JSON.stringify(data.parsed, null, '  '), (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function callApi(cook) {
  switch (options.apicall) {
    case 'import' :
      const urlob = urlp.parse(options.url,true);
      return request({
        url: `${urlob.protocol}//${urlob.host}${urlob.pathname.replace('/g/',`/import/${urlob.query.projectId}/json/`)}`,
        method: 'POST',
        headers: { cookie: cook },
        payloadStream: fs.createReadStream(options.filepath),
        multipartOptions: {
          formData : {
            tsAction: options.tsaction,
            _op: options.update,
            testSuiteId: options.testsuiteid
          }
        },
      });
    default :
      return request({
        url: options.url.replace('/g/', '/f/json/'),
        method: 'GET',
        headers: { cookie: cook },
      })
      .then(saveToFile);
  }
}

async function main() {
  try {
    let data = await signin();
    data = extractCookie(data);
    await callApi(data);
    process.exit(0);
  } catch (erm) {
    error(erm);
    process.exit(1);
  }
}

main();
