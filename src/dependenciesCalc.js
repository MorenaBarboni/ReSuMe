const path = require("path");
const fileSys = require("./utils/fileSys");
var DepGraph = require("dependency-graph").DepGraph;
const config = require("./config");

function buildContractsDependencyCircularGraph(contracts) {
  var graph = new DepGraph({ circular: true });

  contracts.forEach((c) => {
    graph.addNode(c.name);
  });

  contracts.forEach((c1) => {
    contracts.forEach((c2) => {
      if (c1.name != c2.name) {
        if (
          c1.content.includes(path.parse(c2.name).name)
          //||
          //c2.content.includes(path.parse(c1.name).name)
        ) {
          graph.findAndAddDependency(c1.name, c2.name);
        }
      }
    });
  });

  contracts.forEach((c) => {
    console.log(
      "Dependencies of " +
      c.name +
      ": " +
      (graph.dependenciesOf(c.name).length == 0
        ? "none"
        : "[" + graph.dependenciesOf(c.name) + "]")
    );
    console.log();
  });

  return graph;
}

function buildContractsDependencyGraph(contracts) {
  var graph = new DepGraph();

  contracts.forEach((c) => {
    graph.addNode(c.name);
  });

  contracts.forEach((c1) => {
    contracts.forEach((c2) => {
      if (c1.name != c2.name) {
        if (c1.content.includes(path.parse(c2.name).name)) {
          // console.log(c1.content.indexOf(path.parse(c2.name).name));
          graph.findAndAddDependency(c1.name, c2.name);
        }
      }
    });
  });

  contracts.forEach((c) => {
    console.log(
      "Dependencies of " +
      c.name +
      ": " +
      (graph.dependenciesOf(c.name).length == 0
        ? "none"
        : graph.dependenciesOf(c.name))
    );
    console.log();
  });

  return graph;
}

function buildTestsDependencyCircularGraph(tests) {
  var graph = new DepGraph({ circular: true });

  tests.forEach((t) => {
    graph.addNode(t.name);
  });

  tests.forEach((t1) => {
    tests.forEach((t2) => {
      if (t1.name != t2.name) {
        if (
          t1.content.includes(path.parse(t2.name).name)
          //||
          //t2.content.includes(path.parse(t1.name).name)
        ) {
          graph.findAndAddDependency(t1.name, t2.name);
        }
      }
    });
  });

  tests.forEach((t) => {
    console.log(
      "Dependencies of " +
      t.name +
      ": " +
      (graph.dependenciesOf(t.name).length == 0
        ? "none"
        : "[" + graph.dependenciesOf(t.name) + "]")
    );
    console.log();
  });

  return graph;
}

function getAllIndexes(arr, val) {
  var indexes = [];
  var i = 0;
  while (i < arr.length) {
    const a = arr.indexOf(val, i + 1);
    if (a > 0) indexes.push(a);
    else break;
    i = a;
  }
  return indexes;
}

function findAndAddDependenciesBetweenTests(test1, test2, graph) {
  //self dependency check
  if (test1 == test2) return;

  var name2 = path.parse(test2.name).name;
  test1.used_tests.forEach((re) => {
    if (re.includes(name2)) {
      //occurrence is not part of another occurrence
      if (re[re.indexOf(name2) - 1] == "/") {
        graph.addDependency(test1.path, test2.path);
      }
    }
  });

  // //tests use require('name')
  // var name2 = path.parse(test2.name).name;

  // //no-occurrence check
  // if (!test1.content.includes(name2)) return;

  // var lines = test1.content.toString().split(/(?:\r\n|\r|\n)/g);

  // //multiline comments check
  // var multiline = false;
  // var starts = new Array();
  // var stops = new Array();
  // lines.forEach((line, lineNum) => {
  //   if (line.includes("/*")) {
  //     multiline = true;
  //     starts.push(lineNum);
  //   }
  //   if (line.includes("*/")) {
  //     stops.push(lineNum);
  //   }
  // });
  // var multiLines = new Array();
  // if (multiline) {
  //   starts.forEach((num, i) => {
  //     for (j = num; j <= stops[i]; j++) {
  //       multiLines.push(j);
  //     }
  //   });
  // }

  // //line by line check
  // lines.forEach((line, lineNum) => {
  //   //is multiline-comment check
  //   if (!multiLines.includes(lineNum)) {
  //     if (line.includes(name2)) {
  //       //occurrence is require statement check
  //       const requireIndex = line.indexOf("require(");

  //       //the occurrence occurs after require statement check
  //       const occurrenceIndex = line.indexOf(name2, requireIndex);

  //       if (requireIndex > -1) {
  //         if (occurrenceIndex > -1) {
  //           //artifacts.require is NOT comment check
  //           const commentIndex = line.indexOf("//");
  //           if (commentIndex < 0 || commentIndex > requireIndex) {
  //             //occurence is NOT after import statement
  //             const semicolonIndex = line.indexOf(";");
  //             if (semicolonIndex > occurrenceIndex) {
  //               //occurrence is not part of another occurrence
  //               if (
  //                 line[occurrenceIndex + name2.length] == '"' ||
  //                 line[occurrenceIndex + name2.length] == "'"
  //               ) {
  //                 graph.addDependency(test1.path, test2.path);
  //                 return;
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // });
}

