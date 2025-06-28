let quotes = [];
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// Load saved quotes
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored
    ? JSON.parse(stored)
    : [
        {
          text: "Believe you can and you're halfway there.",
          category: "Motivation",
        },
        {
          text: "Be yourself; everyone else is already taken.",
          category: "Wisdom",
        },
        {
          text: "To be, or not to be, that is the question.",
          category: "Philosophy",
        },
      ];
  saveQuotes();
}

// Save quotes
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show filtered/random quote
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("lastCategory", selected);
  const filtered =
    selected === "all" ? quotes : quotes.filter((q) => q.category === selected);

  if (filtered.length === 0) {
    quoteDisplay.innerText = "No quotes available.";
  } else {
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    quoteDisplay.innerText = `"${random.text}" - [${random.category}]`;
  }
}

// Populate category dropdown
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map((q) => q.category))];
  categoryFilter.innerHTML = "";
  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

// Restore last selected category
function restoreLastCategory() {
  const last = localStorage.getItem("lastCategory");
  if (last) categoryFilter.value = last;
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return alert("Please fill in both fields.");

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();
  postQuoteToServer(newQuote);
  alert("Quote added!");
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Export quotes to JSON
function exportToJsonFile() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Import from file
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes imported!");
    } catch {
      alert("Error reading JSON file.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// ✅ Fetch from mock API (simulated server)
async function fetchQuotesFromServer() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();
    return data.slice(0, 5).map((post) => ({
      text: post.title,
      category: "Server",
    }));
  } catch (e) {
    console.error("Server fetch failed", e);
    return [];
  }
}

// ✅ Post quote to server (mock)
async function postQuoteToServer(quote) {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(quote),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await res.json();
    console.log("Quote posted to server:", result);
  } catch (e) {
    console.error("Post failed", e);
  }
}

// ✅ Sync with server and resolve conflicts
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  if (serverQuotes.length) {
    quotes = serverQuotes; // Server wins
    saveQuotes();
    populateCategories();
    filterQuotes();
    notification.innerText = "Quotes synced with server!";
    setTimeout(() => {
      notification.innerText = "";
    }, 4000);
  }
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  restoreLastCategory();
  filterQuotes();
  document.getElementById("newQuote").addEventListener("click", filterQuotes);
  sessionStorage.setItem("sessionStart", new Date().toISOString());
  setInterval(syncQuotes, 15000); // ✅ periodic check
});
