const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const fileSys = require("./fileSys");
const { table } = require("table");

function logPathsOnConsole(title, paths) {
  const n = paths.length;
  if (n == 0) console.log(title + ": " + chalk.green("none"));
  else {
    console.log(title + " (" + n + "):");

    paths.forEach((p) => {
      console.log(
        "\t" + path.parse(p).dir + "/" + chalk.bold(path.basename(p))
      );
    });
  }
  console.log();
}

function logTileOnReport(content) {
  fs.appendFileSync(fileSys.report, "\n\n" + content + "\n", { flags: "a" });
}

function logJsonOnReport(content) {
  const n = content.length;
  if (n == 0) fs.appendFileSync(fileSys.report, "none", { flags: "a" });
  else
    fs.appendFileSync(fileSys.report, JSON.stringify(content, null, "\t"), {
      flags: "a",
    });
}

function logProgramDifferences(cc, ct) {
  var s =
    "\n" +
    "\n" +
    "-------------- PROGRAM DIFFERENCES --------------" +
    "\n\n" +
    "Changed contracts:";

  var n = cc.length;
  if (n == 0) s = s + " none" + "\n";
  else {
    s = s + "\n";
    cc.forEach((c) => {
      s = s + " - " + c + "\n";
    });
  }

  s = s + "\n" + "Changed tests:";
  n = ct.length;
  if (n == 0) s = s + " none" + "\n";
  else {
    s = s + "\n";
    ct.forEach((t) => {
      s = s + " - " + t + "\n";
    });
  }
  s = s + "\n\n";
  fs.appendFileSync(fileSys.report, s, { flags: "a" });
}

function logRTS(cm, rt) {
  var s =
    "--------- REGRESSION MUTATION SELECTION ---------" +
    "\n\n" +
    "Contracts to be mutated:";

  var n = cm.length;
  if (n == 0) s = s + " none" + "\n";
  else {
    s = s + "\n";
    cm.forEach((c) => {
      s = s + " - " + c + "\n";
    });
  }

  s = s + "\n" + "Regression tests:";
  n = rt.length;
  if (n == 0) s = s + " none" + "\n";
  else {
    s = s + "\n";
    rt.forEach((t) => {
      s = s + " - " + t + "\n";
    });
  }
  s = s + "\n\n";
  fs.appendFileSync(fileSys.report, s, { flags: "a" });
}

function logSuMo() {
  var s =
    "--------- SUMO MUTATION TESTING PROCESS ---------" +
    "\n" +
    ".\n" +
    ".\n" +
    ".\n" +
    ".\n" +
    ".\n" +
    ".\n" +
    ".\n"+
    "---------------- PROCESS ENDED ------------------";

  s = s + "\n\n\n";
  fs.appendFileSync(fileSys.report, s, { flags: "a" });
}

function logRTSResults(matrix, t, k, a, sc) {
  var s =
    "------- PARTIAL MUTATION TESTING RESULTS --------" +
    "\n\nPartial mutants execution matrix:\n";

  s =
    s +
    table(matrix) +
    "Total mutants: " +
    t +
    "\nKilled mutants: " +
    k +
    "\nAlive mutants: " +
    a +
    "\nMutation score: " +
    sc +"\n\n\n";
  fs.appendFileSync(fileSys.report, s, { flags: "a" });
}

function logRTSUpdatedResults(matrix, t, k, a,sc) {
  var s =
    "------ REGRESSION MUTATION TESTING RESULTS ------" +
    "\n\nUpdated mutants execution matrix:\n";

  s =
    s +
    table(matrix) +
    "Total mutants: " +
    t +
    "\nKilled mutants: " +
    k +
    "\nAlive mutants: " +
    a +
    "\nMutation score: " +
    sc;
  fs.appendFileSync(fileSys.report, s, { flags: "a" });
}

module.exports = {
  logPathsOnConsole: logPathsOnConsole,
  logJsonOnReport: logJsonOnReport,
  logTileOnReport: logTileOnReport,
  logProgramDifferences: logProgramDifferences,
  logRTS: logRTS,
  logSuMo: logSuMo,
  logRTSResults: logRTSResults,
  logRTSUpdatedResults: logRTSUpdatedResults,
};
