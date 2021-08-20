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
const changedContracts_paths = checksumCalc.checkContracts(contracts);
const changedTests_paths = checksumCalc.checkTests(tests);

//file firewall around dangerous files (contracts and tests)
const filesFirewall = firewallCalc.computeFirewall(
  changedContracts_paths,
  changedTests_paths,
  dependencyGraph,
  tests
);

//regression tests
const regressionTests = firewallCalc.extractTestsFromFirewall(
  filesFirewall,
  tests
);

console.log();
console.log("######### REGRESSION TESTING #########");
console.log();

logger.logPaths("Changed contracts", changedContracts_paths);

logger.logPaths("Changed tests", changedTests_paths);

logger.logPaths("Files firewall", filesFirewall);

logger.logPaths("Regression tests", regressionTests);

console.log();

/// MUTATION TESTING STRAT
console.log("######### REGRESSION MUTATION TESTING #########");
console.log();

//SE DECIDIAMO DI SFOLTIRE I MUTANTI
//Genero i mutanti di:
//contratti alterati +
//contratti che usano transitivamente i contratti alterati
//aka: contratti nel firewall
const contractsFromFirewall = firewallCalc.extractContractsFromFirewall(
  filesFirewall,
  contracts
);
logger.logPaths("Contracts from firewall", contractsFromFirewall);

//REGRESSION TESTS
//Fanno parte dei regression tests i test che utilizzano:
//i contratti da cui genero i mutanti +
//i test alterati
//aka: tests nel firewall
const testsFromFirewall = firewallCalc.extractTestsFromFirewall(
  filesFirewall,
  tests
);
logger.logPaths("Tests from firewall", testsFromFirewall);

//aggiungo ai mutanti i mutanti generati da:
//contratti che vengono utilizzati dai test alterati
const contractsUsedByTests = firewallCalc.getContractsUsedByTests(
  changedTests_paths,
  dependencyGraph,
  contracts
);
logger.logPaths("Contracts used by changed tests", contractsUsedByTests);

const unique = (value, index, self) => {
  return self.indexOf(value) === index;
};
const mutatingContracts = contractsUsedByTests.concat(contractsFromFirewall).filter(unique);
logger.logPaths("Contracts to be mutated", mutatingContracts);


logger.logPaths("Regression tests", testsFromFirewall);

//FINE

//se cambiano gli operatori cambiano potenzialmente i mutanti di tutti i contratti
const operators = loader.loadMutationOperators();

const bool = checksumCalc.mutationOperatorsChanged(operators);

console.log("Mutation operators changhed since last run: " + chalk.green(bool));
