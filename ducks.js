// Dynamically fetch image srcs
const c = document.querySelector(".container");
const duckAssets = 6;
var ducks = [];
for (var i=1;i<=duckAssets; i++) {
  var url = `assets/duck${i}.png`;
  ducks.push(url);
  preloadImage(url)
};

// Preload images
function preloadImage(url) {
  var img = new Image();
  img.src = url;
}

var prevDuckY = window.innerHeight / 2
// Randomly select and position
function createDuck(randX) {
  const duck = document.createElement("img");
  duck.src = ducks[Math.floor(Math.random() * duckAssets)];
  duck.style.position = "absolute";
  duck.style.height = Math.floor(Math.random() * 10) + 100 + "px";
  duck.classList.add("duck");
  c.appendChild(duck);
  duck.style.right = 0 - 299 + "px";

  // Handle click and message opening
  duck.addEventListener("click", function(){
    const msg = document.querySelector(".message");
    const msgClose = document.querySelector(".messageClose");
    msgClose.style.display = "block";
    msg.style.transition = "all 1s ease-in-out 1s";
    msg.style.opacity = 1;
    msg.style.width = "500px";
    message(duck, msg);
    duck.classList.remove("duck");
    duck.classList.add("messageDuck");
    msgClose.addEventListener("click", closeMessage);
  })
  

  // Ensure starting position is not too close to another duck and within bounds
  var startDuckYOffset = ((Math.round(Math.random()) * 2) - 1) * (Math.floor(Math.random() * (window.innerHeight / 2)) + duck.height);
  var startDuckY = prevDuckY + startDuckYOffset;
  if (startDuckY < 0) {
    startDuckY = startDuckY + (window.innerHeight - duck.height);
  };
  if (startDuckY > (window.innerHeight - duck.height)) {
    startDuckY = startDuckY - (window.innerHeight - duck.height);
  };
  prevDuckY = startDuckY;
  duck.style.top = startDuckY + "px";
  // Create random values
  duck.offset = Math.floor(Math.random() * 10) - 5;
  duck.speed = Math.floor(Math.random() * 0.5) + 0.3;
  duck.style.transform = `rotate(${duck.offset}deg)`;
}



// Create message content
function message(duck, msg) {
  // Fetch Activity API
  fetch("https://www.boredapi.com/api/activity")
    .then(response => response.json())
    .then(data => msg.querySelector("p").innerHTML = "\""+data.activity+"!\"");
  // Choose random name
  fetch("names.txt")
    .then(response => response.json())
    .then(data => msg.querySelector("h2").innerHTML = data[Math.floor(Math.random()*data.length)] + " says:")
};

const no = document.querySelector("#no")
no.addEventListener("click", closeMessage)

// Handle message closing
const msg = document.querySelector(".message");
const msgClose = document.querySelector(".messageClose");

function closeMessage() {
  msgClose.removeEventListener("click", closeMessage);
  msg.style.transition = "all 1s ease-in-out 0s";
  msg.style.opacity = 0;
  msg.style.width = 0;
  const msgDuck = document.querySelector(".messageDuck");
  msgDuck.style.transition = "all 1s ease-in-out 1s";
  msgDuck.style.padding = "200px";
  setTimeout(function(){
    msgDuck.remove();
    msgClose.style.display = "none";
  }, 2000)
}

// Create new duck every x milliseconds
createDuck();
const duckTimer = setInterval(function(){
  if (document.visibilityState == "visible") createDuck();
}, 4000);

const update = setInterval(function(){
  var all = c.querySelectorAll(".duck");
  for (var i = 0, x; x = all[i++];) {
    x.style.right = `calc(${x.style.right} + ${x.speed}px)`;
    x.style.top = `calc(${x.style.top} - ${x.offset / 100}px)`;
    if (x.offsetLeft < 0 - x.width) {
      x.remove();
    };
  };
}, 10);

