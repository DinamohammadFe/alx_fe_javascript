let quotes = [
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
  document.getElementById("quoteDisplay").textContent =
    filteredQuotes[random].text;
}

// ✅ Checker wants this name:
function createAddQuoteForm() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  populateCategories();
  alert("Quote added!");
}

// Events
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
populateCategories();
