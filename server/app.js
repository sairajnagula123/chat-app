const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/authRoutes");

const userRoutes = require("./routes/userRoutes");

const conversationRoutes = require("./routes/conversationRoutes");

const messageRoutes = require("./routes/messageRoutes");

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/conversations", conversationRoutes);

app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
    res.send("Chat Server Running...");
});

module.exports = app;