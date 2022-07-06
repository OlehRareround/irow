const {
  Scenes: { BaseScene },
} = require('telegraf');
const Word = require('../../db/models/word');
// const agenda = require('../../agenda/initAgenda');
const Training = require('../../db/models/training');

const trainingScene = new BaseScene('trainingScene');

trainingScene.enter(async (ctx) => {
  try {
    const userId = ctx.message.from.id;
    const trainingDoc = await Training.findOne({
      userId,
      status: 'ACT',
    }).exec();
    if (!trainingDoc) {
      ctx.reply('Your dictionary is empty.\nPlease add /words!');
      return (ctx.session.exit = true);
    } else {
      ctx.session.exit = false;
      const word = await Word.findById({
        _id: trainingDoc.wordId,
      });
      ctx.session.text = word.text;
      ctx.session.translate = word.translate;
      ctx.session.trainingDoc = trainingDoc;
      ctx.reply(
        `Enter the translation (in Ukrainian)!\nWord: ${ctx.session.text}`,
      );
    }
  } catch (err) {
    console.error(err);
    ctx.reply({ error: err.message || err });
    ctx.session.exit = true;
    return ctx.scene.leave();
  }
});

trainingScene.on('text', async (ctx) => {
  if (ctx.session.exit) {
    return ctx.scene.leave();
  }
  const translate = ctx.message.text.toLowerCase();
  if (translate === ctx.session.translate) {
    ctx.reply(`Yes, ${translate} === ${ctx.session.translate}`);
    await Training.updateOne(
      { _id: ctx.session.trainingDoc._id },
      { status: 'CMP' },
    );
  } else {
    ctx.reply(`No, ${translate} !== ${ctx.session.translate}`);
  }
  return ctx.scene.reenter();
});

module.exports = { trainingScene };
