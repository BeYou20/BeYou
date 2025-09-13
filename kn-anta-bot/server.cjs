// server.cjs
const express = require("express");
const path = require("path");
const fetch = require("node-fetch"); // تأكد من تثبيت node-fetch

const app = express();

// ملفات ثابتة (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// صفحة البداية
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "kn_anta_bot.html"));
});

// قراءة مفتاح API من متغير البيئة
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// API للرد على المستخدم
app.post("/api/chat", async (req, res) => {
    const userMessage = req.body.message || "";

    const systemContext = `
أنت موظف افتراضي حصري لمؤسسة "كن أنت للتدريب والتأهيل". 
المؤسسة متخصصة في التدريب والتأهيل الشخصي والمهني، وتهدف إلى رفع كفاءة الأفراد وتمكينهم من اكتساب مهارات حياتية ومهنية متنوعة. 
... // أضف باقي التعليمات كما في كودك السابق
`;

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
                    { role: "system", content: systemContext },
                    { role: "user", content: userMessage }
                ]
            })
        });

        const data = await response.json();
        // حسب تنسيق DeepSeek
        const botMessage = data.choices?.[0]?.message?.content || "آسف، حدث خطأ.";
        res.json({ message: botMessage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "آسف، حدث خطأ." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
