import express from "express";
import moment from "moment";
import AWS from "aws-sdk";
import bodyParser from "body-parser";
import * as claim from "./claim.js";
import sendMessage from "./notify.js";

const app = express();
const date = "YYYY-MM-DD HH:mm:ss";
const s3 = new AWS.S3();
const chat_id = process.env.chat_id;
const bucket = process.env.BUCKET;

app.all("/claim-gr", async (req, res) => {
  let startTime = performance.now();
  console.log("claim-gr started");
  let cs1_claim_gr = await claim.cs1_claim_gr();
  let cd3_claim_gr = await claim.cd3_claim_gr();
  console.log("claim-gr finished");
  let endTime = performance.now();
  let totalTime = (endTime - startTime).toFixed(3);
  console.log(`claim-gr: ${totalTime}ms`);
  let time = moment(new Date()).format(date);
  // balances updated and appended to sheet
  let message = `
${time}
claimed gr successfully
${cs1_claim_gr}
${cd3_claim_gr}

<b>cyclic</b>: ${totalTime}ms (<a href="${process.env.cs_url}">cyclic</a>)`;
  await sendMessage(chat_id, message);
  res.send(`green rabbit claimed<br/>${totalTime}ms`);
});

app.all("/withdraw-gr", async (req, res) => {
  let startTime = performance.now();
  console.log("withdraw-gr started");
  let cs1_withdraw_gr = await claim.cs1_withdraw_gr();
  let cd3_withdraw_gr = await claim.cd3_withdraw_gr();
  console.log("withdraw-gr finished");
  let endTime = performance.now();
  let totalTime = (endTime - startTime).toFixed(3);
  console.log(`withdraw-gr: ${totalTime}ms`);
  let time = moment(new Date()).format(date);
  let message = `
${time}
withdrew gr
<code>cs1 balance:  ${claim.cs1_balance}</code>
<code>cd3 balance:  ${claim.cd3_balance}</code>
${cs1_withdraw_gr}
${cd3_withdraw_gr}

<b>cyclic</b>: ${totalTime}ms (<a href="${process.env.cs_url}">cyclic</a>)`;
  await sendMessage(chat_id, message);
  res.send(`green rabbit withdrawn<br/>${totalTime}ms`);
});

app.use(bodyParser.json());

// curl -i some-app.cyclic.app/myFile.txt
app.get("*", async (req, res) => {
  let filename = req.path.slice(1);

  try {
    let s3File = await s3
      .getObject({
        Bucket: bucket,
        Key: filename,
      })
      .promise();

    res.set("Content-type", s3File.ContentType);
    res.send(s3File.Body.toString()).end();
  } catch (error) {
    if (error.code === "NoSuchKey") {
      console.log(`No such key ${filename}`);
      res.sendStatus(404).end();
    } else {
      console.log(error);
      res.sendStatus(500).end();
    }
  }
});

// curl -i -XPUT --data '{"k1":"value 1", "k2": "value 2"}' -H 'Content-type: application/json' https://some-app.cyclic.app/myFile.txt
app.put("*", async (req, res) => {
  let filename = req.path.slice(1);

  console.log(typeof req.body);

  await s3
    .putObject({
      Body: JSON.stringify(req.body),
      Bucket: bucket,
      Key: filename,
    })
    .promise();

  res.set("Content-type", "text/plain");
  res.send("ok").end();
});

// curl -i -XDELETE https://some-app.cyclic.app/myFile.txt
app.delete("*", async (req, res) => {
  let filename = req.path.slice(1);

  await s3
    .deleteObject({
      Bucket: bucket,
      Key: filename,
    })
    .promise();

  res.set("Content-type", "text/plain");
  res.send("ok").end();
});

// /////////////////////////////////////////////////////////////////////////////
// Catch all handler for all other request.
app.use("*", (req, res) => {
  res.sendStatus(404).end();
});

app.listen(process.env.PORT || 3000);
