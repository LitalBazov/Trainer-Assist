import React, { useState } from "react";
import { Link, useNavigate ,useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { signOut } from '../../services/authService';
import "./Header.css";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

export default function Header() {
  const tokenCookie = Cookies.get('token');
  let userData = { role: '' };
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location


  if (tokenCookie) {
    userData = jwtDecode(tokenCookie);
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const handleClick = () => {
    if (!tokenCookie) {
      navigate('/');
    }
    closeMobileMenu();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/trainer/search?specialty=${searchQuery}`);
    }
  };

  return (
    <div className={`Header ${mobileMenuOpen ? "open" : ""}`}>
      <div className="Logo">
        <img src="./logo.png" alt="logo" />
      </div>
  
      <div className={`mobileMenuIcon ${mobileMenuOpen ? "open" : ""}`} onClick={toggleMobileMenu}>
        <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
      </div>
  
      <nav className={`navLinks ${mobileMenuOpen ? "open" : ""}`}>
        {tokenCookie && location.pathname !== "/signup" ? (
          <Link to="/home" onClick={handleClick}>Home</Link>
        ) : (
          <Link to="/" onClick={closeMobileMenu}>Home</Link>
        )}
  
        {tokenCookie && userData.role === "trainer" ? (
          <>
            <Link to="/watchTrainingRequest" onClick={handleClick}>Watch Training Request</Link>
            <Link to="/insert/specialty" onClick={handleClick}>Insert Specialty</Link>
          </>
        ) : null}
  
        {tokenCookie && userData.role === "admin" && (
          <Link to="/admin" onClick={handleClick}>Admin Page</Link>
        )}
  
        {tokenCookie && userData.role === "user" && (
          <Link to="/trainingRequest" onClick={handleClick}>Create Training request</Link>
        )}

        
        {tokenCookie && userData.role === "user" && (
          <Link to="/TraineeTrainingSession" onClick={handleClick}>my Trainings</Link>
        )}
 
        {tokenCookie ? (
          <Link to="/profile" onClick={handleClick}>Profile</Link>
        ) : (
          <Link to="/" onClick={handleClick}>Profile</Link>
        )}
  
        {tokenCookie && (
          <button onClick={handleSignOut}>Sign Out</button>
        )}
      </nav>
  
      {tokenCookie && userData.role === "user" && (
        <div className={`searchPanel ${mobileMenuOpen ? "open" : ""}`}>
          <input
            type="text"
            placeholder="Search Trainer by Speciality"
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
          />
          <button onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} />
            Search
          </button>
        </div>
      )}
    </div>
  );
  
  
}
