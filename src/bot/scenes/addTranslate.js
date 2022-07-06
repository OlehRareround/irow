const {
  Scenes: { BaseScene },
} = require('telegraf');
const Word = require('../../db/models/word');
const agenda = require('../../agenda/initAgenda');

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
      const wordId = thisWord.id;
      const to = userId;
      const currentDate = new Date();
      const date = currentDate.setMinutes(currentDate.getMinutes() + 30);
      ctx.reply(
        'The word is added to your dictionary. Next repeating after 30 minutes',
      );
      agenda.schedule(date, 'sendMessage', { to, wordId }); // production
      // agenda.now('sendMessage', { to, wordId }); // dev
      ctx.scene.leave();
    });
  } catch (err) {
    console.log(err);
    ctx.reply(`error: ${err.message}`);
    return ctx.scene.leave();
  }
});

module.exports = { addTranslateScene };
