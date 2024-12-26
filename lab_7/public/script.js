const animZone = document.getElementById("anim");
const startBtn = document.getElementById("start-btn");
const reloadBtn = document.getElementById("reload-btn");
const closeBtn = document.getElementById("close-btn");
const clearBtn = document.getElementById("clear-local-btn");
const logMessage = document.getElementById("log-message");
const eventData = document.getElementById("event-data");

let circles = [];
let animationFrameId;
let animationRunning = false;
let eventCounter = 1;

const SPEED = 3;
const MIN_DISTANCE = 10;
const localStorageKey = "circleEvents";
const serverUrl = "https://tales-from-far-far-away-balls.onrender.com/events.php";

const formatTime = (date) => {
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const sendEventToServer = async (event) => {
  await fetch(serverUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
};

const logEvent = async (message) => {
  const time = formatTime(new Date());
  const event = {
    id: eventCounter++,
    time,
    message,
  };

  logMessage.textContent = `${event.id}. ${event.time}: ${event.message}`;

  const storedEvents = JSON.parse(localStorage.getItem(localStorageKey)) || [];
  storedEvents.push(event);
  localStorage.setItem(localStorageKey, JSON.stringify(storedEvents));

  await sendEventToServer(event);
};

const createCircle = (color, isTop) => {
  const circle = document.createElement("div");
  circle.classList.add("circle", color);

  const x = MIN_DISTANCE + Math.random() * (animZone.clientWidth - MIN_DISTANCE * 2 - 20);
  const y = isTop
    ? MIN_DISTANCE
    : animZone.clientHeight - MIN_DISTANCE - 30;

  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;

  const angle = Math.random() * Math.PI * 2;
  circle.dx = Math.cos(angle) * SPEED;
  circle.dy = Math.sin(angle) * SPEED * (isTop ? 1 : -1);

  animZone.appendChild(circle);
  circles.push(circle);

  logEvent(`Кулька ${color} створена у позиції (${x.toFixed(2)}, ${y.toFixed(2)})`);
};

const moveCircles = () => {
    circles.forEach((circle) => {
        let x = parseFloat(circle.style.left);
        let y = parseFloat(circle.style.top);

        x += circle.dx;
        y += circle.dy;

        if (x <= 0 || x + 30 >= animZone.clientWidth ) {
            circle.dx *= -1;
            logEvent(`Кулька ${circle.classList.contains("blue") ? "синя" : "помаранчева"} відскочила від стінки`);
        }

        if (y <= 0 || y + 30 >= animZone.clientHeight) {
            circle.dy *= -1; // Зміна напрямку по осі Y
            logEvent(`Кулька ${circle.classList.contains("blue") ? "синя" : "помаранчева"} відскочила від стінки`);
        }

        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;
    });
};
  
const handleCollision = () => {
    const [circle1, circle2] = circles;

    const dx = parseFloat(circle1.style.left) - parseFloat(circle2.style.left);
    const dy = parseFloat(circle1.style.top) - parseFloat(circle2.style.top);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 30) {
        circle1.dx *= -1;
        circle1.dy *= -1;
        circle2.dx *= -1;
        circle2.dy *= -1;
        logEvent("Кульки зіткнулися між собою");
    }
};

const checkStopCondition = () => {
    const topCircles = circles.filter(
        (circle) => parseFloat(circle.style.top) + 10 <= animZone.clientHeight / 2
    );
    const bottomCircles = circles.filter(
        (circle) => parseFloat(circle.style.top) + 10 > animZone.clientHeight / 2
    );

    if (topCircles.length === 2 || bottomCircles.length === 2) {
        stopAnimation();
        logEvent("Анімація зупинена: всі кульки в одній половині");
        startBtn.disabled = false;
    }
};
  
const animate = () => {
    moveCircles();
    handleCollision();
    checkStopCondition();

    if (animationRunning) {
        animationFrameId = requestAnimationFrame(animate);
    }
};  

const startAnimation = () => {
  if (!animationRunning) {
    animationRunning = true;
    startBtn.disabled = true;
    logEvent("Анімація запущена");
    animate();
  }
};

const reloadAnimation = () => {
  stopAnimation();
  circles = [];
  animZone.innerHTML = '<div class="divider"></div>';
  createCircle("blue", true);
  createCircle("orange", false);
  startBtn.disabled = false;
  logEvent("Анімація перезавантажена");
};

const stopAnimation = () => {
  animationRunning = false;
  cancelAnimationFrame(animationFrameId);
};

const closeAnimation = async () => {
  stopAnimation();

  const storedEvents = JSON.parse(localStorage.getItem(localStorageKey)) || [];
  storedEvents.forEach((event) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>LocalStorage</td><td>${event.id}</td><td>${event.time}</td><td>${event.message}</td>`;
    eventData.appendChild(row);
  });

  const response = await fetch(serverUrl);
  const serverEvents = await response.json();
  serverEvents.forEach((event) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>Сервер</td><td>${event.id}</td><td>${event.time}</td><td>${event.message}</td>`;
    eventData.appendChild(row);
  });
};

const clearStorage = () => {
    localStorage.clear(); // Очищення Local Storage
    logEvent("Local Storage очищено"); // Логування події
};

startBtn.addEventListener("click", startAnimation);
reloadBtn.addEventListener("click", reloadAnimation);
closeBtn.addEventListener("click", closeAnimation);
clearBtn.addEventListener("click", clearStorage);

createCircle("blue", true);
createCircle("orange", false);