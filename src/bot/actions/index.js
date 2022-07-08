const Word = require('../../db/models/word');
const { commands } = require('../helpers');
const bot = require('../connect');

async function initActions() {
  try {
    bot.start(async (ctx) => {
      ctx.replyWithMarkdown(
        `Привіт, *${ctx.message.from.first_name}*!` +
          '\n\nЯ допомагаю вчити англійські слова використовуючи метод інтервальних повторень.' +
          '\n\nЯк тільки ти правильно відповідаєш, слово переходить на наступну ітерацію. Всього ітерацій 8.' +
          '\nПерша ітерація через 15хв, друга через 30хв, далі через 3 години, 1 день, 5 днів, 25 днів, 3 місяці і остання через рік.' +
          '\n\nЩоб переглянути доступні команди натискай /help',
      );
    });

    bot.help((ctx) => ctx.reply(commands));

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
        result.push(`${obj.text}\n`); // need add next repeating;
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
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = { initActions };
