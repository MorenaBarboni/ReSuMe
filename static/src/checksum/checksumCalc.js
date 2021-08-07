const fs = require("fs");
const writer = require("../utils/writer");
const path = require("path");
const checksum = require("checksum");

function checkContracts(contracts) {
  const checksumsPath = path.join(
    writer.resultsPath,
    "contractsChecksums.json"
  );
  const changedPaths = path.join(writer.resultsPath, "changedContracts.json");

  var oldChecksums = fs.existsSync(checksumsPath);
  var oldFilesChecksums;
  if (oldChecksums) oldFilesChecksums = require(checksumsPath);

  var newFilesChecksums = new Array();
  contracts.forEach((contract) => {
    var current = {
      fileName: contract.name,
      checksum: checksum(contract.content),
      lastChecksum: null,
    };
    if (oldChecksums) {
      var old = oldFilesChecksums.find(
        ({ fileName }) => fileName === contract.name
      );
      if (old != undefined) current.lastChecksum = old.checksum;
    }
    newFilesChecksums.push(current);
  });

  writer.writeJsonToFile("contractsChecksums.json", newFilesChecksums);

  var changedFilesNames = new Array();
  newFilesChecksums.forEach((element) => {
    if (element.checksum != element.lastChecksum)
      changedFilesNames.push(element.fileName);
  });
  //if (changedFilesNames.length == 0) changedFilesNames.push("none");

  writer.writeJsonToFile("changedContracts.json", changedFilesNames);

  return changedFilesNames;
}

function checkTests(tests) {
  const checksumsPath = path.join(writer.resultsPath, "testsChecksums.json");
  const changedPaths = path.join(writer.resultsPath, "changedTests.json");

  var oldChecksums = fs.existsSync(checksumsPath);
  var oldFilesChecksums;
  if (oldChecksums) oldFilesChecksums = require(checksumsPath);

  var newFilesChecksums = new Array();
  tests.forEach((test) => {
    var current = {
      fileName: test.name,
      checksum: checksum(test.content),
      lastChecksum: null,
    };
    if (oldChecksums) {
      var old = oldFilesChecksums.find(
        ({ fileName }) => fileName === test.name
      );
      if (old != undefined) current.lastChecksum = old.checksum;
    }
    newFilesChecksums.push(current);
  });

  writer.writeJsonToFile("testsChecksums.json", newFilesChecksums);

  var changedFilesNames = new Array();
  newFilesChecksums.forEach((element) => {
    if (element.checksum != element.lastChecksum)
      changedFilesNames.push(element.fileName);
  });
  //if (changedFilesNames.length == 0) changedFilesNames.push("none");

  writer.writeJsonToFile("changedTests.json", changedFilesNames);

  return changedFilesNames;
}

module.exports = {
  checkContracts: checkContracts,
  checkTests: checkTests,
};
