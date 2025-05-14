// background.js
const background = [
  "./assets/background/pokemon-bg.jpg",
  "./assets/background/pokemon-bg-2.jpg",
  "./assets/background/pokemon-bg-3.jpg",
  "./assets/background/pokemon-bg-4.jpg"
];

let currentBg = 0;

export function initBackgroundSwitcher() {
  document.getElementById("theme-button").addEventListener("click", () => {
    currentBg = (currentBg + 1) % background.length;
    document.body.style.backgroundImage = `url('${background[currentBg]}')`;
  });
}