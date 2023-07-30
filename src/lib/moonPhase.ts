import { Context } from "telegraf";

function getCurrentMoonPosition() {
  const now = new Date();

  const diff = now.getTime() - new Date(2001, 0, 1).getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  const lunations = 0.20439731 + days * 0.03386319269;

  return lunations % 1;
}

const actualPhase = (currentMoonPosition: number): [string, string] => {
  const index = currentMoonPosition * 8 + 0.5;
  const roundedIndex = Math.floor(index);

  const unicodes = ["🌕", "🌔", "🌔", "🌒", "🌑", "🌒", "🌒", "🌔"];

  const phases = [
    "Lua Nova",
    "Lua Crescente",
    "Quarto Crescente",
    "Lua Gibosa",
    "Lua Cheia",
    "Lua Balsâmica",
    "Quarto Minguante",
    "Lua Minguante",
  ];

  return [unicodes[roundedIndex], phases[roundedIndex]]; // roundedIndex & 7
};

export const moonPhase = (ctx: Context) => {
  const currentPosition = getCurrentMoonPosition();
  const [unicode, phase] = actualPhase(currentPosition);
  const roundedposition = currentPosition.toFixed(3);

  if (!!roundedposition && !!phase) {
    const today = new Date();

    const date = today.toLocaleDateString(ctx.from?.language_code || "en", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    return ctx.reply(`
      ${unicode} ${phase} (${roundedposition}) \n📅 ${date}
    `);
  }

  return ctx.reply(
    "Sorry, It's not possible to get the moon phase right now. Please try again later."
  );
};
