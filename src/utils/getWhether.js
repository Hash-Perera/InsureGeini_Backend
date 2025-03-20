import axios from "axios";

export const getWhether = async (lat, lon) => {
  return await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WHEATHER_API_KEY}`
  );
};
