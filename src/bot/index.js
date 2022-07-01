require('dotenv').config();

async function startBot(bot) {
  if (process.env.PRODUCTION === 'true') {
    bot.telegram.setWebhook('https://irow-bot.herokuapp.com/new-message');
    bot.startWebhook(`/new-message`, null, process.env.PORT);
  } else {
    bot.launch();
  }
  console.log('Bot started');

  process.once('SIGINT', () => {
    console.log('graceful stopping');
    bot.stop('SIGINT');
  });
  process.once('SIGTERM', () => {
    console.log('graceful stopping');
    bot.stop('SIGTERM');
  });
}

module.exports = { startBot };
