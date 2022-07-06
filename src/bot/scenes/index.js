const {
  Markup,
  session,
  Scenes: { Stage },
} = require('telegraf');
const { addWordScene } = require('./addWord');
const { addTranslateScene } = require('./addTranslate');
const { deleteWordScene } = require('./deleteWordScene');
const { trainingScene } = require('./trainingScene');
const bot = require('../connect');

async function initScenes() {
  try {
    const stage = new Stage([
      addWordScene,
      addTranslateScene,
      deleteWordScene,
      trainingScene,
    ]);
    stage.command('cancel', (ctx) => {
      ctx.reply('Operation canceled');
      return ctx.scene.leave();
    });
    stage.command('words', async (ctx) => {
      await ctx.scene.leave();
      ctx.replyWithHTML(
        'add, delete or view your words',
        Markup.inlineKeyboard([
          [
            Markup.button.callback('add', 'btn_add', false),
            Markup.button.callback('delete', 'btn_delete', false),
          ],
          [
            Markup.button.callback('viewAll', 'btn_viewAll', false),
            Markup.button.callback('viewInProcess', 'btn_viewInProcess', false),
            Markup.button.callback('viewComplete', 'btn_viewComplete', false),
          ],
        ]),
      );
    });

    bot.use(session(), stage.middleware());

    return stage;
  } catch (err) {
    console.error(err);
    process.exit(0);
  }
}

module.exports = { initScenes };
