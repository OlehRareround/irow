const { Telegraf } = require('telegraf');

async function initBot(token) {
  const bot = new Telegraf(token);
  console.log('Bot initialized');
  return bot;
}

module.exports = { initBot };
