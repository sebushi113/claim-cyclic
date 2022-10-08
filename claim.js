import { Api, JsonRpc } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig.js"; // development only
// import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig";
import fetch from "node-fetch";
import * as cron from "node-cron";
import moment from "moment";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import * as notify from "./notify.js";
import * as update_cpu4 from "./update_cpu4.js";
import * as http from "http";
import express from "express";

const privateKeys = [process.env.cs1c, process.env.cd3c];

const signatureProvider = new JsSignatureProvider(privateKeys);
//https://wax.eosio.online/endpoints
// let rpc = new JsonRpc("https://wax.greymass.com", { fetch }); //required to read blockchain state
// let rpc = new JsonRpc("https://wax.eosusa.news/", { fetch });
let rpc = new JsonRpc("http://wax.api.eosnation.io/", { fetch });
let api = new Api({ rpc, signatureProvider }); //required to submit transactions

const cs1a = process.env.cs1a;
const cs1p = process.env.cs1;
const cd3a = process.env.cd3a;
const cd3p = process.env.cd3p;

const date = "YYYY-MM-DD HH:mm:ss";
const telegram_date = "YYYY MM DD  HH:mm:ss";

const chat_id = process.env.chat_id;
const chat_id2 = process.env.chat_id2;

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
            authorization: [{ actor: cs1a, permission: cs1p }],
            data: {
              to: cs1a,
            },
          },
        ],
      },
      { useLastIrreversible: true, expireSeconds: 500 }
    );
    // console.log(
    //   `  🦁   | ${moment(new Date()).format(date)} | ${
    //     transaction.transaction_id
    //   }`
    // );
    // console.log("🦁 " + transaction.transaction_id);
    // console.log(tx);

    let tx = transaction.transaction_id;
    console.log("🦁 " + tx);
    // console.log("tx");
    // console.log(tx);

    // let from =
    //   transaction.processed.action_traces[0].inline_traces[0].act.data.from;
    // // console.log("from");
    // // console.log(from);
    let to =
      transaction.processed.action_traces[0].inline_traces[0].act.data.to;
    // // console.log("to");
    // // console.log(to);
    // let action =
    //   transaction.processed.action_traces[0].inline_traces[0].act.name;
    // // console.log("action");
    // // console.log(action);
    // let quantity =
    //   transaction.processed.action_traces[0].inline_traces[0].act.data.quantity;
    // // console.log("quantity");
    // // console.log(quantity);
    // // let tx = "66f21ad13d3fc13518bd2fcbc05ec34fd89d4d2ffdd66b9f9d5b0f0c0a9a634c";
    // // let tx = transaction.id;

    let tx_message = `${moment(new Date()).format(
      telegram_date
    )}\n\naction: claim\nfrom: s\\.rplanet\nto: ${to}\n\n[view transaction](https://wax.bloks.io/transaction/${tx})`;

    // let tx_message =
    //   moment(new Date()).format(telegram_date) +
    //   "\n\naction: claim\nfrom: s\\.rplanet\nto:" +
    //   to +
    //   "\n\n[view transaction](https://wax.bloks.io/transaction/${tx})";

    // console.log("tx_message");
    // console.log(tx_message);

    notify.sendMessage(chat_id2, tx_message);

    // return tx;
    await sleep(5000);
    await cs1_claim_rplanet();
  } catch (error) {
    if (error.message == "assertion failure with message: E_NOTHING_TO_CLAIM") {
      console.log(" 🦁✅  | nothing to claim, waiting...");
    } else if (
      error.message ==
      "estimated CPU time (0 us) is not less than the maximum billable CPU time for the transaction (0 us)"
    ) {
      console.log(`  🦁   | ${moment(new Date()).format(date)} | api error`);
      await api_error();
      await sleep(3000);
      await cs1_claim_rplanet();
    } else {
      console.log(
        `  🦁   | ${moment(new Date()).format(date)} | unknown error`
      );
      console.log(error);
      await unknown_error();
      await sleep(5000);
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
            authorization: [{ actor: cd3a, permission: cd3p }],
            data: {
              to: cd3a,
            },
          },
        ],
      },
      { useLastIrreversible: true, expireSeconds: 300 }
    );
    // console.log(
    //   `  🐵   | ${moment(new Date()).format(date)} | ${
    //     transaction.transaction_id
    //   }`
    // );
    let tx = transaction.transaction_id;
    // console.log("tx");
    console.log(tx);

    // let from =
    //   transaction.processed.action_traces[0].inline_traces[0].act.data.from;
    // // console.log("from");
    // // console.log(from);
    let to =
      transaction.processed.action_traces[0].inline_traces[0].act.data.to;
    // // console.log("to");
    // // console.log(to);
    // let action =
    //   transaction.processed.action_traces[0].inline_traces[0].act.name;
    // // console.log("action");
    // // console.log(action);
    // let quantity =
    //   transaction.processed.action_traces[0].inline_traces[0].act.data.quantity;
    // // console.log("quantity");
    // // console.log(quantity);
    // // let tx = "66f21ad13d3fc13518bd2fcbc05ec34fd89d4d2ffdd66b9f9d5b0f0c0a9a634c";
    // // let tx = transaction.id;

    // // from: ${from}
    // // quantity: ${quantity}

    let tx_message = `${moment(new Date()).format(
      telegram_date
    )}\n\n*claim*\nfrom: s\\.rplanet\nto: ${to}\n\n[view transaction](https://wax.bloks.io/transaction/${tx})`;

    // console.log("tx_message");
    // console.log(tx_message);

    console.log("🦁 " + tx);
    notify.sendMessage(chat_id2, tx_message);

    await sleep(5000);
    await cd3_claim_rplanet();
  } catch (error) {
    if (error.message == "assertion failure with message: E_NOTHING_TO_CLAIM") {
      console.log(" 🐵✅  | nothing to claim, waiting...");
    } else if (
      error.message ==
      "estimated CPU time (0 us) is not less than the maximum billable CPU time for the transaction (0 us)"
    ) {
      console.log(`  🐵   | ${moment(new Date()).format(date)} | api error`);
      await api_error();
      await sleep(5000);
      await cd3_claim_rplanet();
    } else {
      console.log(
        `  🐵   | ${moment(new Date()).format(date)} | unknown error`
      );
      console.log(error);
      await unknown_error();
      await sleep(5000);
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
            authorization: [{ actor: cs1a, permission: cs1p }],
            data: {
              user: cs1a,
            },
          },
          {
            account: "driveless.gr",
            name: "claim",
            authorization: [{ actor: cs1a, permission: cs1p }],
            data: {
              user: cs1a,
              collection: "greenrabbit",
            },
          },
          {
            account: "staking.gr",
            name: "claim",
            authorization: [{ actor: cd3a, permission: cd3p }],
            data: {
              user: cd3a,
              collection: "greenrabbit",
            },
          },
        ],
      },
      // { blocksBehind: 3, expireSeconds: 30 }
      { useLastIrreversible: true, expireSeconds: 300 }
    );
    // console.log(
    //   ` 🦁🐵  | ${moment(new Date()).format(date)} | ${
    //     transaction.transaction_id
    //   }`
    // );

    let tx = transaction.transaction_id;
    console.log("🦁🐵 " + tx);
    // console.log("tx");
    // console.log(tx);

    // let from =
    //   transaction.processed.action_traces[0].inline_traces[0].act.data.from;
    // // console.log("from");
    // // console.log(from);
    let to =
      transaction.processed.action_traces[0].inline_traces[0].act.data.to;
    // // console.log("to");
    // // console.log(to);
    // let action =
    //   transaction.processed.action_traces[0].inline_traces[0].act.name;
    // // console.log("action");
    // // console.log(action);
    // let quantity =
    //   transaction.processed.action_traces[0].inline_traces[0].act.data.quantity;
    // // console.log("quantity");
    // // console.log(quantity);
    // // let tx = "66f21ad13d3fc13518bd2fcbc05ec34fd89d4d2ffdd66b9f9d5b0f0c0a9a634c";
    // // let tx = transaction.id;

    // // from: ${from}
    // // quantity: ${quantity}

    let tx_message = `${moment(new Date()).format(
      telegram_date
    )}\n\naction: claim\nfrom: green rabbit\n\n[view transaction](https://wax.bloks.io/transaction/${tx})`;

    // console.log("tx_message");
    // console.log(tx_message);

    console.log("🦁 " + tx);
    notify.sendMessage(chat_id2, tx_message);

    notify.sendMessage(chat_id2, tx);
    await sleep(10000);
    await all_claim_greenrabbit();
  } catch (error) {
    if (
      error.message ==
      "assertion failure with message: nothing to claim just yet"
    ) {
      console.log(" ✅✅  | nothing to claim, waiting...");
    } else if (
      error.message ==
      "estimated CPU time (0 us) is not less than the maximum billable CPU time for the transaction (0 us)"
    ) {
      console.log(` 🦁🐵  | ${moment(new Date()).format(date)} | api error`);
      await api_error();
      await all_claim_greenrabbit();
    } else {
      console.log(
        ` 🦁🐵  | ${moment(new Date()).format(date)} | unknown error`
      );
      console.log(error);
      await unknown_error();
      await all_claim_greenrabbit();
    }
    // }
  }
}

