(function () {

    "use strict";

    const fs = require('fs');
    const readline = require('readline');
    const google = require('googleapis');
    const googleAuth = require('google-auth-library');

    // If modifying these scopes, delete your previously saved credentials
    // at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
    const SCOPES = [];
    const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
		     process.env.USERPROFILE) + '/.credentials/';
    
    /**
     * Store token to disk be used in later program executions.
     *
     * @param {Object} token The token to store to disk.
     */
    function storeToken(token, tokenPath) {
	try {
	    fs.mkdirSync(TOKEN_DIR);
	} catch (err) {
	    if (err.code != 'EEXIST') {
		throw err;
	    }
	}
	fs.writeFile(tokenPath, JSON.stringify(token));
	console.log('Token stored to ' + tokenPath);
    }
    
    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     *
     * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback to call with the authorized
     *     client.
     */
    function getNewToken(oauth2Client, tokenPath, callback) {
	const authUrl = oauth2Client.generateAuthUrl({
	    access_type: 'offline',
	    scope: SCOPES
	});
	console.log('Authorize this app by visiting this url: ', authUrl);
	const rl = readline.createInterface({
	    input: process.stdin,
	    output: process.stdout
	});
	rl.question('Enter the code from that page here: ', function(code) {
	    rl.close();
	    oauth2Client.getToken(code, function(err, token) {
		if (err) {
		    console.log('Error while trying to retrieve access token', err);
		    return;
		}
		oauth2Client.credentials = token;
		storeToken(token, tokenPath);
		callback(oauth2Client);
	    });
	});
    }

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     *
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, scope, tokenFile, callback) {
	SCOPES.push(scope);
	const tokenPath = TOKEN_DIR + tokenFile;
	const clientSecret = credentials.installed.client_secret;
	const clientId = credentials.installed.client_id;
	const redirectUrl = credentials.installed.redirect_uris[0];
	const auth = new googleAuth();
	const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
	// Check if we have previously stored a token.
	fs.readFile(tokenPath, function(err, token) {
	    if (err) {
		getNewToken(oauth2Client, tokenPath, callback);
	    } else {
		oauth2Client.credentials = JSON.parse(token);
		callback(oauth2Client);
	    }
	});
    }
    
    module.exports = authorize;

})();
