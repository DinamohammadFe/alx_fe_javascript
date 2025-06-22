let quotes = [];
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// Load saved data on page load
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  restoreLastCategory();
  filterQuotes();
  setInterval(syncQuotes, 15000); // Check every 15 seconds
});

// Load from localStorage
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored ? JSON.parse(stored) : [];
  if (quotes.length === 0) {
    quotes = [
      { text: "Stay hungry, stay foolish.", category: "Inspiration" },
      { text: "Talk is cheap. Show me the code.", category: "Programming" },
    ];
    saveQuotes();
  }
}

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate dropdown with unique categories
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// Display a random quote from selected category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("lastCategory", selectedCategory);
  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes found.";
  } else {
    const quote = filtered[Math.floor(Math.random() * filtered.length)];
    quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
    sessionStorage.setItem("lastQuote", quote.text);
  }
}

// Restore last filter from storage
function restoreLastCategory() {
  const last = localStorage.getItem("lastCategory");
  if (last) categoryFilter.value = last;
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();
  showNotification("Quote added locally.");

  // Also post to server
  postQuoteToServer({ text, category });

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Show message
function showNotification(msg) {
  notification.textContent = msg;
  setTimeout(() => (notification.textContent = ""), 3000);
}

// Export to JSON
function exportToJsonFile() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import from file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      imported.forEach(q => {
        if (q.text && q.category && !quotes.find(existing => existing.text === q.text)) {
          quotes.push(q);
        }
      });
      saveQuotes();
      populateCategories();
      filterQuotes();
      showNotification("Quotes imported.");
    } catch (e) {
      alert("Invalid file.");
    }
  };
  reader.readAsText(file);
}

// ✅ Simulate server: Fetch quotes from mock API
function fetchQuotesFromServer() {
  return fetch("https://jsonplaceholder.typicode.com/posts?_limit=2")
    .then(res => res.json())
    .then(data => {
      return data.map(item => ({
        text: `Server: ${item.title}`,
        category: "Server"
      }));
    });
}

// ✅ Simulate server: Post quote
function postQuoteToServer(quote) {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(quote),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
    .then(res => res.json())
    .then(data => {
      console.log("Posted to server:", data);
    });
}

// ✅ Periodic sync
function syncQuotes() {
  fetchQuotesFromServer().then(serverQuotes => {
    let newQuotes = 0;
    serverQuotes.forEach(sq => {
      if (!quotes.find(local => local.text === sq.text)) {
        quotes.push(sq);
        newQuotes++;
      }
    });
    if (newQuotes > 0) {
      saveQuotes();
      populateCategories();
      filterQuotes();
      showNotification(`${newQuotes} new quote(s) synced from server.`);
    }
  }).catch(() => {
    showNotification("Failed to sync with server.");
  });
}

document.getElementById("newQuote").addEventListener("click", filterQuotes);
