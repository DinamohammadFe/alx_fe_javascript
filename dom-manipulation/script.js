let quotes = [];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");
const importFileInput = document.getElementById("importFile");

// Load saved data on page load
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  restoreLastCategory();
  filterQuotes();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);

  setInterval(syncQuotes, 15000); // simulate syncing every 15s
});

// Show random quote
function showRandomQuote() {
  const filtered = getFilteredQuotes();
  if (filtered.length === 0) {
    quoteDisplay.innerText = "No quotes availa
