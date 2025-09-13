const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

// تقديم الملفات الثابتة
app.use(express.static(__dirname));

// صفحة البداية عند "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "kn_anta_bot.html"));
});

// API لاستدعاء Gemini
const axios = require("axios");

app.post("/ask-gemini", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      { contents: [{ parts: [{ text: question }] }] },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": "AIzaSyDOPZhbw6Bb5K7lreU0rbhDLo7zXAA0IRg" // المفتاح تم وضعه هنا مباشرةً
        }
      }
    );

    const answer = response.data.candidates[0].content.parts[0].text;
    res.json({ answer });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "حدث خطأ أثناء الاتصال بـ Gemini API" });
  }
});

// API لاستدعاء DeepSeek
app.post("/ask-deepseek", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: question }]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
        }
      }
    );

    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "حدث خطأ أثناء الاتصال بـ DeepSeek API" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
