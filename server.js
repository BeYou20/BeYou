const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const axios = require("axios");

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

// API لاستدعاء OpenAI
app.post("/ask-openai", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}` // هنا يستخدم متغير البيئة
        }
      }
    );

    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "حدث خطأ أثناء الاتصال بـ OpenAI API" });
  }
});

// APIs للنماذج الأخرى (تم تعطيلها)
app.post("/ask-gemini", async (req, res) => {
  res.status(500).json({ error: "Gemini API غير مفعل حاليًا." });
});

app.post("/ask-deepseek", async (req, res) => {
  res.status(500).json({ error: "DeepSeek API غير مفعل حاليًا." });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
