const { connectDB } = require('./db');
const { startAgenda } = require('./agenda');
const { initScenes } = require('./bot/scenes');
const { initActions } = require('./bot/actions');
const { startBot } = require('./bot');

async function run() {
  await connectDB();
  await initScenes();
  await initActions();
  await startBot();
  await startAgenda();
}

run();
