import http from 'http';
import https from 'https';
import urlp from 'url';
import fs from 'fs';
import { isObject, ifNoCaseKeyExists, pick, stringify } from './util';

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
      if (error) reject(typeof error === 'string' ? new RequestError(error) : error);
      else resolve(data);
    }
    if (typeof options === 'string') {
      [url, method, parser] = [options, 'GET', JSON.parse];
    } else if (isObject(options)) {
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
        if (Math.floor((toSend.statusCode / 100)) === 2) {
          cb(null, toSend);
        } else {
          cb(toSend);
        }
      }
      res.on('error', respond);
      res.on('end', respond);
    });
    req.once('error', reject);
    if (payload !== undefined) {
      payload = stringify(payload);
      req.end(payload);
    } else if (options.payloadStream instanceof fs.ReadStream) {
      const mo = (isObject(options.multipartOptions) ? options.multipartOptions : {});
      if (!(mo.boundaryKey)) {
        mo.boundaryKey = Math.random().toString(16).substr(2, 11);
      }
      req.setHeader('content-type', `multipart/form-data; boundary="----${mo.boundaryKey}"`);
      if (mo.contentLength) {
        req.setHeader('Content-Length', mo.contentLength);
      }
      if (isObject(mo.formData)) {
        Object.entries(mo.formData).forEach(([formKey, formValue]) => {
          req.write(`------${mo.boundaryKey}\r\nContent-Disposition: form-data; name="${formKey}"\r\n\r\n${formValue}\r\n`);
        });
      }
      req.write(`------${mo.boundaryKey}\r\nContent-Type: ${(mo.mimeType || 'application/octet-stream')}\r\nContent-Disposition: form-data; name="${(mo.fieldName || 'file1')}"; filename="${(mo.fileName || 'filename')}"\r\n\r\n`);
      options.payloadStream.pipe(req, { end: false });
      options.payloadStream.once('end', req.end.bind(req, `\r\n------${mo.boundaryKey}--\r\n`));
      options.payloadStream.once('error', reject);
    } else {
      req.end();
    }
    return undefined;
  });
}

export default request;
