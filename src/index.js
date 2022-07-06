const { connectDB } = require('./db');
const { initScenes } = require('./bot/scenes');
const { initActions } = require('./bot/actions');
const { startBot } = require('./bot');
const { startAgenda } = require('./agenda');

async function run() {
  await connectDB();
  await initScenes();
  await initActions();
  await startBot();
  await startAgenda();
}

run();
