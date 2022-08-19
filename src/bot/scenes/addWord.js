const {
  Scenes: { BaseScene },
} = require('telegraf');
const Word = require('../../db/models/word');
const { messages } = require('../../consts/bot.messages');

const addWordScene = new BaseScene('addWordScene');

addWordScene.enter((ctx) => ctx.replyWithHTML(messages.addWordScene.enter));

addWordScene.on('text', async (ctx) => {
  try {
    const userId = ctx.message.from.id.toString();
    ctx.session.word = ctx.message.text.toLowerCase();
    const res = await Word.findOne({
      user: userId,
      text: ctx.session.word,
    }).exec();
    if (res) {
      ctx.reply(messages.addWordScene.incorrectWord);
      return ctx.scene.leave();
    }
    return ctx.scene.enter('addTranslateScene');
  } catch (err) {
    console.log(err);
    ctx.reply(messages.error);
    return ctx.scene.leave();
  }
});

module.exports = { addWordScene };
