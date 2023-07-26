import "./config/env";
import { api, bot, Context } from "./http";

type AstronomyPicture = {
  hdUrl: string;
  url: string;
  title: string;
  copyright: string;
  date: string;
};

type Cache = {
  picture: AstronomyPicture | null;
};

const cache: Cache = {
  picture: null,
};

const getAstronomyPicture = async (): Promise<AstronomyPicture | null> => {
  try {
    const response = await api.get(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`
    );

    if (response.status !== 200) {
      console.log(
        "🚀 ~ file: index.ts:27 ~ getAstronomyPicture ~ response:",
        response.data
      );
      return null;
    }

    return response.data;
  } catch (error: any) {
    console.log(
      "🚀 ~ file: index.ts:30 ~ getAstronomyPicture ~ error:",
      error.message
    );
    return null;
  }
};

const fetchAstronomyPicture = async (ctx: Context) => {
  try {
    if (cache.picture !== null) {
      const { hdUrl, url, title, copyright, date }: AstronomyPicture =
        cache.picture;

      if (!url && !hdUrl) return;

      console.log("🚀 ~ FETCHING IMAGE FROM CACHE:", cache);

      return ctx.sendPhoto(hdUrl || url, {
        caption: `<a href="${url}">${title}</a> — ${date}`,
        parse_mode: "HTML",
      });
    }

    const data = await getAstronomyPicture();

    console.log("🚀 ~ FETCHING IMAGE FROM API");

    if (data === null) {
      console.log(
        "🚀 ~ file: index.ts:67 ~ Could not fetch image ~ data:",
        data
      );
      return;
    }

    const { hdUrl, url, title, copyright, date }: AstronomyPicture = data;

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
    console.log(
      "🚀 ~ file: index.ts:89 ~ fetchAstronomyPicture ~ error:",
      error
    );
    return ctx.reply("Could not fetch image");
  }
};

const commands = `Command reference:
/help - Show this message
/apod - NASA's Astronomy Picture of the Day
`;

bot.command("help", async (ctx) => {
  await ctx.telegram.sendMessage(ctx.chat.id, commands);
});

bot.command("apod", fetchAstronomyPicture);

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
  });
