// Imports
const socketio = require("socket.io");
const http = require("http");
const express = require("express");

// Constructors and shit
const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.set("view engine", "ejs");

// Game src
var gamedata = new Set();
io.on("connection", async (socket) => {
  var username;
  var usercode;
  socket.on("joingame", async (json) => {
    username = json.username;
  });
  socket.on("hostgame", () => {
    let gamecode = createGameCode().toString();
    gamedata.add(gamecode);
    console.log("A new game has been created with the code " + gamecode);
    usercode = gamecode;
    socket.emit("createdgame", { code: gamecode });
  });
  socket.on("disconnect", () => {
    if (username) {
      io.emit("playerleave", { username: username });
    }
    if (usercode) {
      io.emit("gameclosed", { code: usercode });
      console.log(
        "The game " + usercode + " has been closed due to the host leaving"
      );
      gamedata.delete(usercode);
    }
  });
  socket.on("joingame", (json) => {
    if (!gamedata.has(json.code)) return socket.emit("invalidcode");
    io.emit("playerjoingame", json);
    socket.emit("connectsucessfully");
    console.log(
      "A player named " + json.username + " has joined the lobby " + json.code
    );
  });
});

function createGameCode() {
  let code = getRandomInt(1000, 9999);
  if (gamedata.has(code)) return createGameCode();
  else return code;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Page render
app.get(["/", "/styles.css", "/host", "/about", "/shit.css", "/gamescripts/*"], async (req, res) => {
  if (req.path === "/") return res.render("./home.ejs");
  if (req.path === "/host") return res.render("./host.ejs");
  if (req.path === "/about") return res.render("./about.ejs");
  if (req.path.includes("."))
    if (require("fs").existsSync("./views" + req.path))
      return res.sendFile(__dirname + "/views" + req.path);
    else res.render("./404.ejs");
});

// Init server
server.listen(3000, () => {
  console.log("Starting server");
  console.log("Created by Blocks_n_more");
});
app.use(function (req, res) {
  res.status(404).render("./404");
});
("LapQuip!")