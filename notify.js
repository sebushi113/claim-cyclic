import { Telegraf } from "telegraf";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const chat_id = process.env.chat_id;
const chat_id2 = process.env.chat_id2;
// const message = "error: *claim experienced an error*";
// const error = "error";

export default async function sendMessage(chat_id, message) {
  await bot.telegram.sendMessage(chat_id, message, {
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
  console.log("\x1b[36m%s\x1b[0m", "message sent");
}

// sendMessage(chat_id2, tx_message);
// console.log(sendMessage());
