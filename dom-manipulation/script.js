let quotes = [];
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// Show a random quote from the filtered list
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((q) => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerText = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerText = `"${quote.text}" - [${quote.category}]`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Add a new quote
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
  showRandomQuote(); // Update DOM

  alert("Quote added!");

  textInput.value = "";
  categoryInput.value = "";
}

// Load quotes from localStorage
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    // default quotes if none in storage
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
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
}

// Populate dropdown categories
function populateCategories() {
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  const uniqueCategories = [...new Set(quotes.map((q) => q.category))];
  uniqueCategories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes when dropdown changes
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  showRandomQuote();
}

// Restore last selected filter
function restoreLastCategory() {
  const saved = localStorage.getItem("selectedCategory");
  if (saved) {
    categoryFilter.value = saved;
  }
}

// Export quotes as JSON file
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

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    const imported = JSON.parse(e.target.result);
    quotes.push(...imported);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();
    showRandomQuote();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Simulate server fetch (mock API)
function fetchQuotesFromServer() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          text: "The only thing we have to fear is fear itself.",
          category: "Courage",
        },
        {
          text: "In the middle of difficulty lies opportunity.",
          category: "Inspiration",
        },
      ]);
    }, 1000);
  });
}

// Sync local quotes with server
async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    const newQuotes = serverQuotes.filter(
      (sq) =>
        !quotes.some((lq) => lq.text === sq.text && lq.category === sq.category)
    );

    if (newQuotes.length > 0) {
      quotes.push(...newQuotes);
      localStorage.setItem("quotes", JSON.stringify(quotes));
      populateCategories();
      notification.innerText = `${newQuotes.length} new quote(s) synced from server.`;
      setTimeout(() => (notification.innerText = ""), 5000);
    }
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  restoreLastCategory();
  showRandomQuote();
  setInterval(syncQuotes, 15000); // Sync every 15 sec

  document
    .getElementById("newQuote")
    .addEventListener("click", showRandomQuote);
});
