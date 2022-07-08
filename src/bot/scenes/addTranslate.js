require('dotenv').config();
const {
  Scenes: { BaseScene },
} = require('telegraf');
const Word = require('../../db/models/word');
const agenda = require('../../agenda/initAgenda');
const bot = require('../../bot/connect');

const addTranslateScene = new BaseScene('addTranslateScene');

addTranslateScene.enter((ctx) =>
  ctx.replyWithHTML('Enter the translate (in Ukrainian):'),
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
    ctx.reply(
      'The word is added to your dictionary. Next repeating after 15 minutes.',
    );
    process.env.PRODUCTION === 'true'
      ? agenda.schedule(date, 'sendMessage', { to, wordId })
      : agenda.now('sendMessage', { to, wordId });
    ctx.scene.leave();
  } catch (err) {
    console.error(err);
    ctx.reply('Error, please try again later.');
    return ctx.scene.leave();
  }
});

module.exports = { addTranslateScene };
