const button = document.getElementById("start-btn");
const conversation = document.getElementById("conversation");
let recognizing = false;
let recognition;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onresult = async (event) => {
    const userText = event.results[0][0].transcript;
    addMessage("user", userText);
    const reply = await getAIResponse(userText);
    addMessage("bot", reply);
    speak(reply);
  };

  recognition.onend = () => {
    recognizing = false;
    button.textContent = "🎙️ Start Talking";
  };
}

button.onclick = () => {
  if (!recognizing) {
    recognition.start();
    recognizing = true;
    button.textContent = "🛑 Stop Talking";
  } else {
    recognition.stop();
  }
};

async function getAIResponse(userText) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_OPENAI_API_KEY"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a friendly voice assistant." },
        { role: "user", content: userText }
      ]
    })
  });
  const data = await res.json();
  return data.choices[0].message.content;
}

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = `${sender === "user" ? "👤 You:" : "🤖 Bot:"} ${text}`;
  conversation.appendChild(msg);
}

function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speech.rate = 1;
  speechSynthesis.speak(speech);
}