// server.cjs
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // تخدم ملفات HTML و CSS و JS

// ====================
// API لـ Gemini (ثلاث مفاتيح ممكنة)
// ====================
const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2
];

app.post("/ask-gemini", async (req, res) => {
  try {
    const { question, keyIndex } = req.body; // keyIndex يحدد أي مفتاح نستخدم
    const apiKey = GEMINI_KEYS[keyIndex] || GEMINI_KEYS[0];

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        contents: [{ parts: [{ text: question }] }]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        }
      }
    );

    const answer = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "لا يوجد جواب";
    res.json({ answer });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "حدث خطأ أثناء الاتصال بـ Gemini API" });
  }
});

// ====================
// API لـ DeepSeek
// ====================
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

    const answer = response.data.choices?.[0]?.message?.content || "لا يوجد جواب";
    res.json({ answer });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "حدث خطأ أثناء الاتصال بـ DeepSeek API" });
  }
});

// ====================
// تشغيل السيرفر
// ====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
