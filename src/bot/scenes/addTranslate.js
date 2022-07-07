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

addTranslateScene.on('text', (ctx) => {
  try {
    const userId = ctx.message.from.id.toString();
    ctx.session.translate = ctx.message.text;
    let word = new Word({
      text: ctx.session.word.toLowerCase(),
      user: userId,
      translate: ctx.session.translate.toLowerCase(),
    });
    word.save((err, thisWord) => {
      if (err) {
        throw new Error(err);
      }
      try {
        const wordId = thisWord.id;
        const to = userId;
        const currentDate = new Date();
        const date = currentDate.setMinutes(currentDate.getMinutes() + 15);
        bot.telegram.deleteMessage(ctx.message.from.id, ctx.message.message_id);
        ctx.reply(
          'The word is added to your dictionary. Next repeating after 30 minutes',
        );
        process.env.PRODUCTION === 'true'
          ? agenda.schedule(date, 'sendMessage', { to, wordId })
          : agenda.now('sendMessage', { to, wordId });
        ctx.scene.leave();
      } catch (err) {
        throw new Error(err);
      }
    });
  } catch (err) {
    console.log(err);
    ctx.reply(`error: ${err.message}`);
    return ctx.scene.leave();
  }
});

module.exports = { addTranslateScene };
