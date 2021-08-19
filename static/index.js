const fileSys = require("./src/utils/fileSys");
const loader = require("./src/utils/loader");
const logger = require("./src/utils/logger");
const dependenciesCalc = require("./src/dependencies/dependenciesCalc");
const checksumCalc = require("./src/checksum/checksumCalc");
const firewallCalc = require("./src/firewall/firewallCalc");
const chalk = require("chalk");

//.remus dir
fileSys.createAmbient();

//load files
const contracts = loader.loadContracts();
const tests = loader.loadTests();

//files dependencies (C-use-C, T-use-C, T-use-T)
const dependencyGraph = dependenciesCalc.buildAllDependenciesGraph(
  contracts,
  tests
);

//changed files (+ newly added files) since last execution
const changedContracts = checksumCalc.checkContracts(contracts);
const changedTests = checksumCalc.checkTests(tests);

//file firewall around dangerous files (contracts and tests)
const dangerousFiles = firewallCalc.getDangerousFiles(
  changedContracts,
  changedTests,
  dependencyGraph
);

//regression tests
const testsToRerun = firewallCalc.getAffectedTests(
  dangerousFiles,
  tests,
  dependencyGraph
);


logger.logPaths("Changed contracts", changedContracts);

logger.logPaths("Changed tests", changedTests);

logger.logPaths("Files firewall", dangerousFiles);

logger.logPaths("Regression tests", testsToRerun);
