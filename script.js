console.log("🎬 game loaded");

// ---------------- SAFE CHECK ----------------

if (!window.movies || !movies.length) {
  console.error("❌ movies.js не загружен или пустой");
}

// ---------------- STATE ----------------

const movie = movies[Math.floor(Math.random() * movies.length)];

let currentFrame = 0;
let gameEnded = false;

// ---------------- ELEMENTS ----------------

const frameImage = document.getElementById("movie-frame");
const guessInput = document.getElementById("guess-input");
const guessButton = document.getElementById("guess-button");
const message = document.getElementById("message");
const attempts = document.getElementById("attempts");
const shareButton = document.getElementById("share-button");
const suggestions = document.getElementById("suggestions");

const modal = document.getElementById("win-modal");
const winText = document.getElementById("win-text");
const copyBtn = document.getElementById("copy-result");
const closeBtn = document.getElementById("close-modal");

// ---------------- UTIL ----------------

function normalize(text) {
  return (text || "").toLowerCase().trim();
}

function getAttemptWord(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;

  if (mod100 >= 11 && mod100 <= 14) return "попыток";
  if (mod10 === 1) return "попытку";
  if (mod10 >= 2 && mod10 <= 4) return "попытки";
  return "попыток";
}

// ---------------- FRAME ----------------

function updateFrame() {
  if (!frameImage || !movie?.frames) return;

  frameImage.src = movie.frames[currentFrame];

  let dots = "";
  for (let i = 0; i < movie.frames.length; i++) {
    dots += i < currentFrame ? "🟨" : "⬛";
  }

  attempts.textContent = `Кадр ${currentFrame + 1} / ${movie.frames.length} ${dots}`;
}

// ---------------- SHARE ----------------

function generateShareText() {
  const date = new Date().toLocaleDateString("ru-RU");

  let grid = "";

  for (let i = 0; i < movie.frames.length; i++) {
    grid += i <= currentFrame ? "🟩" : "⬛";
  }

  return `🎬 Movie Game
${date}
${grid}

👉 Сыграй сам: ${window.location.href}`;
}

// ---------------- MODAL ----------------

function openModal(success) {
  if (!modal) return;

  modal.classList.remove("hidden");

  winText.textContent = success
    ? `Ты угадал "${movie.displayTitle}" за ${currentFrame + 1} ${getAttemptWord(currentFrame + 1)}`
    : `Не угадано. Это был "${movie.displayTitle}"`;
}

// ---------------- END GAME ----------------

function endGame(success) {
  gameEnded = true;

  guessButton.disabled = true;
  shareButton.style.display = "block";

  message.textContent = success
    ? "🎉 Верно!"
    : `❌ Это был ${movie.displayTitle}`;

  openModal(success);
}

// ---------------- INIT ----------------

updateFrame();

// ---------------- GAME ----------------

guessButton.addEventListener("click", () => {
  if (gameEnded) return;

  const guess = normalize(guessInput.value);

  const answers = (movie.answers || []).map(normalize);

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
  const value = normalize(guessInput.value);

  suggestions.innerHTML = "";

  if (!value || !window.movieDatabase) return;

  const filtered = movieDatabase
    .filter(m => normalize(m).startsWith(value))
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

// ---------------- SHARE ----------------

shareButton.onclick = async () => {
  await navigator.clipboard.writeText(generateShareText());
  alert("Скопировано!");
};

// ---------------- MODAL BUTTONS ----------------

closeBtn?.addEventListener("click", () => {
  modal.classList.add("hidden");
});

copyBtn?.addEventListener("click", async () => {
  await navigator.clipboard.writeText(generateShareText());
  alert("Скопировано!");
});