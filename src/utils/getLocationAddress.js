import axios from "axios";

export const getLocationAddress = async (lat, lon) => {
  return await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.CHATHURA_GOOGLE_API_KEY}`
  );
};
