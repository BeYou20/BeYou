const GEMINI_API_KEY_1 = process.env.GEMINI_API_KEY_1;
const GEMINI_API_KEY_2 = process.env.GEMINI_API_KEY_2;

app.post("/ask-gemini", async (req, res) => {
  try {
    const { question } = req.body;

    // اختياري: استخدام المفتاح 1 أو 2 بشكل عشوائي
    const apiKey = Math.random() < 0.5 ? GEMINI_API_KEY_1 : GEMINI_API_KEY_2;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      { contents: [{ parts: [{ text: question }] }] },
      { headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey } }
    );

    const answer = response.data.candidates[0].content.parts[0].text;
    res.json({ answer });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "حدث خطأ أثناء الاتصال بـ Gemini API" });
  }
});
