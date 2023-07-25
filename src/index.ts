import "./config/env";
import { api, bot, Context } from "./http";

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200,
};

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
      throw new Error("Could not fetch image");
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

      if (!url) throw new Error("Invalid cache");

      console.log("🚀 ~ FETCHING IMAGE FROM CACHE:", cache);

      const header = `${title} - ${date}`;
      const footer = `${copyright ? `\n\nCopyright: ${copyright}` : ""}`;

      return ctx.sendPhoto(hdUrl || url, {
        caption: `${header} ${footer}`,
      });
    }

    const data = await getAstronomyPicture();

		console.log("🚀 ~ FETCHING IMAGE FROM API");

    if (data === null) {
      throw new Error("Could not fetch image");
    }

    const { hdUrl, url, title, copyright, date }: AstronomyPicture = data;

    cache.picture = {
      hdUrl,
      copyright,
      date,
      title,
      url,
    };

    if (!url) throw new Error("Invalid image");

    ctx.sendPhoto(hdUrl || url, {
      caption: `${title} - ${date} \n\nCopyright: ${
        copyright ? `${copyright}` : ""
      }`,
    });
  } catch (error) {
    console.error(error);
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

bot
  .launch()
  .then(() => {
    console.log("Bot started");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
