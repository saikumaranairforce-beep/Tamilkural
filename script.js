document.addEventListener("DOMContentLoaded", () => {
  // Output elements
  const quoteTextElement = document.getElementById("quoteText");
  const quoteAuthorElement = document.getElementById("quoteAuthor");

  // Tabs + panels
  const tabNumber = document.getElementById("tabNumber");
  const tabWord = document.getElementById("tabWord");
  const panelNumber = document.getElementById("panelNumber");
  const panelWord = document.getElementById("panelWord");

  // Number search elements
  const quantityInput = document.getElementById("quantity");
  const fetchButton = document.getElementById("fetchQuoteButton");

  // Word search elements
  const wordQueryInput = document.getElementById("wordQuery");
  const searchWordButton = document.getElementById("searchWordButton");
  const resultsNumbers = document.getElementById("resultsNumbers");
  const matchCount = document.getElementById("matchCount");

  // Data cache
  let kurals = [];

  // ---------- Helpers ----------
  function showLoading(msg = "Loading…") {
    quoteTextElement.textContent = msg;
    quoteAuthorElement.textContent = "- Loading";
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function renderKuralByIndex(idx) {
    const k = kurals[idx];
    if (!k) return;

    const line1 = k.Line1 ?? "";
    const line2 = k.Line2 ?? "";
    const mv = k.mv ?? ""; // you were showing mv already
    const engl = k.explanation ?? ""; // you were showing mv already
    const paaliyal = `${k.paal_tamil ?? ""} | ${k.iyal ?? ""} | ${k.athikaram_tamil ?? ""}`;
    const author = "திருவள்ளுவர் | ";

    // Same output style you had: lines + mv
    quoteTextElement.innerHTML =
      `${escapeHtml(line1)}<br>${escapeHtml(line2)}<br><br>${escapeHtml(mv)}<br><br>${escapeHtml(engl)}`;

    quoteAuthorElement.textContent = `- ${author}${paaliyal}`;
  }

  function renderKuralByNumber(num) {
    const n = Number(num);
    if (!Number.isFinite(n) || n < 1 || n > 1330) {
      quoteTextElement.textContent = "Please enter a valid Kural number (1 to 1330).";
      quoteAuthorElement.textContent = "- Error";
      return;
    }
    renderKuralByIndex(n - 1);
  }

  function setActiveTab(which) {
    const isNumber = which === "number";
    panelNumber.style.display = isNumber ? "block" : "none";
    panelWord.style.display = isNumber ? "none" : "block";

    // Optional: basic visual hint
    tabNumber.disabled = isNumber;
    tabWord.disabled = !isNumber;
  }

  // ---------- Word Search ----------
  function buildNumberChip(kuralNumber) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = kuralNumber;
    btn.style.padding = "6px 10px";
    btn.style.cursor = "pointer";

    btn.addEventListener("click", () => {
      setActiveTab("number");          // switch to number tab
      quantityInput.value = kuralNumber; // keep number input synced
      renderKuralByNumber(kuralNumber);  // show output
    });

    return btn;
  }

  function searchByEnglishWord(queryRaw) {
    const query = (queryRaw || "").trim().toLowerCase();

    resultsNumbers.innerHTML = "";
    matchCount.textContent = "";

    if (!query) {
      matchCount.textContent = "Type a word to search (example: minister).";
      return;
    }

    // Your “includes” logic, but against Translation (English) (and mv too just in case)
    const matches = kurals.filter((t) => {
      const translation = String(t.Translation ?? "").toLowerCase();
      const mv = String(t.mv ?? "").toLowerCase();
      return translation.includes(query) || mv.includes(query);
    });

    matchCount.textContent = `Matches: ${matches.length}`;

    // Show numbers horizontally
    matches.forEach((m) => {
      const chip = buildNumberChip(m.Number);
      resultsNumbers.appendChild(chip);
    });

    // If only one match, auto-open it
    if (matches.length === 1) {
      renderKuralByNumber(matches[0].Number);
    }
  }

  // ---------- Load JSON ----------
  async function loadKuralJson() {
    showLoading("Loading Tirukkural data…");
    try {
      //const resp = await fetch(data, { cache: "no-store" });
      //if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      //const data = await resp.json();

      //if (!data || !Array.isArray(data.kural)) {
      //  throw new Error("Invalid JSON structure. Expected { kural: [...] }");
      //}

      kurals = data.kural;

      // Initial render: kural 1
      renderKuralByNumber(1);
      quoteAuthorElement.textContent = "- திருவள்ளுவர்";
    } catch (err) {
      console.error(err);
      quoteTextElement.textContent = "Oops! Failed to load the Tirukkural JSON. Check console + file path.";
      quoteAuthorElement.textContent = "- System Error";
    }
  }

  // ---------- Events ----------
  tabNumber.addEventListener("click", () => setActiveTab("number"));
  tabWord.addEventListener("click", () => setActiveTab("word"));

  fetchButton.addEventListener("click", () => renderKuralByNumber(quantityInput.value));

  searchWordButton.addEventListener("click", () => searchByEnglishWord(wordQueryInput.value));

  wordQueryInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchByEnglishWord(wordQueryInput.value);
  });

  // Default tab
  setActiveTab("number");

  // Start
  loadKuralJson();
});
