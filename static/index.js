const fileSys = require("./src/utils/fileSys");
const loader = require("./src/utils/loader");
const dependenciesCalc = require("./src/dependencies/dependenciesCalc");
const checksumCalc = require("./src/checksum/checksumCalc");
const firewallCalc = require("./src/firewall/firewallCalc");

fileSys.createAmbient();

const contracts = loader.loadContracts();
const changedContracts = checksumCalc.checkContracts(contracts);

const tests = loader.loadTests();
const changedTests = checksumCalc.checkTests(tests);

const allDependencies = dependenciesCalc.buildAllDependenciesGraph(
  contracts,
  tests
);

const dangerousFiles = firewallCalc.getDangerousFiles(
  changedContracts,
  changedTests,
  allDependencies
);

const testsToRerun = firewallCalc.getAffectedTests(
  dangerousFiles,
  tests,
  allDependencies
);

console.log(
  "Changed contracts" +
    (changedContracts.length == 0
      ? ": "
      : " (" + changedContracts.length + "):") +
    (changedContracts.length == 0
      ? "none"
      : JSON.stringify(changedContracts, null, "\t"))
);

console.log(
  "Changed tests" +
    (changedTests.length == 0 ? ": " : " (" + changedTests.length + "):") +
    (changedTests.length == 0
      ? "none"
      : JSON.stringify(changedTests, null, "\t"))
);

console.log(
  "Firewall around" +
    (dangerousFiles.length == 0 ? ": " : " (" + dangerousFiles.length + "):") +
    (dangerousFiles.length == 0
      ? "none"
      : JSON.stringify(dangerousFiles, null, "\t"))
);

console.log(
  "Tests to rerun" +
    (testsToRerun.length == 0 ? ": " : " (" + testsToRerun.length + "):") +
    (testsToRerun.length == 0
      ? "none"
      : JSON.stringify(testsToRerun, null, "\t"))
);

console.log();
