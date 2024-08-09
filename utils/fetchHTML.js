const axios = require('axios');

const fetchHTML = async (url) => {
  try {
    // console.log(`Fetching HTML for: ${url}`); // Log the URL being requested
    const response = await axios.get(url);
    console.log('HTML content fetched');
    return response.data;
  } catch (error) {
    console.log("fuckk thisss")
    console.error(`Error fetching HTML from ${url}:`, error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch HTML data');
  }
};

module.exports = fetchHTML;
