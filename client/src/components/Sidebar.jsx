import { useEffect, useState } from "react";
import api from "../services/api";
import socket from "../socket";
import "./Sidebar.css";

function Sidebar({

    selectedUser,
    setSelectedUser,
    setConversation

}) {

    const [conversations, setConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {

        fetchConversations();

    }, []);

    useEffect(() => {

        socket.on("onlineUsers", (users) => {

            setOnlineUsers(users);

        });

        return () => {

            socket.off("onlineUsers");

        };

    }, []);

    const fetchConversations = async () => {

        try {

            const res = await api.get("/conversations");

            setConversations(res.data);

        } catch (error) {

            console.log(error);

        }

    };

    const openConversation = (conversation) => {

        const currentUser = JSON.parse(
            localStorage.getItem("user")
        );

        const otherUser = conversation.participants.find(

            (user) => user._id !== currentUser.id

        );

        setSelectedUser(otherUser);

        setConversation(conversation);

    };

    return (

        <div className="sidebar">

            <h2>Chats</h2>

            {

                conversations.map((conversation) => {

                    const currentUser = JSON.parse(
                        localStorage.getItem("user")
                    );

                    const user = conversation.participants.find(

                        (u) => u._id !== currentUser.id

                    );

                    if (!user) return null;

                    return (

                        <div

                            key={conversation._id}

                            className={`user-card ${

                                selectedUser?._id === user._id
                                    ? "active"
                                    : ""

                            }`}

                            onClick={() => openConversation(conversation)}

                        >

                            <div className="user-info">

                                <div>

                                    <h4>

                                        {user.name}

                                    </h4>

                                    <p>

                                        {

                                            conversation.lastMessage ||

                                            "Start chatting..."

                                        }

                                    </p>

                                    <small>

                                        {

                                            new Date(

                                                conversation.lastMessageTime

                                            ).toLocaleTimeString([],

                                                {

                                                    hour: "2-digit",

                                                    minute: "2-digit"

                                                }

                                            )

                                        }

                                    </small>

                                </div>

                                <span

                                    className={

                                        onlineUsers.includes(user._id)

                                            ? "status-dot online"

                                            : "status-dot offline"

                                    }

                                ></span>

                            </div>

                        </div>

                    );

                })

            }

        </div>

    );

}

export default Sidebar;