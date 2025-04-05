import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { trackUser, trackInteraction, loadStats } from "./stats.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  trackUser(ctx);

  ctx.reply(
    "Привіт! Я бот-помічник для абітурієнтів, які хочуть вступити на Програмну інженерію в ХНУРЕ.\nВиберіть питання, яке вас цікавить:",
    {
      reply_markup: {
        keyboard: [
          ["📚 Які предмети потрібні?", "📊 Який прохідний бал?"],
          ["📅 Дедлайни подачі документів", "📞 Контакти приймальної комісії"],
        ],
        resize_keyboard: true,
      },
    }
  );
});

bot.hears("📚 Які предмети потрібні?", (ctx) => {
  trackInteraction("subjects");
  ctx.reply(
    "✅ Українська мова\n✅ Математика\n✅ Один предмет на вибір: Іноземна мова, Історія України або Фізика"
  );
});

bot.hears("📊 Який прохідний бал?", (ctx) => {
  trackInteraction("score");
  ctx.reply(
    "📊 Прохідний бал на бюджет у 2024 році — від 170+. Точний бал залежить від конкурсу."
  );
});

bot.hears("📅 Дедлайни подачі документів", (ctx) => {
  trackInteraction("deadlines");
  ctx.reply(
    "🗓️ Важливі дати:\n- Подання заяв: 1–15 липня 2025\n- Рейтингові списки: до 20 липня\n- Зарахування на бюджет: до 25 липня"
  );
});

bot.hears("📞 Контакти приймальної комісії", (ctx) => {
  trackInteraction("contacts");
  ctx.reply(
    "🌐 Сайт: https://software.nure.ua/\n📞 Телефон: +38 (057) 702-13-53\n✉️ Email: pi@nure.ua"
  );
});

bot.command("stats", (ctx) => {
  const stats = loadStats();
  const isAdmin = ctx.chat.id == process.env.ADMIN_ID;

  if (!isAdmin) return ctx.reply("⛔ Доступ лише для адміністратора");

  ctx.reply(
    `📊 Статистика бота:\n` +
      `👥 Унікальні користувачі: ${stats.users.length}\n` +
      `📚 Предмети: ${stats.interactions.subjects}\n` +
      `📊 Бал: ${stats.interactions.score}\n` +
      `📅 Дедлайни: ${stats.interactions.deadlines}\n` +
      `📞 Контакти: ${stats.interactions.contacts}`
  );
});

bot.launch();
console.log("Бот запущено! 🚀");
