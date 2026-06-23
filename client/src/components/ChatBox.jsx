import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import socket from "../socket";
import "./ChatBox.css";

function ChatBox({ selectedUser, conversation }) {

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [typing, setTyping] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const bottomRef = useRef(null);

    useEffect(() => {

        const loadChat = async () => {

            if (conversation) {

                await fetchMessages();

                try {

                    await api.put(
                        `/messages/seen/${conversation._id}`
                    );

                    await fetchMessages();

                } catch (error) {

                    console.log(error);

                }

            }

        };

        loadChat();

    }, [conversation]);

    useEffect(() => {

        socket.on("receiveMessage", (message) => {

            if (message.conversationId === conversation?._id) {

                setMessages((prev) => [...prev, message]);

            }

        });

        socket.on("typing", () => {

            setTyping(true);

        });

        socket.on("stopTyping", () => {

            setTyping(false);

        });

        return () => {

            socket.off("receiveMessage");
            socket.off("typing");
            socket.off("stopTyping");

        };

    }, [conversation]);

    useEffect(() => {

        bottomRef.current?.scrollIntoView({

            behavior: "smooth"

        });

    }, [messages, typing]);

    const fetchMessages = async () => {

        if (!conversation) return;

        try {

            const res = await api.get(

                `/messages/${conversation._id}`

            );

            setMessages(res.data);

        } catch (error) {

            console.log(error);

        }

    };

    const sendMessage = () => {

        if (!text.trim()) return;

        socket.emit("sendMessage", {

            conversationId: conversation._id,

            senderId: currentUser.id,

            receiverId: selectedUser._id,

            text

        });

        socket.emit("stopTyping", {

            senderId: currentUser.id,

            receiverId: selectedUser._id

        });

        setText("");

    };

    const handleTyping = (e) => {

        setText(e.target.value);

        if (e.target.value.trim()) {

            socket.emit("typing", {

                senderId: currentUser.id,

                receiverId: selectedUser._id

            });

        } else {

            socket.emit("stopTyping", {

                senderId: currentUser.id,

                receiverId: selectedUser._id

            });

        }

    };

    if (!selectedUser) {

        return (

            <div className="chat-box">

                <div className="no-chat">

                    <h2>Select a user to start chatting</h2>

                </div>

            </div>

        );

    }

    return (

        <div className="chat-box">

            <div className="chat-header">

                <h2>{selectedUser.name}</h2>

            </div>

            <div className="chat-messages">

                {

                    messages.map((msg) => (

                        <div

                            key={msg._id}

                            className={

                                msg.sender?.toString() === currentUser.id

                                    ? "message sent"

                                    : "message received"

                            }

                        >

                            <div>

                                <div>

                                    {msg.text}

                                </div>

                                {

                                    msg.sender?.toString() === currentUser.id && (

                                        <small>

                                            {

                                                msg.seen

                                                    ? "✓✓"

                                                    : "✓"

                                            }

                                        </small>

                                    )

                                }

                            </div>

                        </div>

                    ))

                }

                {

                    typing && (

                        <p className="typing">

                            {selectedUser.name} is typing...

                        </p>

                    )

                }

                <div ref={bottomRef}></div>

            </div>

            <div className="chat-input">

                <input

                    type="text"

                    placeholder="Type a message..."

                    value={text}

                    onChange={handleTyping}

                    onKeyDown={(e) => {

                        if (e.key === "Enter") {

                            sendMessage();

                        }

                    }}

                />

                <button onClick={sendMessage}>

                    Send

                </button>

            </div>

        </div>

    );

}

export default ChatBox;