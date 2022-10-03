require("dotenv").config();
const TelegramApi = require("node-telegram-bot-api");

const { gameOptions, againOptions } = require("./options");

const token = process.env.token;

const bot = new TelegramApi(token, { polling: true });

const chats = {};

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
    console.log(msg);

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
