const fs = require("fs");
const path = require("path");
const config = require("../config");

const contractsDir = config.contractsDir + config.contractsGlob;
const testsDir = config.testsDir + config.testsGlob;

const remusDir = path.join(config.remusDir, ".remus");

const checksumsDir = path.join(remusDir, "checksums");
const contracts_checksums = path.join(checksumsDir, "contracts_checksums.json");
const tests_checksums = path.join(checksumsDir, "tests_checksums.json");

const changesDir = path.join(remusDir, "changes");
const contracts_changed = path.join(changesDir, "contracts_changed.json");
const tests_changed = path.join(changesDir, "tests_changed.json");

const dependenciesDir = path.join(remusDir, "dependencies");
const contracts_deps = path.join(dependenciesDir, "contracts_deps.json");
const tests_deps = path.join(dependenciesDir, "tests_deps.json");
const all_dependencies = path.join(dependenciesDir, "all_dependencies.json");

const firewallDir = path.join(remusDir, "firewall");
const files_firewall = path.join(firewallDir, "files_firewall.json");

const regression_tests = path.join(firewallDir, "regression_tests.json");

const baselineDir = path.join(remusDir, "baseline");

function createAmbient() {
  if (!fs.existsSync(remusDir)) fs.mkdirSync(remusDir);
  if (!fs.existsSync(dependenciesDir)) fs.mkdirSync(dependenciesDir);
  if (!fs.existsSync(changesDir)) fs.mkdirSync(changesDir);
  if (!fs.existsSync(firewallDir)) fs.mkdirSync(firewallDir);
  if (!fs.existsSync(checksumsDir)) fs.mkdirSync(checksumsDir);
  if (!fs.existsSync(baselineDir)) fs.mkdirSync(baselineDir);
}

function writeFile(type, content) {
  var path = adequatePath(type);
  fs.writeFileSync(path, JSON.stringify(content, null, "\t"), (err) => {
    if (err) throw err;
  });
}

function adequatePath(type) {
  switch (type) {
    case types.baseline:
      return baselineDir;
    case types.contracts_checksums:
      return contracts_checksums;
    case types.tests_checksums:
      return tests_checksums;
    case types.contracts_changed:
      return contracts_changed;
    case types.tests_changed:
      return tests_changed;
    case types.contracts_deps:
      return contracts_deps;
    case types.all_dependencies:
      return all_dependencies;
    case types.tests_deps:
      return tests_deps;
    case types.firewall:
      return files_firewall;
    case types.result:
      return remusDir;
    case types.regression_tests:
      return regression_tests;
  }
}

const types = {
  baseline: 0,
  contracts_checksums: 1,
  tests_checksums: 2,
  contracts_changed: 3,
  tests_changed: 4,
  contracts_deps: 5,
  tests_deps: 6,
  all_dependencies: 10,
  firewall: 7,
  result: 8,
  regression_tests: 9,
};

function existsContractsChecksums() {
  return fs.existsSync(contracts_checksums);
}

function loadContractsChecksums() {
  return require(path.resolve(contracts_checksums));
}

function existsTestsChecksums() {
  return fs.existsSync(tests_checksums);
}

function loadTestsChecksums() {
  return require(path.resolve(tests_checksums));
}

module.exports = {
  createAmbient: createAmbient,
  contractsDir: contractsDir,
  testsDir: testsDir,
  existsContractsChecksums: existsContractsChecksums,
  loadContractsChecksums: loadContractsChecksums,
  existsTestsChecksums: existsTestsChecksums,
  loadTestsChecksums: loadTestsChecksums,
  types: types,
  writeFile: writeFile,
};
