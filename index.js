const TelegramApi = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.token;

const bot = new TelegramApi(token, { polling: true });

bot.on("message", (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  console.log(msg.text);
  if (text === "/start") {
    bot.sendMessage(chatId, `Приветствую тебя, ${msg.from.first_name}`);
  }
  // bot.sendMessage(chatId, `Ответ на сообщение ${text}`);
});
