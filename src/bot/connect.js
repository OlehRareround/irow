require('dotenv').config();

const { Telegraf } = require('telegraf');

let bot;
process.env.PRODUCTION === 'true'
  ? (bot = new Telegraf(process.env.BOT_TOKEN))
  : (bot = new Telegraf(process.env.BOT_TOKEN_DEV));

console.log('Bot initialized');

module.exports = bot;
