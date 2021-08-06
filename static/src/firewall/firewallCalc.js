const { get } = require("http");
const path = require("path");
const writer = require("../utils/writer");

function getDangerousFiles(changedContracts, changedTests, dependencies) {
  const changedFiles = changedContracts.concat(changedTests);
  var dangerousFiles = changedFiles;

  changedFiles.forEach((file) => {
    const dep = dependencies.dependantsOf(file);
    dangerousFiles = dangerousFiles.concat(dep);
  });

  const unique = (value, index, self) => {
    return self.indexOf(value) === index;
  };
  const result = dangerousFiles.filter(unique).sort();

  writer.writeJsonToFile(__dirname + "/firewall.json", result);

  return result;
}

function getAffectedTests(dangerousFiles) {
  
  const result = dangerousFiles.filter(file => file.endsWith(".js")).sort();

  writer.writeJsonToFile(__dirname + "/testsToRerun.json", result);

  return result;
}

module.exports = {
  getDangerousFiles: getDangerousFiles,
  getAffectedTests: getAffectedTests
};
