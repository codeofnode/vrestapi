import options from './extractArgs';

export function error(...args) {
  if (options.loglevel > -1) {
    console.error(...args); // eslint-disable-line no-console
  }
}
export function warn(...args) {
  if (options.loglevel > 0) {
    console.warn(...args); // eslint-disable-line no-console
  }
}
export function log(...args) {
  if (options.loglevel > 1) {
    console.log(...args); // eslint-disable-line no-console
  }
}
