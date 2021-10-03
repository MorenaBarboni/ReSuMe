const fileSys = require("./src/utils/fileSys");
const loader = require("./src/utils/loader");
const logger = require("./src/utils/logger");
const dependenciesCalc = require("./src/dependencies/dependenciesCalc");
const checksumCalc = require("./src/checksum/checksumCalc");
const remusCalc = require("./src/remus/remusCalc");
const matrixCalc = require("./src/matrix/matrixCalc");
const chalk = require("chalk");
const { table } = require("table");
const { matrixJsonToMatrix } = require("./src/matrix/matrixCalc");
const unique = (value, index, self) => {
  return self.indexOf(value) === index;
};

//.remus dir
fileSys.createAmbient();

//load files
const contracts = loader.loadContracts();
// [
//  {
//    path: ../C.sol,
//    name: C.sol,
//    content: ...,
//    imports: [../D.sol, ../E.sol, ...]
//  }, ...
// ]

const tests = loader.loadTests();
// [
//  {
//    path: ../T1.js,
//    name: T1.js,
//    content: ...,
//    requires: [../T5.js, ../T6.js, ...],
//    artifacts: [../D.sol, ../E.sol, ...]
//  }, ...
// ]

//files dependencies (C-uses-C, T-uses-C, T-uses-T)
const dependencyGraph = dependenciesCalc.buildDependencyGraph(contracts, tests);
// graph: node: name: ../C.sol,
//              data: "contract" or "test"

console.log();
console.log("#####################################");
console.log("######## PROGRAM DIFFERENCES ########");
console.log("#####################################");
console.log();

//changed files (+ newly added files) since last execution
const changedContracts_paths = checksumCalc.checkContracts(contracts);
// [../C.sol, ../D.sol, ...]
const changedTests_paths = checksumCalc.checkTests(tests);
// [../T1.js, ../T2.js, ...]

logger.logPaths("Changed contracts", changedContracts_paths);
logger.logPaths("Changed tests", changedTests_paths);

console.log("###############################################");
console.log("######### REGRESSION MUTATION TESTING #########");
console.log("###############################################");
console.log();

const contracsHaveChanged = changedContracts_paths.length > 0;
const testsHaveChanged = changedTests_paths.length > 0;

var regressionTests = [];
var contractsToBeMutated = [];

//no changes
if (!contracsHaveChanged && !testsHaveChanged) {
  console.log(
    chalk.red("Case:") +
      " " +
      chalk.green("No changed files since last revision")
  );
  console.log();
}

//only changed contracts
if (contracsHaveChanged && !testsHaveChanged) {
  console.log(
    chalk.red("Case:") +
      " " +
      chalk.green("Only contracts changed since last revision")
  );
  console.log();

  //changed contracts + dependant and dependency contracts of changed contracts
  contractsToBeMutated =
    remusCalc.getChangedContractsPlusDependencyAndDependantContractsOfChangedContracts(
      changedContracts_paths,
      dependencyGraph
    );

  //dependant tests of changed contracts
  regressionTests = remusCalc.getDependantTestsOfChangedContracts(
    changedContracts_paths,
    dependencyGraph
  );

  //regression test + dependency tests of regression test
  regressionTests =
    remusCalc.getRegressionTestsPlusDependencyTestsOfRegressionTests(
      regressionTests,
      dependencyGraph
    );
}

//only changed tests
if (!contracsHaveChanged && testsHaveChanged) {
  console.log(
    chalk.red("Case:") +
      " " +
      chalk.green("Only tests changed since last revision")
  );
  console.log();

  //dependency contracts of changed tests
  contractsToBeMutated = remusCalc.getDependencyContractsOfChangedTests(
    changedTests_paths,
    dependencyGraph
  );

  //changed tests + dependant tests of changed tests
  regressionTests = remusCalc.getChangedTestsPlusDependantTestsOfChangedTests(
    changedTests_paths,
    dependencyGraph
  );

  //regression test + dependency tests of regression test
  regressionTests =
    remusCalc.getRegressionTestsPlusDependencyTestsOfRegressionTests(
      regressionTests,
      dependencyGraph
    );
}

//se ci sono sia contratti che test alterati
if (contracsHaveChanged && testsHaveChanged) {
  console.log(
    chalk.red("Case:") +
      " " +
      chalk.green("Both contracts and tests changed since last revision")
  );

  //changed contracts + dependant and dependency contracts of changed contracts + dependency contracts of changed tests
  contractsToBeMutated =
    remusCalc.getChangedContractsPlusDependencyAndDependantContractsOfChangedContractsPlusDependencyContractsOfChangedTests(
      changedContracts_paths,
      changedTests_paths,
      dependencyGraph
    );

  //changed tests + dependant tests of changed contracts + dependant tests of changed tests
  regressionTests =
    remusCalc.getChangedTestsPlusDependantTestsOfChangedTestsPlusDependantTestsOfChangedContracts(
      changedContracts_paths,
      changedTests_paths,
      dependencyGraph
    );

  //regression test + dependency tests of regression test
  regressionTests =
    remusCalc.getRegressionTestsPlusDependencyTestsOfRegressionTests(
      regressionTests,
      dependencyGraph
    );
}

fileSys.writeFile(fileSys.types.regression_tests, regressionTests);
fileSys.writeFile(fileSys.types.regression_contracts, contractsToBeMutated);

logger.logPaths("Contracts to be mutated", contractsToBeMutated);
logger.logPaths("Regression tests", regressionTests);

console.log("#########################################");
console.log("######### SUMO MUTATION TESTING #########");
console.log("#########################################");
console.log(".");
console.log(".");
console.log(".");
console.log(".");
console.log(".");
console.log(".");
console.log(".");
console.log("#######################################################");
console.log("######### REGRESSION MUTATION TESTING RESULTS #########");
console.log("#######################################################");
console.log();

const currentMatrixJson = loader.loadCurrentMatrixJson();
const currentMatrix = matrixCalc.matrixJsonToMatrix(currentMatrixJson);
const killedMutants = matrixCalc.getKilledMutantsFromMatrixJson(currentMatrixJson);
const aliveMutants = matrixCalc.getAliveMutantsFromMatrixJson(currentMatrixJson);
const mutants = matrixCalc.getMutantsFromMatrixJson(currentMatrixJson);
const score = killedMutants.length / mutants.length;

console.log("Regression mutants execution matrix:");
console.log(table(currentMatrix));

console.log("- Mutants -");
console.log("Generated mutants: " + mutants.length);
console.log("Killed mutants: " + killedMutants.length);
console.log("Alive mutants: " + aliveMutants.length);

console.log("Mutation score: " + score);

console.log();
console.log("##############################################################");
console.log("######### REGRESSION MUTATION TESTING RESULTS UPDATE #########");
console.log("##############################################################");
console.log();

const previousMatrixJson = loader.loadPreviousMatrixJson();
const previousMatrix = matrixCalc.matrixJsonToMatrix(previousMatrixJson);
console.log("Previous regression mutants execution matrix:");
console.log(table(previousMatrix));

const updatedMatrixJson = matrixCalc.updateCurrentMatrixFromPreviousMatrixJson(previousMatrixJson, currentMatrixJson);
const updatedMatrix = matrixCalc.matrixJsonToMatrix(updatedMatrixJson);
console.log("Updated regression mutants execution matrix:");
console.log(table(updatedMatrix));

console.log("Updated mutation score: " + matrixCalc.calculateMutationScoreFromMatrixJson(updatedMatrixJson));