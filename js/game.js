let time = 5;

const timer = document.getElementById("timer");
const reload = document.getElementById("reload");
const inputText = document.getElementById("text-input");

let press = false;
let interval;

function isLetter(str) {
    return str.length === 1 && str.match(/[a-zA-Z]/i);
}

function reduceTime(){
    return setInterval(() => {
        if (press && time > 0){
            timer.innerHTML = time > 0 ? --time : 0;
        }
        // console.log(time);   
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

function restart(){
    time = 5;
    press = false;
    clearInterval(interval);
    input = [];
    timer.innerHTML = time;
    generateRandomString();
    getAllWordsAndLetters();
}

let idx = 0;
let wordIdx = 0;
let letterIdx = 0;
let words;

reload.addEventListener("click", restart);
document.addEventListener("DOMContentLoaded", () => {
    generateRandomString();
    words = getAllWordsAndLetters();
});

document.addEventListener("keydown", (event) => {
    timer.innerHTML = time;
    // console.log(words[wordIdx])
    if(event.key != null & !press){
        press = true;
        interval = reduceTime();
    }
    if(event.key == ' '){
        if(letterIdx != 0){
            wordIdx++;
            // console.log(wordIdx);
            letterIdx = 0;
        }
    }
    if (isLetter(event.key)) {
        console.log(Array.from(words[wordIdx])[letterIdx] + " " + event.key);

        if (Array.from(words[wordIdx])[letterIdx] == event.key) {
            console.log("Benar");

            const currentWord = inputText.querySelectorAll(".word")[wordIdx];
            const currentLetter = currentWord.querySelectorAll("letter")[letterIdx];

            currentLetter.classList.add("correct");

        } else if(letterIdx <= words[wordIdx].length) {
            console.log("Salah");

            const currentWord = inputText.querySelectorAll(".word")[wordIdx];
            const currentLetter = currentWord.querySelectorAll("letter")[letterIdx];

            currentLetter.classList.add("incorrect");
        } else{
            const currentWord = inputText.querySelectorAll(".word")[wordIdx];
            const currentLetter = currentWord.querySelectorAll("letter")[letterIdx];

            currentLetter.classList.add("extra");
        }

        idx++;
        letterIdx++;
    }
    if(event.key === 'Backspace'){

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

    console.log(allWords);

    return allWords;
}