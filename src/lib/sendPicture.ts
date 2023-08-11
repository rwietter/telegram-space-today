import { Picture } from "../types";
import { getPicture } from "./fetchPicture";
import { client } from "../services";

const sendFromAPI = async () => {
  try {
    const data = await getPicture();

    if (data == null) {
      return new Error("Could not fetch image");
    }

    const { url, title, date }: Picture = data;

    const TIME_TO_LIVE = 18000; // 5 hours
    await client.set("picture", JSON.stringify(data), "EX", TIME_TO_LIVE);

    return { url, title, date }
  } catch (error) {
    return new Error("Sorry, we have a problem in Space Center Houston :(");
  }
};

const sendFromCache = async (cache: string) => {
  try {
    const deserializeCache = await JSON.parse(cache);

    const { url, title, date }: Picture = deserializeCache;

    if (!url) return new Error("Could not fetch image");

    return { url, title, date }
  } catch (error) {
    return new Error("Sorry, we have a problem in Space Center Houston :(");
  }
}

type Data = {
  url: string;
  title: string;
  date: string;
}

export const sendPicture = async (): Promise<Data | Error> => {
  try {
    const cache = await client.get("picture");

    if (!cache) {
      console.log("Cache miss. Fetching from API.");
      return sendFromAPI();
    }

    console.log("Cache hit. Sending from cache.");
    return sendFromCache(cache);

  } catch (error) {
    return new Error("Sorry, we have a problem in Space Center Houston :(");
  }
};
