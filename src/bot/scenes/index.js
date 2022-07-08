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
      if (typeof ctx.session?.__scenes === 'object') {
        await ctx.scene.leave();
      }
      ctx.replyWithHTML(
        'Words collection settings',
        Markup.inlineKeyboard([
          [
            Markup.button.callback('add', 'btn_add', false),
            Markup.button.callback('delete', 'btn_delete', false),
          ],
          [
            Markup.button.callback(
              'view InProcess',
              'btn_viewInProcess',
              false,
            ),
            Markup.button.callback('view Complete', 'btn_viewComplete', false),
          ],
          [Markup.button.callback('view all', 'btn_viewAll', false)],
        ]),
      );
    });

    stage.command('training', (ctx) => ctx.scene.enter('trainingScene'));

    bot.use(session(), stage.middleware());

    return stage;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = { initScenes };
