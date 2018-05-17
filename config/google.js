const http = require('http');
const url = require('url');
const querystring = require('querystring');
const opn = require('opn');
const { OAuth2Client } = require('google-auth-library');

const keys = require('../keys.json');

/**
 * Start by acquiring a pre-authenticated oAuth2 client.
 */
async function main() {
  try {
    const oAuth2Client = await getAuthenticatedClient();
    // Make a simple request to the Google Plus API using our pre-authenticated client.

    const url = 'https://people.googleapis.com/$discovery/rest?version=v1';
    const res = await oAuth2Client.request({ url })
    console.log(res.data);
  } catch (e) {
    console.error(e);
  }
  process.exit();
}

/**
 * Create a new OAuth2Client, and go through the OAuth2 content
 * workflow.  Return the full client to the callback.
 */
function getAuthenticatedClient() {
  return new Promise((resolve, reject) => {
    // create an oAuth client to authorize the API call.

    const oAuth2Client = new OAuth2Client(
      keys.web.client_id,
      keys.web.client_secret,
      keys.web.redirect_uris[6]
    );

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'online',
      scope: 'https://www.googleapis.com/auth/plus.me'
    });

    // Open an http server to accept the oauth callback.

    const server = http.createServer(async (req, res) => {
      if (req.url.indexOf('/oauth2callback') > -1) {
        // acquire the code from the querystring, and close the web server.
        const qs = querystring.parse(url.parse(req.url).query);
        console.log(`Code is ${qs.code}`);
        res.end('Authentication successful! Please return to the console.');
        server.close();

        // Now that we have the code, use that to acquire tokens.
        const r = await oAuth2Client.getToken(qs.code)
        // Make sure to set the credentials on the OAuth2 client.
        oAuth2Client.setCredentials(r.tokens);
        console.info('Tokens acquired.');
        resolve(oAuth2Client);
      }
    }).listen(3000, () => {
      // open the browser to the authorize url to start the workflow
      opn(authorizeUrl);
    });
  });
}

module.exports = main;