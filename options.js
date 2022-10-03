module.exports = {
  gameOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: "0", callback_data: "0" },
          { text: "1", callback_data: "1" },
        ],
      ],
    }),
  },

  againOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [[{ text: "Играть еще раз", callback_data: "/again" }]],
    }),
  },
};
