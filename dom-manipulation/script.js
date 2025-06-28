let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Believe you can and you're halfway there.", category: "Motivation" },
  { text: "Be yourself; everyone else is already taken.", category: "Wisdom" },
  {
    text: "To be, or not to be, that is the question.",
    category: "Philosophy",
  },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// Show random quote
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filtered =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((q) => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.innerText = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];
  quoteDisplay.innerText = `"${quote.text}" - [${quote.category}]`;

  sessionStorage.setItem("lastQuote", quote.text);
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
  localStorage.setItem("quotes", JSON.stringify(quotes));

  populateCategories();
  alert("Quote added!");

  // Clear inputs
  textInput.value = "";
  categoryInput.value = "";
}

// Populate dropdown
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map((q) => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes
function filterQuotes() {
  localStorage.setItem("selectedCategory", categoryFilter.value);
  showRandomQuote();
}

// Restore last filter
function restoreLastCategory() {
  const saved = localStorage.getItem("selectedCategory");
  if (saved) categoryFilter.value = saved;
}

// Sync from server
function fetchQuotesFromServer() {
  fetch("https://jsonplaceholder.typicode.com/posts?_limit=3")
    .then((res) => res.json())
    .then((data) => {
      const serverQuotes = data.map((item) => ({
        text: item.title,
        category: "Server",
      }));

      quotes.push(...serverQuotes);
      localStorage.setItem("quotes", JSON.stringify(quotes));
      notification.innerText = "Quotes synced from server.";
      populateCategories();
    });
}

function syncQuotes() {
  fetchQuotesFromServer();
}

// Load quotes
function loadQuotes() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) quoteDisplay.innerText = last;
}

// On load
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  restoreLastCategory();
  showRandomQuote();
  setInterval(syncQuotes, 15000);

  document
    .getElementById("newQuote")
    .addEventListener("click", showRandomQuote);
});
