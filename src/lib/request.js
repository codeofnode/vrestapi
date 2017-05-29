import http from 'http';
import https from 'https';
import urlp from 'url';
import { isObect, ifNoCaseKeyExists, pick, stringify } from './util';

class RequestError extends Error {
  constructor(message) {
    super(message);
    this.name = RequestError.name;
  }
}

function request(options) {
  let url;
  let method;
  let payload;
  let headers;
  let parser;
  return new Promise((resolve, reject) => {
    function cb(error, data) {
      if (error) reject(new RequestError(error));
      else resolve(data);
    }
    if (typeof options === 'string') {
      [url, method, parser] = [options, 'GET', JSON.parse];
    } else if (isObect(options)) {
      ({ url, method, payload, headers } = options);
      parser = (typeof options.parser === 'function' ? options.parser : JSON.parse);
    } else {
      return cb('INVALID_OPTIONS');
    }
    if (typeof url !== 'string' || !url.length) return cb('URL_NOT_FOUND');
    if (typeof method !== 'string' || !method.length) return cb('METHOD_NOT_FOUND');
    if (typeof headers !== 'object' || headers === null) headers = {};
    const obj = urlp.parse(url);
    obj.method = method;
    if (!ifNoCaseKeyExists(headers, 'content-type')) headers['content-type'] = 'application/json';
    obj.headers = headers;
    const req = (obj.protocol === 'https:' ? https : http).request(obj, (res) => {
      let resc = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { resc += chunk; });
      function respond() {
        const toSend = pick(res, 'statusCode', 'headers');
        toSend.content = resc;
        if (typeof parser === 'function') {
          try {
            toSend.parsed = parser(resc);
          } catch (er) {
            toSend.parseError = er;
          }
        }
        if((toSend.statusCode % 100) === 2){
          cb(null, toSend);
        } else {
          cb(toSend);
        }
      }
      res.on('error', respond);
      res.on('end', respond);
    });
    if (payload !== undefined) {
      payload = stringify(payload);
      req.write(payload);
    }
    req.once('error', reject);
    req.end();
    return undefined;
  });
}

export default request;
