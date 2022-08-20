const {
  Scenes: { BaseScene },
} = require('telegraf');
const Word = require('../../db/models/word');
const { schedule } = require('../../agenda/jobs/scheduler');
const Training = require('../../db/models/training');
const bot = require('../connect');
const { messages } = require('../../consts/bot.messages');

const trainingScene = new BaseScene('trainingScene');

trainingScene.enter(async (ctx) => {
  try {
    const userId = ctx.message.from.id;
    ctx.session.trainingDoc = await Training.findOne({
      userId,
      status: 'ACT',
    }).exec();
    let message = '';
    if (!ctx.session.trainingDoc) {
      message = messages.trainingScene.enter.cancel;
      ctx.reply(message);
      return (ctx.session.exit = true);
    }
    ctx.session.exit = false;
    ctx.session.word = await Word.findById({
      _id: ctx.session.trainingDoc.wordId,
    });
    message = messages.trainingScene.enter.ok(ctx.session.word.text);
    ctx.reply(message);
  } catch (err) {
    console.error(err);
    ctx.reply(messages.error);
    ctx.session.exit = true;
    return ctx.scene.leave();
  }
});

trainingScene.on('text', async (ctx) => {
  try {
    if (ctx.session.exit) {
      return ctx.scene.leave();
    }
    let thisWordStage = ctx.session.word.stage;
    const translate = ctx.message.text.toLowerCase();
    let reply;
    if (translate === ctx.session.word.translate) {
      reply = messages.trainingScene.correct;
      if (thisWordStage < 8) {
        thisWordStage += 1;
        await Word.updateOne(
          {
            _id: ctx.session.word._id,
          },
          { stage: thisWordStage },
        );
      } else {
        thisWordStage = 88;
        await Word.updateOne(
          {
            _id: ctx.session.word._id,
          },
          { status: 'Complete', stage: thisWordStage },
        );
      }
    } else {
      reply = messages.trainingScene.incorrect(ctx.session.word.translate);
      thisWordStage = 1;
      await Word.updateOne(
        {
          _id: ctx.session.word._id,
        },
        { stage: thisWordStage },
      );
    }

    reply += messages.trainingScene.nextRepeat;
    const currentDate = new Date();
    let date;
    switch (thisWordStage) {
      case 1:
        ctx.replyWithMarkdownV2(reply + '15 minutes\\.');
        date = currentDate.setMinutes(currentDate.getMinutes() + 15);
        schedule.sendMessage(date, ctx.message.from.id, ctx.session.word._id);
        break;
      case 2:
        ctx.replyWithMarkdownV2(reply + '30 minutes\\.');
        date = currentDate.setMinutes(currentDate.getMinutes() + 30);
        schedule.sendMessage(date, ctx.message.from.id, ctx.session.word._id);
        break;
      case 3:
        ctx.replyWithMarkdownV2(reply + '3 hours\\.');
        date = currentDate.setHours(currentDate.getHours() + 3);
        schedule.sendMessage(date, ctx.message.from.id, ctx.session.word._id);
        break;
      case 4:
        ctx.replyWithMarkdownV2(reply + '1 day\\.');
        date = currentDate.setHours(currentDate.getHours() + 24);
        schedule.sendMessage(date, ctx.message.from.id, ctx.session.word._id);
        break;
      case 5:
        ctx.replyWithMarkdownV2(reply + '5 days\\.');
        date = currentDate.setHours(currentDate.getHours() + 120);
        schedule.sendMessage(date, ctx.message.from.id, ctx.session.word._id);
        break;
      case 6:
        ctx.replyWithMarkdownV2(reply + '25 days\\.');
        date = currentDate.setHours(currentDate.getHours() + 600);
        schedule.sendMessage(date, ctx.message.from.id, ctx.session.word._id);
        break;
      case 7:
        ctx.replyWithMarkdownV2(reply + '3 month\\.');
        date = currentDate.setHours(currentDate.getHours() + 2160);
        schedule.sendMessage(date, ctx.message.from.id, ctx.session.word._id);
        break;
      case 8:
        ctx.replyWithMarkdownV2(reply + '1 year\\.');
        date = currentDate.setHours(currentDate.getHours() + 8760);
        schedule.sendMessage(date, ctx.message.from.id, ctx.session.word._id);
        break;
      case 88:
        ctx.reply(messages.trainingScene.congratulations);
        break;
      default:
        console.error(
          'Something went wrong with the stages, and switched to default',
        );
        ctx.reply(messages.error);
    }

    await Training.updateOne(
      { _id: ctx.session.trainingDoc._id },
      { status: 'CMP' },
    );

    bot.telegram.deleteMessage(ctx.message.from.id, ctx.message.message_id);

    return ctx.scene.reenter();
  } catch (err) {
    console.error(err);
    ctx.reply(messages.error);
    return ctx.scene.leave();
  }
});

module.exports = { trainingScene };
