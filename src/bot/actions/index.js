const Word = require('../../db/models/word');
const { commands } = require('../../consts/bot.commands');
const bot = require('../connect');
const { messages } = require('../../consts/bot.messages');

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
      ctx.reply(message);
    });

    bot.action('btn_viewInProcess', async (ctx) => {
      const status = 'In process';
      const user = ctx.callbackQuery.from.id.toString();
      const filter = { user, status };
      const inProcess = await Word.find(filter);
      const words = [];
      inProcess.forEach((obj) => {
        words.push(`${obj.text}\n`);
      });
      const message = messages.wordsInfo(words, status);
      ctx.reply(message);
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
      ctx.reply(message);
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
