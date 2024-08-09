const xml2js = require('xml2js');

const parseXML = async (xmlData) => {
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xmlData);

  const products = result.urlset.url.map((url) => ({
    link: url.loc[0],
    image: url['image:image'] ? url['image:image'][0]['image:loc'][0] : '',
    title: url['image:image'] ? url['image:image'][0]['image:title'][0] : 'No title',
  }));

  return products;
};

module.exports = parseXML;
