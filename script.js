const movie = movies[Math.floor(Math.random() * movies.length)];

let currentFrame = 0;
let gameEnded = false;

// ELEMENTS
const frameImage = document.getElementById("movie-frame");
const guessInput = document.getElementById("guess-input");
const guessButton = document.getElementById("guess-button");
const message = document.getElementById("message");
const attempts = document.getElementById("attempts");
const shareButton = document.getElementById("share-button");
const suggestions = document.getElementById("suggestions");

// MODAL
const modal = document.getElementById("win-modal");
const winText = document.getElementById("win-text");
const copyBtn = document.getElementById("copy-result");
const closeBtn = document.getElementById("close-modal");

// ---------------- UTIL ----------------

function normalize(text) {
  return text.toLowerCase().trim();
}

// ---------------- FRAME ----------------

function updateFrame() {
  frameImage.src = movie.frames[currentFrame];

  let dots = "";
  for (let i = 0; i < movie.frames.length; i++) {
    dots += i < currentFrame ? "🟨" : "⬛";
  }

  attempts.textContent =
    `Попытки: ${currentFrame} / ${movie.frames.length} ${dots}`;
}

// ---------------- SHARE ----------------

function generateShareText() {
  const date = new Date().toLocaleDateString("ru-RU");

  let grid = "";

  for (let i = 0; i < movie.frames.length; i++) {
    grid += i <= currentFrame ? "🟩" : "⬛";
  }

  return `🎬 Movie Game\n${date}\n${grid}`;
}

// ---------------- END GAME ----------------

function endGame(success) {
  gameEnded = true;
  guessButton.disabled = true;

  shareButton.style.display = "block";

  if (success) {
    message.textContent = "🎉 Верно!";
  } else {
    message.textContent = `❌ Это был ${movie.displayTitle}`;
  }

  openModal(success);
}

// ---------------- MODAL ----------------

function openModal(success) {
  modal.classList.remove("hidden");

  winText.textContent = success
    ? `Ты угадал "${movie.displayTitle}" за ${currentFrame + 1} попыток!`
    : `Не угадано. Это был "${movie.displayTitle}"`;
}

// ---------------- INIT ----------------

updateFrame();

// ---------------- GAME ----------------

guessButton.addEventListener("click", () => {
  if (gameEnded) return;

  const guess = normalize(guessInput.value);

  const answers = movie.answers.map(normalize);

  if (answers.includes(guess)) {
    endGame(true);
    return;
  }

  currentFrame++;

  if (currentFrame >= movie.frames.length) {
    endGame(false);
    return;
  }

  updateFrame();
  guessInput.value = "";
  suggestions.innerHTML = "";
});

// ---------------- AUTOCOMPLETE ----------------

guessInput.addEventListener("input", () => {
  const value = guessInput.value.toLowerCase();

  suggestions.innerHTML = "";

  if (!value) return;

  const filtered = movieDatabase
    .filter(m => m.toLowerCase().includes(value))
    .slice(0, 6);

  filtered.forEach(title => {
    const div = document.createElement("div");
    div.textContent = title;

    div.onclick = () => {
      guessInput.value = title;
      suggestions.innerHTML = "";
    };

    suggestions.appendChild(div);
  });
});

// ---------------- SHARE BUTTON ----------------

shareButton.onclick = async () => {
  await navigator.clipboard.writeText(generateShareText());
  alert("Скопировано!");
};

// ---------------- MODAL BUTTONS ----------------

closeBtn.onclick = () => {
  modal.classList.add("hidden");
};

copyBtn.onclick = async () => {
  await navigator.clipboard.writeText(generateShareText());
  alert("Скопировано!");
};