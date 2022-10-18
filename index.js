import express from "express";
import moment from "moment";
import * as claim from "./claim.js";

const app = express();
const date = "YYYY-MM-DD HH:mm:ss";

app.all("/gr-claim", async (req, res) => {
  console.time("gr-claim");
  res.write("claiming green rabbit...");
  console.log(moment(new Date()).format(date) + " | gr-claim started");
  await claim.all_claim_greenrabbit();
  // await claim.all_withdraw_greenrabbit();
  console.log(moment(new Date()).format(date) + " | gr-claim finished");
  console.timeEnd("gr-claim");

  res.write("green rabbit claimed");
  // res.write("claimed");
  res.end;
});

app.all("/gr-withdraw", async (req, res) => {
  res.write("withdrawing green rabbit...");
  console.time("gr-withdraw");
  console.log(moment(new Date()).format(date) + " | gr-withdraw started");
  await all_withdraw_greenrabbit();
  console.log(moment(new Date()).format(date) + " | gr-withdraw finished");
  console.timeEnd("gr-withdraw");

  res.send("green rabbit withdrawn");
});
app.listen(process.env.PORT || 3000);
