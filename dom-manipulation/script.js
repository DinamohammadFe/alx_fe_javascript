let quotes = [];
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// Show a random quote
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((q) => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerText = "No quotes in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerText = `"${quote.text}" - [${quote.category}]`;

  // Save last viewed quote in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Add new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes(); // update localStorage
  populateCategories();
  showRandomQuote();

  alert("Quote added!");
  textInput.value = "";
  categoryInput.value = "";
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

// Populate category dropdown
function populateCategories() {
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  const uniqueCategories = [...new Set(quotes.map((q) => q.category))];
  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Filter and show quotes by category
function filterQuotes() {
  showRandomQuote();
}

// Export quotes to a JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("Invalid format");
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      showRandomQuote();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Restore last quote from sessionStorage (optional)
function restoreLastViewedQuote() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const q = JSON.parse(last);
    quoteDisplay.innerText = `"${q.text}" - [${q.category}]`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  restoreLastViewedQuote();
  document
    .getElementById("newQuote")
    .addEventListener("click", showRandomQuote);
});
