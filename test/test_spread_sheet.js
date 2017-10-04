(function () {

    "use strict";

    const Google = require("../index");
    const SpreadSheet = Google.SpreadSheet;

    const ss = new SpreadSheet("../client_secret.json", function () {
	ss.create("あおあお", function (err, response) {
	    if (err) {
		console.log(err);
		return;
	    }
	    console.log(response);
	});
    });
})();
