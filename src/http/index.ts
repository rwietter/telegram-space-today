import { Telegraf, Context } from "telegraf";

const BOT_TOKEN = process.env.BOT_TOKEN as string;

const bot = new Telegraf(BOT_TOKEN).catch(console.log);

export { bot, Context };