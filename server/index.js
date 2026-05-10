const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors({
  origin: "*",
}));

app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", ({ username, room }) => {
    socket.join(room);

    socket.to(room).emit("user_joined", {
      username,
    });
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected ✅");

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB error ❌", err);
  });