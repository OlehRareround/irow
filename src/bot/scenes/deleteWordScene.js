const {
  Scenes: { BaseScene },
} = require('telegraf');
const Word = require('../../db/models/word');
const Training = require('../../db/models/training');
const Job = require('../../db/models/job');
const { messages } = require('../../consts/bot.messages');

const deleteWordScene = new BaseScene('deleteWordScene');

deleteWordScene.enter((ctx) =>
  ctx.replyWithHTML(messages.deleteWordScene.enter),
);

deleteWordScene.on('text', async (ctx) => {
  try {
    const user = ctx.message.from.id.toString();
    const text = ctx.message.text.toLowerCase();
    const checkWord = await Word.findOne({
      user,
      text,
    });
    if (!checkWord) {
      const message = messages.deleteWordScene.incorrectWord(text);
      ctx.reply(message);
      return ctx.scene.leave();
    } else {
      await Word.deleteOne({ user, text });
      await Training.deleteMany({ userId: user, wordId: checkWord._id });
      await Job.deleteMany({
        $and: [
          { 'data.to': user },
          { 'data.wordId': checkWord._id.toString() },
        ],
      });
      const message = messages.deleteWordScene.complete(text);
      ctx.reply(message);
      return ctx.scene.leave();
    }
  } catch (err) {
    console.error(err);
    ctx.reply(messages.error);
    return ctx.scene.leave();
  }
});

module.exports = { deleteWordScene };
