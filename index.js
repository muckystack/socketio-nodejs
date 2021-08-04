const path = require("path");
const express = require("express");
const app = express();
const socketIO = require("socket.io");

app.set("port", process.env.PORT || 3000);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");

  next();
});

// static files
app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});

// Settings
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// websockets
io.on("connection", (socket) => {
  console.log("New conection", socket.id);

  socket.on("chat:message", (data) => {
    io.sockets.emit("chat:message", data);
  });

  socket.on("chat:typing", (data) => {
    socket.broadcast.emit("chat:typing", data);
  });
});
