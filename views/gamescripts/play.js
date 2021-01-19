// Init stuff
var socket = io();
var code;

// Functions
function getElm(id) {
  return document.getElementById(id);
}

function joingame() {
  getElm("directions").innerHTML = "Connecting to game!";
  socket.emit("joingame", {
    username: getElm("submitusername").value,
    code: getElm("submitcode").value,
  });
}

function shitshow() {
  let dark = getElm("dark");
  if (dark.disabled) {
    dark.disabled = false;
  } else {
    dark.disabled = true;
  }
}

function directions(text) {
  getElm("directions").innerHTML = text;
}

// Socket game code
socket.on("connectsucessfully", () => {
  directions("Connected! Wait for the game to start");
  code = getElm("submitcode").value;
  getElm("submitname").style.display = "none";
  getElm("submitcode").style.display = "none";
  getElm("submitusername").style.display = "none";
});

socket.on("invalidcode", () => {
  directions("Invalid code provided! The game might have ended");
});

socket.on("gameclosed", (json) => {
  if (code !== json.code) return;
  directions("Game closed by host! <br>Type a code and username");
  getElm("submitname").style.display = "";
  getElm("submitcode").style.display = "";
  getElm("submitusername").style.display = "";
});

socket.on("gamestart", (json) => {
  if (code !== json.code) return;
  directions("Look at the hosts screen!");
});

socket.on("question", (json) => {
  if (code !== json.code) return;
  directions("Respond to the question!<br>" + json.question);
});
