let time = 30;
let initialTime = 30;
const timeOptions = [15, 30, 60, 120];
const wordsOptions = [15, 25, 50, 100];
let elapsedTime = 0;

const wordCountOptions = document.querySelectorAll("#modeOption span");
const timeModeBtn = document.getElementById('timeMode');
const wordModeBtn = document.getElementById('wordMode');
const quoteModeBtn = document.getElementById('quoteMode');
const zenModeBtn = document.getElementById('zenMode');
const modeOption = document.getElementById('modeOption');
const option1 = document.getElementById('options-1');
const option2 = document.getElementById('options-2');
const option3 = document.getElementById('options-3');
const option4 = document.getElementById('options-4');

const count = document.getElementById("count");
const reload = document.getElementById("reload");
const inputText = document.getElementById("text-input");
const pause = document.getElementById("pause");

let totalWords = 25;
let gameMode = 'time';
let optionChoosedMode = time;

let press = false;
let interval;
let afkTimeout;
let isAFK = false;

let correctCharacters = 0;
let incorrectCharacters = 0;
let extraCharacters = 0;
let rawCharacters = 0;
let data = [];
let dataRaw = [];

function hidePause() {
    pause.style.display = "none";
    count.style.display = "block";
}

function showPause() {
    pause.style.display = "flex";
    count.style.display = "none";
}

pause.addEventListener("click", hidePause);
document.addEventListener("keydown", hidePause);

