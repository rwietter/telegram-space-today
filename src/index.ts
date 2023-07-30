import "./config/env";
import { bot } from "./http";
import { sendPicture } from "./lib";
import { moonPhase } from "./lib/moonPhase";

const commands = `Command reference:
/help - Show this message
/apod - NASA's Astronomy Picture of the Day
/moon - Current moon phase
`;

bot.command("help", async (ctx) => {
  await ctx.telegram.sendMessage(ctx.chat.id, commands);
});

bot.command("apod", sendPicture);

bot.command('moon', moonPhase)

bot.command("start", async (ctx) => {
  await ctx.telegram.sendMessage(ctx.chat.id, "Welcome to the bot!");
  await ctx.telegram.sendMessage(ctx.chat.id, commands);
});

bot
  .launch()
  .then(() => {
    console.log("Bot started");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
