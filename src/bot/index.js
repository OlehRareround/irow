require('dotenv').config();
const bot = require('./connect');

async function startBot() {
  try {
    if (process.env.PRODUCTION === 'true') {
      bot.telegram.setWebhook('https://irow-bot.herokuapp.com/new-message');
      bot.startWebhook(`/new-message`, null, process.env.PORT);
    } else {
      bot.launch();
    }
    console.log('Bot started');

    process.once('SIGINT', () => {
      console.log('Bot stopping...');
      bot.stop('SIGINT');
    });
    process.once('SIGTERM', () => {
      console.log('Bot stopping...');
      bot.stop('SIGTERM');
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = { startBot };