function findAndAddDependenciesBetweenContracts(contract1, contract2, graph) {
  //self dependency check
  if (contract1 == contract2) return;

  contract1.used_contracts.forEach((im) => {
    if (im.includes(contract2.name)) {
      //occurrence is not part of another occurrence
      if (im[im.indexOf(contract2.name) - 1] == "/") {
        graph.addDependency(contract1.path, contract2.path);
      }
    }
  });

  //const parsed = solParse.parse(contract1.content.toString());

  // console.log("START " + contract1.path);
  // //console.log(parsed.children[0]);
  // console.log("END");

  // //self dependency check
  // if (contract1 == contract2) return;

  // //contracts use import with .sol
  // var name2 = contract2.name;

  // //no-occurrence check
  // if (!contract1.content.includes(name2)) return;

  // var lines = contract1.content.toString().split(/(?:\r\n|\r|\n)/g);

  // //multiline comments check
  // var multiline = false;
  // var starts = new Array();
  // var stops = new Array();
  // lines.forEach((line, lineNum) => {
  //   if (line.includes("/*")) {
  //     multiline = true;
  //     starts.push(lineNum);
  //   }
  //   if (line.includes("*/")) {
  //     stops.push(lineNum);
  //   }
  // });
  // var multiLines = new Array();
  // if (multiline) {
  //   starts.forEach((num, i) => {
  //     for (j = num; j <= stops[i]; j++) {
  //       multiLines.push(j);
  //     }
  //   });
  // }

  // //line by line check
  // lines.forEach((line, lineNum) => {
  //   //line is NOT multiline-comment check
  //   if (!multiLines.includes(lineNum)) {
  //     if (line.includes(name2)) {
  //       const occurrenceIndex = line.indexOf(name2);

  //       //occurrence is import statement check
  //       const importIndex = line.indexOf("import '");
  //       if (importIndex > -1) {
  //         //import is NOT comment check
  //         const commentIndex = line.indexOf("//");
  //         if (commentIndex < 0 || commentIndex > importIndex) {
  //           //occurence is NOT after import statement
  //           const semicolonIndex = line.indexOf(";");
  //           if (semicolonIndex > occurrenceIndex) {
  //             //occurrence is not part of another occurrence
  //             const slashIndex = occurrenceIndex - 1;
  //             if (line[slashIndex] == "/") {
  //               graph.addDependency(contract1.path, contract2.path);
  //               return;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // });
}

