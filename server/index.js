const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- AUTH ----------------
app.post("/auth/register", (req, res) => {
  res.json({ msg: "Registered" });
});

app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ error: "Invalid credentials" });
  }

  res.json({ msg: "Login success" });
});

// ---------------- SERVER ----------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// 🧠 STORE USERS
let users = {};

// ---------------- SOCKET ----------------
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // 🔹 JOIN ROOM + USER TRACK
  socket.on("join_room", ({ room, username }) => {
    socket.join(room);

    users[socket.id] = {
      username,
      room,
      online: true,
      lastSeen: null,
    };

    io.to(room).emit("user_status", Object.values(users));
  });

  // 🔹 SEND MESSAGE
  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
  });

  // 🔹 DELIVERED
  socket.on("message_delivered", (data) => {
    io.to(data.room).emit("message_delivered_update", data.id);
  });

  // 🔹 SEEN
  socket.on("message_seen", (data) => {
    io.to(data.room).emit("message_seen_update", data.id);
  });

  // 🔹 TYPING
  socket.on("typing", (data) => {
    socket.to(data.room).emit("show_typing", data);
  });

  socket.on("stop_typing", (data) => {
    socket.to(data.room).emit("hide_typing");
  });

  // 🔹 DISCONNECT → LAST SEEN
  socket.on("disconnect", () => {
    if (users[socket.id]) {
      const user = users[socket.id];

      user.online = false;
      user.lastSeen = new Date().toLocaleTimeString();

      io.to(user.room).emit("user_status", Object.values(users));
    }

    console.log("User Disconnected:", socket.id);
  });
});

// ---------------- START ----------------
server.listen(5000, () => {
  console.log("Server running on port 5000");
});