var http = require("http");
var express = require("express");
var jade = require("jade");
var uuid = require("node-uuid");
var sio = require("socket.io");

var app = express();
var server = http.Server(app);
var io = sio(server);

var servers = io
  .of("/server")
  .on("connection", function (socket) {
    console.log("server connected");
  });

var controllers = io
  .of("/controller")
  .on("connection", function (socket, keys) {
    var id = socket.id;

    servers.emit("join", id)

    socket.on("disconnect", function () {
      servers.emit("leave", id); 
    });

    socket.on("tick", function (keys) {
      var controllerPulse = {
        id: id,
        keys: keys
      };
      
      servers.emit("tick", {
        id: id,
        keys: keys 
      });
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

app.get("/controller", function (req, res) {
  res.render("controller");
});

server.listen(5000, console.log.bind(console, "connected on 5000"));
