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

// API لاستدعاء Hugging Face
app.post("/ask-huggingface", async (req, res) => {
  try {
    const { question } = req.body;
    
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
      { inputs: question },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`
        }
      }
    );

    const answer = response.data[0].generated_text;
    res.json({ answer });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "حدث خطأ أثناء الاتصال بـ Hugging Face API" });
  }
});

// APIs للنماذج الأخرى (تم تعطيلها)
app.post("/ask-openai", async (req, res) => {
  res.status(500).json({ error: "OpenAI API غير مفعل حاليًا." });
});

app.post("/ask-gemini", async (req, res) => {
  res.status(500).json({ error: "Gemini API غير مفعل حاليًا." });
});

app.post("/ask-deepseek", async (req, res) => {
  res.status(500).json({ error: "DeepSeek API غير مفعل حاليًا." });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
