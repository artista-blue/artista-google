(function () {

    "use strict";

    const Google = {};

    Google.Drive = require("./lib/drive");
    Google.SpreadSheet = require("./lib/spread_sheet");

    module.exports = Google;
    
})();
