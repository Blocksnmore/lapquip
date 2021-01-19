// Init stuff
var socket = io();
var code = -1;
var players = [];
getElm("connectedplayers").style.display = "none";

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
}

function shitshow() {
  let dark = getElm("dark");
  if (dark.disabled) {
    dark.disabled = false;
  } else {
    dark.disabled = true;
  }
}

function hostgame() {
  getElm("directions").innerHTML = "Connecting to server!";
  getElm("host").style.display = "none";
  socket.emit("hostgame");
}

// Socket game code
socket.on("createdgame", (json) => {
  code = json.code;
  getElm("connectedplayers").style.display = "";
  getElm("directions").innerHTML =
    "Players! Join up at <code>"+location.hostname+"</code> with the code <strong>" + code+"</strong>";
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
