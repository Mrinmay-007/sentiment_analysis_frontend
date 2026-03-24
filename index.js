const input = document.getElementById("textInput");
const button = document.getElementById("predictBtn");
const resultDiv = document.getElementById("result");
const loading = document.getElementById("loading");

server_url = 'https://sentiment-analysis-tkcn.onrender.com'


// Emoji logic
function getEmoji(prediction) {
  prediction = prediction.toLowerCase();

  if (prediction.includes("positive")) return "😊";
  if (prediction.includes("negative")) return "😡";
  if (prediction.includes("neutral")) return "😐";

  return "🤖";
}

// Predict function
async function predict() {
  const text = input.value.trim();

  if (!text) {
    resultDiv.innerHTML = "⚠️ Please enter text!";
    resultDiv.classList.add("show");
    return;
  }

  loading.style.display = "block";
  resultDiv.classList.remove("show");

  try {
    const response = await fetch(`${server_url}/predict/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: text })
    });

    const data = await response.json();

    loading.style.display = "none";

    if (response.ok) {
      const emoji = getEmoji(data.prediction);

      resultDiv.innerHTML = `
        <span>${emoji}</span>
        ${data.prediction}
      `;
    } else {
      resultDiv.innerHTML = "⚠️ " + data.detail;
    }

    resultDiv.classList.add("show");

  } catch (error) {
    loading.style.display = "none";
    resultDiv.innerHTML = "❌ Server error";
    resultDiv.classList.add("show");
  }
}

// Button click
button.addEventListener("click", predict);

// Enter key
input.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    predict();
  }
});