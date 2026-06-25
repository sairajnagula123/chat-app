import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await api.post("/auth/login", formData);

            localStorage.setItem("token", res.data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            navigate("/home");

        } catch (error) {

            alert(
                error.response?.data?.message || "Login Failed"
            );

        }

    };

    return (
    <div className="login-container">
        <div className="login-card">
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <button type="submit">
                    Login
                </button>
            </form>

            <Link to="/register">
                Don't have an account?
            </Link>
        </div>
    </div>
);

}

export default Login;