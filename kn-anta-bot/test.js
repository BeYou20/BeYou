import fetch from "node-fetch";

const DEEPSEEK_API_KEY = "sk-4c82faf2ab8e4f21af534f81e1ae6a2b";

(async () => {
  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-r1",
        messages: [
          { role: "system", content: "اختبار API" },
          { role: "user", content: "مرحبا" }
        ]
      })
    });

    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error("خطأ عند الاتصال بـ API:", err);
  }
})();
