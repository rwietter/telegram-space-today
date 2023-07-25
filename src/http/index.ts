import { Telegraf, Context } from "telegraf";
import axios from "axios";

const BOT_TOKEN = process.env.BOT_TOKEN as string;

const api = axios.create({
  baseURL: `https://api.nasa.gov`
});

// const TelegrafSingleton = (function () {
//   let instance: Telegraf<Context> | null = null;

//   function createInstance() {
//     const bot = new Telegraf(BOT_TOKEN);

//     return bot;
//   }

//   return {
//     getInstance() {
//       if (!instance) {
//         instance = createInstance();
//       }

//       return instance;
//     },
//   };
// })();

// const bot = TelegrafSingleton.getInstance();

const bot = new Telegraf('6612128919:AAHK8c7uUeG_XilTDklp4Xv8BPfXf5jUxtM')

export { bot, Context, api };