async function successful_tx() {
  let tx = transaction.transaction_id;
  console.log(tx);
  notify.sendMessage(chat_id2, tx);
}

async function api_error() {
  rpc = new JsonRpc("http://wax.api.eosnation.io", { fetch });
  api = new Api({ rpc, signatureProvider }); //required to submit transactions
  console.log("  🔁  | switching api -> " + rpc.endpoint);
  let api_error_message =
    "api error 🔁\nswitching api to: http://wax\\.api\\.eosnation\\.io";
  notify.sendMessage(chat_id, api_error_message);
  await sleep(5000);
}

async function unknown_error() {
  // console.log(error);
  let unknown_error_message = "unknown error\ncheck console";
  notify.sendMessage(chat_id, unknown_error_message);
  await sleep(5000);
}

console.log(" rpc  | " + rpc.endpoint);

// cs1_claim_rplanet();
// cd3_claim_rplanet();
// all_claim_greenrabbit();

const app = express();
app.all("/cs1", async (req, res) => {
  // console.log("Just got a request!");
  await cs1_claim_rplanet();
  res.send("claiming cs1...");
  // res.write("claimed");
  // res.end;
  // res.write(cs1_claim_rplanet());
});
app.all("/cd3", async (req, res) => {
  await cd3_claim_rplanet();
  res.send("claiming cd3...");
});
app.all("/gr", async (req, res) => {
  await all_claim_greenrabbit();
  res.send("claiming green rabbit...");
});
app.all("/cpu4", async (req, res) => {
  await update_cpu4();
  res.send("updating cpu4...");
});
app.listen(process.env.PORT || 3000);

// // app.use(async function (req, res, next) {
// //   //do stuff
// //   // res.send("claiming cl...");
// //   res.write("claiming cl...");
// //   await cs1_claim_rplanet();
// //   // res.write(cs1_claim_rplanet());
// //   // res.send("claimed");
// //   // res.send(cl);
// //   // res.send("claimed");
// //   next();
// // });

// cron.schedule("2 * * * *", cs1_claim_rplanet);
// console.log("  🦁   | waiting to claim on min 2...");
// cron.schedule("2 0,2,4,6,8,10,12,14,16,18,20,22 * * *", cd3_claim_rplanet);
// console.log("  🐵   | waiting to claim on min 2 of even hour...");

// cron.schedule("0 17 * * */1", all_claim_greenrabbit);
// console.log(" 🦁🐵  | waiting to claim at 17:00:00...");
