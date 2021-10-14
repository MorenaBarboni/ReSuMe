const path = require("path");
const fs = require("fs");
const glob = require("glob");
const fileSys = require("./fileSys");
const sol_parser = require("@solidity-parser/parser");
const acorn = require("acorn");

function loadTests() {
  fileSys.copyTestsToBaseline();

  const paths = glob.sync(fileSys.loadTestsDir);

  var tests = new Array();
  paths.forEach((test) => {
    const content = fs.readFileSync(test);

    var artifacts = new Array();
    var requires = new Array();

    if (test.endsWith(".js")) {
      var ast = acorn.parse(content.toString(), {
        ecmaVersion: 2020,
      });
      ast.body.forEach((node) => {
        if (node.type == "VariableDeclaration") {
          if (
            node.declarations.length > 0 &&
            node.declarations[0] != undefined &&
            node.declarations[0].init != undefined &&
            node.declarations[0].init.arguments != undefined &&
            node.declarations[0].init.arguments.length > 0 &&
            node.declarations[0].init.arguments[0].value != undefined &&
            node.declarations[0].init.callee != undefined &&
            node.declarations[0].init.callee.object != undefined &&
            node.declarations[0].init.callee.property != undefined &&
            node.declarations[0].init.callee.object.name == "artifacts" &&
            node.declarations[0].init.callee.property.name == "require"
          ) {
            artifacts.push(node.declarations[0].init.arguments[0].value);
          } else if (
            node.declarations.length > 0 &&
            node.declarations[0] != undefined &&
            node.declarations[0].init != undefined &&
            node.declarations[0].init.arguments != undefined &&
            node.declarations[0].init.arguments.length > 0 &&
            node.declarations[0].init.arguments[0].value != undefined &&
            node.declarations[0].init.callee != undefined &&
            node.declarations[0].init.callee.name != undefined &&
            node.declarations[0].init.callee.name == "require"
          ) {
            requires.push(node.declarations[0].init.arguments[0].value);
          }
        } else if (node.type == "ExpressionStatement") {
          if (
            node.expression != undefined &&
            node.expression.callee != undefined &&
            node.expression.callee.name != undefined &&
            node.expression.callee.name == "require" &&
            node.expression.arguments != undefined &&
            node.expression.arguments.length > 0 &&
            node.expression.arguments[0].value != undefined
          )
            requires.push(node.expression.arguments[0].value);
        }
      });
    } else if (test.endsWith(".py")) {
      var lines = content.toString().split(/(?:\r\n|\r|\n)/g);
      lines.forEach((l) => {
        if (l.includes(".sol")) artifacts.push(l.split("'", 2)[1]);
      });
    }

    tests.push({
      path: test,
      name: path.parse(test).base,
      content: content,
      artifacts: artifacts,
      requires: requires,
    });
  });

  return tests;
}

function loadContracts() {
  fileSys.copyContractsToBaseline();

  const paths = glob.sync(fileSys.loadContractsDir);

  var contracts = new Array();
  paths.forEach((contract) => {
    const content = fs.readFileSync(contract);

    var imports = new Array();
    var ast = sol_parser.parse(content.toString());
    sol_parser.visit(ast, {
      ImportDirective: function (node) {
        imports.push(node.path);
      },
    });

    contracts.push({
      path: contract,
      name: path.parse(contract).base,
      content: content,
      imports: imports,
    });
  });
  return contracts;
}

function loadMutationOperators() {
  fileSys.copyMutationOpertatorsToBaseline();

  const ops = require(fileSys.loadMutationOperatorsFile);

  return ops;
}

function loadMatrixJsonFromFile(matrix) {
  var lines = matrix.toString().split(/(?:\r\n|\r|\n)/g);

  var mutantLines = [];
  lines.forEach((line) => {
    if (line.length > 0) {
      const contract_mutant_killers_saviors = line.split(":", 4);
      const contract = contract_mutant_killers_saviors[0];
      const mutant = contract_mutant_killers_saviors[1];
      const killers = contract_mutant_killers_saviors[2];
      const saviors = contract_mutant_killers_saviors[3];
      var killers_array = killers.split(",");
      if (killers_array[0] == "") killers_array = [];
      var saviors_array = saviors.split(",");
      if (saviors_array[0] == "") saviors_array = [];
      const mutantLine = {
        contract: contract,
        mutant: mutant,
        killers: killers_array,
        saviors: saviors_array,
      };

      mutantLines.push(mutantLine);
    }
  });

  return mutantLines;
}

function loadPreviousMatrixJson() {
  return loadMatrixJsonFromFile(fileSys.loadPreviousMatrixFile());
}

function loadCurrentMatrixJson() {
  return loadMatrixJsonFromFile(fileSys.loadCurrentMatrixFile());
}

function loadFinalMatrix() {
  return loadMatrixJsonFromFile(
    fs.readFileSync(require("../config").finalMatrixPath)
  );
}

module.exports = {
  loadTests: loadTests,
  loadContracts: loadContracts,
  loadMutationOperators: loadMutationOperators,
  loadPreviousMatrixJson: loadPreviousMatrixJson,
  loadCurrentMatrixJson: loadCurrentMatrixJson,
  loadFinalMatrix: loadFinalMatrix,
};
