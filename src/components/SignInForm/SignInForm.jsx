import "./SignInForm.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContex";
import { useContext } from "react";

export default function SignInForm() {
  const navigate = useNavigate();
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      await signIn(email, password);
      console.log("Authentication successful");
      navigate("/home");
    } catch (error) {
      console.log('handleSignIn error:', error.response.status);
  
      if (error.response && error.response.data && error.response.data.message) {
        const errorMessage = error.response.data.message;
  
        // Check if the error message indicates invalid credentials
        if (errorMessage === 'Invalid email or password') {
          setError('Invalid email or password');
        } else {
          alert(errorMessage);
        }
      } else {
        // Default error handling in case the structure of the error response is different
        alert('Invalid email or password');
      }
  
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={(e) => handleSubmit(e)}>
        <img src="/logosign.png" alt="logo" className="logo" />
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
        {error && <p className="error-message">{error}</p>}
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
