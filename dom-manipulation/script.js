let quotes = [];
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// Load quotes from localStorage
function loadQuotes() {
  const saved = localStorage.getItem("quotes");
  if (saved) {
    quotes = JSON.parse(saved);
  } else {
    quotes = [
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
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate category dropdown
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

// Restore last selected category
function restoreLastCategory() {
  const last = localStorage.getItem("lastCategory");
  if (last) {
    categoryFilter.value = last;
  }
}

// Filter quotes
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("lastCategory", selected);
  const filtered =
    selected === "all" ? quotes : quotes.filter((q) => q.category === selected);
  if (filtered.length === 0) {
    quoteDisplay.innerText = "No quotes found in this category.";
  } else {
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    quoteDisplay.innerText = `"${random.text}" - [${random.category}]`;
  }
}

// Show random quote
function showRandomQuote() {
  filterQuotes(); // Reuses filtering logic
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }
  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added!");
}

// Export quotes to JSON file
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

// Import quotes from JSON file
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

// Sync with mock server
function syncQuotes() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((res) => res.json())
    .then((data) => {
      const serverQuotes = data.slice(0, 5).map((post) => ({
        text: post.title,
        category: "Server",
      }));
      quotes = serverQuotes; // server wins
      saveQuotes();
      populateCategories();
      filterQuotes();
      notification.innerText =
        "Quotes synced with server (local data replaced)";
      setTimeout(() => (notification.innerText = ""), 5000);
    })
    .catch((err) => {
      console.error("Sync failed", err);
    });
}

// On load
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  restoreLastCategory();
  filterQuotes();
  document
    .getElementById("newQuote")
    .addEventListener("click", showRandomQuote);
  sessionStorage.setItem("sessionStart", new Date().toISOString());
  setInterval(syncQuotes, 15000); // sync every 15s
});
