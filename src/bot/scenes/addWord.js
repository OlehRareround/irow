const {
  Scenes: { BaseScene },
} = require('telegraf');
const Word = require('../../db/models/word');

const addWordScene = new BaseScene('addWordScene');

addWordScene.enter((ctx) => ctx.replyWithHTML('Enter the word (in English):'));

addWordScene.on('text', async (ctx) => {
  try {
    const userId = ctx.message.from.id.toString();
    ctx.session.word = ctx.message.text.toLowerCase();
    const res = await Word.findOne({
      user: userId,
      text: ctx.session.word,
    }).exec();
    if (res) {
      ctx.reply('The word is already in your dictionary');
      return ctx.scene.leave();
    } else {
      return ctx.scene.enter('addTranslateScene');
    }
  } catch (err) {
    console.log(err);
    ctx.reply('Error, please try again later.');
    return ctx.scene.leave();
  }
});

module.exports = { addWordScene };
