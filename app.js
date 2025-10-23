const express = require("express");

const axios = require("axios");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));


const bodyParser = require("body-parser");
app.use(bodyParser.json());

// ✅ Define fallback model list (priority order)

const MODELS = [
  { id: "deepseek/deepseek-r1:free", name: "DeepSeek R1" },
  { id: "deepseek/deepseek-chat-v3-0324:free", name: "DeepSeek Chat V3" },
  { id: "meta-llama/llama-4-maverick:free", name: "Llama 4 Maverick" },
  { id: "xai/grok-4-fast:free", name: "Grok 4 Fast" }
];

app.get("/", (req, res) => res.render("index"));

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  let replyText = "No response.";
  let usedModel = null;

  for (const model of MODELS) {
    try {
      console.log(`🔹 Trying model: ${model.id}`);

      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: model.id,
          messages: [{ role: "user", content: userMessage }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "My AI Website",
          },
          timeout: 20000,
        }
      );

      replyText = response.data.choices?.[0]?.message?.content || "No reply.";
      usedModel = model.name;
      console.log(`✅ Success with model: ${model.name}`);
      break; // stop if success
    } catch (err) {
      const status = err.response?.status;
      console.warn(`⚠️ ${model.id} failed (status ${status || "?"})`);

      if (status === 429 || status === 503) {
        // rate-limited or busy → try next
        continue;
      } else {
        console.error(err.response?.data || err.message);
        break;
      }
    }
  }

  res.json({
    reply: usedModel
      ? `🤖 <b>${usedModel}:</b> ${replyText}`
      : "All models failed. Please try again later."
  });
});

app.listen(3000, () => console.log("✅ Server running at http://localhost:3000"));
