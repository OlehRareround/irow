const Word = require('../../db/models/word');
const Job = require('../../db/models/job');
const { commands } = require('../../consts/bot.commands');
const bot = require('../connect');
const { messages } = require('../../consts/bot.messages');
const { compare } = require('../helpers');

async function initActions() {
  try {
    bot.start(async (ctx) => {
      ctx.replyWithMarkdown(messages.start(ctx.message.from.first_name));
    });

    bot.help((ctx) => ctx.reply(commands));

    bot.action('btn_add', async (ctx) => {
      await ctx.scene.enter('addWordScene');
    });

    bot.action('btn_viewAll', async (ctx) => {
      const status = 'All';
      const user = ctx.callbackQuery.from.id.toString();
      const filter = { user };
      const all = await Word.find(filter);
      const words = [];
      all.forEach((obj) => {
        words.push(`${obj.text}\n`);
      });
      const message = messages.wordsInfo(words, status);
      ctx.replyWithMarkdown(message);
    });

    bot.action('btn_viewInProcess', async (ctx) => {
      const status = 'In process';
      const user = ctx.callbackQuery.from.id.toString();
      const dateNow = new Date();

      const filter = { user, status };
      const wordsInProcess = await Word.find(filter);

      const jobs = await Job.find({
        'data.to': +user,
        nextRunAt: { $ne: null },
      });

      const sortedWords = [];
      wordsInProcess.forEach((word) => {
        const job = jobs.filter(
          (job) => word._id.toString() === job.data.wordId.toString(),
        );
        sortedWords.push({
          name: word.text,
          nextRunAt: job[0]?.nextRunAt || dateNow,
        });
      });

      sortedWords.sort(compare);
      sortedWords.forEach((word) =>
        word.nextRunAt === dateNow
          ? (word.nextRunAt = 'ACT')
          : (word.nextRunAt = word.nextRunAt.toLocaleString()),
      );

      const wordsEntries = [];
      sortedWords.forEach((word) =>
        wordsEntries.push(`${word.name} - ${word.nextRunAt}\n`),
      );

      const message = messages.wordsInfo(wordsEntries, status);
      ctx.replyWithMarkdown(message);
    });

    bot.action('btn_viewComplete', async (ctx) => {
      const status = 'Complete';
      const user = ctx.callbackQuery.from.id.toString();
      const filter = { user, status };
      const complete = await Word.find(filter);
      const words = [];
      complete.forEach((obj) => {
        words.push(`${obj.text}\n`);
      });
      const message = messages.wordsInfo(words, status);
      ctx.replyWithMarkdown(message);
    });

    bot.on('text', async (ctx) => {
      try {
        bot.telegram.deleteMessage(ctx.message.from.id, ctx.message.message_id);
      } catch (err) {
        console.error(err);
        ctx.reply(`Error: ${err?.message}`);
      }
    });

    bot.action('btn_delete', async (ctx) => {
      ctx.scene.enter('deleteWordScene');
    });

    console.log('Actions initialized');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = { initActions };
