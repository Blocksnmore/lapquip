// Init stuff
var socket = io();
var code;
getElm("submitresponse").style.display = "none";
getElm("promptresponse").style.display = "none";

// Functions
function getElm(id) {
  return document.getElementById(id);
}

function joingame() {
  getElm("directions").innerHTML = "Connecting to game!";
  setTimeout(function () {
    socket.emit("joingame", {
      username: getElm("submitusername").value,
      code: getElm("submitcode").value,
    });
  }, Math.random() * (Math.random() * Math.random() * (200 * Math.random())));
}

function shitshow() {
  let dark = getElm("dark");
  if (dark.disabled) {
    dark.disabled = false;
  } else {
    dark.disabled = true;
  }
}

function submitresponse() {
  getElm("promptresponse").value = "";
  getElm("promptresponse").style.display = "none";
  getElm("submitresponse").style.display = "none";
  io.emit("userresponse", {
    code: code,
    response: getElm("promptresponse").value,
  });
  directions("Wait for everyone to finish writing their prompts");
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

socket.on("prompt", (json) => {
  if (code !== json.code) return;
  directions("Respond to the prompt<br>" + json.prompt);
  getElm("submitresponse").style.display = "";
  getElm("promptresponse").style.display = "";
});

socket.on("invalidcode", () => {
  directions("Invalid code provided! The game might have ended");
  getElm("submitname").style.display = "";
  getElm("submitcode").style.display = "";
  getElm("submitusername").style.display = "";
});

socket.on("gameclosed", (json) => {
  if (code !== json.code) return;
  directions("Game closed by host! <br>Type a code and username");
  getElm("submitname").style.display = "";
  getElm("submitcode").style.display = "";
  getElm("submitusername").style.display = "";
  getElm("promptresponse").style.display = "none";
  getElm("submitresponse").style.display = "none";
});

socket.on("gamestart", (json) => {
  if (code !== json.code) return;
  directions("Look at the hosts screen!");
});
