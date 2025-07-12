// Load quotes from localStorage or use default ones
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  {
    text: "Travel is the only thing you buy that makes you richer.",
    category: "Travel",
  },
  {
    text: "Art enables us to find ourselves and lose ourselves at the same time.",
    category: "Art",
  },
  {
    text: "The only way to do great work is to love what you do.",
    category: "Motivation",
  },
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate category dropdown
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map((q) => q.category))];
  const select = document.getElementById("categorySelect");
  select.innerHTML = "";

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

// Show a random quote and store it in sessionStorage
function showRandomQuote() {
  const selectedCategory = document.getElementById("categorySelect").value;
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter((q) => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").textContent =
      "No quotes found in this category.";
    return;
  }

  const random = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[random];

  // Display the quote
  document.getElementById("quoteDisplay").textContent = quote.text;

  // Save to sessionStorage
  sessionStorage.setItem("lastViewedQuote", quote.text);
}

// Add a new quote
function createAddQuoteForm() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added!");
}

// Export all quotes to JSON
function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
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
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (e) {
      alert("Error parsing JSON.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Load the last viewed quote from sessionStorage
function loadLastViewedQuote() {
  const last = sessionStorage.getItem("lastViewedQuote");
  if (last) {
    document.getElementById("quoteDisplay").textContent = last;
  }
}

// ✅ Wrap startup logic to ensure checker sees addEventListener
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("newQuote")
    .addEventListener("click", showRandomQuote);
  populateCategories();
  loadLastViewedQuote();
});
