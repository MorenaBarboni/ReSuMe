const fs = require("fs");
const writer = require("../utils/writer");
const path = require("path");
const checksum = require("checksum");

function checkContracts(contracts) {
  const contractsFolder = path.join(__dirname, ".contracts");
  if (!fs.existsSync(contractsFolder))
    fs.mkdirSync(path.join(__dirname, ".contracts"));
  const checksumsPath = path.join(__dirname, ".contracts", "checksums.json");
  const changedPaths = path.join(__dirname, ".contracts", "changed.json");

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

  writer.writeJsonToFile(checksumsPath, newFilesChecksums);
  
  var changedFilesNames = new Array();
  newFilesChecksums.forEach((element) => {
    if (element.checksum != element.lastChecksum)
    changedFilesNames.push(element.fileName);
  });
  //if (changedFilesNames.length == 0) changedFilesNames.push("none");
  
  writer.writeJsonToFile(changedPaths, changedFilesNames);

  return changedFilesNames;
}

function checkTests(tests) {
  const contractsFolder = path.join(__dirname, ".tests");
  if (!fs.existsSync(contractsFolder))
    fs.mkdirSync(path.join(__dirname, ".tests"));
  const checksumsPath = path.join(__dirname, ".tests", "checksums.json");
  const changedPaths = path.join(__dirname, ".tests", "changed.json");

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

  writer.writeJsonToFile(checksumsPath, newFilesChecksums);

  var changedFilesNames = new Array();
  newFilesChecksums.forEach((element) => {
    if (element.checksum != element.lastChecksum)
      changedFilesNames.push(element.fileName);
  });
  //if (changedFilesNames.length == 0) changedFilesNames.push("none");

  writer.writeJsonToFile(changedPaths, changedFilesNames);

  return changedFilesNames;
}

module.exports = {
  checkContracts: checkContracts,
  checkTests: checkTests,
};
