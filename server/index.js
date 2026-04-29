const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

// 👉 Import routes
const authRoutes = require("./routes/auth");

const app = express();

// 🔥 MONGODB CONNECTION (VERY IMPORTANT)
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB error ❌", err));

// 🔥 MIDDLEWARE
app.use(cors({ origin: "*" }));
app.use(express.json());

// 🔥 ROUTES
app.use("/auth", authRoutes);

// 👉 Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const server = http.createServer(app);

// 🔥 SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Store users
let users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room
  socket.on("join_room", ({ username, room }) => {
    socket.join(room);
    users[socket.id] = { username, room };

    socket.to(room).emit("user_joined", { username });
  });

  // Send message
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  // Typing
  socket.on("typing", ({ username, room }) => {
    socket.to(room).emit("typing", username);
  });

  socket.on("stop_typing", ({ room }) => {
    socket.to(room).emit("stop_typing");
  });

  // Disconnect
  socket.on("disconnect", () => {
    const user = users[socket.id];

    if (user) {
      socket.to(user.room).emit("user_left", {
        username: user.username,
      });

      delete users[socket.id];
    }

    console.log("User disconnected:", socket.id);
  });
});

// 🔥 PORT (Render compatible)
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});