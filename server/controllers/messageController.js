const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const sendMessage = async (req, res) => {

    try {

        const {
            conversationId,
            receiverId,
            text
        } = req.body;

        const senderId = req.user.id;

        const message = await Message.create({

            conversationId,
            sender: senderId,
            receiver: receiverId,
            text

        });

        await Conversation.findByIdAndUpdate(
            conversationId,
            {
                lastMessage: text,
                lastMessageTime: new Date()
            }
        );

        res.status(201).json(message);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const getMessages = async (req, res) => {

    try {

        const messages = await Message.find({

            conversationId: req.params.conversationId

        }).sort({

            createdAt: 1

        });

        res.status(200).json(messages);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const markSeen = async (req, res) => {

    try {

        await Message.updateMany(

            {

                conversationId: req.params.id,

                receiver: req.user.id

            },

            {

                seen: true

            }

        );

        res.status(200).json({

            message: "Seen Updated"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    sendMessage,

    getMessages,

    markSeen

};