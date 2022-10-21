import express from "express";
import moment from "moment";
import * as claim from "./claim.js";

const app = express();
const date = "YYYY-MM-DD HH:mm:ss";

app.all("/claim-gr", async (req, res) => {
  // res.write("claiming green rabbit...");
  console.time("claim-gr");
  console.log(moment(new Date()).format(date) + " | claim-gr started");
  await claim.cs1_claim_gr();
  await claim.cd3_claim_gr();
  console.log(moment(new Date()).format(date) + " | claim-gr finished");
  console.timeEnd("claim-gr");
  res.send("green rabbit claimed");
  // res.write("claimed");
  // res.end;
});

app.all("/withdraw-gr", async (req, res) => {
  // res.write("withdrawing green rabbit...");
  console.time("withdraw-gr");
  console.log(moment(new Date()).format(date) + " | withdraw-gr started");
  await claim.cs1_withdraw_gr();
  await claim.cd3_withdraw_gr();
  console.log(moment(new Date()).format(date) + " | withdraw-gr finished");
  console.timeEnd("withdraw-gr");
  res.send("green rabbit withdrawn");
});
app.listen(process.env.PORT || 3000);
