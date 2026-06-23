const Conversation = require("../models/Conversation");

const createConversation = async (req, res) => {

    try {

        const { receiverId } = req.body;

        const senderId = req.user.id;

        let conversation = await Conversation.findOne({

            participants: {
                $all: [senderId, receiverId]
            }

        });

        if (!conversation) {

            conversation = await Conversation.create({

                participants: [
                    senderId,
                    receiverId
                ],

                lastMessage: "",

                lastMessageTime: new Date()

            });

        }

        res.status(200).json(conversation);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const getConversations = async (req, res) => {

    try {

        const conversations = await Conversation.find({

            participants: req.user.id

        })
        .populate("participants", "name email")
        .sort({
            lastMessageTime: -1
        });

        res.status(200).json(conversations);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {

    createConversation,

    getConversations

};