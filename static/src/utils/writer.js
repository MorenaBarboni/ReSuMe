const fs = require("fs");
const path = require("path");
const config = require("../config")
const fSys = require("../utils/fSys");


function writeJsonToFile(fileName, json) {
  fs.writeFileSync(
    path.join(fSys.resDir, fileName),
    JSON.stringify(json, null, "\t"),
    (err) => {
      if (err) throw err;
    }
  );
}

module.exports = { writeJsonToFile: writeJsonToFile };
