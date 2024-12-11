let time = 30;
const initialTime = 30;

const timer = document.getElementById("timer");
const reload = document.getElementById("reload");
const inputText = document.getElementById("text-input");
const pause = document.getElementById("pause");

let totalWords = 25;
let gameTime = 60;
let gameMode = 'time';

let press = false;
let interval;
let afkTimeout;
let isAFK = false;

let correctCharacters = 0;
let rawCharacters = 0;
let data = [];
let dataRaw = [];

function hidePause() {
    pause.style.display = "none";
    timer.style.display = "block";
}

function showPause() {
    pause.style.display = "flex";
    timer.style.display = "none";
}

pause.addEventListener("click", hidePause);
document.addEventListener("keydown", hidePause);

function isNotSymbol(str) {
    return str.length === 1 && str.match(/[a-zA-Z0-9]/i);
}

function reduceTime(){
    return setInterval(() => {
        if (time > 0) {
            time--;
            timer.innerHTML = formatTime(time);

            const elapsedMinutes = (initialTime - time) / 60;
            const correctWPM = elapsedMinutes > 0 ? Math.floor(correctCharacters / (5 * elapsedMinutes)) : 0;
            const rawWPM = elapsedMinutes > 0 ? Math.floor(rawCharacters / (5 * elapsedMinutes)) : 0;
            
            data.push({ time: initialTime - time, wpm: correctWPM });
            dataRaw.push({ time: initialTime - time, wpm: rawWPM });
        }
        if (time === 0) {
            gameEnd();
        }
    }, 1000);
}

document.getElementById('timeOption').addEventListener('click', showTimeOptions);
document.getElementById('wordOption').addEventListener('click', showWordOptions);

function showTimeOptions(){
    gameMode = "time";
    console.log(gameMode);

}

function showWordOptions(){
    gameMode = "word";
    console.log(gameMode);
}

function formatTime(seconds) {
    if (seconds >= 60) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
        return seconds.toString();
    }
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
    inputText.classList.remove('fade-in');
    inputText.classList.add('fade-out');
    
    inputText.addEventListener('transitionend', function handler() {
        inputText.removeEventListener('transitionend', handler);
        
        time = initialTime;
        correctCharacters = 0;
        press = false;
        clearInterval(interval);
        clearTimeout(afkTimeout);
        isAFK = false;

        idx = 0;
        wordIdx = 0;
        letterIdx = 0;
        error = false;

        // BELUM KEPAKAI
        // wrong = 0;
        // extra = 0;
        // wpm = [];
        // raw = [];

        data = [];
        dataRaw = [];
        
        timer.innerHTML = formatTime(time);
        inputText.innerHTML = "";
        
        generateRandomString();
        words = getAllWordsAndLetters();
        updateCursorPosition();

        inputText.classList.remove('fade-out');
        inputText.classList.remove('fade-in');
        
        requestAnimationFrame(() => {
            inputText.classList.add('fade-in');
        });
    });
}


function resetAFKTimeout() {
    if (isAFK) {
        console.log("Back from AFK");
        isAFK = false;
        cursor.classList.remove("typing");
        hidePause();
    }
    clearTimeout(afkTimeout);
    afkTimeout = setTimeout(() => {
        isAFK = true;
        console.log("AFK");
        cursor.classList.add("typing");
        showPause();
    }, 3000);
}

let idx = 0;
let wordIdx = 0;
let letterIdx = 0;
let words;
let error = false;
let wrong = 0;
let extra = 0;

reload.addEventListener("click", restart);
logo.addEventListener("click", restart);
document.addEventListener("DOMContentLoaded", () => {
    showPause();
    cursor.classList.add("typing");
    generateRandomString();
    words = getAllWordsAndLetters();
});

