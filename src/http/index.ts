import { Telegraf, Context } from "telegraf";
import axios from "axios";

const BOT_TOKEN = process.env.BOT_TOKEN as string;

const api = axios.create({
  baseURL: `https://api.nasa.gov`
});

const TelegrafSingleton = (function () {
  let instance: Telegraf<Context> | null = null;

  function createInstance() {
    const bot = new Telegraf(BOT_TOKEN);

    return bot;
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }

      return instance;
    },
  };
})();

const bot = TelegrafSingleton.getInstance();

export { bot, Context, api };