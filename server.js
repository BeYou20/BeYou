app.post("/ask-gemini", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent", // غيّر هذا السطر
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
