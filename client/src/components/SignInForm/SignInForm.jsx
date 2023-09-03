import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/authContex";
import { Link, useNavigate } from "react-router-dom";
import "./SignInForm.css";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      console.log("User signed in");
      navigate("/home");
    } catch (error) {
      console.error("Error signing in:", error);
      if (error.response && error.response.status === 401) {
        // Handle invalid email or password error
        alert("Invalid email or password");
      } else if (error.response && error.response.status === 500) {
        console.log("Server error");
        // Handle server error, show an appropriate message to the user
      } else {
        console.log("Unknown error");
        // Handle other errors with a different status code
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSignIn}>
        <img src="/mypics/logosign.png" alt="logo" className="logo" />
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </div>
        <div className="form-group">
          <p>Don't have an account?</p>
          <Link to="/signup" className="link">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
