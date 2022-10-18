import { Api, JsonRpc } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig.js"; // development only
// import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig";
import fetch from "node-fetch";
import moment from "moment";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import sendMessage from "./notify.js";

const privateKeys = [process.env.cs1c, process.env.cd3c];

const signatureProvider = new JsSignatureProvider(privateKeys);
//https://wax.eosio.online/endpoints
let rpc = new JsonRpc("https://wax.greymass.com", { fetch }); //required to read blockchain state
// let rpc = new JsonRpc("https://wax.eosusa.news/", { fetch });
// let rpc = new JsonRpc("http://wax.api.eosnation.io/", { fetch });
let api = new Api({ rpc, signatureProvider }); //required to submit transactions

const cs1 = process.env.cs1;
const cs1_perm = process.env.cs1perm;
const cd3 = process.env.cd3;
const cd3_perm = process.env.cd3perm;

const chat_id = process.env.chat_id;
const chat_id2 = process.env.chat_id2;
const date = "YYYY-MM-DD HH:mm:ss";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
      { useLastIrreversible: true, expireSeconds: 300 }
    );
    let action =
      transaction.processed.action_traces[0].inline_traces[0].act.name;
    let from =
      transaction.processed.action_traces[0].inline_traces[0].act.data.from;
    let to =
      transaction.processed.action_traces[0].inline_traces[0].act.data.to;
    let quantity =
      transaction.processed.action_traces[0].inline_traces[0].act.data.quantity;
    let tx = transaction.transaction_id;
    let time = moment(new Date()).format(date);
    let message = `${time}\n<b>cyclic</b>\n\naction: ${action}\nfrom: ${from}\nto: ${to}\nquantity: ${quantity}\n\n<a href="https://wax.bloks.io/transaction/${tx}">view transaction</a>`;
    console.log("🦁🐵 " + tx);
    await sendMessage(chat_id2, message);
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

async function all_withdraw_greenrabbit() {
  try {
    const transaction = await api.transact(
      {
        actions: [
          {
            account: "accounts.gr",
            name: "withdraw",
            authorization: [{ actor: cs1, permission: cs1_perm }],
            data: {
              user: cs1,
              quantity: "282504.0000 SHELL",
            },
          },
          {
            account: "accounts.gr",
            name: "withdraw",
            authorization: [{ actor: cd3, permission: cd3_perm }],
            data: {
              user: cd3,
              quantity: "48344.4000 SHELL",
            },
          },
        ],
      },
      { useLastIrreversible: true, expireSeconds: 300 }
    );
    let action =
      transaction.processed.action_traces[0].inline_traces[0].act.name;
    let from =
      transaction.processed.action_traces[0].inline_traces[0].act.data.from;
    let to =
      transaction.processed.action_traces[0].inline_traces[0].act.data.to;
    let quantity =
      transaction.processed.action_traces[0].inline_traces[0].act.data.quantity;
    let tx = transaction.transaction_id;
    let time = moment(new Date()).format(date);
    let message = `${time}\n<b>cyclic</b>\n\naction: ${action}\nfrom: ${from}\nto: ${to}\nquantity: ${quantity}\n\n<a href="https://wax.bloks.io/transaction/${tx}">view transaction</a>`;
    // \n<code>cd3d:  ${cpu4_cd3d}</code>
    console.log("🦁🐵 " + tx);
    await sendMessage(chat_id2, message);
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
  }
}

async function successful_tx() {
  let tx = transaction.transaction_id;
  console.log(tx);
  await sendMessage(chat_id2, tx);
}

async function api_error() {
  rpc = new JsonRpc("http://wax.api.eosnation.io", { fetch });
  api = new Api({ rpc, signatureProvider }); //required to submit transactions
  console.log("  🔁  | switching api -> " + rpc.endpoint);
  let api_error_message =
    "api error 🔁\nswitching api to: http://wax\\.api\\.eosnation\\.io";
  await sendMessage(chat_id, api_error_message);
  await sleep(5000);
}

async function unknown_error() {
  // console.log(error);
  let unknown_error_message = "unknown error\ncheck console";
  await sendMessage(chat_id, unknown_error_message);
  await sleep(5000);
}

console.log(" rpc  | " + rpc.endpoint);
/*
// console.log(cs1_claim_rplanet());

// let claimed = await cs1_claim_rplanet();

// import express from "express";
// const app = express();
// app.all("/", (req, res) => {
//   console.log("Just got a request!");
//   res.send("claiming cs1...");
//   // res.send("claimed" + claimed);
// });
// app.listen(process.env.PORT || 3000);

// import * as http from "http";
// http
//   .createServer(async function (req, res) {
//     // console.log(`Just got a request at ${req.url}!`);
//     res.write("claiming cs1...\n");
//     // await sleep(20000);
//     // await cs1_claim_rplanet();
//     res.write("claimed\n" + (await cs1_claim_rplanet()));
//     res.end();
//   })
//   .listen(process.env.PORT || 3000);

// http.get("http://localhost:3000/cs1", function (response) {
//   // console.log("Status:", response.statusCode);
//   // console.log("Headers: ", response.headers);
//   response.pipe(process.stdout);
// });

// http.get("http://localhost:3000/cd3", function (response) {
//   // console.log("Status:", response.statusCode);
//   // console.log("Headers: ", response.headers);
//   response.pipe(process.stdout);
// });
*/
// all_claim_greenrabbit();

// const app = express();

// app.all("/gr-claim", async (req, res) => {
//   console.time("gr-claim");
//   console.log(moment(new Date()).format(date) + " | gr-claim started");
//   // res.send("claiming green rabbit...");
//   await all_claim_greenrabbit();
//   console.log(moment(new Date()).format(date) + " | gr-claim finished");
//   console.timeEnd("gr-claim");

//   res.send("green rabbit claimed");
//   // res.write("claimed");
//   // res.end;
// });

// // app.all("/gr-withdraw", async (req, res) => {
// //   console.time("gr-withdraw");
// //   console.log(moment(new Date()).format(date) + " | gr-withdraw started");
// //   // res.write("withdrawing green rabbit...");
// //   await all_withdraw_greenrabbit();
// //   console.log(moment(new Date()).format(date) + " | gr-withdraw finished");
// //   console.timeEnd("gr-withdraw");

// //   res.send("green rabbit withdrawn");
// // });
// app.listen(process.env.PORT || 3000);
