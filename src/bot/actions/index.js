const Word = require('../../db/models/word');
const { commands } = require('../helpers');
const { Markup } = require('telegraf');
const bot = require('../connect');

async function initActions() {
  bot.start(async (ctx) => {
    ctx.reply(`Hi, ${ctx.message.from.first_name}! ${commands}`);
  });

  bot.help((ctx) => ctx.reply(commands));

  bot.command('words', (ctx) => {
    ctx.replyWithHTML(
      'add, delete or view your words',
      Markup.inlineKeyboard([
        [
          Markup.button.callback('add', 'btn_add', false),
          Markup.button.callback('delete', 'btn_delete', false),
        ],
        [
          Markup.button.callback('viewAll', 'btn_viewAll', false),
          Markup.button.callback('viewInProcess', 'btn_viewInProcess', false),
          Markup.button.callback('viewComplete', 'btn_viewComplete', false),
        ],
      ]),
    );
  });

  bot.command('training', (ctx) => {
    ctx.scene.enter('trainingScene');
  });

  bot.action('btn_add', async (ctx) => {
    await ctx.scene.enter('addWordScene');
  });

  bot.action('btn_viewAll', async (ctx) => {
    const userId = ctx.callbackQuery.from.id.toString();
    const filter = { user: userId };
    const all = await Word.find(filter);
    const result = [];
    all.forEach((obj) => {
      result.push(`${obj.text}\n`);
    });
    const message = `** Status: all **\n\n${result
      .toString()
      .replace(/,/g, '')}\n** Count: ${result.length} **`;
    ctx.reply(message);
  });

  bot.action('btn_viewInProcess', async (ctx) => {
    const userId = ctx.callbackQuery.from.id.toString();
    const filter = { user: userId, status: 'In process' };
    const InProcess = await Word.find(filter);
    const result = [];
    InProcess.forEach((obj) => {
      result.push(`${obj.text}\n`);
    });
    const message = `** Status: In Process **\n\n${result
      .toString()
      .replace(/,/g, '')}\n** Count: ${result.length} **`;
    ctx.reply(message);
  });

  bot.action('btn_viewComplete', async (ctx) => {
    const userId = ctx.callbackQuery.from.id.toString();
    const filter = { user: userId, status: 'Complete' };
    const complete = await Word.find(filter);
    const result = [];
    complete.forEach((obj) => {
      result.push(`${obj.text}\n`);
    });
    const message = `** Status: Complete **\n\n${result
      .toString()
      .replace(/,/g, '')}\n** Count: ${result.length} **`;
    ctx.reply(message);
  });

  bot.on('text', async (ctx) => {
    try {
      bot.telegram.deleteMessage(ctx.message.from.id, ctx.message.message_id);
    } catch (err) {
      console.error(err);
      ctx.reply(`Error: ${err.message}`);
    }
  });

  bot.action('btn_delete', async (ctx) => {
    ctx.scene.enter('deleteWordScene');
  });

  console.log('Actions initialized');
}

module.exports = { initActions };