document.addEventListener("keydown", (event) => {
    resetAFKTimeout();

    if (cursor.classList.contains("typing")) {
        cursor.classList.remove("typing");
    }

    timer.innerHTML = formatTime(time);
    
    if(event.key != null & !press && isNotSymbol(event.key)){
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

            if (wordIdx >= words.length) {
                press = false;
                gameEnd();
            }
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
                    correctCharacters++;
                    rawCharacters++;
                } 
                else {
                    error = true;

                    const currentLetter = currentLetters[letterIdx];
                    if (currentLetter) {
                        currentLetter.classList.add("incorrect");
                    }
                    rawCharacters++;
                }
            } else {
                error = true;

                const extraLetterSpan = document.createElement("letter");
                extraLetterSpan.textContent = event.key;
                extraLetterSpan.classList.add("extra");
                currentWordDiv.appendChild(extraLetterSpan);
                words[wordIdx] += event.key;
                rawCharacters++;
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
        } 
        // Ini kalau misalnya lagi di awal kata dan belum ada huruf sama sekali, balik ke kata sebelumnya
        else if (wordIdx > 0) {
            const prevWordDiv = inputText.querySelectorAll(".word")[wordIdx - 1];
            
            // Only allow going back to previous word if it contains an error
            if (prevWordDiv.classList.contains("error")) {
                wordIdx--;
                const prevLetters = prevWordDiv.querySelectorAll("letter");
                let invalid = false;
                letterIdx = prevLetters.length;
    
                for (let i = prevLetters.length - 1; i >= 0; i--) {
                    if (prevLetters[i].classList.contains("correct")) {
                        letterIdx = i + 1;
                        break;  
                    }
                    if (prevLetters[i].classList.contains("incorrect") || 
                        prevLetters[i].classList.contains("extra")) {
                        letterIdx = i + 1;
                        invalid = true;
                        break;  
                    }
                }
    
                // Hapus class error dari kata sebelumnya
                if(invalid){
                    prevWordDiv.classList.remove("error");
                }
            }
        }

        let incorrectFlag = false
        const prevWordDiv = inputText.querySelectorAll(".word")[wordIdx];
        const prevLetters = prevWordDiv.querySelectorAll("letter");
        
        for (let i = prevLetters.length - 1; i >= 0; i--) {
            if (prevLetters[i].classList.contains("incorrect")) {
                incorrectFlag = true;
                break;  
            }
        }
        if(incorrectFlag) {
            error = true
        } else {
            prevWordDiv.classList.remove("error");
            error = false;
        }
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
        cursor.style.top = `${rect.top + 5}px`;
        cursor.style.left = `${rect.left}px`;
    } else {
        const lastLetter = currentLetters[currentLetters.length - 1];
        if (lastLetter) {
            const rect = lastLetter.getBoundingClientRect();  
            cursor.style.top = `${rect.top + 5}px`;
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


//JANGAN LUPA DI REMOVE NANTI + CLASS HIDDEN DI SECTION GAME
// document.getElementById("result").style.display = "block";

updateCursorPosition();

function gameEnd() {
    const game = document.querySelector(".main-game");
    const result = document.getElementById("result");

    game.style.display = "none";
    result.style.display = "block";
    clearInterval(interval);
    
    const maxWPM = Math.max(...data.map(d => d.wpm), ...dataRaw.map(d => d.wpm));
    const maxTime = Math.max(...data.map(d => d.time));
    const chartHeight = 300;
    const chartWidth = document.getElementById('chart').offsetWidth - 20;
    
    const chart = document.getElementById('chart');
    const pointsCorrect = [];
    const pointsRaw = [];
    
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
        const value = Math.round((maxWPM / ySteps) * i);
        const y = (value / maxWPM) * chartHeight;
    
        const indicator = document.createElement('div');
        indicator.className = 'y-indicator';
        indicator.style.bottom = `${y}px`;
        indicator.style.left = `0px`;
    
        const label = document.createElement('div');
        label.className = 'label';
        label.textContent = value;
        
        indicator.appendChild(label);
        chart.appendChild(indicator);
    }
    
    // Buat gambarin titik dataRaw dan data
    dataRaw.forEach((item, index) => {
        const firstTime = dataRaw[0].time;
        const normalizedTime = item.time - firstTime;
        const x = (normalizedTime / (maxTime - firstTime)) * chartWidth;
        const y = (item.wpm / maxWPM) * chartHeight;
    
        const point = document.createElement('div');
        point.className = 'point';
        point.style.left = `${x}px`;
        point.style.bottom = `${y + 2}px`;
        point.style.backgroundColor = 'var(--logoTextColor)';
        // point.style.width = "8px";
        // point.style.height = "8px";
    
        chart.appendChild(point);
        pointsRaw.push({ x, y });
    });

    data.forEach((item, index) => {
        const firstTime = data[0].time;
        const normalizedTime = item.time - firstTime;
        const x = (normalizedTime / (maxTime - firstTime)) * chartWidth;
        const y = (item.wpm / maxWPM) * chartHeight;
    
        const point = document.createElement('div');
        point.className = 'point';
        point.style.left = `${x}px`;
        point.style.bottom = `${y + 2}px`;
        point.style.backgroundColor = 'var(--logoColor)';
        // point.style.width = "8px";
        // point.style.height = "8px";
        
        const label = document.createElement('div');
        label.className = 'label';
        label.textContent = item.time;
        label.style.left = `${x}px`;
        label.style.bottom = '-20px';
    
        chart.appendChild(point);
        chart.appendChild(label);
        pointsCorrect.push({ x, y });
    }); 
    
    // Buat gambarin garis garis penghubung
    for (let i = 0; i < pointsRaw.length - 1; i++) {
        const line = document.createElement('div');
        line.className = 'line';
        line.style.left = `${pointsRaw[i].x}px`;
        line.style.bottom = `${pointsRaw[i].y + 10}px`;
        line.style.backgroundColor = 'var(--logoTextColor)';
    
        const dx = pointsRaw[i + 1].x - pointsRaw[i].x;
        const dy = pointsRaw[i + 1].y - pointsRaw[i].y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = -Math.atan2(dy, dx) * (180 / Math.PI);
    
        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}deg)`;
        
        chart.appendChild(line);
    }

    for (let i = 0; i < pointsCorrect.length - 1; i++) {
        const line = document.createElement('div');
        line.className = 'line';
        line.style.left = `${pointsCorrect[i].x}px`;
        line.style.bottom = `${pointsCorrect[i].y + 10}px`;
        line.style.backgroundColor = 'var(--logoColor)';
    
        const dx = pointsCorrect[i + 1].x - pointsCorrect[i].x;
        const dy = pointsCorrect[i + 1].y - pointsCorrect[i].y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = -Math.atan2(dy, dx) * (180 / Math.PI);
    
        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}deg)`;
        
        chart.appendChild(line);
    }

    console.log("Raw data", data);
    console.log("Data", dataRaw);
}
