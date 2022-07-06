const {
  Scenes: { BaseScene },
} = require('telegraf');
const Word = require('../../db/models/word');

const addWordScene = new BaseScene('addWordScene');

addWordScene.enter((ctx) => ctx.replyWithHTML('Enter the word (in English):'));

addWordScene.on('text', (ctx) => {
  try {
    const userId = ctx.message.from.id.toString();
    ctx.session.word = ctx.message.text;
    Word.findOne({ user: userId, text: ctx.session.word }, function (err, res) {
      if (err) {
        throw new Error(err);
      } else {
        if (res) {
          ctx.reply('The word is already in your dictionary');
          return ctx.scene.leave();
        } else {
          ctx.scene.enter('addTranslateScene');
        }
      }
    });
  } catch (err) {
    console.log(err);
    ctx.reply(err.message);
    return ctx.scene.leave();
  }
});

module.exports = { addWordScene };
