const fs = require("fs");

function writeJsonToFile(path, json) {
  fs.writeFileSync(path, JSON.stringify(json, null, "\t"), (err) => {
    if (err) throw err;
  });
}

module.exports = { writeJsonToFile: writeJsonToFile };
