const writer = require("../utils/writer");

const unique = (value, index, self) => {
  return self.indexOf(value) === index;
};

function getDangerousFiles(changedContracts, changedTests, dependencies) {
  const changedFiles = changedContracts.concat(changedTests);
  var dangerousFiles = changedFiles;

  changedFiles.forEach((file) => {
    const dep = dependencies.dependantsOf(file);
    dangerousFiles = dangerousFiles.concat(dep);
  });

  const result = dangerousFiles.filter(unique).sort();

  writer.writeJsonToFile("firewall.json", result);

  return result;
}

function getAffectedTests(dangerousFiles, tests, dependencies) {
  tests = tests.map((t) => t.path);
  const affectedTests = dangerousFiles
    .filter((file) => tests.includes(file))
    .sort();

  var result = affectedTests;
  affectedTests.forEach((test) => {
    const dep = dependencies.dependenciesOf(test);
    result = result.concat(dep);
  });

  result = result.filter((file) => tests.includes(file)).sort().filter(unique);

  writer.writeJsonToFile("testsToRerun.json", result);

  return result;
}

module.exports = {
  getDangerousFiles: getDangerousFiles,
  getAffectedTests: getAffectedTests,
};