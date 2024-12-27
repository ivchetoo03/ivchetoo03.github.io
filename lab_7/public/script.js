const animZone = document.getElementById("anim");
const startBtn = document.getElementById("start-btn");
const reloadBtn = document.getElementById("reload-btn");
const closeBtn = document.getElementById("close-btn");
const logMessage = document.getElementById("log-message");
const eventData = document.getElementById("event-data");



let circles = [];
let animationFrameId;
let animationRunning = false;
let closed = false;
let eventCounter = 1;


const SPEED = 3;
const MIN_DISTANCE = 10;
const localStorageKey = "circleEvents";
const serverUrl = "https://tales-from-far-far-away-balls.onrender.com/events.php";
// const serverUrl = "http://localhost:3000/events.php";
const eventSet = new Set();

const formatTime = (date) => {
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const sendEventToServer = async (event) => {
  try {
    await fetch(serverUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error('Error sending event:', error);
  }
};

const logEvent = async (message) => {
  const time = formatTime(new Date());
  const eventId = `${time}-${message}`;

  if (!eventSet.has(eventId)) {
    eventSet.add(eventId); // Додаємо подію до набору
    const event = { id: eventCounter++, time, message };
    logMessage.textContent = `${event.id}. ${event.time}: ${event.message}`;

    const storedEvents = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    storedEvents.push(event);
    localStorage.setItem(localStorageKey, JSON.stringify(storedEvents));

    sendEventToServer(event);
  }
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
};

const moveCircles = () => {
    circles.forEach((circle) => {
        let x = parseFloat(circle.style.left);
        let y = parseFloat(circle.style.top);

        x += circle.dx;
        y += circle.dy;

        if (x <= 0 || x + 30 >= animZone.clientWidth ) {
            circle.dx *= -1;
            logEvent(`Ball ${circle.classList.contains("blue") ? "blue" : "orange"} deflected off the wall`);
        }

        if (y <= 0 || y + 30 >= animZone.clientHeight) {
            circle.dy *= -1;
            logEvent(`Ball ${circle.classList.contains("blue") ? "blue" : "orange"} deflected off the wall`);
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
        logEvent("Balls have collided");
    }
};

const checkStopCondition = () => {
    const topCircles = circles.filter(
        (circle) => parseFloat(circle.style.top) + 30 <= animZone.clientHeight / 2
    );
    const bottomCircles = circles.filter(
        (circle) => parseFloat(circle.style.top) > animZone.clientHeight / 2
    );

    if (topCircles.length === 2 || bottomCircles.length === 2) {
        stopAnimation();
        logEvent("Animation is over: all ball are on one side");
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

const startAnimation = async () => {
  animZone.style.display = 'block';
  if(closed == true){
    reloadAnimation();
    clearServerData();
    localStorage.clear();
    console.log('Local Storage cleared');
    eventCounter = 1;
    const localStorageTable = document.getElementById("local-storage-data");
    const serverTable = document.getElementById("server-data");
    localStorageTable.innerHTML = '';
    serverTable.innerHTML = '';
  }
  else if (!animationRunning && closed == false) {
      animationRunning = true;
      startBtn.style.display = 'none'; 
      reloadBtn.style.display = 'inline-block'; 
      closeBtn.style.display = 'inline-block'; 
      logEvent("Animation is active!");
      animate();
  }
  closed = false;
};

const reloadAnimation = () => {
  stopAnimation();
  circles = [];
  animZone.innerHTML = '<div class="divider"></div>';
  createCircle("blue", true);
  createCircle("orange", false);
  startBtn.style.display = 'inline-block';
  reloadBtn.style.display = 'none';
  closeBtn.style.display = 'none';
};

const stopAnimation = () => {
  animationRunning = false;
  cancelAnimationFrame(animationFrameId);
};

const closeAnimation = async () => {
  closed = true;
  stopAnimation();
  startBtn.style.display = 'inline-block';
  reloadBtn.style.display = 'none';
  closeBtn.style.display = 'none';
  animZone.style.display = 'none';

  const localStorageData = JSON.parse(localStorage.getItem(localStorageKey)) || [];
  const localStorageTable = document.getElementById("local-storage-data");
  localStorageData.forEach((event) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>LocalStorage</td><td>${event.id}</td><td>${event.time}</td><td>${event.message}</td>`;
      localStorageTable.appendChild(row);
  });

  const response = await fetch("events.json", { method: 'GET' });
  const serverEvents = await response.json();
  const serverTable = document.getElementById("server-data");
  serverEvents.forEach((event) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>Server</td><td>${event.id}</td><td>${event.time}</td><td>${event.message}</td>`;
      serverTable.appendChild(row);
  });
};

const clearServerData = async () => {
  console.log('Очищення серверних даних...');
  fetch(serverUrl, {
      method: 'DELETE',
      headers: { "Content-Type": "application/json" }
  });
};

startBtn.addEventListener("click", startAnimation);
reloadBtn.addEventListener("click", reloadAnimation);
closeBtn.addEventListener("click", closeAnimation);

createCircle("blue", true);
createCircle("orange", false);
clearServerData();
localStorage.clear();
console.log('Local Storage cleared');