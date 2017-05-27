import http from 'http';
import https from 'https';
import urlp from 'url';
import { noop, isObect, ifNoCaseKeyExists, pick } from './util';

function request(options, cb = noop) {
  let url;
  let method;
  let payload;
  let headers;
  let parser;
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
  if (!ifNoCaseKeyExists(headers,'content-type')) headers['content-type'] = 'application/json';
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
      cb(null, toSend);
    }
    res.on('error', respond);
    res.on('end', respond);
  });
  if (payload !== undefined) {
    payload = JSON.stringify(payload);
    req.write(payload);
  }
  req.once('error', er => cb(`ERROR_WHILE_REQUEST: ${er.message || er}`));
  req.end();
  return req;
}

export default request;
