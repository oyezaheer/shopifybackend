const fetchHTML = require('../utils/fetchHTML');
require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const retryDelay = 120000; // 2 minutes

const getGroqChatCompletion = async (content) => {
  try {
    return await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content,
        },
      ],
      model: "llama3-8b-8192",
    });
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.log('Rate limit exceeded, retrying...');
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return getGroqChatCompletion(content); // Retry
    }
    throw error; // Rethrow if not a rate limit error
  }
};

exports.summarizeProduct = async (req, res) => {
  try {
    const { productUrl } = req.body;
    console.log(`Summarizing product for URL: ${productUrl}`);

    // Fetch the product page content
    const pageContent = await fetchHTML(productUrl);
    
    // Log the content to ensure it's being fetched correctly
    console.log('Page content fetched:', pageContent.slice(0, 200)); // Log first 200 chars for brevity

    // Request summarization from the Groq API
    const chatCompletion = await getGroqChatCompletion(pageContent);

    // Log the API response for debugging
    console.log('Groq API response:', chatCompletion);

    // Extract summary from the API response
    const summary = chatCompletion.choices[0]?.message?.content || 'No summary available';
    res.json({ summary });
  } catch (error) {
    console.error('Error fetching summary:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to summarize product content' });
  }
};
