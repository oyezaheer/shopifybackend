const fetchXML = require("../utils/fetchXML");
const parseXML = require("../utils/parseXML");
const fetchHTML = require("../utils/fetchHTML");
const cheerio = require("cheerio");

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.getProducts = async (req, res) => {
  try {
    const { sitemapUrl } = req.method === "POST" ? req.body : req.query;
    console.log("Fetching XML data from:", sitemapUrl);

    const xmlData = await fetchXML(sitemapUrl);
    console.log("XML Data fetched successfully");

    const products = await parseXML(xmlData);
    console.log("Products parsed:", products);

    // Filter products to include only those with a title and image link
    const filteredProducts = products.filter(
      (product) => product.title && product.image
    );
    console.log("Filtered products:", filteredProducts);

    // Get the top 10 filtered products
    const topProducts = filteredProducts.slice(0, 10);
    console.log("Top products:", topProducts);

    const summarizedProducts = await Promise.all(
      topProducts.map(async (product) => {
        const { link, image, title } = product;
        console.log("Fetching HTML for:", link);

        const pageContent = await fetchHTML(link);

        // Load the HTML into Cheerio
        const $ = cheerio.load(pageContent);

        // Remove unnecessary tags
        $("script, style, link, iframe, img, meta, noscript").remove();

        // Extract all text from the body of the HTML
        const textContent = $("body").text();

        // Clean up the text by removing excessive whitespace
        const cleanedText = textContent.replace(/\s+/g, " ").trim();

        console.log("HTML content fetched");

        const response = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `Please summarize the following content into 3 points with 10 words that hold the important information of the content:\n\n${cleanedText}`,
            },
          ],
          model: "llama3-8b-8192",
        });

        console.log(response);
        const summary = response.choices[0]?.message?.content || "No summary";
        console.log(summary);

        return {
          title,
          image,
          summary,
        };
      })
    );

    res.json({ products: summarizedProducts });
  } catch (error) {
    console.error("Error:", error.message); // Log detailed error message
    res.status(500).json({ error: "Failed to fetch and summarize products" });
  }
};