function isNotGeneralSymbol(str) {
    return str.length === 1 && str.match(/[a-zA-Z0-9,.'":!@#%()]/i);
}

function reduceTime(){
    return setInterval(() => {
        if (gameMode === "time" && time > 0) {
            time--;
            count.innerHTML = formatTime(time);
        } else if (gameMode === "words") {
            elapsedTime++;
        } else if (gameMode === "quote") {
            elapsedTime++;
        } else if (gameMode === "zen") {
            elapsedTime++;
        }

        const currentTime = gameMode === "time" ? initialTime - time : elapsedTime;
        const elapsedMinutes = currentTime / 60;
        const correctWPM = elapsedMinutes > 0 ? Math.floor(correctCharacters / (5 * elapsedMinutes)) : 0;
        const rawWPM = elapsedMinutes > 0 ? Math.floor(rawCharacters / (5 * elapsedMinutes)) : 0;
        
        data.push({ time: currentTime, wpm: correctWPM });
        dataRaw.push({ time: currentTime, wpm: rawWPM });

        if (time === 0 && gameMode === "time") {
            gameEnd();
        }
    }, 1000);
}

timeModeBtn.addEventListener('click', showTimeOptions);
wordModeBtn.addEventListener('click', showWordOptions);
quoteModeBtn.addEventListener('click', showQuoteOptions);
zenModeBtn.addEventListener('click', showZenOptions);

function showTimeOptions(){
    gameMode = "time";
    modeOption.style.display = 'flex';
    option1.textContent = timeOptions[0];
    option2.textContent = timeOptions[1];
    option3.textContent = timeOptions[2];
    option4.textContent = timeOptions[3];
    console.log(gameMode);
}

function showWordOptions(){
    gameMode = "words";
    modeOption.style.display = 'flex';
    option1.textContent = wordsOptions[0];
    option2.textContent = wordsOptions[1];
    option3.textContent = wordsOptions[2];
    option4.textContent = wordsOptions[3];
    console.log(gameMode);
}

function showQuoteOptions(){
    gameMode = "quote";
    count.style.display = 'none';
    console.log(gameMode);
    reset();
    modeOption.style.display = 'none';
}

function showZenOptions(){
    gameMode = "zen";
    console.log(gameMode);
    reset();
    modeOption.style.display = 'none';
    count.innerHTML = '0';
    inputText.innerHTML = '';

    const wordDiv = document.createElement("div");
    wordDiv.className = "word";
    inputText.appendChild(wordDiv);
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

wordCountOptions.forEach(option => {
    option.addEventListener('click', () => {
        const optionValue = parseInt(option.textContent);

        if (gameMode === 'time') {
            time = optionValue;
            initialTime = optionValue;
            optionChoosedMode = optionValue;
            console.log(`Time Mode: ${time} minutes`);
        } else if (gameMode === 'words') {
            totalWords = optionValue;
            optionChoosedMode = optionValue;
            console.log(`Words Mode: ${totalWords} words`);
        }

        reset();
    });
});

const wordsData = {
    "nouns": [
      "apple", "book", "chair", "desk", "phone", "window", "light", "pen", "table", "house",
      "tree", "cloud", "road", "water", "coffee", "street", "music", "car", "key", "time",
      "night", "day", "shirt", "shoe", "clock", "star", "watch", "bird", "cat", "dog", "ball",
      "game", "food", "drink", "party", "team", "work", "peace", "love", "friend", "family",
      "job", "school", "study", "class", "desk", "teacher", "student", "mountain", "ocean", "river",
      "forest", "sky", "sun", "moon", "planet", "computer", "television", "camera", "bottle", "cup",
      "lamp", "blanket", "keychain", "glove", "shoe", "sand", "earth", "soda", "dream", "idea", "i",
      "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them", "my", "your",
    ],
    "adjectives": [
      "happy", "sad", "bright", "dark", "big", "small", "fast", "slow", "good", "bad",
      "beautiful", "ugly", "clean", "dirty", "soft", "hard", "loud", "quiet", "long", "short",
      "young", "old", "easy", "difficult", "new", "old", "warm", "cold", "rich", "poor",
      "strong", "weak", "funny", "serious", "angry", "excited", "fearful", "nervous", "brave",
      "sleepy", "cheerful", "peaceful", "shiny", "wet", "dry", "thin", "thick", "sweet", "sour",
      "salty", "spicy", "smooth", "rough", "fuzzy", "delicate", "harsh", "friendly", "shy"
    ],
    "verbs": [
      "run", "jump", "eat", "sleep", "read", "write", "talk", "listen", "play", "work",
      "study", "sing", "dance", "speak", "think", "build", "make", "watch", "call", "help",
      "clean", "drive", "walk", "draw", "cook", "learn", "teach", "open", "close", "sit", "stand",
      "throw", "catch", "push", "pull", "laugh", "cry", "love", "hate", "kiss", "hug", "embrace",
      "attack", "defend", "buy", "sell", "share", "organize", "decorate", "create", "discover",
      "explore", "sing", "jump", "climb", "swim", "ski", "fly", "cook", "bake", "build", "help",
      "question", "agree", "disagree", "investigate", "lead", "follow", "succeed", "fail"
    ]
};

const generations = {
    "08-1": "Be Energic Go Happy (BEGH)",
    "13-0": "Prove Our Will, Emerge Our Spirit (POWER)",
    "14-0": "Hard Work, Passion, and Make it Happens",
    "15-1": "Keep Fighting and Share Our Greatest Skill | High Quality on Perfect Effort (HOPE)",
    "15-2": "Smart Mission to Improve Knowledge (SMILE) | Give Inspiration, unappeased nonsuch and Trustworthy (GIANT)",
    "17-2": "Achieve Success Through Faith, Effort, and Teamwork | Perfection Comes From Positive Attitude",
    "18-1": "Hardwork and Extraordinary Effort Make Success Come Closer | Believe, Empower, Strive Together (BEST)",
    "18-2": "To Learn, To Aim, To Achieve the Finest in Our Passion | Hardwork Always Provide Potential Intelligence and Endless Solidarity (Happiness)",
    "19-1": "Always Try New Things, Overcome All Problems (AT-TOP) | Always Strive to Learn, Achieve, and Believe (ASLAB)",
    "20-1": "Through Hard Work and Dedication We Hold Our Future In Our Hands | Be on Our Maximum (BOOM)",
    "21-1": "Greatness Comes from Curiosity, Tenacity, and Integrity.",
    "21-2": "An act of rectitude and perseverance leads to excellence | COmmitment and Valiance Indicates Dignity(COVID)",
    "22-1": "Alongside courage and perseverance, we shape and define our future.",
    "22-2": "Wonderful things can be achieved when there is teamwork, hard work, and perseverance",
    "23-1": "Breaking and overcoming challenges through courage, hard work, and persistence.",
    "23-2": "inspired by passion, driven by purpose, together we shatter limits and redefine boundaries",
    "24-1": "Relentlessly move forward and achieve our dreams.",
    "24-2": "Confront the challenges of learning and outgrow the boundaries together."
};

  
function generateRandomString(mode = 'default'){
    const wordsArray = [
        ...wordsData.nouns,
        ...wordsData.adjectives,
        ...wordsData.verbs
    ];

    inputText.innerHTML = "";
    document.getElementById('generation_result').textContent = '';
    if (mode === 'quote') {
        const generationCodes = Object.keys(generations);
        const randomGen = generationCodes[Math.floor(Math.random() * generationCodes.length)];
        const quote = generations[randomGen];

        document.getElementById('generation_result').textContent = randomGen;
        
        const quoteWords = quote.replace(/\|/g, ' ').split(/\s+/)
            .filter(word => word.length > 1 && !/^\(.*\)$/.test(word));

            quoteWords.forEach(word => {
            const wordDiv = document.createElement("div");
            wordDiv.className = "word";

            for (const char of word) {
                const letterSpan = document.createElement("letter");
                letterSpan.textContent = char;

                wordDiv.appendChild(letterSpan);
            }

            inputText.appendChild(wordDiv);
        });
    } else {
        for (let i = 0; i < totalWords; i++) {
            const randomWord = wordsArray[Math.floor(Math.random() * wordsArray.length)];

            const wordDiv = document.createElement("div");
            wordDiv.className = "word";

            for (const char of randomWord) {
                const letterSpan = document.createElement("letter");
                letterSpan.textContent = char;
                wordDiv.appendChild(letterSpan);
            }

            inputText.appendChild(wordDiv);
            document.getElementById('generation_result').textContent = '';
        }
    }
}

function reset() {
    inputText.classList.remove('fade-in');
    inputText.classList.add('fade-out');
    
    inputText.addEventListener('transitionend', function handler() {
        inputText.removeEventListener('transitionend', handler);
        
        time = initialTime;
        elapsedTime = 0;
        correctCharacters = 0;
        press = false;
        clearInterval(interval);
        clearTimeout(afkTimeout);
        isAFK = false;

        idx = 0;
        wordIdx = 0;
        letterIdx = 0;
        error = false;

        data = [];
        dataRaw = [];
        
        count.style.display = (gameMode === "quote") ? 'none' : 'block';
        count.innerHTML = gameMode === "time" ? formatTime(time) : gameMode === "words" ? `0/${totalWords}` : '0';
        inputText.innerHTML = "";
        
        if (gameMode !== "zen") {
            generateRandomString(gameMode);
        }
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

reload.addEventListener("click", reset);
let focusRemoved = false;

reload.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        reset();
        reload.blur();
        focusRemoved = true;
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Tab' && focusRemoved) {
        setTimeout(() => {
            reload.focus();
            focusRemoved = false;
        }, 0);
    }
});

logo.addEventListener("click", reset);
document.addEventListener("DOMContentLoaded", () => {
    showPause();
    cursor.classList.add("typing");
    generateRandomString();
    words = getAllWordsAndLetters();
    document.getElementById('generation').style.display = 'none';
    updateCursorPosition();
});

function paused() {
    document.getElementById("mode").style.display = 'none';
    document.getElementById("footer-left").style.display = 'none';
    document.getElementById("footer-right").style.display = 'none';
}

function unpaused() {
    document.getElementById("mode").style.display = 'flex';
    document.getElementById("footer-left").style.display = 'flex';
    document.getElementById("footer-right").style.display = 'flex';
}

let idx = 0;
let wordIdx = 0;
let letterIdx = 0;
let words;
let error = false;

document.addEventListener("keydown", (event) => {
    resetAFKTimeout();

    if (cursor.classList.contains("typing")) {
        cursor.classList.remove("typing");
    }

    // BUAT END GAME MODE ZEN CTRL + ENTER
    if (event.ctrlKey && event.key === 'Enter' && gameMode === "zen") {
        gameEnd();
        return;
    }

    if(event.key != null & !press && isNotGeneralSymbol(event.key)){
        press = true;
        interval = reduceTime();
    }

    if (gameMode === "zen") {
        if (event.key === 'Backspace') {
            const words = inputText.querySelectorAll(".word");
            const currentWord = words[words.length - 1];
            
            if (currentWord) {
                const letters = currentWord.querySelectorAll("letter");
                if (letters.length > 0) {
                    currentWord.removeChild(letters[letters.length - 1]);
                    if (correctCharacters > 0) correctCharacters--;
                    if (rawCharacters > 0) rawCharacters--;
                    if (letterIdx > 0) letterIdx--;
                } else if (words.length > 1) {
                    inputText.removeChild(currentWord);
                    const currentCount = parseInt(count.innerHTML);
                    if (currentCount > 0) {
                        count.innerHTML = currentCount - 1;
                    }
                }
            }
            updateCursorPosition();
            return;
        }

        if (event.key === ' ') {
            const wordDiv = document.createElement("div");
            wordDiv.className = "word";
            inputText.appendChild(wordDiv);
            
            const currentCount = parseInt(count.innerHTML);
            count.innerHTML = currentCount + 1;
            
            correctCharacters++;
            rawCharacters++;
            letterIdx++;
            
            requestAnimationFrame(() => {
                updateCursorPosition();
            });
            return;
        }

        if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
            const words = inputText.querySelectorAll(".word");
            const currentWord = words[words.length - 1] || (() => {
                const newWord = document.createElement("div");
                newWord.className = "word";
                inputText.appendChild(newWord);
                return newWord;
            })();
    
            const currentLetters = currentWord.querySelectorAll("letter");
            if (currentLetters.length < 30) {
                const letterSpan = document.createElement("letter");
                letterSpan.textContent = event.key;
                letterSpan.classList.add("correct");
                currentWord.appendChild(letterSpan);
            } else {
                return;
            }
            
            correctCharacters++;
            rawCharacters++;
            letterIdx++;
            
            const currentTime = elapsedTime;
            const elapsedMinutes = currentTime / 60;
            const wpm = elapsedMinutes > 0 ? Math.floor(correctCharacters / (5 * elapsedMinutes)) : 0;
            
            data.push({ time: currentTime, wpm: wpm });
            dataRaw.push({ time: currentTime, wpm: wpm });
    
            updateCursorPosition();
            return;
        }

    } else{
        if (gameMode === "words") {
            const completedWords = wordIdx + (letterIdx === words[wordIdx].length ? 1 : 0);
            count.innerHTML = `${completedWords}/${totalWords}`;
        } else if (gameMode === "time") {
            count.innerHTML = formatTime(time);
        } else if (gameMode === "quote") {
            count.style.display = 'none';
        }
    
        if(event.key == ' '){
            if(letterIdx != 0){
                if(error || (letterIdx != words[wordIdx].length)){
                    const currentWord = inputText.querySelectorAll(".word")[wordIdx];
                    currentWord.classList.add("error");
                }
    
                if (gameMode === "zen") {
                    // if (event.key === ' ') {
                    const currentCount = parseInt(count.innerHTML);
                    count.innerHTML = currentCount + 1;
                    // }
                    updateCursorPosition();
                }
                
                wordIdx++;
                letterIdx = 0;
                error = false;
    
                if (gameMode === "words") {
                    count.innerHTML = `${wordIdx}/${totalWords}`;
                }
            }
        }
    
        if (isNotGeneralSymbol(event.key)) {
            if (gameMode === "zen") {
                const letterSpan = document.createElement("letter");
                letterSpan.textContent = event.key;
                inputText.appendChild(letterSpan);
                correctCharacters++;
                rawCharacters++;
                letterIdx++;
                updateCursorPosition();
            } else {
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
                            // INI TRACK INCORRECT CHAR
                            incorrectCharacters++;
                            rawCharacters++;
                        }
                    } else {
                        error = true;
                        const extraLetterSpan = document.createElement("letter");
                        extraLetterSpan.textContent = event.key;
                        extraLetterSpan.classList.add("extra");
                        currentWordDiv.appendChild(extraLetterSpan);
                        words[wordIdx] += event.key;
                        // INI TRACK EXTRA CHAR
                        extraCharacters++;
                        rawCharacters++;
                    }
    
                    idx++;
                    letterIdx++;
    
                    if (gameMode === "words") {
                        const completedWords = wordIdx + (letterIdx === words[wordIdx].length ? 1 : 0);
                        count.innerHTML = `${completedWords}/${totalWords}`;
                    }
    
                    if (wordIdx === words.length - 1 && letterIdx === words[wordIdx].length) {
                        press = false;
                        gameEnd();
                    }
                } else {
                    // Kalau sudah mencapai batas 7 huruf ekstra, skip
                    return;
                }
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
    if (gameMode === "zen") {
        const words = inputText.querySelectorAll(".word");
        const currentWord = words[words.length - 1];
        
        if (currentWord) {
            const letters = currentWord.querySelectorAll("letter");
            if (letters.length > 0) {
                const lastLetter = letters[letters.length - 1];
                const rect = lastLetter.getBoundingClientRect();
                cursor.style.top = `${rect.top + 5}px`;
                cursor.style.left = `${rect.right}px`;
            } else {
                const rect = currentWord.getBoundingClientRect();
                cursor.style.top = `${rect.top + 5}px`;
                cursor.style.left = `${rect.left}px`;
            }
        } else {
            const wordDiv = document.createElement("div");
            wordDiv.className = "word";
            inputText.appendChild(wordDiv);
            const rect = wordDiv.getBoundingClientRect();
            cursor.style.top = `${rect.top + 5}px`;
            cursor.style.left = `${rect.left}px`;
        }
        return;
    }

    const currentWordDiv = inputText.querySelectorAll(".word")[wordIdx];  
    if (!currentWordDiv) return;

    const currentLetters = currentWordDiv.querySelectorAll("letter");  

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
    if (isNotGeneralSymbol(event.key)) { 
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

function calculateAverageWPM(dataArray) {
    if (!dataArray || dataArray.length === 0) return 0;
    const sum = dataArray.reduce((acc, curr) => acc + curr.wpm, 0);
    return sum / dataArray.length;
}

function calculateAverageConsistency(data, dataRaw) {
    if (!data || !dataRaw || data.length === 0 || dataRaw.length === 0) return 0;
    
    const consistencies = data.map((item, index) => {
        if (dataRaw[index] && dataRaw[index].wpm !== 0) {
            return (item.wpm / dataRaw[index].wpm) * 100;
        }
        return 0;
    });
    
    const sum = consistencies.reduce((acc, curr) => acc + curr, 0);
    return sum / consistencies.length;
}

function setGameMode(mode) {
    gameMode = mode;
    if (mode === "words") {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    } else {
        if (!timerInterval) {
            timerInterval = setInterval(() => {
                time++;
                count.innerHTML = formatTime(time);
            }, 1000);
        }
    }
}

function gameEnd() {
    const generation = document.getElementById('generation');
    generation.style.display = gameMode === "quote" ? 'block' : 'none';

    clearInterval(interval);
    
    const game = document.querySelector(".main-game");
    const result = document.getElementById("result");
    const modeResult = document.getElementById("mode_result");
    const statsResult = document.getElementById("stats_result");
    const wpmResult = document.getElementById("wpm_result");
    const accResult = document.getElementById("acc_result");
    const rawResult = document.getElementById("raw_result");
    const consistencyResult = document.getElementById("consistency_result");
    const timeResult = document.getElementById("time_result");

    game.style.display = "none";
    result.style.display = "block";

    modeResult.textContent = gameMode === 'zen' ? 'zen' : 
                            gameMode === 'time' ? `time ${formatTime(optionChoosedMode)}` : 
                            `words ${optionChoosedMode}`;
    
    const totalWords = gameMode === 'zen' ? Math.max(1, parseInt(count.innerHTML)) : correctCharacters / 5;
    const timeInMinutes = elapsedTime / 60;
    
    let finalWPM = 0, rawWPM = 0;
    
    if (gameMode === 'zen') {
        finalWPM = Math.round(totalWords / timeInMinutes);
        rawWPM = finalWPM;
    } else {
        finalWPM = calculateAverageWPM(data);
        rawWPM = calculateAverageWPM(dataRaw);
    }

    finalWPM = isNaN(finalWPM) ? 0 : Math.max(0, Math.round(finalWPM));
    rawWPM = isNaN(rawWPM) ? 0 : Math.max(0, Math.round(rawWPM));

    const accuracy = rawCharacters > 0 ? (correctCharacters / rawCharacters) * 100 : 0;
    
    accResult.textContent = Math.floor(accuracy) + '%';
    wpmResult.textContent = finalWPM;
    rawResult.textContent = rawWPM;
    statsResult.textContent = `${correctCharacters}/${incorrectCharacters}/${extraCharacters}`;
    timeResult.textContent = gameMode === 'time' ? initialTime : elapsedTime;
    
    const avgConsistency = gameMode === 'zen' ? 100 : calculateAverageConsistency(data, dataRaw);
    consistencyResult.textContent = Math.floor(isNaN(avgConsistency) ? 0 : avgConsistency) + '%';

    const chart = document.getElementById('chart');
    chart.innerHTML = '';

    if (gameMode === 'zen') {
        data = [];
        dataRaw = [];
        
        if (totalWords > 0 && elapsedTime > 0) {
            for (let i = 1; i <= elapsedTime; i++) {
                const minutesPassed = i / 60;
                const wordsAtThisPoint = Math.min(totalWords, Math.floor(totalWords * (i / elapsedTime)));
                const currentWPM = Math.round(wordsAtThisPoint / minutesPassed);
                data.push({ time: i, wpm: currentWPM });
                dataRaw.push({ time: i, wpm: currentWPM });
            }
        } else {
            data.push({ time: 1, wpm: 0 });
            dataRaw.push({ time: 1, wpm: 0 });
        }
    }

    const maxWPM = Math.max(1, ...data.map(d => d.wpm), ...dataRaw.map(d => d.wpm));
    const maxTime = Math.max(1, ...data.map(d => d.time));
    const chartHeight = 300;
    const chartWidth = chart.offsetWidth - 20;
    
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

    const maxLabels = 30;
    const labelInterval = Math.ceil(data.length / maxLabels);

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
        
        if (index % labelInterval === 0 && index / labelInterval < maxLabels) {
            const label = document.createElement('div');
            label.className = 'label';
            label.textContent = item.time;
            label.style.left = `${x}px`;
            label.style.bottom = '-20px';
            chart.appendChild(label);
        }
    
        chart.appendChild(point);
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

    // console.log("Raw data", data);
    // console.log("Data", dataRaw);
}

function handleRestart() {
    const game = document.querySelector(".main-game");
    const result = document.getElementById("result");
    
    result.style.display = "none";
    game.style.display = "flex";

    const chart = document.getElementById('chart');
    chart.innerHTML = '';

    time = initialTime;
    elapsedTime = 0;
    correctCharacters = 0;
    incorrectCharacters = 0;
    extraCharacters = 0;
    rawCharacters = 0;
    press = false;
    clearInterval(interval);
    clearTimeout(afkTimeout);
    isAFK = false;

    idx = 0;
    wordIdx = 0;
    letterIdx = 0;
    error = false;

    data = [];
    dataRaw = [];
    
    count.innerHTML = gameMode === "time" ? formatTime(time) : `0/${totalWords}`;
    
    generateRandomString(gameMode);
    words = getAllWordsAndLetters();
    updateCursorPosition();
}

const restartBtn = document.getElementById('restart');
restartBtn.addEventListener('click', handleRestart);
restartBtn.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleRestart();
    }
});