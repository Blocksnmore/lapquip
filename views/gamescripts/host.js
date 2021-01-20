// Init stuff
var socket = io();
var code = -1;
var players = [];
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
  if(players.length > 2) getElm("startgame").style.display = "";
  else getElm("startgame").style.display = "none";
}

function shitshow() {
  let dark = getElm("dark");
  if (dark.disabled) {
    dark.disabled = false;
  } else {
    dark.disabled = true;
  }
}

function startgame(){
  if(players.length < 3) return;
  socket.emit("gamestart")
  getElm("directions").innerHTML = "Players will be given wacky prompts they respond to,<br>Once everyone is finished voting will begin for which is better!";
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
  if (players.indexOf(json.username) > -1) {
    players.splice(players.indexOf(json.username), 1);
  }
  updatePlayers();
});