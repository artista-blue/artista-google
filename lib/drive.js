(function () {

    "use strict";

    const fs = require("fs");

    const google = require('googleapis');

    const authorize = require('./authorize');

    function readCredential(fname) {
    	const content = fs.readFileSync(fname);
	return JSON.parse(content);
    }

    class Drive {

	constructor (credentialFile, callback) {
	    const credentials = readCredential(credentialFile);
	    const scope = 'https://www.googleapis.com/auth/drive.metadata.readonly';
	    const tokenFile = 'drive.googleapis.com-nodejs.json';	    
	    authorize (credentials, scope, tokenFile, (auth) => {
		this.auth = auth;
		//this.sheets = google.sheets('v4');
		callback();
	    });
	}

	listDir (dirId, callback) {
	    const service = google.drive('v3');
	    service.files.list({
		auth: this.auth,
		includeRemoved: false,
		spaces: 'drive',
		fileId: dirId,
		fields: 'nextPageToken, files(id, name, parents, mimeType, modifiedTime)',
		trashed: false,
		q: `'${dirId}' in parents and trashed = false`
	    }, function(err, response) {
		if (err) {
		    callback(err);
		    return;
		}
		const files = response.files;
		callback(null, files);
	    });
	}
    }

    module.exports = Drive;
    
}());
