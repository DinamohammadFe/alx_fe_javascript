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

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const categories = ["all", ...new Set(quotes.map((q) => q.category))];

  const categorySelect = document.getElementById("categorySelect");
  const categoryFilter = document.getElementById("categoryFilter");

  [categorySelect, categoryFilter].forEach((select) => {
    if (!select) return;
    select.innerHTML = "";
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      select.appendChild(option);
    });
  });

  // Restore last selected filter
  const savedFilter = localStorage.getItem("lastSelectedCategory");
  if (categoryFilter && savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

function showRandomQuote() {
  const selectedCategory =
    document.getElementById("categorySelect")?.value || "all";
  let filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((q) => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").textContent =
      "No quotes found in this category.";
    return;
  }

  const random = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[random];
  document.getElementById("quoteDisplay").textContent = quote.text;
  sessionStorage.setItem("lastViewedQuote", quote.text);
}

function filterQuotes() {
  const filterValue = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedCategory", filterValue);

  const filtered =
    filterValue === "all"
      ? quotes
      : quotes.filter((q) => q.category === filterValue);

  const display = document.getElementById("quoteDisplay");
  if (filtered.length === 0) {
    display.textContent = "No quotes found.";
    return;
  }

  // Show all filtered quotes as a list
  display.innerHTML =
    "<ul>" + filtered.map((q) => `<li>${q.text}</li>`).join("") + "</ul>";
}

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
  alert("Quote added!");
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

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

function loadLastViewedQuote() {
  const last = sessionStorage.getItem("lastViewedQuote");
  if (last) {
    document.getElementById("quoteDisplay").textContent = last;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("newQuote")
    .addEventListener("click", showRandomQuote);
  populateCategories();
  loadLastViewedQuote();
  filterQuotes(); // apply filter on load
});
