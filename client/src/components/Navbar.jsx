import { useNavigate } from "react-router-dom";
import socket from "../socket";
import "./Navbar.css";

function Navbar() {

    const navigate = useNavigate();

    const logout = () => {

        socket.disconnect();

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    };

    return (

        <div className="navbar">

            <h2>Chat App</h2>

            <button onClick={logout}>
                Logout
            </button>

        </div>

    );

}

export default Navbar;