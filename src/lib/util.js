export const isObject = ob => (typeof ob === 'object' && ob !== null && !(Array.isArray(ob)));

export function noop() {}

export function ifNoCaseKeyExists(ob, key) {
  const keys = Object.keys(ob);
  let n = keys.length;
  while (n) {
    n -= 1;
    if (keys[n].toLowerCase() === key) return true;
  }
  return false;
}

export function pick(o, ...props) {
  return Object.assign({}, ...props.map(prop => ({ [prop]: o[prop] })));
}

export function stringify(input) {
  if (typeof input === 'string') return input;
  if (typeof input === 'object') {
    try {
      return JSON.stringify(input);
    } catch (err) {
      return String(input);
    }
  }
  return String(input);
}
