// ===============================
// Global Variables
// ===============================

let words = [];
let currentSection = null;

// ===============================
// About Panel
// ===============================

function toggleAbout() {
    document.getElementById("aboutPanel").classList.toggle("active");
}

// ===============================
// Load words.json
// ===============================

fetch("words.json?v=" + Date.now(), { cache: "no-store" })
    .then(response => response.json())
    .then(data => {

    words = data;

    console.log("Loaded " + words.length + " words.");

    checkDuplicates();

})
    .catch(error => {

        console.error(error);

        document.getElementById("searchResult").innerHTML =
            "<p>Unable to load words.json.</p>";

    });

// ===============================
// Search
// ===============================

function searchWord() {

    const input = document
        .getElementById("searchInput")
        .value
        .trim();

    const result = document.getElementById("searchResult");

    result.innerHTML = "";

    // Empty
    if (input === "") {

        result.innerHTML = "<p>Please enter a word.</p>";
        return;

    }

    // Numbers not allowed
    if (!isNaN(input)) {

        result.innerHTML =
            "<p>Numbers are not allowed. Please search using a word.</p>";

        return;

    }

    // Find ALL matching words

    const foundWords = words.filter(item =>
        item.word.toLowerCase().trim() === input.toLowerCase().trim()
    );

    // Word not found

    if (foundWords.length === 0) {

        result.innerHTML = `

        <div class="word-item">

            <h2>❌ ${input}</h2>

            <p>This word is not added yet.</p>

        </div>

        `;

        return;

    }

    // Find positions

    const positions = foundWords.map(item => words.indexOf(item) + 1);

    result.innerHTML = `

    <div class="word-item">

        <h2>✅ ${input}</h2>

        <p><strong>Status:</strong> This word is added.</p>

        <p><strong>Total Result(s):</strong> ${foundWords.length}</p>

        <p><strong>Position(s):</strong> ${positions.join(", ")}</p>

    </div>

    `;

    // Show every matching word

    foundWords.forEach((item, index) => {

        result.innerHTML += `

        <div class="word-item">

            <h2>${index + 1}. ${item.word}</h2>

            <p><strong>Type:</strong> ${item.type}</p>

            <p><strong>Position:</strong> ${positions[index]}</p>

        </div>

        `;

    });

}

// ===============================
// Show Sections
// ===============================

function showSection(sectionIndex) {

    const display = document.getElementById("wordDisplay");

    if (currentSection === sectionIndex) {

        display.innerHTML = "";

        currentSection = null;

        return;

    }

    currentSection = sectionIndex;

    const start = sectionIndex * 100;

    const end = start + 100;

    const sectionWords = words.slice(start, end);

    const col1 = sectionWords.slice(0, 25);
    const col2 = sectionWords.slice(25, 50);
    const col3 = sectionWords.slice(50, 75);
    const col4 = sectionWords.slice(75, 100);

    display.innerHTML = `

<div class="words-columns">

<div class="column">

${col1.map((item, i) => `
<div class="word-item">
${start + i + 1}. ${item.word}
</div>
`).join("")}

</div>

<div class="column">

${col2.map((item, i) => `
<div class="word-item">
${start + i + 26}. ${item.word}
</div>
`).join("")}

</div>

<div class="column">

${col3.map((item, i) => `
<div class="word-item">
${start + i + 51}. ${item.word}
</div>
`).join("")}

</div>

<div class="column">

${col4.map((item, i) => `
<div class="word-item">
${start + i + 76}. ${item.word}
</div>
`).join("")}

</div>

</div>

`;

}

// ===============================
// Enter Key
// ===============================

document
.getElementById("searchInput")
.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

        searchWord();

    }

});

// ===============================
// Clear Search Result
// ===============================

document
.getElementById("searchInput")
.addEventListener("input", function () {

    if (this.value.trim() === "") {

        document.getElementById("searchResult").innerHTML = "";

    }

});
// ===============================
// Check Duplicate Words
// ===============================

function checkDuplicates() {

    const report = document.getElementById("duplicateReport");

    const map = new Map();

    words.forEach((item, index) => {

        const key = item.word.toLowerCase().trim();

        if (!map.has(key)) {

            map.set(key, []);

        }

        map.get(key).push({
            position: index + 1,
            word: item.word,
            type: item.type
        });

    });

    let html = "";

    let duplicateCount = 0;

    map.forEach((entries) => {

        if (entries.length > 1) {

            duplicateCount++;

            html += `

<div class="word-item">

<h2>⚠ ${entries[0].word}</h2>

<p><strong>Total:</strong> ${entries.length}</p>

<p><strong>Positions:</strong>
${entries.map(e => e.position).join(", ")}
</p>

<p><strong>Types:</strong>
${entries.map(e => e.type).join(", ")}
</p>

</div>

`;

        }

    });

    if (duplicateCount === 0) {

        report.innerHTML = `

<div class="word-item">

<h2>✅ No duplicate words found.</h2>

</div>

`;

    } else {

        report.innerHTML = `

<h2 style="margin:20px 0;">
⚠ Duplicate Words Found (${duplicateCount})
</h2>

${html}

`;

    }

}