const fileSys = require("../utils/fileSys");

const unique = (value, index, self) => {
  return self.indexOf(value) === index;
};

function computeFirewall(
  changedContracts_paths,
  changedTests_paths,
  dependencyGraph,
  tests
) {
  var firewall = changedContracts_paths;

  changedContracts_paths.forEach((path) => {
    const dep = dependencyGraph.dependantsOf(path);
    firewall = firewall.concat(dep);
  });

  firewall = firewall.concat(changedTests_paths).filter(unique);

  const tests_paths = tests.map((t) => t.path);
  const testsInFirewall = firewall.filter((file) => tests_paths.includes(file));
  testsInFirewall.forEach((path) => {
    const dep = dependencyGraph.dependantsOf(path);
    var depTest = dependencyGraph.dependenciesOf(path);
    depTest = depTest.filter((file) => tests_paths.includes(file));

    firewall = firewall.concat(dep).concat(depTest);
  });

  firewall = firewall.filter(unique).sort();

  fileSys.writeFile(fileSys.types.firewall, firewall);

  return firewall;

  // const changedFiles_paths = changedContracts_paths.concat(changedTests_paths);
  // var firewall = changedFiles_paths;

  // changedFiles_paths.forEach((path) => {
  //   const dep = dependencies.dependantsOf(path);
  //   firewall = firewall.concat(dep);
  // });

  // firewall = firewall.filter(unique).sort();

  // fileSys.writeFile(fileSys.types.firewall, firewall);

  // return firewall;
}

function extractTestsFromFirewall(filesFirewall, tests) {
  const tests_paths = tests.map((t) => t.path);
  const regressionTests = filesFirewall.filter((file) =>
    tests_paths.includes(file)
  );

  fileSys.writeFile(fileSys.types.regression_tests, regressionTests);

  return regressionTests;
}

function extractContractsFromFirewall(filesFirewall, contracts) {
  const contracts_paths = contracts.map((c) => c.path);
  const contractsInFirewall = filesFirewall.filter((file) =>
    contracts_paths.includes(file)
  );

  return contractsInFirewall;
}

function getContractsUsedByTests(testsRef, dependencyGraph, contracts) {
  const contracts_paths = contracts.map((c) => c.path);
  var result = new Array();
  testsRef.forEach((path) => {
    const dep = dependencyGraph
      .dependenciesOf(path)
      .filter((file) => contracts_paths.includes(file));
    result = result.concat(dep);
  });
  result = result.filter(unique).sort();

  return result;
}

function getAffectedContracts(
  contracts,
  filesFirewall,
  changedTests_paths,
  dependencies
) {
  contracts = contracts.map((c) => c.path);
  var affectedContracts = filesFirewall;

  changedTests_paths.forEach((path) => {
    const dep = dependencies.dependenciesOf(path);
    affectedContracts = affectedContracts.concat(dep);
  });

  affectedContracts = affectedContracts
    .filter((file) => contracts.includes(file))
    .filter(unique)
    .sort();

  // var result = result
  //   .filter((file) => tests.includes(file))
  //   .sort()
  //   .filter(unique);

  //fileSys.writeFile(fileSys.types.regression_tests, result);

  return affectedContracts;
}

module.exports = {
  computeFirewall: computeFirewall,
  extractTestsFromFirewall: extractTestsFromFirewall,
  extractContractsFromFirewall: extractContractsFromFirewall,
  getContractsUsedByTests: getContractsUsedByTests,
  getAffectedContracts: getAffectedContracts,
};
