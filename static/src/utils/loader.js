const path = require("path");
const fs = require("fs");

function loadTests(testsDir) {
  var tests = new Array();
  fs.readdirSync(testsDir).forEach((test) => {
    tests.push({
      name: test,
      content: fs.readFileSync(path.join(testsDir, test)),
    });
  });

  return tests;
}

function loadContracts(contractsDir) {
  var contracts = new Array();
  fs.readdirSync(contractsDir).forEach((contract) => {
    contracts.push({
      name: contract,
      content: fs.readFileSync(path.join(contractsDir, contract)),
    });
  });

  return contracts;
}

module.exports = {
  loadTests: loadTests,
  loadContracts: loadContracts,
};
