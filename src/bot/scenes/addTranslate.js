const {
  Scenes: { BaseScene },
} = require('telegraf');
const Word = require('../../db/models/word');
const { schedule } = require('../../agenda/jobs/scheduler');
const bot = require('../../bot/connect');
const { messages } = require('../../consts/bot.messages');

const addTranslateScene = new BaseScene('addTranslateScene');

addTranslateScene.enter((ctx) =>
  ctx.replyWithHTML(messages.addTranslateScene.enter),
);

addTranslateScene.on('text', async (ctx) => {
  try {
    const userId = ctx.message.from.id.toString();
    ctx.session.translate = ctx.message.text.toLowerCase();
    let word = new Word({
      text: ctx.session.word,
      user: userId,
      translate: ctx.session.translate,
    });
    const thisWord = await word.save();
    const wordId = thisWord.id;
    const to = userId;
    const currentDate = new Date();
    const date = currentDate.setMinutes(currentDate.getMinutes() + 15);
    bot.telegram.deleteMessage(ctx.message.from.id, ctx.message.message_id);
    ctx.reply(messages.addTranslateScene.complete);
    schedule.sendMessage(date, to, wordId);
    ctx.scene.leave();
  } catch (err) {
    console.error(err);
    ctx.reply(messages.error);
    return ctx.scene.leave();
  }
});

module.exports = { addTranslateScene };
