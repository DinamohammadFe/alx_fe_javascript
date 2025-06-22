document.addEventListener("DOMContentLoaded", function () {
  const quotes = [
    {
      text: "The only way to do great work is to love what you do.",
      category: "Motivation",
    },
    {
      text: "Life is what happens when you're busy making other plans.",
      category: "Life",
    },
    {
      text: "In the middle of difficulty lies opportunity.",
      category: "Inspiration",
    },
  ];

  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const addQuoteBtn = document.getElementById("addQuote");

  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `
            <p>"${quote.text}"</p>
            <small><em>Category: ${quote.category}</em></small>
        `;
  }

  function addQuote() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");

    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (text === "" || category === "") {
      alert("Please enter both quote and category.");
      return;
    }

    const newQuote = { text, category };
    quotes.push(newQuote);
    textInput.value = "";
    categoryInput.value = "";
    alert("Quote added!");
  }

  newQuoteBtn.addEventListener("click", showRandomQuote);
  addQuoteBtn.addEventListener("click", addQuote);
});
