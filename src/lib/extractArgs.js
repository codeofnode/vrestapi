const getStringValue = (inp) => {
  if (inp === '1' || inp === 'true') return true;
  if (inp) return inp;
  return undefined;
};

const { version, name, description } = require('../package.json'); // eslint-disable-line import/no-unresolved

const showError = function showError(message) {
  console.log(`\n    ${name} - ${description} .\n`); // eslint-disable-line no-console
  console.log(`    version - ${version}\n`); // eslint-disable-line no-console
  if (typeof message === 'string') {
    console.error(message);  // eslint-disable-line no-console
  }
  process.exit(2);
};

const ALLOWED_API_CALLS = ['export', 'import'];
const ALLOWED_LOG_LEVELS = ['prod', 'test', 'dev'];

const options = { };
let showHelp = false;

const argvs = process.argv.slice(2);
const arl = argvs.length;
for (let ind, arg, key, value, val, z = 0; z < arl; z += 1) {
  arg = argvs[z];
  ind = arg.indexOf('=');
  if (ind === -1) {
    showHelp = `Argument ${arg} must have \`=\` as separator.`;
    break;
  }
  key = arg.substr(0, ind);
  value = getStringValue(arg.substr(ind + 1));
  val = ALLOWED_LOG_LEVELS.indexOf(value);
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
    case '-e':
    case '--email':
      if (typeof value === 'string') {
        options.email = value;
      }
      break;
    case '-p':
    case '--password':
      if (typeof value === 'string') {
        options.password = value;
      }
      break;
    case '-f':
    case '--filepath':
      if (typeof value === 'string') {
        options.filepath = value;
      }
      break;
    case '-u':
    case '--url':
      if (typeof value === 'string') {
        options.url = value;
      }
      break;
    case '--vrestbaseurl':
      if (typeof value === 'string') {
        options.vrestbaseurl = value;
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

if (!(showHelp)) {
  if (!(Object.prototype.hasOwnProperty.call(options, 'email'))) {
    showError('Login email is a required input. Pass it as --email=<youremail>');
  }
  if (!(Object.prototype.hasOwnProperty.call(options, 'password'))) {
    options.password = process.env.VREST_PASSWORD;
  }
  if (typeof options.password !== 'string') {
    showError('Login password is a required input. Pass it as --password=<your_vrest_password>');
  }
  if (!(Object.prototype.hasOwnProperty.call(options, 'url'))) {
    showError('URL is a required input. Pass it as --url=<your_vrest_fetch_url>');
  }
  if (options.url.indexOf('http') !== 0) {
    showError('URL is invalid. It must start with `https`');
  }
  if (!(Object.prototype.hasOwnProperty.call(options, 'vrestbaseurl'))) {
    options.vrestbaseurl = 'https://vrest.io/';
  }
  if (!(Object.prototype.hasOwnProperty.call(options, 'apicall'))) {
    options.apicall = 'export';
  }
  if (!(Object.prototype.hasOwnProperty.call(options, 'filepath'))) {
    options.filepath = process.cwd() + '/vrest_file.json';
  }
  if (options.vrestbaseurl.indexOf('http') !== 0) {
    showError('vREST base URL is invalid. It must start with `https`');
  }
}

if (showHelp) {
  showError(showHelp);
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
