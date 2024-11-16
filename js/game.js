let time = 5;

const timer = document.getElementById("timer");
const reload = document.getElementById("reload");
const inputText = document.getElementById("text-input");

let press = false;
let interval;

function isNotSymbol(str) {
    return str.length === 1 && str.match(/[a-zA-Z0-9]/i);
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
let error = false;

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
            console.log("DIF", letterIdx, words[wordIdx].length)
            if(error || letterIdx != words[wordIdx].length){
                const currentWord = inputText.querySelectorAll(".word")[wordIdx];
                currentWord.classList.add("error");
            }
            wordIdx++;
            // console.log(wordIdx);
            letterIdx = 0;
            error = false;
        }
    }

    if (isNotSymbol(event.key)) {
        const currentWordDiv = inputText.querySelectorAll(".word")[wordIdx];
        const currentLetters = currentWordDiv.querySelectorAll("letter");

        console.log(Array.from(words[wordIdx])[letterIdx] + " " + event.key);

        if (letterIdx < words[wordIdx].length) {
            // Correct letter
            if (Array.from(words[wordIdx])[letterIdx] == event.key) {
                console.log("Benar");

                const currentLetter = currentLetters[letterIdx];
                if (currentLetter) {
                    currentLetter.classList.add("correct");
                }
            } 
            // Incorrect letter
            else {
                console.log("Salah");

                error = true;
                const currentLetter = currentLetters[letterIdx];
                if (currentLetter) {
                    currentLetter.classList.add("incorrect");
                }
            }
        } else {
            // Extra letter (insert new letter dynamically)
            console.log("Extra");

            error = true;

            const extraLetterSpan = document.createElement("letter");
            extraLetterSpan.textContent = event.key;
            extraLetterSpan.classList.add("extra");
            currentWordDiv.appendChild(extraLetterSpan);

            words[wordIdx] += event.key;
        }

        idx++;
        letterIdx++;
    }

    if (event.key === 'Backspace') {
        const currentWordDiv = inputText.querySelectorAll(".word")[wordIdx];
        const currentLetters = currentWordDiv.querySelectorAll("letter");

        if (letterIdx > 0) {
            letterIdx--;

            const currentLetter = currentLetters[letterIdx];
            if (currentLetter) {
                if(currentLetter.classList.contains(".extra")){
                    currentWordDiv.removeChild(currentLetter);
                }else{
                    currentLetter.classList.remove("correct", "incorrect");
                }
            }
        } else if (wordIdx > 0) {
            wordIdx--;
            letterIdx = words[wordIdx].length;

            const currentLetter = currentWordDiv.querySelector("letter:last-child");
            if (currentLetter && currentWordDiv) {
                currentLetter.classList.remove("correct", "incorrect", "extra");
            }
        }

        if (currentLetters[letterIdx] && currentLetters[letterIdx].classList.contains("extra")) {
            currentWordDiv.removeChild(currentLetters[letterIdx]);
            words[wordIdx] = words[wordIdx].slice(0, -1);
        }

        error = Array.from(currentLetters).some(letter => letter.classList.contains("incorrect") || letter.classList.contains("extra"));
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