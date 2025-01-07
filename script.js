let timeLeft;
let timerId = null;
let isWorkMode = true;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const workButton = document.getElementById('work');
const breakButton = document.getElementById('break');
const customTimeInput = document.getElementById('customTime');
const setCustomTimeButton = document.getElementById('setCustomTime');

function parseCustomTime(timeString) {
    timeString = timeString.trim();
    
    // Handle ":ss" format for seconds only
    if (timeString.startsWith(':')) {
        const seconds = parseInt(timeString.substring(1));
        if (!isNaN(seconds) && seconds < 60) {
            return seconds;
        }
        return null;
    }
    
    // Handle "mm:ss" format
    const pattern = /^(\d+):(\d+)$/;
    const match = timeString.match(pattern);
    
    if (!match) {
        // Try to parse as a single number (assuming minutes)
        const minutes = parseInt(timeString);
        if (!isNaN(minutes)) {
            return minutes * 60;
        }
        return null;
    }
    
    const minutes = parseInt(match[1]);
    const seconds = parseInt(match[2]);
    
    if (seconds >= 60) return null;
    
    return (minutes * 60) + seconds;
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function setCustomTime() {
    const timeString = customTimeInput.value;
    const totalSeconds = parseCustomTime(timeString);
    
    if (totalSeconds === null) {
        alert('Please enter time in format "mm:ss" or ":ss"');
        return;
    }
    
    clearInterval(timerId);
    timerId = null;
    timeLeft = totalSeconds;
    updateDisplay();
    customTimeInput.value = '';
}

function startTimer() {
    if (timerId === null) {
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                
                let beepCount = 0;
                const sound = document.getElementById('timerSound');
                const playBeep = setInterval(() => {
                    sound.currentTime = 0;
                    sound.play();
                    beepCount++;
                    if (beepCount >= 5) {
                        clearInterval(playBeep);
                        setTimeout(() => {
                            alert(isWorkMode ? 'Work session completed!' : 'Break session completed!');
                        }, 500);
                    }
                }, 500);
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = isWorkMode ? 25 * 60 : 5 * 60;
    updateDisplay();
    customTimeInput.value = '';
}

function setWorkMode() {
    isWorkMode = true;
    timeLeft = 25 * 60;
    updateDisplay();
}

function setBreakMode() {
    isWorkMode = false;
    timeLeft = 5 * 60;
    updateDisplay();
}

// Event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
workButton.addEventListener('click', setWorkMode);
breakButton.addEventListener('click', setBreakMode);
setCustomTimeButton.addEventListener('click', setCustomTime);
customTimeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        setCustomTime();
    }
});

// Initialize
timeLeft = 25 * 60;
updateDisplay(); 