function findAndAddDependenciesBetweenTestsAndContracts(
  test1,
  contract2,
  graph
) {
  var name2 = path.parse(contract2.name).name;
  test1.used_contracts.forEach((ar) => {
    if (ar.includes(name2)) {
      //occurrence is not part of another occurrence
      if (ar.indexOf(name2) == 0) {
        graph.addDependency(test1.path, contract2.path);
      }
    }
  });

  // //tests use artifacts.require
  // var name2 = path.parse(contract2.name).name;

  // //no-occurrence check
  // if (!test1.content.includes(name2)) return;

  // var lines = test1.content.toString().split(/(?:\r\n|\r|\n)/g);

  // //multiline comments check
  // var multiline = false;
  // var starts = new Array();
  // var stops = new Array();
  // lines.forEach((line, lineNum) => {
  //   if (line.includes("/*")) {
  //     multiline = true;
  //     starts.push(lineNum);
  //   }
  //   if (line.includes("*/")) {
  //     stops.push(lineNum);
  //   }
  // });
  // var multiLines = new Array();
  // if (multiline) {
  //   starts.forEach((num, i) => {
  //     for (j = num; j <= stops[i]; j++) {
  //       multiLines.push(j);
  //     }
  //   });
  // }

  // //line by line check
  // lines.forEach((line, lineNum) => {
  //   //line is NOT multiline-comment check
  //   if (!multiLines.includes(lineNum)) {
  //     if (line.includes(name2)) {
  //       //occurrence is artifacts.require statement check
  //       const artifactsIndex = line.indexOf("artifacts.require");

  //       //the occurrence occurs after artifacts.require statement check
  //       const occurrenceIndex = line.indexOf(name2, artifactsIndex);

  //       if (artifactsIndex > -1) {
  //         if (occurrenceIndex > -1) {
  //           //artifacts.require is NOT comment check
  //           const commentIndex = line.indexOf("//");
  //           if (commentIndex < 0 || commentIndex > artifactsIndex) {
  //             //occurence is NOT after import statement
  //             const semicolonIndex = line.indexOf(";");
  //             if (semicolonIndex > occurrenceIndex) {
  //               //occurrence is not part of another occurrence
  //               if (
  //                 (line[occurrenceIndex - 1] == "'" ||
  //                   line[occurrenceIndex - 1] == '"') &&
  //                 (line[occurrenceIndex + name2.length] == "'" ||
  //                   line[occurrenceIndex + name2.length] == '"')
  //               ) {
  //                 graph.addDependency(test1.path, contract2.path);
  //                 return;
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // });
}

function buildDependencyGraph(contracts, tests) {
  var graph = new DepGraph({ circular: true });

  contracts.forEach((c) => {
    graph.addNode(c.path, "contract");
  });
  tests.forEach((t) => {
    graph.addNode(t.path, "test");
  });

  //contracts that use contracts - import() statement
  contracts.forEach((c1) => {
    contracts.forEach((c2) => {
      findAndAddDependenciesBetweenContracts(c1, c2, graph);
    });
  });

  //tests that use tests - require() statement
  tests.forEach((t1) => {
    tests.forEach((t2) => {
      findAndAddDependenciesBetweenTests(t1, t2, graph);
    });
  });

  //tests that use contracts - artifacts.require() statement
  tests.forEach((t) => {
    contracts.forEach((c) => {
      findAndAddDependenciesBetweenTestsAndContracts(t, c, graph);
    });
  });

  var allDependencies = new Array();

  tests.concat(contracts).forEach((file) => {
    // const directDependants = graph.directDependantsOf(file.name);
    // var indirectDependants = graph
    //   .dependantsOf(file.name)
    //   .filter((n) => !directDependants.includes(n));
    // const directDependencies = graph.directDependenciesOf(file.name);
    // var indirectDependencies = graph
    //   .dependenciesOf(file.name)
    //   .filter((n) => !directDependencies.includes(n));

    // const dep = {
    //   name: c.name,
    //   directDependants: directDependants,
    //   indirectDependants: indirectDependants,
    //   directDependencies: directDependencies,
    //   indirectDependencies: indirectDependencies,
    // };

    // const dep = {
    //   file: file.path,
    //   transitivelyUses: graph.dependenciesOf(file.path),
    //   isTransitivelyUsedBy: graph.dependantsOf(file.path),
    // };

    const dep = {
      file: file.path,
      testDependencies: graph
        .dependenciesOf(file.path)
        .filter((d) => graph.getNodeData(d) == "test"),
      contractDependencies: graph
        .dependenciesOf(file.path)
        .filter((d) => graph.getNodeData(d) == "contract"),
      testDependants: graph
        .dependantsOf(file.path)
        .filter((d) => graph.getNodeData(d) == "test"),
      contractDependants: graph
        .dependantsOf(file.path)
        .filter((d) => graph.getNodeData(d) == "contract"),
    };

    allDependencies.push(dep);
  });

  fileSys.writeFile(fileSys.types.all_dependencies, allDependencies);

  var contractDependencies = new Array();
  var testDependencies = new Array();
  allDependencies.forEach((dep) => {

    //The dependency is a contract under test
    if (dep.file.includes(path.basename(config.testsDir))) {
      testDependencies.push(dep);
    }
    //The dependency is a test file
    else if (dep.file.includes(path.basename(config.contractsDir))) {
      contractDependencies.push(dep);
    }
  });

  fileSys.writeFile(fileSys.types.contracts_deps, contractDependencies);
  fileSys.writeFile(fileSys.types.tests_deps, testDependencies);

  return graph;
}

module.exports = {
  buildDependencyGraph: buildDependencyGraph,
};
