import { Context } from "telegraf";
import { Picture } from "../types";
import { getPicture } from "./fetchPicture";
import { client } from "../services";

const sendFromAPI = async (ctx: Context) => {
  try {
    const data = await getPicture();

    if (data == null) {
      return ctx.reply("Could not fetch image");
    }

    const { url, title, date }: Picture = data;

    const TIME_TO_LIVE = 18000; // 5 hours
    await client.set("picture", JSON.stringify(data), "EX", TIME_TO_LIVE);

    return ctx.sendPhoto(url, {
      caption: `<a href="${url}">${title}</a> — ${date}`,
      parse_mode: "HTML",
    });
  } catch (error) {
    return ctx.reply("Sorry, we have a problem in Space Center Houston :(");
  }
};

const sendFromCache = async (ctx: Context, cache: string) => {
  try {
    const deserializeCache = await JSON.parse(cache);

    const { url, title, date }: Picture = deserializeCache;

    if (!url) return;

    return ctx.sendPhoto(url, {
      caption: `<a href="${url}">${title}</a> — ${date}`,
      parse_mode: "HTML",
    });
  } catch (error) {
    return ctx.reply("Sorry, something went wrong. Try again later.");
  }
}

export const sendPicture = async (ctx: Context) => {
  try {
    const cache = await client.get("picture");

    if (!cache) {
      console.log("Cache miss. Fetching from API.");
      return sendFromAPI(ctx);
    }

    console.log("Cache hit. Sending from cache.");
    return sendFromCache(ctx, cache);

  } catch (error) {
    return ctx.reply("Sorry, we have a server problem. Try again later.");
  }
};
