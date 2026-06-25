require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");

const Message = require("./models/Message");
const Conversation = require("./models/Conversation");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Key -> User ID
// Value -> Socket ID
const onlineUsers = new Map();

io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);

    // ===========================
    // User Joins
    // ===========================
    socket.on("join", (userId) => {

        onlineUsers.set(userId, socket.id);

        console.log("Online Users:");
        console.log(onlineUsers);

        // Send online users to everyone
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));

    });

    // ===========================
    // Send Message
    // ===========================
    socket.on("sendMessage", async (data) => {

        try {

            const {
                conversationId,
                senderId,
                receiverId,
                text
            } = data;

            // Save message
            const message = await Message.create({

                conversationId,
                sender: senderId,
                receiver: receiverId,
                text

            });

            // Update last message
            await Conversation.findByIdAndUpdate(
                conversationId,
                {
                    lastMessage: text,
                    lastMessageTime: new Date()
                }
            );

            // Receiver socket
            const receiverSocketId = onlineUsers.get(receiverId);

            // Send to receiver
            if (receiverSocketId) {

                io.to(receiverSocketId).emit(
                    "receiveMessage",
                    message
                );

            }

            // Send back to sender
            socket.emit("receiveMessage", message);

        } catch (error) {

            console.log(error);

        }

    });

    // Typing
    socket.on("typing", (data) => {

        const receiverSocketId = onlineUsers.get(data.receiverId);

        if (receiverSocketId) {

            io.to(receiverSocketId).emit("typing", {

                senderId: data.senderId

            });

        }

    });

    // Stop Typing
    socket.on("stopTyping", (data) => {

        const receiverSocketId = onlineUsers.get(data.receiverId);

        if (receiverSocketId) {

            io.to(receiverSocketId).emit("stopTyping", {

                senderId: data.senderId

            });

        }

    });

    // ===========================
    // Disconnect
    // ===========================
    socket.on("disconnect", () => {

        for (const [userId, socketId] of onlineUsers.entries()) {

            if (socketId === socket.id) {

                onlineUsers.delete(userId);

                break;

            }

        }

        console.log("User Disconnected:", socket.id);

        console.log("Online Users:");
        console.log(onlineUsers);

        // Update online users for everyone
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));

    });

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});