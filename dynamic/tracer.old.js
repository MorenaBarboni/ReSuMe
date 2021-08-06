const fs = require("fs");
const CoverageAPI = require("solidity-coverage/api");

var checksum = require("checksum"),
  cs = checksum("dshaw");

console.log("My_project started!");

const c = require("ganache-cli");

const api = new CoverageAPI(
  { port: 8555 },
  { silent: false },
  { client: c },
  { providerOptions: {} },
  { skipFiles: [] },
  { istanbulFolder: "coverage" },
  { istanbulReporter: ["html", "lcov", "text", "json"] }
);

const contracts = [
  // {
  //     source: fs.readFileSync('/home/francesco/Scrivania/EtherCrowdfunding/contracts/CrowdfundingCampaign.sol', 'utf8'),
  //     canonicalPath: '/home/francesco/Scrivania/EtherCrowdfunding/contracts/CrowdfundingCampaign.sol',
  //     relativePath: 'CrowdfundingCampaign.sol'
  // }
  // ,
  {
    source: fs.readFileSync("./marketplace.sol", "utf8"),
    canonicalPath: "/marketplace.sol",
    relativePath: "Marketplace.sol",
  },
];

const instrumented = api.instrument(contracts);
const inData = api.getInstrumentationData();
console.log();
console.log("Contracts instrumented succesfully!");

// fs.writeFile('data.json', JSON.stringify(inData), (err) => {
//     if (err) throw err;
// })

const dir = "instrumentedContracts";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

instrumented.forEach((element) => {
  fs.writeFile(dir + "/" + element.relativePath, element.source, (err) => {
    if (err) throw err;
  });
});

console.log();
console.log("Instrumented contracts saved to " + dir + "!");
console.log();