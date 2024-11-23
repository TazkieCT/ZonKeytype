let time = 15;

const timer = document.getElementById("timer");
const reload = document.getElementById("reload");
const inputText = document.getElementById("text-input");

let press = false;
let interval;
let afkTimeout;
let isAFK = false;

function isNotSymbol(str) {
    return str.length === 1 && str.match(/[a-zA-Z0-9]/i);
}

function reduceTime(){
    return setInterval(() => {
        if (press && time > 0 && !isAFK) {
            timer.innerHTML = time > 0 ? --time : 0;
        }
    }, 1000)
}

function generateRandomString(){
    const words = [
        "apple", "banana", "orange", "grape", "watermelon", "cherry", "mango", "blueberry",
        "strawberry", "pineapple", "coconut", "lemon", "kiwi", "peach", "plum", "apricot",
        "raspberry", "melon", "pear", "lime", "nectarine", "papaya", "fig", "pomegranate",
        "date", "cantaloupe", "elderberry", "guava", "dragonfruit", "lychee", "jackfruit"
    ];

    inputText.innerHTML = "";

    for (let i = 0; i < 30; i++) {
        const randomWord = words[Math.floor(Math.random() * words.length)];

        const wordDiv = document.createElement("div");
        wordDiv.className = "word";

        for (const char of randomWord) {
            const letterSpan = document.createElement("letter");
            letterSpan.textContent = char;

            wordDiv.appendChild(letterSpan);
        }

        inputText.appendChild(wordDiv);
    }
}

function restart() {
    time = 15;
    press = false;
    clearInterval(interval);
    clearTimeout(afkTimeout);
    isAFK = false;

    idx = 0;
    wordIdx = 0;
    letterIdx = 0;
    error = false;

    wrong = 0;
    extra = 0;
    wpm = [];
    raw = [];
    
    timer.innerHTML = time;
    inputText.innerHTML = "";
    
    generateRandomString();
    words = getAllWordsAndLetters();

    updateCursorPosition();
}


function resetAFKTimeout() {
    if (isAFK) {
        console.log("Back from AFK");
        isAFK = false;
        cursor.classList.remove("typing");
    }
    clearTimeout(afkTimeout);
    afkTimeout = setTimeout(() => {
        isAFK = true;
        console.log("AFK");
        cursor.classList.add("typing");
    }, 3000);
}

let idx = 0;
let wordIdx = 0;
let letterIdx = 0;
let words;
let error = false;
let wrong = 0;
let extra = 0;
let wpm = []; // Jumlah huruf yang diketik benar
let raw = []; // Jumlah huruf yang diketik benar dan salah

reload.addEventListener("click", restart);
document.addEventListener("DOMContentLoaded", () => {
    cursor.classList.add("typing");
    generateRandomString();
    words = getAllWordsAndLetters();
});

