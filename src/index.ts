import "./config/env";
import "./services/mongo";
import cron from "node-cron";
import { bot } from "./http";
import { Chatlist } from "./model/schema";
import { sendPicture, unsubscribeToReceiveApodEveryday, moonPhase } from "./lib";

const commands = `Command reference:
/help - Show this message
/apod - NASA's Astronomy Picture of the Day
/moon - Current moon phase
/subscribe - Subscribe to receive the Astronomy Picture of the Day every day
/unsubscribe - Unsubscribe to receive the Astronomy Picture of the Day every day
`;

bot.command("help", async (ctx) => {
  await ctx.telegram.sendMessage(ctx.chat.id, commands);
});

bot.command("apod", async (ctx) => {
  const data = await sendPicture();

  if (data instanceof Error) {
    return ctx.reply(data.message);
  }

  const { url, title, date, explanation, hdurl } = data;

  const hdImage = hdurl ? `<a href="${hdurl}">HD Version</a>` : "";

  return ctx.telegram.sendPhoto(ctx.chat.id, url, {
    caption: `<a href="${url}">${title}</a> — ${date} \n\n${explanation} \n\n${hdImage}`,
    parse_mode: "HTML",
  });
});

bot.command("moon", moonPhase);

bot.command("start", async (ctx) => {
  await ctx.telegram.sendMessage(ctx.chat.id, "Welcome to the bot!");
  await ctx.telegram.sendMessage(ctx.chat.id, commands);
});

bot.command("subscribe", async (ctx) => {
  try {
    const { id } = ctx.chat;

    const exists = await Chatlist.findOne({ chatId: id });

    if (exists) {
      return ctx.reply(
        "Hey! You already registered. If you want to unsubscribe, use /unsubscribe"
      );
    }

    const chatlist = await Chatlist.create({ chatId: id });

    if (!chatlist) {
      return ctx.reply(
        "UwU, Houston, we have a problem. Try again later or contact the developer (@rwietter)"
      );
    }

    return ctx.reply(
      "Wow! Now, you will receive the Astronomy Picture of the Day every day! 🚀"
    );
  } catch (error) {
    console.error(error);
  }
});

bot.command("unsubscribe", unsubscribeToReceiveApodEveryday)

const sendApodForAllGroups = async () => {
  try {
    const chatlists = await Chatlist.find();

    if (!chatlists.length) {
      return;
    }

    const data = await sendPicture();
    if (data instanceof Error) {
      return;
    }

    const { url, title, date, explanation, hdurl } = data;

    const hdImage = hdurl ? `<a href="${hdurl}">HD Version</a>` : "";

    for (const chat of chatlists) {
      await bot.telegram.sendPhoto(String(chat.chatId), url, {
        caption: `<a href="${url}">${title}</a> — ${date} \n\n${explanation} \n\n${hdImage}`,
        parse_mode: "HTML",
      });
    }
  } catch (error) {
    console.error(error);
  }
};

cron.schedule("10 11 */1 * *", async () => {
  await sendApodForAllGroups();
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
