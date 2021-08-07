const fs = require("fs");
const path = require("path");

const resultsPath = path.join(
  path.resolve(path.resolve(__dirname, ".."), ".."),
  "results"
);

function writeJsonToFile(fileName, json) {
  fs.writeFileSync(
    path.join(resultsPath, fileName),
    JSON.stringify(json, null, "\t"),
    (err) => {
      if (err) throw err;
    }
  );
}

module.exports = { writeJsonToFile: writeJsonToFile, resultsPath: resultsPath };
