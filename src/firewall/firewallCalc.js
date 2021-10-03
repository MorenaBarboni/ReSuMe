const fileSys = require("../utils/fileSys");

const unique = (value, index, self) => {
  return self.indexOf(value) === index;
};

function computeFirewall(
  changedContracts_paths,
  changedTests_paths,
  dependencyGraph
) {
  //changed files are added to the firewall
  var firewall_contracts = changedContracts_paths.map((c) => c);
  var firewall_tests = changedTests_paths.map((t) => t);

  //for every changed contract 'c', contracs AND tests that TRANSITIVELY USE 'c' are added (dependantsOf(c))
  changedContracts_paths.forEach((path) => {
    const dependants = dependencyGraph.dependantsOf(path); //contracts and tests
    dependants.forEach((dependant) => {
      const type = dependencyGraph.getNodeData(dependant);
      if (type == "test") firewall_tests.push(dependant);
      //tests
      else if (type == "contract") firewall_contracts.push(dependant); //contracts
    });
  });

  //for every test 't' in firewall, tests that TRANSITIVELY USE 't' are added (dependantsOf(t)) and
  //tests that 't' TRANSITIVELY USES are added (dependenciesOf(t).filter(isTest))
  firewall_tests.forEach((path) => {
    const dependants = dependencyGraph.dependantsOf(path); //tests that use t
    dependants.forEach((dependant) => {
      if (dependencyGraph.getNodeData(dependant) == "test")
        firewall_tests.push(dependant);
    });
    const dependencies = dependencyGraph.dependenciesOf(path); //tests used by t
    dependencies.forEach((dependency) => {
      if (dependencyGraph.getNodeData(dependency) == "test")
        firewall_tests.push(dependency);
    });
  });

  firewall_contracts = firewall_contracts.filter(unique).sort();
  firewall_tests = firewall_tests.filter(unique).sort();

  const firewall = {
    contracts: firewall_contracts,
    tests: firewall_tests,
  };

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

function extractTestsFromFirewall(filesFirewall) {
  const regressionTests = filesFirewall.tests;
  fileSys.writeFile(fileSys.types.regression_tests, regressionTests);
  return regressionTests;
}

function extractContractsFromFirewall(filesFirewall) {
  return filesFirewall.contracts;
}

module.exports = {
  computeFirewall: computeFirewall,
  extractTestsFromFirewall: extractTestsFromFirewall,
  extractContractsFromFirewall: extractContractsFromFirewall 
};
