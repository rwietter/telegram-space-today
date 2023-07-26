import { Context } from "telegraf";
import { Cache, Picture } from "../types";
import { getPicture } from "./fetchPicture";

const cache: Cache = {
  picture: null,
};

export const sendPicture = async (ctx: Context) => {
  try {
    if (cache.picture !== null) {
      const { hdUrl, url, title, date }: Picture = cache.picture;

      if (!url && !hdUrl) return;

      return ctx.sendPhoto(hdUrl || url, {
        caption: `<a href="${url}">${title}</a> — ${date}`,
        parse_mode: "HTML",
      });
    }

    const data = await getPicture();

    if (data == null) {
      return
    }

    const { hdUrl, url, title, copyright, date }: Picture = data;

    cache.picture = {
      hdUrl,
      copyright,
      date,
      title,
      url,
    };

    return ctx.sendPhoto(hdUrl || url, {
      caption: `<a href="${url}">${title}</a> — ${date}`,
      parse_mode: "HTML",
    });
  } catch (error) {
    return ctx.reply("Could not fetch image");
  }
};
