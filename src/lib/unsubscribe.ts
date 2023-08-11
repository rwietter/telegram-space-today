import { Context } from "telegraf";
import { Chatlist } from "../model/schema";

export const unsubscribeToReceiveApodEveryday = async (ctx: Context) => {
   const id = ctx.chat?.id;

   if(!id) {
    return ctx.reply(
      "Ops... Chat id not found. Please, try again later :("
    )
   }

  const deleted = await Chatlist.deleteOne({chatId: id});

  if (!deleted) {
    return ctx.reply(
      "Ops... You are not subscribed. If you want to subscribe, use /subscribe"
    );
  }

  return ctx.reply(
    "You are now unsubscribed. If you want to register again, use /subscribe"
  )
}