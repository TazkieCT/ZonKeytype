const root = document.querySelector(":root");
const style = getComputedStyle(root);

let logoColor = style.getPropertyValue("--logoColor");
let logoTextColor = style.getPropertyValue("--logoTextColor");
let textColor = style.getPropertyValue("--textColor");
let backgroundColor = style.getPropertyValue("--backgroundColor");
let subBackgroundColor = style.getPropertyValue("--subBackgroundColor");

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
        name: "PI",
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

    let currentThemeIndex = localStorage.getItem("selectedTheme") !== null ? localStorage.getItem("selectedTheme") : 0;

    themeColorsArray.forEach((theme, index) => {
        const themeItem = document.createElement("div");
        themeItem.classList.add("flex", "flex-between", "y-center", "colorList");
        
        const themeName = document.createElement("div");
        themeName.textContent = theme.name.charAt(0).toUpperCase() + theme.name.slice(1);
        themeName.style.cursor = "pointer";

        themeItem.addEventListener("click", () => {
            applyTheme(index);
            currentThemeIndex = index;
        });

        const paletteContainer = document.createElement("div");
        paletteContainer.classList.add("pallete");
        paletteContainer.style.backgroundColor = theme.colors.backgroundColor;

        const logoColor = theme.colors.logoColor;
        const logoTextColor = theme.colors.logoTextColor;
        const textColor = theme.colors.textColor;
        
        const colorsToShow = [logoColor, textColor, logoTextColor];

        colorsToShow.forEach(color => {
            const colorSwatch = document.createElement("div");
            colorSwatch.classList.add("colorPallete");
            colorSwatch.style.backgroundColor = color;
            paletteContainer.appendChild(colorSwatch);
        });

        themeItem.appendChild(themeName);
        themeItem.appendChild(paletteContainer);
        
        let hoverTimeout;
        let leaveTimeout;

        themeItem.addEventListener("mouseenter", () => {
            clearTimeout(leaveTimeout);
            hoverTimeout = setTimeout(() => {
                hoverTheme(index);
            }, 500);
        });

        themeItem.addEventListener("mouseleave", () => {
            clearTimeout(hoverTimeout);
            leaveTimeout = setTimeout(() => {
                hoverTheme(currentThemeIndex);
            }, 500);
        });
        
        themeList.appendChild(themeItem);
    });
}

function hoverTheme(themeIndex) {
    const selectedTheme = themeColorsArray[themeIndex].colors;
    root.style.setProperty("--logoColor", selectedTheme.logoColor);
    root.style.setProperty("--logoTextColor", selectedTheme.logoTextColor);
    root.style.setProperty("--textColor", selectedTheme.textColor);
    root.style.setProperty("--backgroundColor", selectedTheme.backgroundColor);
    root.style.setProperty("--subBackgroundColor", selectedTheme.subBackgroundColor);

    localStorage.setItem("selectedTheme", themeIndex);
}


function applyTheme(themeIndex) {
    const selectedTheme = themeColorsArray[themeIndex].colors;
    root.style.setProperty("--logoColor", selectedTheme.logoColor);
    root.style.setProperty("--logoTextColor", selectedTheme.logoTextColor);
    root.style.setProperty("--textColor", selectedTheme.textColor);
    root.style.setProperty("--backgroundColor", selectedTheme.backgroundColor);
    root.style.setProperty("--subBackgroundColor", selectedTheme.subBackgroundColor);

    localStorage.setItem("selectedTheme", themeIndex);

    hideModal();
}

function loadSavedTheme() {
    const savedThemeIndex = localStorage.getItem("selectedTheme");
    if (savedThemeIndex !== null) {
        applyTheme(savedThemeIndex);
    } else {
        applyTheme(0);
    }
}

window.addEventListener("DOMContentLoaded", loadSavedTheme);
