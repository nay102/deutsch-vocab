let words = [];
let currentSection = null;

function toggleAbout() {
  const panel = document.getElementById("aboutPanel");
  panel.classList.toggle("active");
}

// LOAD words.json
fetch(`words.json?v=${Date.now()}`, { cache: "no-store" })
  .then(response => response.json())
  .then(data => {
    words = data;
    console.log("Words loaded:", words.length);
  });


// ================= SHOW SECTION =================
function showSection(sectionIndex) {

  const wordDisplay = document.getElementById("wordDisplay");

  // If same section clicked again → hide it
  if (currentSection === sectionIndex) {
    wordDisplay.innerHTML = "";
    currentSection = null;
    return;
  }

  // Otherwise show section
  wordDisplay.innerHTML = "";
  currentSection = sectionIndex;

  const start = sectionIndex * 100;
  const end = start + 100;

  const sectionWords = words.slice(start, end);
  // Split into 4 groups of 25
  const col1 = sectionWords.slice(0, 25);
  const col2 = sectionWords.slice(25, 50);
  const col3 = sectionWords.slice(50, 75);
  const col4 = sectionWords.slice(75, 100);

  wordDisplay.innerHTML = `
    <div class="words-columns">
      <div class="column">
        ${col1.map((item, i) => `<div class="word-item">${start + i + 1}. ${item.word}</div>`).join("")}
      </div>

      <div class="column">
        ${col2.map((item, i) => `<div class="word-item">${start + i + 26}. ${item.word}</div>`).join("")}
      </div>

      <div class="column">
        ${col3.map((item, i) => `<div class="word-item">${start + i + 51}. ${item.word}</div>`).join("")}
      </div>

      <div class="column">
        ${col4.map((item, i) => `<div class="word-item">${start + i + 76}. ${item.word}</div>`).join("")}
      </div>
    </div>
  `;
  //  // Create 4 columns
  // wordDisplay.innerHTML = `
  //   <div class="words-grid">
  //     ${sectionWords.map((item, index) => `
  //       <div class="word-item">
  //         ${start + index + 1}. ${item.word}
  //       </div>
  //     `).join("")}
  //   </div>
  // `;

    /* sectionWords.forEach((item, index) => {
      wordDisplay.innerHTML += `
        <div class="word-item">
          ${start + index + 1}. ${item.word}
        </div>
      `;
    }); */
}


// ================= SEARCH =================
function searchWord() {

  const input = document.getElementById("searchInput").value.trim();
  const result = document.getElementById("searchResult");

  result.innerHTML = ""; // clear previous results

  // Prevent numbers
  if (!isNaN(input) && input !== "") {
    result.innerHTML = "Du darfst keine Nummer eingeben, bitte schreibe ein Wort!";
    return;
  }

  const foundWords = words.filter(item =>
    item.word.toLowerCase().trim() === input.toLowerCase().trim()
  );

  // ❌ Not found
  if (foundWords.length === 0) {
    result.innerHTML = "❌ Word not added yet.";
    return;
  }

  // ✅ Only ONE result → show normally
  if (foundWords.length === 1) {
    showWord(foundWords[0]);
  }

  // ✅ Multiple results
  else {

    const positions = foundWords.map(word => words.indexOf(word) + 1);

    result.innerHTML = `
      <h3>Found ${foundWords.length} results – at ${positions.join(" & ")}</h3>
    `;

    foundWords.forEach(found => {
      showWord(found);
    });
  }
}


// ================= SHOW WORD FUNCTION =================
function showWord(found) {

  const result = document.getElementById("searchResult");

  // ===== VERB =====
  if (found.type === "Verb") {

    result.innerHTML += `
      <div class="word-item">
        <h2>Verb: ${found.word}</h2>

        <p>
          ${found.trennbar === "yes" ? "Trennbar" : "Nicht trennbar"} – 
          ${found.regelmaessig === "yes" ? "Regelmäßig" : "Unregelmäßig"} – 
          ${found.reflexiv === "yes" ? "Reflexiv" : "Nicht reflexiv"}
        </p>

        <p><strong>
          ${found.formen.infinitiv} – 
          ${found.formen.praeteritum} – 
          ${found.formen.perfekt}
        </strong></p>

        <p><strong>Englisch:</strong></p>
        <p>${found.englisch.join(", ")}</p>

        <p><strong>Bangla:</strong></p>
        <p>${found.bangla.join(", ")}</p>
      </div>
    `;
  }

  // ===== NOUN =====
  else if (found.type === "Nomen") {

    let cleanWord = found.word.replace(/^(der|die|das)\s+/i, "").trim();

    result.innerHTML += `
      <div class="word-item">
        <h2>Nomen: ${found.artikel || ""} ${cleanWord}</h2>

        <p><strong>Plural:</strong> ${found.plural || "—"}</p>

        <p><strong>Englisch:</strong></p>
        <p>${found.englisch.join(", ")}</p>

        <p><strong>Bangla:</strong></p>
        <p>${found.bangla.join(", ")}</p>
      </div>
    `;
  }

  // ===== ADJECTIVE =====
  else if (found.type === "Adjektiv") {

    result.innerHTML += `
      <div class="word-item">
        <h2>Adjektiv: ${found.word}</h2>

        <p><strong>Komparativ:</strong> ${found.komparativ || "—"}</p>
        <p><strong>Superlativ:</strong> ${found.superlativ || "—"}</p>

        <p><strong>Englisch:</strong></p>
        <p>${found.englisch.join(", ")}</p>

        <p><strong>Bangla:</strong></p>
        <p>${found.bangla.join(", ")}</p>
      </div>
    `;
  }

  // ===== ADVERB =====
  else if (found.type === "Adverb") {

    result.innerHTML += `
      <div class="word-item">
        <h2>Adverb: ${found.word}</h2>

        <p><strong>Englisch:</strong></p>
        <p>${found.englisch.join(", ")}</p>

        <p><strong>Bangla:</strong></p>
        <p>${found.bangla.join(", ")}</p>
      </div>
    `;
  }
}


// ================= ENTER KEY SEARCH =================
document.getElementById("searchInput")
  .addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      searchWord();
    }
});
