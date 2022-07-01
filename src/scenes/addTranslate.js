const {
  Scenes: { BaseScene },
} = require('telegraf');
const Word = require('../db/models/word');

const addTranslateScene = new BaseScene('addTranslateScene');

addTranslateScene.enter((ctx) => ctx.replyWithHTML('Enter the translate:'));

addTranslateScene.on('text', (ctx) => {
  try {
    const userId = ctx.message.from.id.toString();
    ctx.session.translate = ctx.message.text;
    let word = new Word({
      text: ctx.session.word,
      user: userId,
      translate: ctx.session.translate,
    });
    word
      .save()
      .then(() => {
        ctx.reply('A word was added in your dictionary.');
        // here need add job // return agenda.define('sendCheckingScene')
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (err) {
    console.log(err);
    ctx.reply(err.message);
    return ctx.scene.leave();
  }
});

module.exports = { addTranslateScene };
