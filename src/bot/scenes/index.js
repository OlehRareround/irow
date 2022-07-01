const {
  session,
  Scenes: { Stage },
} = require('telegraf');
const { addWordScene } = require('./addWord');
const { addTranslateScene } = require('./addTranslate');
const { deleteWordScene } = require('./deleteWordScene');

async function initScenes(bot) {
  const stage = new Stage([addWordScene, addTranslateScene, deleteWordScene]);
  bot.use(session(), stage.middleware());
  console.log('Scenes initialized');
  return stage;
}

module.exports = { initScenes };
