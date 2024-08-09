const axios = require('axios');

const fetchXML = async (url) => {
  try {
    const response = await axios.get(url);
    // console.log(response)
    return response.data;
  } catch (error) {
    // console.log("thisssssssss is where getting erroor")
    throw new Error('Failed to fetch XML data');
  }
};

module.exports = fetchXML;
