var http = require("http");
var express = require("express");
var jade = require("jade");
var uuid = require("node-uuid");
var _ = require("lodash");
var remove = _.remove;
var invoke = _.invoke;
var values = _.values;
var moniker = require("moniker");
var sio = require("socket.io");

var app = express();
var httpServer = http.Server(app);
var io = sio(httpServer);

var Game = function (socket) {
  if (!socket) throw new Error("must provide socket");
  this.id = uuid.v4();
  this.socket = socket;
  this.clientSockets = [];
  this.name = moniker.choose();
  this.url = "/controller/" + this.id;
};

var games = {};

var onServerConnect = function (socket, 

io
.of("/server")
.on("connection", function (socket) {
  var game = new Game(socket);

  games[game.id] = game;

  io
  .of(game.url)
  .on("connection", function (socket, keys) {
    var id = socket.id;

    game.clientSockets.push(socket);
    game.socket.emit("join", id);

    socket.on("disconnect", function () {
      remove(game.clientSockets, socket);
      game.socket.emit("leave", id);
    });

    socket.on("tick", function (keys) {
      var pulse = {
        id: id,
        keys: keys 
      }; 
      game.socket.emit("tick", pulse);
    });
  });

  socket.on("disconnect", function () {
    //need to perhaps broadcast to clients?
    invoke(game.clientSockets, "emit", "game-end");
    delete games[game.id];
  });
});

app.engine("jade", jade.__express);
app.set("view engine", "jade");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/assets"));
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/lobby", function (req, res) {
  res.render("lobby", {games: values(games)});
});

app.get("/controller/:id", function (req, res) {
  res.render("controller");
});

app.get("*", function (req, res) {
  res.redirect("/lobby");
});

httpServer.listen(5000, console.log.bind(console, "connected on 5000"));
