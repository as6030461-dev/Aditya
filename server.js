const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 3000);

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));
app.use(express.static(__dirname));

app.get("/api/health", (_req, res) => res.json({ ok: true, aiConfigured: Boolean(process.env.GROQ_API_KEY) }));

app.post("/api/chat", async (req, res) => {
    try {
        const messages = req.body?.messages;
        if (!Array.isArray(messages) || messages.length < 1 || messages.length > 20 ||
            messages.some((m) => !m || !["system", "user", "assistant"].includes(m.role) ||
                typeof m.content !== "string" || m.content.length > 12000)) {
            return res.status(400).json({ error: "Invalid chat messages." });
        }
        if (!process.env.GROQ_API_KEY) {
            return res.status(503).json({ error: "AI is not configured. Add GROQ_API_KEY to your .env file and restart the server." });
        }

        const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
                messages,
                temperature: 0.7,
                max_tokens: 1200
            })
        });
        const data = await upstream.json().catch(() => ({}));
        if (!upstream.ok) {
            console.error("Groq API error:", upstream.status, data?.error?.message || "unknown error");
            return res.status(502).json({ error: "AI provider request failed. Check your API key/model and try again." });
        }
        const message = data?.choices?.[0]?.message?.content;
        if (typeof message !== "string" || !message.trim()) {
            return res.status(502).json({ error: "AI returned an empty response. Please try again." });
        }
        return res.json({ message: message.trim() });
    } catch (error) {
        console.error("AI server error:", error.message);
        return res.status(500).json({ error: "Could not connect to the AI service. Please try again." });
    }
});

app.listen(PORT, () => console.log(`Aditya portfolio running at http://localhost:${PORT}`));
