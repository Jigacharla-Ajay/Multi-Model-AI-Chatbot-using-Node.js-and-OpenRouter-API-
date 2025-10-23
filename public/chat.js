const sidebar = document.getElementById("chat-sidebar");
const openBtn = document.getElementById("open-chat");
const closeBtn = document.getElementById("close-btn");
const chatMessages = document.getElementById("chat-messages");

let conversation = []; // Store full conversation

// --- Open Chat Sidebar ---
openBtn.addEventListener("click", () => {
  sidebar.classList.add("active");        // slide in chat sidebar
  openBtn.classList.add("hide-btn");      // hide the chat button
});

// --- Close Chat Sidebar ---
closeBtn.addEventListener("click", () => {
  sidebar.classList.remove("active");     // slide out chat sidebar

  // Delay re-showing button until sidebar is fully closed
  setTimeout(() => {
    openBtn.classList.remove("hide-btn");
  }, 400); // match CSS transition time
});

// --- Send Message Function ---
async function sendMessage() {
  const messageInput = document.getElementById("message");
  const message = messageInput.value.trim();
  if (!message) return;

  // Add user message
  conversation.push({ role: "user", content: message });
  appendMessage("You", message);
  messageInput.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    const botReply = data?.reply || "No reply received.";
    conversation.push({ role: "assistant", content: botReply });
    appendMessage("Agent", botReply);
  } catch (err) {
    console.error(err);
    appendMessage("Agent", "⚠️ Error fetching reply.");
  }
}

// --- Append Messages to Chat ---
function appendMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add(sender === "You" ? "user-message" : "bot-message");
  msgDiv.innerHTML = `<b>${sender}:</b> ${text}`;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
