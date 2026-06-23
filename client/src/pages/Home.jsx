import { useEffect, useState } from "react";
import "./Home.css";

import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import Navbar from "../components/Navbar";
import socket from "../socket";

function Home() {

    const [selectedUser, setSelectedUser] = useState(null);
    const [conversation, setConversation] = useState(null);

    useEffect(() => {

        const user = JSON.parse(localStorage.getItem("user"));

        if (user) {

            socket.connect();

            socket.emit("join", user.id);

        }

        return () => {

            socket.disconnect();

        };

    }, []);

    return (

        <>

            <Navbar/>

            <div className="home">

            <Sidebar
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                setConversation={setConversation}
            />

            <ChatBox
                selectedUser={selectedUser}
                conversation={conversation}
            />

            </div>

        </>

    );

}

export default Home;