import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {loginUser} from "../../redux/apiRequest";
import { useDispatch } from "react-redux";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const newUser = {
            username: username,
            password: password,
        };
        // 
        try {
            const response = await loginUser(newUser, dispatch, navigate);

            if (response && response.role) {
                const { role } = response;

                // Điều hướng dựa trên role
                switch (role) {
                    case "admin":
                        navigate("/admin-dashboard");
                        break;
                    case "player":
                        navigate("/player-dashboard");
                        break;
                    case "sponsor":
                        navigate("/sponsor-dashboard");
                        break;
                    case "organizer":
                        navigate("/organizer-dashboard");
                        break;
                    case "referee":
                        navigate("/referee-dashboard");
                        break;
                    default:
                        navigate("/user-dashboard");
                        break;
                }
            } else {
                alert("Login failed: Unable to determine role.");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed: " + error.message);
        }
    }
    return ( 
        <section className="login-container">
            <div className="login-title"> Log in</div>
            <form onSubmit = {handleLogin}>
                <label>USERNAME</label>
                <input type="text" 
                placeholder="Enter your username" 
                onChange = {(e) => setUsername(e.target.value)}
                />
                <label>PASSWORD</label>
                <input type="password" placeholder="Enter your password"
                onChange = {(e) => setPassword(e.target.value)}
                />
                <button type="submit"> Continue </button>
            </form>
            <div className="login-register"> Don't have an account yet? </div>
            <Link className="login-register-link" to="/register">Register one for free </Link>
        </section>
     );
}
 
export default Login;