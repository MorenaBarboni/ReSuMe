const chalk = require("chalk");
const path = require("path");

function logPaths(title, paths) {
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

module.exports = { logPaths: logPaths };
