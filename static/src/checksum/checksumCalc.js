const fs = require("fs");
const writer = require("../utils/writer");
const path = require("path");
const fSys = require("../utils/fSys");
const checksum = require("checksum");

function checkContracts(contracts) {
  const checksumsPath = path.join(fSys.resDir, "contractsChecksums.json");

  var oldChecksumsExists = fs.existsSync(checksumsPath);
  var oldFilesChecksums;
  if (oldChecksumsExists) oldFilesChecksums = require(checksumsPath);

  var newFilesChecksums = new Array();
  contracts.forEach((contract) => {
    var current = {
      filePath: contract.path,
      fileName: contract.name,
      checksum: checksum(contract.content),
      lastChecksum: null,
    };
    if (oldChecksumsExists) {
      var old = oldFilesChecksums.find(
        ({ filePath }) => filePath === contract.path
      );
      if (old != undefined) current.lastChecksum = old.checksum;
    }
    newFilesChecksums.push(current);
  });

  writer.writeJsonToFile("contractsChecksums.json", newFilesChecksums);

  var changedFilesNames = new Array();
  newFilesChecksums.forEach((element) => {
    if (element.checksum != element.lastChecksum)
      changedFilesNames.push(element.filePath);
  });
  //if (changedFilesNames.length == 0) changedFilesNames.push("none");

  writer.writeJsonToFile("changedContracts.json", changedFilesNames);

  return changedFilesNames;
}

function checkTests(tests) {
  const checksumsPath = path.join(fSys.resDir, "testsChecksums.json");

  var oldChecksumsExists = fs.existsSync(checksumsPath);
  var oldFilesChecksums;
  if (oldChecksumsExists) oldFilesChecksums = require(checksumsPath);

  var newFilesChecksums = new Array();
  tests.forEach((test) => {
    var current = {
      fileName: test.name,
      filePath: test.path,
      checksum: checksum(test.content),
      lastChecksum: null,
    };
    if (oldChecksumsExists) {
      var old = oldFilesChecksums.find(
        ({ filePath }) => filePath === test.path
      );
      if (old != undefined) current.lastChecksum = old.checksum;
    }
    newFilesChecksums.push(current);
  });

  writer.writeJsonToFile("testsChecksums.json", newFilesChecksums);

  var changedFilesNames = new Array();
  newFilesChecksums.forEach((element) => {
    if (element.checksum != element.lastChecksum)
      changedFilesNames.push(element.filePath);
  });
  //if (changedFilesNames.length == 0) changedFilesNames.push("none");

  writer.writeJsonToFile("changedTests.json", changedFilesNames);

  return changedFilesNames;
}

module.exports = {
  checkContracts: checkContracts,
  checkTests: checkTests,
};
