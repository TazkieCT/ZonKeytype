const root = document.querySelector(":root");
const style = getComputedStyle(root);

let logoColor = style.getPropertyValue("--logoColor"); /* Color Logo */
let logoTextColor = style.getPropertyValue("--logoTextColor"); /* Color Logo Teks */
let textColor = style.getPropertyValue("--textColor"); /* Color Teks Konten */
let backgroundColor = style.getPropertyValue("--backgroundColor"); /* Color Background Web */
let subBackgroundColor = style.getPropertyValue("--subBackgroundColor"); /* Color Sub-Background Web (Lebih gelap) */

const themeColorsArray = [
    {
        name: "default",
        colors: {
            logoColor: "#FFB800",
            logoTextColor: "#D1D0C5",
            textColor: "#646669",
            backgroundColor: "#323437",
            subBackgroundColor: "#2C2E31"
        }
    },
    {
        name: "bushido",
        colors: {
            logoColor: "#F44C7F",
            logoTextColor: "#E9ECF0",
            textColor: "#939EAE",
            backgroundColor: "#333A45",
            subBackgroundColor: "#1C222D"
        }
    },
    {
        name: "brat",
        colors: {
            logoColor: "#080808",
            logoTextColor: "#FFFFFF",
            textColor: "#080808",
            backgroundColor: "#8ED008",
            subBackgroundColor: "#AEE028"
        }
    },
    {
        name: "dark",
        colors: {
            logoColor: "#EEEEEE",
            logoTextColor: "#EEEEEE",
            textColor: "#444444",
            backgroundColor: "#111111",
            subBackgroundColor: "#191919"
        }
    },
    {
        name: "apple",
        colors: {
            logoColor: "#E55050",
            logoTextColor: "#FFAAAA",
            textColor: "#FF6060",
            backgroundColor: "#6E2626",
            subBackgroundColor: "#3F1616"
        }
    },
    {
        name: "desert oasis",
        colors: {
            logoColor: "#D19D01",
            logoTextColor: "#332800",
            textColor: "#0061FE",
            backgroundColor: "#FFF2D5",
            subBackgroundColor: "#EDDEBC"
        }
    },
    {
        name: "snow candy",
        colors: {
            logoColor: "#FF360D",
            logoTextColor: "#000000",
            textColor: "#B7B7B7",
            backgroundColor: "#FFFFFF",
            subBackgroundColor: "#ECECEC"
        }
    }, 
    {
        name: "io",
        colors: {
            logoColor: "#55C6F0",
            logoTextColor: "#1D1E1E",
            textColor: "#1E107A",
            backgroundColor: "#FFF9F2",
            subBackgroundColor: "#E5DDD4"
        }
    }, 
    {
        name: "ryujinscales",
        colors: {
            logoColor: "#F17754",
            logoTextColor: "#FFBC90",
            textColor: "#FFE4BC",
            backgroundColor: "#081426",
            subBackgroundColor: "#040E1D"
        }
    }, 
    {
        name: "contrast",
        colors: {
            logoColor: "#ff006e",
            logoTextColor: "#fb5607",
            textColor: "#ffbe0b",
            backgroundColor: "#3a86ff",
            subBackgroundColor: "#8338ec"
        }
    }, 
];

const themeSpan = document.getElementById("theme");
const modal = document.getElementById("theme-modal");
const closeButton = document.querySelector(".close-button");

function showModal() {
    console.log("Showing modal.......");
    modal.classList.add("show");
    populateThemes();
}

function hideModal() {
    modal.classList.remove("show");
}

themeSpan.addEventListener("click", showModal);

closeButton.addEventListener("click", hideModal);
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        hideModal();
    }
});

function populateThemes() {
    const themeList = document.getElementById("theme-list");
    themeList.innerHTML = "";

    themeColorsArray.forEach((theme, index) => {
        const themeItem = document.createElement("div");
        themeItem.textContent = theme.name;
        themeItem.style.cursor = "pointer";
        
        themeItem.addEventListener("click", () => applyTheme(index));
        
        themeList.appendChild(themeItem);
    });
}

function applyTheme(themeIndex) {
    const selectedTheme = themeColorsArray[themeIndex].colors;
    root.style.setProperty("--logoColor", selectedTheme.logoColor);
    root.style.setProperty("--logoTextColor", selectedTheme.logoTextColor);
    root.style.setProperty("--textColor", selectedTheme.textColor);
    root.style.setProperty("--backgroundColor", selectedTheme.backgroundColor);
    root.style.setProperty("--subBackgroundColor", selectedTheme.subBackgroundColor);

    hideModal();
}