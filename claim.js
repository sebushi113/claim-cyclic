import { Api, JsonRpc } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig.js"; // development only
// import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig";
import fetch from "node-fetch";
import * as cron from "node-cron";
import moment from "moment";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
// import * as notify from "./notify.js";
// import sendMessage from "./notify";
// const notify = require("./notify");
const privateKeys = [process.env.cs1c, process.env.cd3c];

const signatureProvider = new JsSignatureProvider(privateKeys);
let rpc = new JsonRpc("https://wax.greymass.com", { fetch });
// const rpc = new JsonRpc("https://wax.eosusa.news/", { fetch }); //https://wax.eosio.online/endpoints
// const rpc = new JsonRpc("http://wax.api.eosnation.io/", { fetch });
// const rpc = new JsonRpc("https://wax.greymass.com"); //required to read blockchain state
let api = new Api({ rpc, signatureProvider }); //required to submit transactions

const cs1 = process.env.cs1;
const cs1_perm = process.env.cs1perm;
const cd3 = process.env.cd3;
const cd3_perm = process.env.cd3perm;

// let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
// let current_date = date.format("YYYY-MM-DD HH:mm:ss");
// let next_hour = date.add(1, "hours").format("HH");
const date = "YYYY-MM-DD HH:mm:ss";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function cs1_claim_rplanet() {
  // while (true) {
  try {
    const transaction = await api.transact(
      {
        actions: [
          {
            account: "s.rplanet",
            name: "claim",
            authorization: [{ actor: cs1, permission: cs1_perm }],
            data: {
              to: cs1,
            },
          },
        ],
      },
      // { blocksBehind: 3, expireSeconds: 30 }
      { useLastIrreversible: true, expireSeconds: 300 }
    );
    console.log(
      `  🦁  \x1b[32m | ${moment(new Date()).format(date)} | ${
        transaction.transaction_id
      }\x1b[0m`
    );
    await sleep(10000);
    await cs1_claim_rplanet();
  } catch (error) {
    if (error.message == "assertion failure with message: E_NOTHING_TO_CLAIM") {
      console.log(" 🦁✅ | nothing to claim, waiting...");
      // console.log("- 🦁   RP nothing to claim ✅");
      // console.log(
      //   `- 🦁   RP trying to claim again at ${moment(new Date())
      //     .add(1, "hours")
      //     .format("HH")}:03:00...`
      // ); //⏩
    } else if (
      error.message ==
      "estimated CPU time (0 us) is not less than the maximum billable CPU time for the transaction (0 us)"
    ) {
      console.log(
        `  🦁  \x1b[31m | ${moment(new Date()).format(date)} | api error\x1b[0m`
      );
      // rpc = new JsonRpc("http://wax.api.eosnation.io/", { fetch });
      // api = new Api({ rpc, signatureProvider }); //required to submit transactions
      // console.log("\x1b[33m%s\x1b[0m", "switching api -> " + rpc.endpoint);
      // let api_error_message = "api error\nswitching api -> " + rpc.endpoint;
      // notify.sendMessage(api_error_message);
      // await sleep(10000);
      await api_error();
      await cs1_claim_rplanet();
    } else {
      console.log(
        `  🦁  \x1b[31m | ${moment(new Date()).format(
          date
        )} | unknown error\x1b[0m`
      );
      await unknown_error();
      await cs1_claim_rplanet();
    }
  }
  // }
}

async function cd3_claim_rplanet() {
  try {
    const transaction = await api.transact(
      {
        actions: [
          {
            account: "s.rplanet",
            name: "claim",
            authorization: [{ actor: cd3, permission: cd3_perm }],
            data: {
              to: cd3,
            },
          },
        ],
      },
      // { blocksBehind: 3, expireSeconds: 30 }
      { useLastIrreversible: true, expireSeconds: 300 }
    );
    console.log(
      `  🐵  \x1b[32m | ${moment(new Date()).format(date)} | ${
        transaction.transaction_id
      }\x1b[0m`
    );
    await sleep(10000);
    await cd3_claim_rplanet();
  } catch (error) {
    if (error.message == "assertion failure with message: E_NOTHING_TO_CLAIM") {
      console.log(" 🐵✅ | nothing to claim, waiting...");
      // console.log(
      //   `- 🐵   RP trying to claim again at ${moment(new Date())
      //     .add(2, "hours")
      //     .format("HH")}:03:00...`
      // ); //⏩
    } else if (
      error.message ==
      "estimated CPU time (0 us) is not less than the maximum billable CPU time for the transaction (0 us)"
    ) {
      console.log(
        `  🐵  \x1b[31m | ${moment(new Date()).format(date)} | api error\x1b[0m`
      );
      await api_error();
      await cs1_claim_rplanet();
    } else {
      console.log(
        `  🐵  \x1b[31m | ${moment(new Date()).format(
          date
        )} | unknown error\x1b[0m`
      );
      await unknown_error();
      await cd3_claim_rplanet();
    }
  }
  // }
}

