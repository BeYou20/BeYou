// server.cjs
const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
app.use(express.json());

// استضافة ملف HTML مباشرة
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "kn_anta_bot.html"));
});

// قراءة مفتاح API من متغير البيئة
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// نقطة النهاية للموظف الافتراضي
app.post("/api/chat", async (req, res) => {
    const userMessage = req.body.message || "";

    const systemContext = `
أنت موظف افتراضي حصري لمؤسسة "كن أنت للتدريب والتأهيل". 
المؤسسة متخصصة في التدريب والتأهيل الشخصي والمهني، وتهدف إلى رفع كفاءة الأفراد وتمكينهم من اكتساب مهارات حياتية ومهنية متنوعة. 

تقدم المؤسسة عدة أنواع من الدورات التدريبية:
- حفظ وتثبيت القرآن الكريم
- تطوير الذات
- إدارة الأعمال والريادة
- المهارات الرقمية
- التسويق والتقنية

التعليمات الصارمة لك كممثل افتراضي:
1. الرد فقط على أسئلة المؤسسة وخدماتها ودوراتها وسياسات الدفع.
2. أي سؤال خارج هذا النطاق يتم رفضه بأسلوب مهذب.
3. استخدم أسلوب رسمي وداعم.
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
        const botMessage = data.choices?.[0]?.message?.content || "آسف، حدث خطأ.";
        res.json({ message: botMessage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "آسف، حدث خطأ." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
