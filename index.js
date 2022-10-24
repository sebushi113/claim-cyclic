import express from "express";
import moment from "moment";
import * as claim from "./claim.js";
import sendMessage from "./notify.js";

const app = express();
const date = "YYYY-MM-DD HH:mm:ss";
const chat_id2 = process.env.chat_id2;

app.all("/claim-gr", async (req, res) => {
  // res.write("claiming green rabbit...");
  // let claim_gr = "time taken";
  // console.time(claim_gr);
  let startTime = performance.now();
  console.log(moment(new Date()).format(date) + " | claim-gr started");
  let cs1_claim_gr = await claim.cs1_claim_gr();
  let cd3_claim_gr = await claim.cd3_claim_gr();
  console.log(moment(new Date()).format(date) + " | claim-gr finished");
  let endTime = performance.now();
  // console.timeEnd(claim_gr);
  let totalTime = startTime - endTime.toFixed(3);
  console.log(`claim-gr: ${totalTime}`);
  let tx_message = `${cs1_claim_gr}\n\n${cd3_claim_gr}\n\nclaim-gr: ${totalTime}ms`;
  await sendMessage(chat_id2, tx_message);
  res.send("green rabbit claimed");
  // res.write("claimed");
  // res.end;
});

app.all("/withdraw-gr", async (req, res) => {
  // res.write("withdrawing green rabbit...");
  // console.time("withdraw-gr");
  let startTime = performance.now();
  console.log(moment(new Date()).format(date) + " | withdraw-gr started");
  let cs1_withdraw_gr = await claim.cs1_withdraw_gr();
  let cd3_withdraw_gr = await claim.cd3_withdraw_gr();
  console.log(moment(new Date()).format(date) + " | withdraw-gr finished");
  let endTime = performance.now();
  // console.timeEnd(claim_gr);
  let totalTime = startTime - endTime.toFixed(3);
  console.log(`withdraw-gr: ${totalTime}`);
  let tx_message = `${cs1_withdraw_gr}\n\n${cd3_withdraw_gr}\n\nwithdraw-gr: ${totalTime}ms`;
  await sendMessage(chat_id2, tx_message); // console.timeEnd("withdraw-gr");
  res.send("green rabbit withdrawn");
});

app.listen(process.env.PORT || 3000);
