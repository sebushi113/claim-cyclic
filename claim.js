import { Api, JsonRpc } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig.js"; // development only
// import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig";
import fetch from "node-fetch";
import moment from "moment";
import * as dotenv from "dotenv";
dotenv.config();
import sendMessage from "./notify.js";
// import { api_error } from "./api-error.js";

const privateKeys = [process.env.cs1k, process.env.cd3k];

const signatureProvider = new JsSignatureProvider(privateKeys);
//https://wax.eosio.online/endpoints
let rpc = new JsonRpc("https://wax.greymass.com", { fetch }); //required to read blockchain state
// let rpc = new JsonRpc("https://wax.eosusa.news/", { fetch });
// let rpc = new JsonRpc("http://wax.api.eosnation.io/", { fetch });
let api = new Api({ rpc, signatureProvider }); //required to submit transactions

const cs1a = process.env.cs1a;
const cs1p = process.env.cs1p;
const cd3a = process.env.cd3a;
const cd3p = process.env.cd3p;
const chat_id = process.env.chat_id;
const errors = process.env.errors;
const date = "YYYY-MM-DD HH:mm:ss";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function cs1_claim_gr() {
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
        ],
      },
      { useLastIrreversible: true, expireSeconds: 300 }
    );
    let tx = transaction.transaction_id;
    console.log("🦁 c | " + tx);
    let at_account = transaction.processed.action_traces[0].act.account;
    let at_name = transaction.processed.action_traces[0].act.name;
    let at_data_user = transaction.processed.action_traces[0].act.data.user;
    let at_data_collection =
      transaction.processed.action_traces[0].act.data.collection;
    let it_data_quantity =
      transaction.processed.action_traces[0].inline_traces[0].act.data.quantity;

    // let time = moment(new Date()).format(date);
    let message = `
🦁  <b>${at_data_user}</b>
account: ${at_account}
name: <b>${at_name}</b>
collection: ${at_data_collection}
quantity: ${it_data_quantity}
<a href="https://wax.bloks.io/transaction/${tx}">view transaction</a>`;
    return message;
    // await sendMessage(chat_id, message);
    await sleep(5000);
    await cs1_claim_gr();
  } catch (error) {
    let error_message = `🦁 w | cs1_claim_gr\n${error.message}`;
    console.log(error_message);
    await sendMessage(errors, error_message);
    if (
      error.message ==
      "assertion failure with message: nothing to claim just yet"
    ) {
      console.log("🦁✅ c | nothing to claim, waiting...");
      return;
    } else if (
      error.message ==
      "estimated CPU time (0 us) is not less than the maximum billable CPU time for the transaction (0 us)"
    ) {
      console.log(`🦁 c | ${moment(new Date()).format(date)} | api error`);
      await api_error();
      await cs1_claim_gr();
    } else {
      console.log(`🦁 c | ${moment(new Date()).format(date)} | unknown error`);
      console.log(error);
      // await sleep(5000);
      // await cs1_claim_gr();
    }
  }
}

