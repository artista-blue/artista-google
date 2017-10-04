(function () {

    "use strict";

    const fs = require("fs");

    const google = require('googleapis');

    const authorize = require('./authorize');

    function readCredential(fname) {
    	const content = fs.readFileSync(fname);
	return JSON.parse(content);
    }
    
    function getColumnByIndex (sheet, index) {
	const rows = sheet.values;
	return rows.map(function (x) { return x[index]; });
    }

    function getColumnByName (sheet, name) {
	const header = sheet.values[0];
	const index = header.indexOf(name);
	return getColumnByIndex(sheet, index);
    }
    
    class SpreadSheet {
	
	constructor (credentialFile, callback) {
	    const credentials = readCredential(credentialFile);
	    //const scope = 'https://www.googleapis.com/auth/spreadsheets.readonly';
	    const scope = 'https://www.googleapis.com/auth/spreadsheets';
	    const tokenFile = 'sheets.googleapis.com-nodejs.json';
	    authorize (credentials, scope, tokenFile, (auth) => {
		this.auth = auth;
		this.sheets = google.sheets('v4');
		callback(auth);
	    });
	}

	create (name, callback) {
	    var request = {
		resource: {
		    properties:{
			title: name
		    }
		},
		auth: this.auth
	    };
	    this.sheets.spreadsheets.create(request, function (err, response) {
		callback(err, response);
	    });
	}
	
	getSheet (sheetId, range, callback) {
	    const params = {
		auth: this.auth,
		spreadsheetId: sheetId
	    };
	    if (range) {
		params.range = range;
	    } else {
		params.range = "A1:ZZ1000";
	    }
	    this.sheets.spreadsheets.values.get(params, function(err, response) {
		if (err) {
		    callback(err); return;
		}
		callback(null, response);
	    });
	}

	static getRows (sheet) {
	    return sheet.values;
	}

	static getColumn(sheet, nameOrIndex) {
	    let index, name;
	    if (typeof(nameOrIndex) === 'number') {
		return getColumnByIndex(sheet, nameOrIndex);
	    } else {
		return getColumnByName(sheet, nameOrIndex);
	    }
	}

    }

    module.exports = SpreadSheet;
    
}());
