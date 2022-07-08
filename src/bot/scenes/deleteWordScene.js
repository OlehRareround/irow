const {
  Scenes: { BaseScene },
} = require('telegraf');
const Word = require('../../db/models/word');
const Training = require('../../db/models/training');

const deleteWordScene = new BaseScene('deleteWordScene');

deleteWordScene.enter((ctx) => ctx.replyWithHTML('Enter the word for delete:'));

deleteWordScene.on('text', async (ctx) => {
  try {
    const user = ctx.message.from.id.toString();
    const text = ctx.message.text.toLowerCase();
    const checkWord = await Word.findOne({
      user,
      text,
    });
    if (!checkWord) {
      ctx.reply(
        `The word "${text}" is not defined. Nothing to delete (In English).`,
      );
      return ctx.scene.leave();
    } else {
      await Word.deleteOne({ user, text });
      await Training.deleteMany({ userId: user, wordId: checkWord._id });
      ctx.reply(`The word "${text}" was deleted.`);
      return ctx.scene.leave();
    }
  } catch (err) {
    console.error(err);
    ctx.reply('Error, please try again later.');
    return ctx.scene.leave();
  }
});

module.exports = { deleteWordScene };
