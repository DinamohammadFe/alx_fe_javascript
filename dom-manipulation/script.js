// Initialize quotes array
let quotes = [];

// Load quotes from localStorage or use default
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    // Default quotes
    quotes = [
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "The purpose of our lives is to be happy.", category: "Happiness" }
    ];
    saveQuotes();
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById('quoteDisplay').textContent = "No quotes available.";
    return;
  }

  const random = quotes[Math.floor(Math.random() * quotes.length)];
  const display = `${random.text} — [${random.category}]`;
  document.getElementById('quoteDisplay').textContent = display;

  // Save last shown quote in sessionStorage
  sessionStorage.setItem('lastQuote', display);
}

// Add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  alert("Quote added!");
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Export quotes as JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        throw new Error("Invalid format");
      }
    } catch {
      alert("Failed to import quotes. Please check your JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// Load everything on page load
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();

  // Show last viewed quote if any
  const lastQuote = sessionStorage.getItem('lastQuote');
  if (lastQuote) {
    document.getElementById('quoteDisplay').textContent = lastQuote;
  }

  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
});
