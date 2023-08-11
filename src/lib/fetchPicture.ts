import { api } from "../http";
import { Picture } from "../types";

export const fetchApod = async (): Promise<Picture | null> => {
  try {
    const response = await api.get(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`
    );

    if (response.status !== 200) {
      return null;
    }

    return response.data;
  } catch (error: any) {
    return null;
  }
};