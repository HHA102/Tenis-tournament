import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../redux/apiRequest";
import "./register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const newUser = {
      email: email,
      password: password,
      username: username,
    };
    registerUser(newUser, dispatch, navigate);
  };
  return (
    //     <section className="register-container">
    //       <div className="register-title"> Sign up </div>
    //       <form onSubmit={handleRegister}>
    //         <label>EMAIL</label>
    //         <input
    //           type="text"
    //           placeholder="Enter your email"
    //           onChange={(e) => setEmail(e.target.value)}
    //         />
    //         <label>USERNAME</label>
    //         <input
    //           type="text"
    //           placeholder="Enter your username"
    //           onChange={(e) => setUsername(e.target.value)}
    //         />
    //         <label>PASSWORD</label>
    //         <input
    //           type="password"
    //           placeholder="Enter your password"
    //           onChange={(e) => setPassword(e.target.value)}
    //         />
    //         <button type="submit"> Create account </button>
    //       </form>
    //     </section>
    //   );
    // };

    <section className="register-page">
      <div className="register-container">
        <h2 className="register-title">Sign Up</h2>
        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="form-input-register"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="form-input-register"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="form-input-register"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="form-button">
            Create Account
          </button>
        </form>
        <p className="register-footer">
          Already have an account?{" "}
          <a href="/login" className="register-link">
            Log in
          </a>
        </p>
      </div>
    </section>
  );
};

export default Register;
