AI Chatbot with OpenRouter Model Fallback (Express.js)
This project is a simple AI Chat Web App built using Node.js + Express + EJS, with automatic model fallback using the OpenRouter API.
If one model fails (rate limit / busy), the server automatically tries the next model in the priority list.


🚀 Features
✔️ OpenRouter API integration
✔️ Automatic fallback between multiple AI models
✔️ Clean EJS UI
✔️ Express server
✔️ Axios for API requests
✔️ Static frontend served from /public folder


📌 Models Used (Priority Order)
DeepSeek R1
DeepSeek Chat V3
Llama 4 Maverick
Grok 4 Fast
If one fails (429 / 503), the system tries the next model.

project-folder/
│── views/
│   └── index.ejs
│── public/
│   ├── style.css
│   └── script.js
│── app.js
│── package.json
│── README.md
│── .env


🎨 Frontend (EJS)
Inputs user message
Sends request via fetch
Displays AI reply


🛠 Tech Stack
Node.js
Express.js
EJS
Axios
OpenRouter API
