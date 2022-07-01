const {
  Markup,
  Scenes: { BaseScene },
} = require('telegraf');
const Word = require('../db/models/word');

const deleteWordScene = new BaseScene('deleteWordScene');

deleteWordScene.enter((ctx) => ctx.replyWithHTML('Enter the word for delete:'));

deleteWordScene.on('text', async (ctx) => {
  try {
    const userId = ctx.message.from.id.toString();
    const checkWord = await Word.find({ user: userId, text: ctx.message.text });
    if (checkWord.length === 0) {
      ctx.reply(
        `The word "${ctx.message.text}" is not defined. Nothing to delete.`,
      );
      return ctx.scene.leave();
    }
    Word.remove({ user: userId, text: ctx.message.text }).exec();
    ctx.reply(`The word "${ctx.message.text}" was deleted`);
    return ctx.scene.leave();
  } catch (err) {
    console.log(err);
    ctx.reply(err.message);
    return ctx.scene.leave();
  }
});

module.exports = { deleteWordScene };
