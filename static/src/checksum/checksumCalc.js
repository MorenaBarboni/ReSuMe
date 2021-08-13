const fs = require("fs");
const fileSys = require("../utils/fileSys");
const path = require("path");
const checksum = require("checksum");

function checkContracts(contracts) {
  var oldChecksumsExists = fileSys.existsContractsChecksums();
  var oldFilesChecksums;
  if (oldChecksumsExists) oldFilesChecksums = fileSys.loadContractsChecksums();

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

  fileSys.writeFile(fileSys.types.contracts_checksums, newFilesChecksums);

  var changedFilesNames = new Array();
  newFilesChecksums.forEach((element) => {
    if (element.checksum != element.lastChecksum)
      changedFilesNames.push(element.filePath);
  });
  //if (changedFilesNames.length == 0) changedFilesNames.push("none");

  fileSys.writeFile(fileSys.types.contracts_changed, changedFilesNames);

  return changedFilesNames;
}

function checkTests(tests) {
  var oldChecksumsExists = fileSys.existsTestsChecksums();
  var oldFilesChecksums;
  if (oldChecksumsExists) oldFilesChecksums = fileSys.loadTestsChecksums();
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

  fileSys.writeFile(fileSys.types.tests_checksums, newFilesChecksums);

  var changedFilesNames = new Array();
  newFilesChecksums.forEach((element) => {
    if (element.checksum != element.lastChecksum)
      changedFilesNames.push(element.filePath);
  });
  //if (changedFilesNames.length == 0) changedFilesNames.push("none");

  fileSys.writeFile(fileSys.types.tests_changed, changedFilesNames);

  return changedFilesNames;
}

module.exports = {
  checkContracts: checkContracts,
  checkTests: checkTests,
};