export async function cd3_claim_gr() {
  try {
    const transaction = await api.transact(
      {
        actions: [
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
      { useLastIrreversible: true, expireSeconds: 300 }
    );
    let tx = transaction.transaction_id;
    console.log("🐵 c | " + tx);
    let at_account = transaction.processed.action_traces[0].act.account;
    let at_name = transaction.processed.action_traces[0].act.name;
    let at_data_user = transaction.processed.action_traces[0].act.data.user;
    let at_data_collection =
      transaction.processed.action_traces[0].act.data.collection;
    let it_data_quantity =
      transaction.processed.action_traces[0].inline_traces[0].act.data.quantity;

    // let time = moment(new Date()).format(date);
    let message = `
🐵  <b>${at_data_user}</b>
account: ${at_account}
name: <b>${at_name}</b>
collection: ${at_data_collection}
quantity: ${it_data_quantity}
<a href="https://wax.bloks.io/transaction/${tx}">view transaction</a>`;
    return message;
    // await sendMessage(chat_id, message);
    await sleep(5000);
    await cd3_claim_gr();
  } catch (error) {
    let error_message = `🐵 w | cd3_claim_gr\n${error.message}`;
    console.log(error_message);
    await sendMessage(errors, error_message);
    if (
      error.message ==
      "assertion failure with message: nothing to claim just yet"
    ) {
      console.log("🐵✅ c | nothing to claim, waiting...");
      return;
    } else if (
      error.message ==
      "estimated CPU time (0 us) is not less than the maximum billable CPU time for the transaction (0 us)"
    ) {
      console.log(`🐵 c | ${moment(new Date()).format(date)} | api error`);
      await api_error();
      await cd3_claim_gr();
    } else {
      console.log(`🐵 c | ${moment(new Date()).format(date)} | unknown error`);
      console.log(error);
      // await sleep(5000);
      // await cd3_claim_gr();
    }
  }
}

export async function cs1_withdraw_gr() {
  try {
    const transaction = await api.transact(
      {
        actions: [
          {
            account: "accounts.gr",
            name: "withdraw",
            authorization: [{ actor: cs1a, permission: cs1p }],
            data: {
              user: cs1a,
              quantity: "282504.0000 SHELL",
            },
          },
        ],
      },
      { useLastIrreversible: true, expireSeconds: 300 }
    );
    let tx = transaction.transaction_id;
    console.log("🦁 w | " + tx);
    let at_account = transaction.processed.action_traces[0].act.account;
    let at_name = transaction.processed.action_traces[0].act.name;
    let at_data_user = transaction.processed.action_traces[0].act.data.user;
    let at_data_quantity =
      transaction.processed.action_traces[0].act.data.quantity;
    let message = `
🦁  <b>${at_data_user}</b>
account: ${at_account}
name: <b>${at_name}</b>
quantity: ${at_data_quantity}
<a href="https://wax.bloks.io/transaction/${tx}">view transaction</a>`;
    return message;
    // await sendMessage(chat_id, message);
    await sleep(5000);
    await cs1_withdraw_gr();
  } catch (error) {
    let error_message = `🦁 w | cs1_withdraw_gr\n${error.message}`;
    console.log(error_message);
    await sendMessage(errors, error_message);
    if (error.message == "assertion failure with message: overdrawn balance") {
      console.log("🦁✅ w | not enough to withdraw, waiting...");
      return;
    } else if (
      error.message ==
      "estimated CPU time (0 us) is not less than the maximum billable CPU time for the transaction (0 us)"
    ) {
      console.log(`🦁 w | ${moment(new Date()).format(date)} | api error`);
      await api_error();
      await sleep(5000);
      await cs1_withdraw_gr();
    } else {
      console.log(`🦁 w | ${moment(new Date()).format(date)} | unknown error`);
      console.log(error);
      // await sleep(5000);
      // await cs1_withdraw_gr();
    }
  }
}

export async function cd3_withdraw_gr() {
  try {
    const transaction = await api.transact(
      {
        actions: [
          {
            account: "accounts.gr",
            name: "withdraw",
            authorization: [{ actor: cd3a, permission: cd3p }],
            data: {
              user: cd3a,
              quantity: "48344.4000 SHELL",
            },
          },
        ],
      },
      { useLastIrreversible: true, expireSeconds: 300 }
    );
    let tx = transaction.transaction_id;
    console.log("🐵 w | " + tx);
    let at_account = transaction.processed.action_traces[0].act.account;
    let at_name = transaction.processed.action_traces[0].act.name;
    let at_data_user = transaction.processed.action_traces[0].act.data.user;
    let at_data_quantity =
      transaction.processed.action_traces[0].act.data.quantity;
    let message = `
🐵  <b>${at_data_user}</b>
account: ${at_account}
name: <b>${at_name}</b>
quantity: ${at_data_quantity}
<a href="https://wax.bloks.io/transaction/${tx}">view transaction</a>`;
    return message;
    // await sendMessage(chat_id, message);
    await sleep(5000);
    await cd3_withdraw_gr();
  } catch (error) {
    let error_message = `🐵 w | cd3_withdraw_gr\n${error.message}`;
    console.log(error_message);
    await sendMessage(errors, error_message);
    if (error.message == "assertion failure with message: overdrawn balance") {
      console.log("🐵✅ w | not enough to withdraw, waiting...");
      return;
    } else if (
      error.message ==
      "estimated CPU time (0 us) is not less than the maximum billable CPU time for the transaction (0 us)"
    ) {
      console.log(`🐵 w | ${moment(new Date()).format(date)} | api error`);
      await api_error();
      await sleep(5000);
      await cd3_withdraw_gr();
    } else {
      console.log(`🐵 w | ${moment(new Date()).format(date)} | unknown error`);
      console.log(error);
      // await sleep(5000);
      // await cd3_withdraw_gr();
    }
  }
}

async function api_error() {
  rpc = new JsonRpc("http://wax.api.eosnation.io", { fetch });
  api = new Api({ rpc, signatureProvider }); //required to submit transactions
  console.log("  🔀  | switching api -> " + rpc.endpoint);
  let api_error_message = `
🚨  api error
🔀  switching api to <a href="http://wax.api.eosnation.io">wax.api.eosnation.io</a>`;
  await sendMessage(errors, api_error_message);
}

console.log("rpc  | " + rpc.endpoint);
