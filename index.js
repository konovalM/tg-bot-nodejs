require("dotenv").config();
const TelegramApi = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");

// server express
const PORT = 5000;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

/*app.post("/notification", (req, res) => {
  console.log(req.body);
  res.status(200).json("сервер работает");
});*/
// server express

const { gameOptions, againOptions } = require("./options");

const token = process.env.token;

const bot = new TelegramApi(token, { polling: true });

const chats = {};

app.post("/notification", (req, res) => {
  console.log(req.body);
  bot.sendMessage(
    "459403393",
    `С вами просят связаться \n${req.body.email}\n${req.body.full_name}\n${req.body.phone}`
  );
  res.status(200).json("сервер работает");
});

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Я загадаю рандомно цифру: 0 или 1, если угадаешь, то у тебя будет сегодня счастливый день"
  );
  const number = Math.floor(Math.random() * 2);
  chats[chatId] = number.toString();
  return bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Начальное приветствие",
    },
    {
      command: "/info",
      description: "Информация",
    },
    {
      command: "/game",
      description: "Испытай удачу",
    },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    console.log(chatId);

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/629/439/62943973-f1e5-422a-91ff-0436fd9c9722/1.webp"
      );
      return bot.sendMessage(
        chatId,
        `Приветствую тебя, ${msg.from.first_name}`
      );
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        "тут должна быть инструкция по использованию бота"
      );
    }

    if (text === "/game") {
      return await startGame(chatId);
    }

    return bot.sendMessage(chatId, "я тебя не понимаю");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") {
      return await startGame(chatId);
    }

    if (data === chats[chatId]) {
      return bot.sendMessage(chatId, "Угадал, Congratulations", againOptions);
    } else
      return bot.sendMessage(
        chatId,
        "Не угадал, Дефолтный Максим",
        againOptions
      );
  });
};

start();
app.listen(PORT, () => console.log("server started on port " + PORT));
