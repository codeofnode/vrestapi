const getStringValue = (inp) => {
  if (inp === '1' || inp === 'true') return true;
  if (inp) return inp;
  return undefined;
};

const ALLOWED_API_CALLS = ['export', 'import'];
const ALLOWED_LOG_LEVELS = ['prod', 'test', 'dev'];

const options = { };
let showHelp = false;
const { version, what, desc } = require('../package.json'); // eslint-disable-line import/no-unresolved

const argvs = process.argv.slice(2);
const arl = argvs.length;
for (let z = 0; z < arl; z += 1) {
  const arg = argvs[z];
  const ind = arg.indexOf('=');
  if (ind === -1) {
    showHelp = `Argument ${arg} must have \`=\` as separator.`;
    break;
  }
  const key = arg.substr(0, ind);
  const value = getStringValue(arg.substr(ind + 1));
  const val = ALLOWED_LOG_LEVELS.indexOf(value);
  switch (key.toLowerCase()) {
    case '-c':
    case '--apicall':
      if (ALLOWED_API_CALLS.indexOf(value) !== -1) {
        options.apicall = value;
      } else {
        showHelp = `Allowed values for \`${key}\` must be one of \`${String(ALLOWED_API_CALLS)}\`.`;
      }
      break;
    case '-l':
    case '--loglevel':
      if (val !== -1) {
        options.loglevel = val;
      } else {
        showHelp = `Allowed values for \`${key}\` must be one of \`${String(ALLOWED_LOG_LEVELS)}\`.`;
      }
      break;
    case '-h':
    case '--help':
      showHelp = true;
      break;
    default :
      showHelp = `Invalid argument \`${key}\` was provided. Try again with valid arguments.`;
  }
}

if (showHelp) {
  console.log(`\n    ${what} - ${desc} .\n`); // eslint-disable-line no-console
  console.log(`    version - ${version}\n`); // eslint-disable-line no-console
  if (typeof showHelp === 'string') {
    console.error(showHelp);  // eslint-disable-line no-console
  }
  process.exit(2);
}

if (!(Object.prototype.hasOwnProperty.call(options, 'loglevel'))) {
  const loglevel = ALLOWED_LOG_LEVELS.indexOf(process.env.NODE_ENV);
  if (loglevel !== -1) {
    options.loglevel = loglevel;
  }
}
if (!(Object.prototype.hasOwnProperty.call(options, 'loglevel'))) {
  options.loglevel = 0;
}

export default options;
