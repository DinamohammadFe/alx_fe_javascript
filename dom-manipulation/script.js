// Load quotes from localStorage or use default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Travel is the only thing you buy that makes you richer.", category: "Travel" },
  { text: "Art enables us to find ourselves and lose ourselves at the same time.", category: "Art" },
  { text: "The only way to do great work is to love what you do.", category: "Motivation" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate category dropdown
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  const select = document.getElementById("categorySelect");
  select.innerHTML = "";

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

// Show random quote + store in sessionStorage
function showRandomQuote() {
  const selectedCategory = document.getElementById("categorySelect").value;
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").textContent = "No quotes found.";
    return;
  }

  const random = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[random];
  document.getElementById("quoteDisplay").textContent = quote.text;

  // Save to sessionStorage
  sessionStorage.setItem("lastViewedQuote", quote.text);
}

// Add new quote + save to localStorage
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
  docume
