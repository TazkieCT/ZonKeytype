const root = document.querySelector(":root");
const style = getComputedStyle(root);

let primaryColor = style.getPropertyValue("--primaryColor"); /* Color Logo */
let secondaryColor = style.getPropertyValue("--secondaryColor"); /* Color Logo Teks */
let tertiaryColor = style.getPropertyValue("--tertiaryColor"); /* Color Teks Konten */
let quaternaryColor = style.getPropertyValue("--quaternaryColor"); /* Color Background Web */
let quinaryColor = style.getPropertyValue("--quinaryColor"); /* Color Sub-Background Web (Lebih gelap) */

const themeColorsArray = [
    {
        name: "default",
        colors: {
            primaryColor: "#FFB800",
            secondaryColor: "#D1D0C5",
            tertiaryColor: "#646669",
            quaternaryColor: "#323437",
            quinaryColor: "#2C2E31"
        }
    },
    {
        name: "bushido",
        colors: {
            primaryColor: "#F44C7F",
            secondaryColor: "#E9ECF0",
            tertiaryColor: "#939EAE",
            quaternaryColor: "#333A45",
            quinaryColor: "#1C222D"
        }
    },
    {
        name: "brat",
        colors: {
            primaryColor: "#080808",
            secondaryColor: "#080808",
            tertiaryColor: "#080808",
            quaternaryColor: "#8ED008",
            quinaryColor: "#AEE028"
        }
    },
    {
        name: "dark",
        colors: {
            primaryColor: "#EEEEEE",
            secondaryColor: "#EEEEEE",
            tertiaryColor: "#444444",
            quaternaryColor: "#111111",
            quinaryColor: "#191919"
        }
    },
    {
        name: "apple",
        colors: {
            primaryColor: "#E55050",
            secondaryColor: "#FFAAAA",
            tertiaryColor: "#FF6060",
            quaternaryColor: "#6E2626",
            quinaryColor: "#3F1616"
        }
    },
    {
        name: "desert oasis",
        colors: {
            primaryColor: "#D19D01",
            secondaryColor: "#332800",
            tertiaryColor: "#0061FE",
            quaternaryColor: "#FFF2D5",
            quinaryColor: "#EDDEBC"
        }
    },
    {
        name: "snow candy",
        colors: {
            primaryColor: "#FF360D",
            secondaryColor: "#000000",
            tertiaryColor: "#B7B7B7",
            quaternaryColor: "#FFFFFF",
            quinaryColor: "#ECECEC"
        }
    }, 
    {
        name: "io",
        colors: {
            primaryColor: "#55C6F0",
            secondaryColor: "#1D1E1E",
            tertiaryColor: "#1E107A",
            quaternaryColor: "#FFF9F2",
            quinaryColor: "#E5DDD4"
        }
    }, 
    {
        name: "ryujinscales",
        colors: {
            primaryColor: "#F17754",
            secondaryColor: "#FFBC90",
            tertiaryColor: "#FFE4BC",
            quaternaryColor: "#081426",
            quinaryColor: "#040E1D"
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
    root.style.setProperty("--primaryColor", selectedTheme.primaryColor);
    root.style.setProperty("--secondaryColor", selectedTheme.secondaryColor);
    root.style.setProperty("--tertiaryColor", selectedTheme.tertiaryColor);
    root.style.setProperty("--quaternaryColor", selectedTheme.quaternaryColor);
    root.style.setProperty("--quinaryColor", selectedTheme.quinaryColor);

    hideModal();
}