document.addEventListener("keydown", (event) => {
    resetAFKTimeout();

    if (cursor.classList.contains("typing")) {
        cursor.classList.remove("typing");
    }

    timer.innerHTML = time;
    
    if(event.key != null & !press){
        press = true;
        interval = reduceTime();
    }

    if(event.key == ' '){
        if(letterIdx != 0){
            if(error || (letterIdx != words[wordIdx].length)){
                const currentWord = inputText.querySelectorAll(".word")[wordIdx];
                currentWord.classList.add("error");
            }
            
            wordIdx++;
            letterIdx = 0;
            error = false;
        }
    }

    if (isNotSymbol(event.key)) {
        const currentWordDiv = inputText.querySelectorAll(".word")[wordIdx];
        const currentLetters = currentWordDiv.querySelectorAll("letter");

        const extraLetters = currentWordDiv.querySelectorAll(".extra").length;

        if (extraLetters < 7) {
            if (letterIdx < words[wordIdx].length) {
                if (Array.from(words[wordIdx])[letterIdx] == event.key) {
                    const currentLetter = currentLetters[letterIdx];
                    if (currentLetter) {
                        currentLetter.classList.add("correct");
                    }
                } 
                else {
                    error = true;

                    const currentLetter = currentLetters[letterIdx];
                    if (currentLetter) {
                        currentLetter.classList.add("incorrect");
                    }
                }
            } else {
                error = true;

                const extraLetterSpan = document.createElement("letter");
                extraLetterSpan.textContent = event.key;
                extraLetterSpan.classList.add("extra");
                currentWordDiv.appendChild(extraLetterSpan);
                words[wordIdx] += event.key;
            }

            idx++;
            letterIdx++;
        } else {
            // Kalau sudah mencapai batas 7 huruf ekstra, skip
            return;
        }
    }

    if (event.key === 'Backspace') {
        const currentWordDiv = inputText.querySelectorAll(".word")[wordIdx];
        const currentLetters = currentWordDiv.querySelectorAll("letter");

        if (letterIdx > 0) {
            letterIdx--;

            const currentLetter = currentLetters[letterIdx];
            if (currentLetter) {
                if(currentLetter.classList.contains("extra")){
                    currentWordDiv.removeChild(currentLetter);
                    words[wordIdx] = words[wordIdx].slice(0, -1);
                } else {
                    currentLetter.classList.remove("correct", "incorrect");
                }
            }
        // Ini kalau misalnya lagi di awal kata dan belum ada huruf sama sekali, balik ke kata sebelumnya
        } 
        else if (wordIdx > 0) {
            wordIdx--;
            const prevWordDiv = inputText.querySelectorAll(".word")[wordIdx];
            const prevLetters = prevWordDiv.querySelectorAll("letter");
            
            letterIdx = prevLetters.length;

            for (let i = prevLetters.length - 1; i >= 0; i--) {
                if (prevLetters[i].classList.contains("correct") || 
                    prevLetters[i].classList.contains("incorrect") || 
                    prevLetters[i].classList.contains("extra")) {
                    letterIdx = i + 1;
                    break;  
                }
            }

            // Hapus class error dari kata sebelumnya
            prevWordDiv.classList.remove("error");
        }

        //kode  CF
        // ini tujuannnya override tentuin error O(n)
    
        let incorrectFlag = false
        //find incorrect
        const prevWordDiv = inputText.querySelectorAll(".word")[wordIdx];
        const prevLetters = prevWordDiv.querySelectorAll("letter");
        // console.log( prevLetters)
        for (let i = prevLetters.length - 1; i >= 0; i--) {
            if (prevLetters[i].classList.contains("incorrect")) {
                incorrectFlag = true;
                break;  
            }
        }
        if(incorrectFlag) {
            // kalau ga ada huruf salah, maka error
            // prevWordDiv.classList.add("error");
            error = true
        }else{
            // kalau ada huruf salah, maka error
            prevWordDiv.classList.remove("error");
            error=false;
        }
        //===============
    }
})

function getAllWordsAndLetters() {
    const words = inputText.querySelectorAll(".word");
    const allWords = [];

    words.forEach(wordDiv => {
        const letters = wordDiv.querySelectorAll("letter");
        const word = Array.from(letters).map(letterSpan => letterSpan.textContent).join("");
        allWords.push(word);
    });

    return allWords;
}

function updateCursorPosition() {  
    const currentWordDiv = inputText.querySelectorAll(".word")[wordIdx];  
    if (!currentWordDiv) return;

    const currentLetters = currentWordDiv.querySelectorAll("letter");  
    const currentLetter = currentLetters[letterIdx];  

    if (letterIdx < currentLetters.length) {
        const currentLetter = currentLetters[letterIdx];
        const rect = currentLetter.getBoundingClientRect();  
        cursor.style.top = `${rect.top + 9}px`;
        cursor.style.left = `${rect.left}px`;
    } else {
        const lastLetter = currentLetters[currentLetters.length - 1];
        if (lastLetter) {
            const rect = lastLetter.getBoundingClientRect();  
            cursor.style.top = `${rect.top + 9}px`;
            cursor.style.left = `${rect.right}px`;  
        }
    }
}

window.addEventListener("resize", updateCursorPosition);
window.addEventListener("scroll", updateCursorPosition);

document.addEventListener("keydown", (event) => { 
    if (isNotSymbol(event.key)) { 
        updateCursorPosition();  
    }  

    if (event.key === ' ') {  
        updateCursorPosition();  
    }  

    if (event.key === 'Backspace') { 
        updateCursorPosition();
    }  
});  

updateCursorPosition();  