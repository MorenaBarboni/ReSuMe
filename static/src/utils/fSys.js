const fs = require("fs");
const path = require("path");
const config = require("../config");

const resDir = path.join(config.resultsDir, ".remus.results");

function createAmbient() {
  if (!fs.existsSync(resDir)) fs.mkdirSync(resDir);
}

module.exports = { createAmbient: createAmbient, resDir: resDir };
