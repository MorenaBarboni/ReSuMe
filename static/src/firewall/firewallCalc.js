const fileSys = require("../utils/fileSys");

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

  fileSys.writeFile(fileSys.types.firewall, result);

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

  result = result
    .filter((file) => tests.includes(file))
    .sort()
    .filter(unique);

  fileSys.writeFile(fileSys.types.regression_tests, result);

  return result;
}

module.exports = {
  getDangerousFiles: getDangerousFiles,
  getAffectedTests: getAffectedTests,
};
