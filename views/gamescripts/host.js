// Init stuff
const playersrequired = 0; // For debugging purposes, DO NOT MODIFY
var socket = io();
var code = -1;
var players = [];
var playersfinished = [];
var responses = [];
getElm("connectedplayers").style.display = "none";
getElm("startgame").style.display = "none";

// Functions for tools and stuff
function getElm(id) {
  return document.getElementById(id);
}

function updatePlayers() {
  let playerlist = "";
  players.forEach((p) => {
    playerlist += p + "<br>";
  });
  getElm("players").innerHTML = playerlist;
  if (players.length > playersrequired) getElm("startgame").style.display = "";
  else getElm("startgame").style.display = "none";
  if (players.length === playersfinished.length) showresponses();
}

function shitshow() {
  let dark = getElm("dark");
  if (dark.disabled) {
    dark.disabled = false;
  } else {
    dark.disabled = true;
  }
}

function showresponses() {}

function startgame() {
  if (players.length < playersrequired + 1) return;
  socket.emit("gamestart");
  getElm("directions").innerHTML =
    "Players will be given wacky prompts they respond to,<br>Once everyone is finished voting will begin for which is better!";
  getElm("players").style.display = "none";
  getElm("startgame").style.display = "none";
  getElm("connectedplayers").style.display = "none";
  setTimeout(function () {
    getElm("directions").innerHTML =
      "Players! Respond to the prompt provided on your device!";
    socket.emit("announceprompt");
  }, 5000);
}

function hostgame() {
  getElm("directions").innerHTML = "Connecting to server!";
  getElm("host").style.display = "none";
  setTimeout(function () {
    socket.emit("hostgame");
  }, 200 +
    Math.random() * (Math.random() * Math.random() * (200 * Math.random())));
}

// Socket game code
socket.on("phrasegenerated", (json) => {
  console.log("phrase received, ");
  console.log(json);
  socket.emit("broadcastmsg", {
    bcname: "prompt",
    prompt: json.phrase,
    code: code,
  });
});

socket.on("prompt", (json) => {
  if (json.code !== code) return;
  playersfinished.push(json.username);
  responses.push({ author: json.username, prompt: json.prompt });
  updatePlayers();
});

socket.on("createdgame", (json) => {
  code = json.code;
  getElm("connectedplayers").style.display = "";
  getElm("directions").innerHTML =
    "Players! Join up at <code>" +
    location.hostname +
    "/join/" +
    code +
    "</code><br>or type in the code <strong>" +
    code +
    "</strong> at <code>" +
    location.hostname +
    "</strong>";
});

socket.on("playerjoingame", (json) => {
  if (json.code !== code) return;
  players.push(json.username);
  updatePlayers();
});

socket.on("playerleave", (json) => {
  if (playersfinished.indexOf(json.username) > -1) {
    playersfinished.splice(playersfinished.indexOf(json.username), 1);
  }
  if (players.indexOf(json.username) > -1) {
    players.splice(players.indexOf(json.username), 1);
  }
  let authors = [];
  responses.forEach(r =>{
    authors.push(r.author);
  });
  
  updatePlayers();
});
