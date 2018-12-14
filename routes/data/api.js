const axios = require("axios");

// youtube data query url
const queryYT = async q => {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${q}&key=${
    process.env.YOUTUBE_API_KEY
  }`;
  const { data } = await axios.get(url);
  return data["items"];
};

module.exports = {
  queryYT
};