async function all_claim_greenrabbit() {
  // while (true) {
  try {
    const transaction = await api.transact(
      {
        actions: [
          {
            account: "staking.gr",
            name: "claim",
            authorization: [{ actor: cs1, permission: cs1_perm }],
            data: {
              user: cs1,
            },
          },
          {
            account: "driveless.gr",
            name: "claim",
            authorization: [{ actor: cs1, permission: cs1_perm }],
            data: {
              user: cs1,
              collection: "greenrabbit",
            },
          },
          {
            account: "staking.gr",
            name: "claim",
            authorization: [{ actor: cd3, permission: cd3_perm }],
            data: {
              user: cd3,
              collection: "greenrabbit",
            },
          },
        ],
      },
      // { blocksBehind: 3, expireSeconds: 30 }
      { useLastIrreversible: true, expireSeconds: 300 }
    );
    console.log(
      ` 🦁🐵\x1b[32m | ${moment(new Date()).format(date)} | ${
        transaction.transaction_id
      }\x1b[0m`
    );
    await sleep(10000);
    await all_claim_greenrabbit();
  } catch (error) {
    if (
      error.message ==
      "assertion failure with message: nothing to claim just yet"
    ) {
      console.log(" ✅✅ | nothing to claim, waiting...");
    } else if (
      error.message ==
      "estimated CPU time (0 us) is not less than the maximum billable CPU time for the transaction (0 us)"
    ) {
      console.log(
        ` 🦁🐵\x1b[31m | ${moment(new Date()).format(date)} | api error\x1b[0m`
      );
      await api_error();
      await cs1_claim_rplanet();
    } else {
      console.log(
        ` 🦁🐵\x1b[31m | ${moment(new Date()).format(
          date
        )} | unknown error\x1b[0m`
      );
      await unknown_error();
      await all_claim_greenrabbit();
    }
    // }
  }
}

async function api_error() {
  rpc = new JsonRpc("http://wax.api.eosnation.io", { fetch });
  api = new Api({ rpc, signatureProvider }); //required to submit transactions
  console.log("\x1b[33m%s\x1b[0m", "  🔁  | switching api -> " + rpc.endpoint);
  // let api_error_message =
  //   "api error 🔁\nswitching api to: http://wax\\.api\\.eosnation\\.io";
  // notify.sendMessage(api_error_message);
  await sleep(10000);
}

async function unknown_error() {
  console.log(error);
  // let unknown_error_message = "unknown error\ncheck console";
  // notify.sendMessage(unknown_error_message);
  await sleep(10000);
}

cs1_claim_rplanet();
// cd3_claim_rplanet();
// all_claim_greenrabbit();

// let error = "test";
// notify.sendMessage(error);

console.log("\x1b[36m", "rpc | " + rpc.endpoint, "\x1b[0m");

cron.schedule("2 * * * *", cs1_claim_rplanet);
console.log("  🦁   | waiting to claim on min 3...");
cron.schedule("2 0,2,4,6,8,10,12,14,16,18,20,22 * * *", cd3_claim_rplanet);
console.log("  🐵   | waiting to claim on min 3 of even hour...");

cron.schedule("0 17 * * */1", all_claim_greenrabbit);
console.log(" 🦁🐵 | waiting to claim at 13:00:00...");

// console.log(
//   "  🦁",
//   "\x1b[32m",
//   "| " +
//     moment(new Date()).format(date) +
//     " | " +
//     moment(new Date()).format(date) +
//     "\x1b[0m"
// );
// console.log(" 🦁✅ | nothing to claim, waiting...");
// console.log(
//   "🦁 ",
//   "\x1b[31m",
//   "| " + moment(new Date()).format(date) + " | api error",
//   "\x1b[0m"
// );
// console.log(
//   "🦁 ",
//   "\x1b[31m",
//   "| " + moment(new Date()).format(date) + " | unknown error",
//   "\x1b[0m"
// );
// console.log("\x1b[33m%s\x1b[0m", "🔁   | switching api -> " + rpc.endpoint);

// console.log("\x1b[36m", "rpc  | " + rpc.endpoint, "\x1b[0m");

// cron.schedule("3 * * * *", cs1_claim_rplanet);
// console.log("🦁   | waiting to claim on min 3...");
// cron.schedule("3 0,2,4,6,8,10,12,14,16,18,20,22 * * *", cd3_claim_rplanet);
// console.log("🐵   | waiting to claim on min 3 of even hour...");

// cron.schedule("0 17 * * */1", all_claim_greenrabbit);
// console.log("🦁🐵 | waiting to claim at 13:00:00...");

/*
// add local code to github
git init -b main
git add . && git commit -m "initial commit"
gh repo create --source=. --public --push
*/

/*
git add .
git commit -am "make it better"
git push heroku main [NEW]
git push heroku master [OLD]
heroku scale worker=1
heroku scale worker=0 //stop worker
heroku scale web=0
heroku logs --tail
heroku restart
git push --force heroku

// refresh .gitignore
git rm -r --cached .
git add .
*/

/*
"\x1b[32m%s\x1b[0m", green string & reset
\x1b[32m  green
\x1b[0m   reset
\x1b[31m  red

Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
*/
