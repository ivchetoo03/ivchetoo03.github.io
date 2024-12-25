const animZone = document.getElementById("anim");
const startBtn = document.getElementById("start-btn");
const reloadBtn = document.getElementById("reload-btn");
const closeBtn = document.getElementById("close-btn");
const clearLogBtn = document.getElementById("clear-log-btn");
const logMessage = document.getElementById("log-message");
const eventTable = document.getElementById("event-table");
const eventData = document.getElementById("event-data");

let circles = [];
let animationFrameId;
let animationRunning = false;
let eventCounter = 1;

const SPEED = 3;
const MIN_DISTANCE = 10; // Мінімальна відстань від стінок
const localStorageKey = "circleEvents";

const formatTime = (date) => {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const logEvent = (message) => {
    const time = formatTime(new Date());
    const event = {
    id: eventCounter++,
    time,
    message,
    };

    // Показати останнє повідомлення
    logMessage.textContent = `${event.id}. ${event.time}: ${event.message}`;

    // Зберегти у LocalStorage
    const storedEvents = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    storedEvents.push(event);
    localStorage.setItem(localStorageKey, JSON.stringify(storedEvents));

};

const createCircle = (color, isTop) => {
    const circle = document.createElement("div");
    circle.classList.add("circle", color);

    const x = MIN_DISTANCE + Math.random() * (animZone.clientWidth - MIN_DISTANCE * 2 - 20);
    const y = isTop
    ? MIN_DISTANCE
    : animZone.clientHeight - MIN_DISTANCE - 20;

    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    const angle = Math.random() * Math.PI * 2;
    circle.dx = Math.cos(angle) * SPEED;
    circle.dy = Math.sin(angle) * SPEED * (isTop ? 1 : -1);

    animZone.appendChild(circle);
    circles.push(circle);

    logEvent(`Кулька ${color} створена у позиції (${x.toFixed(2)}, ${y.toFixed(2)})`);
};

const startAnimation = () => {
    if (!animationRunning) {
    circles = [];
    animZone.innerHTML = '<div class="divider"></div>';
    createCircle("blue", true);
    createCircle("orange", false);

    animationRunning = true;
    reloadBtn.classList.add("hidden");
    startBtn.disabled = true;
    logEvent("Анімація запущена");
    animate();
    }
};

const reloadAnimation = () => {
    stopAnimation();
    startBtn.disabled = false;
    reloadBtn.classList.add("hidden");
    animZone.innerHTML = '<div class="divider"></div>';
    logEvent("Анімація перезавантажена");
};

const clearLog = () => {
    localStorage.removeItem(localStorageKey);
    logMessage.textContent = "Лог подій очищено.";
};

const closeAnimation = () => {
    stopAnimation();
    const storedEvents = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    storedEvents.forEach((event) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>LocalStorage</td><td>${event.id}</td><td>${event.time}</td><td>${event.message}</td>`;
        eventData.appendChild(row);
    });

    console.log(storedEvents);
    eventTable.style.display = "block";
    logEvent("Анімація закрита. Події збережені.");
};

const stopAnimation = () => {
    animationRunning = false;
    cancelAnimationFrame(animationFrameId);
};

startBtn.addEventListener("click", startAnimation);
reloadBtn.addEventListener("click", reloadAnimation);
closeBtn.addEventListener("click", closeAnimation);
clearLogBtn.addEventListener("click", clearLog);