let quotes = [];
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// Load quotes from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  restoreLastCategory();
  filterQuotes();
  setInterval(syncQuotes, 20000); // sync every 20 seconds

  document
    .getElementById("newQuote")
    .addEventListener("click", showRandomQuote);
});

// Show a random quote
function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerText = "No quotes in this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerText = `"${quote.text}" - [${quote.category}]`;

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
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
  alert("Quote added!");

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  postQuoteToServer(newQuote);
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load quotes from localStorage
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
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

// Populate filter dropdown
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map((q) => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// Filter and display quotes
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("lastCategory", selected);
  const filtered = getFilteredQuotes();
  if (filtered.length === 0) {
    quoteDisplay.innerText = "No quotes in this category.";
    return;
  }
  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerText = `"${quote.text}" - [${quote.category}]`;
}

// Get filtered quotes
function getFilteredQuotes() {
  const selected = categoryFilter.value;
  return selected === "all"
    ? quotes
    : quotes.filter((q) => q.category === selected);
}

// Restore last category filter
function restoreLastCategory() {
  const last = localStorage.getItem("lastCategory");
  if (last) {
    categoryFilter.value = last;
  }
}

// Export quotes to JSON
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("Invalid file format.");
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes imported successfully!");
    } catch {
      alert("Error importing quotes.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Fetch quotes from server (mock API)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=5"
    );
    const data = await response.json();
    return data.map((post) => ({
      text: post.title,
      category: "Server",
    }));
  } catch (err) {
    console.error("Server fetch error:", err);
    return [];
  }
}

// Post quote to server (mock POST)
async function postQuoteToServer(quote) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote),
    });
  } catch (err) {
    console.error("Error posting quote:", err);
  }
}

// Sync local and server quotes
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  let added = 0;

  serverQuotes.forEach((serverQuote) => {
    const exists = quotes.some((local) => local.text === serverQuote.text);
    if (!exists) {
      quotes.push(serverQuote);
      added++;
    }
  });

  if (added > 0) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    notification.innerText = `${added} new quotes synced from server!`;
    setTimeout(() => (notification.innerText = ""), 5000);
  }
}

// Manual sync button
function manualSync() {
  syncQuotes();
  alert("Manual sync triggered.");
}
