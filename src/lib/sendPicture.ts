import { Picture } from "../types";
import { fetchApod } from "./fetchPicture";
import { client } from "../services";

const getPictureFromAPIAndSetItOnRedis = async () => {
  const data = await fetchApod();

  if (data == null) {
    return new Error("Could not fetch image");
  }

  const { url, title, date, explanation, hdurl }: Picture = data;

  const TIME_TO_LIVE = 18000; // 5 hours
  await client.set("picture", JSON.stringify(data), "EX", TIME_TO_LIVE);

  return { url, title, date, explanation, hdurl };
};

const getImageFromRedisCache = async (cache: string) => {
  const deserializeCache = await JSON.parse(cache);

  const { url, title, date, explanation, hdurl }: Picture = deserializeCache;

  if (!url) return new Error("Could not fetch image");

  return { url, title, date, explanation, hdurl };
};

export const sendPicture = async (): Promise<Picture | Error> => {
  try {
    const cache = await client.get("picture");

    if (!cache) return getPictureFromAPIAndSetItOnRedis();

    return getImageFromRedisCache(cache);
  } catch (error) {
    return new Error("Sorry, we have a problem in Space Center Houston :(");
  }
};
