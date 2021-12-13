const fileSys = require("./src/utils/fileSys");
const loader = require("./src/utils/loader");
const logger = require("./src/utils/logger");
const depCalc = require("./src/dependenciesCalc");
const diffCalc = require("./src/differencesCalc");
const remCalc = require("./src/remCalc");
const matrixCalc = require("./src/matrixCalc");
const chalk = require("chalk");
const { table } = require("table");

//.resume dir
fileSys.createAmbient();

//load files
const contracts = loader.loadContracts();
// [
//  {
//    path: ../C.sol,
//    name: C.sol,
//    content: ...,
//    used_contracts: [../D.sol, ../E.sol, ...]
//  }, ...
// ]

const tests = loader.loadTests();
// [
//  {
//    path: ../T1.js,
//    name: T1.js,
//    content: ...,
//    used_tests: [../T5.js, ../T6.js, ...],
//    used_contracts: [../D.sol, ../E.sol, ...]
//  }, ...
// ]

logger.logBaseline(contracts, tests);

//files dependencies (C-uses-C, T-uses-C, T-uses-T)
const dependencyGraph = depCalc.buildDependencyGraph(contracts, tests);
// graph: node: name: ../C.sol,
//              data: "contract" or "test"

console.log();
console.log("#####################################");
console.log("######## PROGRAM DIFFERENCES ########");
console.log("#####################################");
console.log();

//changed files (+ newly added files) since last execution
const changedContracts_paths = diffCalc.checkContracts(contracts);
// [../C.sol, ../D.sol, ...]
const changedTests_paths = diffCalc.checkTests(tests);
// [../T1.js, ../T2.js, ...]

logger.logPathsOnConsole("Changed contracts", changedContracts_paths);
logger.logPathsOnConsole("Changed tests", changedTests_paths);
logger.logProgramDifferences(changedContracts_paths, changedTests_paths);

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
    remCalc.getChangedContractsPlusDependencyAndDependantContractsOfChangedContracts(
      changedContracts_paths,
      dependencyGraph
    );

  //dependant tests of changed contracts
  regressionTests = remCalc.getDependantTestsOfChangedContracts(
    changedContracts_paths,
    dependencyGraph
  );

  //regression test + dependency tests of regression test
  regressionTests =
    remCalc.getRegressionTestsPlusDependencyTestsOfRegressionTests(
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
  contractsToBeMutated = remCalc.getDependencyContractsOfChangedTests(
    changedTests_paths,
    dependencyGraph
  );

  //changed tests + dependant tests of changed tests
  regressionTests = remCalc.getChangedTestsPlusDependantTestsOfChangedTests(
    changedTests_paths,
    dependencyGraph
  );

  //regression test + dependency tests of regression test
  regressionTests =
    remCalc.getRegressionTestsPlusDependencyTestsOfRegressionTests(
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
    remCalc.getChangedContractsPlusDependencyAndDependantContractsOfChangedContractsPlusDependencyContractsOfChangedTests(
      changedContracts_paths,
      changedTests_paths,
      dependencyGraph
    );

  //changed tests + dependant tests of changed contracts + dependant tests of changed tests
  regressionTests =
    remCalc.getChangedTestsPlusDependantTestsOfChangedTestsPlusDependantTestsOfChangedContracts(
      changedContracts_paths,
      changedTests_paths,
      dependencyGraph
    );

  //regression test + dependency tests of regression test
  regressionTests =
    remCalc.getRegressionTestsPlusDependencyTestsOfRegressionTests(
      regressionTests,
      dependencyGraph
    );
}

// fileSys.writeFile(fileSys.types.regression_tests, regressionTests);
// fileSys.writeFile(fileSys.types.regression_contracts, contractsToBeMutated);

logger.logPathsOnConsole("Contracts to be mutated", contractsToBeMutated);
logger.logPathsOnConsole("Regression tests", regressionTests);
logger.logRTS(contractsToBeMutated, regressionTests);

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

logger.logSuMo();

console.log("#######################################################");
console.log("######### REGRESSION MUTATION TESTING RESULTS #########");
console.log("#######################################################");
console.log();

const currentMatrixJson = loader.loadCurrentMatrixJson();
const currentMatrix = matrixCalc.matrixJsonToMatrix(currentMatrixJson);
const mutants = matrixCalc.getMutantsFromMatrixJson(currentMatrixJson);
const killedMutants =
  matrixCalc.getKilledMutantsFromMatrixJson(currentMatrixJson);
const aliveMutants =
  matrixCalc.getAliveMutantsFromMatrixJson(currentMatrixJson);
const score = killedMutants.length / mutants.length;

console.log("Regression mutants execution matrix:");
console.log(table(currentMatrix));

logger.logRTSResults(
  currentMatrix,
  mutants.length,
  killedMutants.length,
  aliveMutants.length,
  score
);

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
const mutantsPre = matrixCalc.getMutantsFromMatrixJson(previousMatrixJson);
const killedMutantsPre =
  matrixCalc.getKilledMutantsFromMatrixJson(previousMatrixJson);
const aliveMutantsPre =
  matrixCalc.getAliveMutantsFromMatrixJson(previousMatrixJson);
const scorePre =
  matrixCalc.calculateMutationScoreFromMatrixJson(previousMatrixJson);

logger.logPreviousMatrix(
  previousMatrix,
  mutantsPre.length,
  killedMutantsPre.length,
  aliveMutantsPre.length,
  scorePre
);

const updatedMatrixJson = matrixCalc.updateCurrentMatrixFromPreviousMatrixJson(
  previousMatrixJson,
  currentMatrixJson,
  contracts,
  tests
);
const mutantsUp = matrixCalc.getMutantsFromMatrixJson(updatedMatrixJson);
const killedMutantsUp =
  matrixCalc.getKilledMutantsFromMatrixJson(updatedMatrixJson);
const aliveMutantsUp =
  matrixCalc.getAliveMutantsFromMatrixJson(updatedMatrixJson);
const scoreUp =
  matrixCalc.calculateMutationScoreFromMatrixJson(updatedMatrixJson);

const updatedMatrix = matrixCalc.matrixJsonToMatrix(updatedMatrixJson);
console.log("Updated regression mutants execution matrix:");
console.log(table(updatedMatrix));

logger.logRemResults(
  updatedMatrix,
  mutantsUp.length,
  killedMutantsUp.length,
  aliveMutantsUp.length,
  scoreUp
);

// const fullMatrix = loader.loadFinalMatrix();
// const killedFull = matrixCalc.getKilledMutantsFromMatrixJson(fullMatrix);
// const killedFullIds = killedFull.map((k) => k.mutant);
// const killedUpIds = killedMutantsUp.map((k) => k.mutant);
// killedFullIds.forEach((j) => {
//   if (!killedUpIds.includes(j)) {
//     console.log(j);
//   }
// });
