let quotes = [];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// Load on start
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes(); // required
  populateCategories();
  restoreLastCategory();
  filterQuotes();

  document
    .getElementById("newQuote")
    .addEventListener("click", showRandomQuote);
  setInterval(syncQuotes, 15000); // simulate sync every 15s
});

// ✅ Show random quote
function showRandomQuote() {
  const filtered = getFilteredQuotes();
  if (filtered.length === 0) {
    quoteDisplay.innerText = "No quotes available for this category.";
    return;
  }
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerText = `"${random.text}" - [${random.category}]`;

  // ✅ Save last viewed quote to sessionStorage
  sessionStorage.setItem("lastViewedQuote", random.text);
}

// ✅ Add new quote
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
  saveQuotes(); // ✅ Save to localStorage
  populateCategories();
  filterQuotes();
  alert("Quote added!");

  textInput.value = "";
  categoryInput.value = "";
}

// ✅ Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ✅ Load from localStorage
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

// ✅ Populate category filter dropdown
function populateCategories() {
  const unique = [...new Set(quotes.map((q) => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  unique.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

// ✅ Filter quotes
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  const filtered = getFilteredQuotes();
  if (filtered.length > 0) {
    quoteDisplay.innerText = `"${filtered[0].text}" - [${filtered[0].category}]`;
  } else {
    quoteDisplay.innerText = "No quotes available.";
  }
}

function getFilteredQuotes() {
  const selected = categoryFilter.value;
  if (selected === "all") return quotes;
  return quotes.filter((q) => q.category === selected);
}

// ✅ Restore last filter
function restoreLastCategory() {
  const selected = localStorage.getItem("selectedCategory");
  if (selected) {
    categoryFilter.value = selected;
  }
}

// ✅ Export to JSON file
function exportToJsonFile() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// ✅ Import from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("Invalid JSON format");
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Failed to import: " + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ✅ Simulate server sync
function syncQuotes() {
  const serverQuotes = [
    {
      text: "Success is not final, failure is not fatal.",
      category: "Motivation",
    },
    {
      text: "In the middle of difficulty lies opportunity.",
      category: "Wisdom",
    },
  ];

  let added = 0;
  serverQuotes.forEach((sq) => {
    if (!quotes.some((q) => q.text === sq.text && q.category === sq.category)) {
      quotes.push(sq);
      added++;
    }
  });

  if (added > 0) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    notify(`${added} new quote(s) synced from server.`);
  }
}

// ✅ Simple notification
function notify(msg) {
  notification.innerText = msg;
  setTimeout(() => {
    notification.innerText = "";
  }, 4000);
}
