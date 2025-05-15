//background-switcher.js
const background = [
    "../assets/images/background/pokemon-bg.jpg",
    "../assets/images/background/pokemon-bg-2.jpg",
    "../assets/images/background/pokemon-bg-3.jpg",
    "../assets/images/background/pokemon-bg-4.jpg"
];

let currentBg = 0;

window.onload = initBackgroundSwitcher

function initBackgroundSwitcher() {
    document.getElementById("theme-button").addEventListener("click", () => {
        currentBg = (currentBg + 1) % background.length;
        document.body.style.backgroundImage = `url('${background[currentBg]}')`;
    });
}