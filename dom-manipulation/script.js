// Initial quotes array
let quotes = [
  { text: "Believe you can and you're halfway there.", category: "Motivation" },
  { text: "Be yourself; everyone else is already taken.", category: "Wisdom" },
  {
    text: "To be, or not to be, that is the question.",
    category: "Philosophy",
  },
];

// Function to show a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerText = `"${quote.text}" - [${quote.category}]`;
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
  alert("Quote added!");

  // Clear inputs
  textInput.value = "";
  categoryInput.value = "";
}

// Add event listener to button
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("newQuote")
    .addEventListener("click", showRandomQuote);
});
