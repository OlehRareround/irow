require('dotenv').config();
const { connectDB } = require('./db');
const { initBot } = require('./bot/connect');
const { initScenes } = require('./bot/scenes');
const { initActions } = require('./bot/actions');
const { startBot } = require('./bot');
const { startAgenda } = require('./agenda');

async function run() {
  await connectDB(process.env.DB_CONFIG);
  const bot = await initBot(process.env.BOT_TOKEN);
  await initScenes(bot);
  await initActions(bot);
  await startBot(bot);
  await startAgenda(bot);
}

run();
