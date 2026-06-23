const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    sendMessage,
    getMessages,
    markSeen
} = require("../controllers/messageController");

router.post("/", authMiddleware, sendMessage);

router.get("/:conversationId", authMiddleware, getMessages);

router.put("/seen/:id", authMiddleware, markSeen);

module.exports = router;