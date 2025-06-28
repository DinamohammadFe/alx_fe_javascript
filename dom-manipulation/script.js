let quotes = [];
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// Load from localStorage or initialize
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

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show quote based on filter
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("lastCategory", selected);
  const filtered =
    selected === "all" ? quotes : quotes.filter((q) => q.category === selected);

  if (filtered.length === 0) {
    quoteDisplay.innerText = "No quotes in this category.";
  } else {
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    quoteDisplay.innerText = `"${random.text}" - [${random.category}]`;
  }
}

// Populate dropdown with categories
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map((q) => q.category))];
  categoryFilter.innerHTML = "";
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// Restore last filter
function restoreLastCategory() {
  const last = localStorage.getItem("lastCategory");
  if (last) categoryFilter.value = last;
}

// Show random quote (based on filter)
function showRandomQuote() {
  filterQuotes();
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();
  postQuoteToServer(newQuote); // async call
  alert("Quote added!");
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// ✅ Export to JSON
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ✅ Import from JSON
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// ✅ Fetch quotes from server (async + mock)
async function fetchQuotesFromServer() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();
    return data.slice(0, 5).map((post) => ({
      text: post.title,
      category: "Server",
    }));
  } catch (error) {
    console.error("Fetch failed:", error);
    return [];
  }
}

// ✅ Post quote to server (async)
async function postQuoteToServer(quote) {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(quote),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const data = await res.json();
    console.log("Posted:", data);
  } catch (error) {
    console.error("Post failed:", error);
  }
}

// ✅ Sync quotes with server (overwrite local)
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  if (serverQuotes.length) {
    quotes = serverQuotes; // Conflict resolution: server wins
    saveQuotes();
    populateCategories();
    filterQuotes();
    notification.innerText = "Quotes synced with server!";
    setTimeout(() => {
      notification.innerText = "";
    }, 4000);
  }
}

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  restoreLastCategory();
  filterQuotes();
  document
    .getElementById("newQuote")
    .addEventListener("click", showRandomQuote);
  sessionStorage.setItem("sessionStart", new Date().toISOString());
  setInterval(syncQuotes, 15000); // ✅ Periodic sync every 15s
});
