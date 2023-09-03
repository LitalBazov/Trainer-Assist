import { AuthContext } from '../../context/authContex';

import React, { useState , useContext } from 'react';
import { useNavigate , Link} from 'react-router-dom';
import {createUser} from '../../services/adminService';
import './CreateUserByAdmin.css'

export default function CreateUserByAdmin() {
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const passwordRegex = /^(?=.*\d{4,})(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  const phoneRegex = /^[+]?\d{8,}$/;
  const nameRegex = /^[a-zA-Z\s]+$/;
  const ageRegex = /^\d+$/;
  const cityRegex = /^[a-zA-Z\s'-]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.match(emailRegex)) {
      alert('Please enter a valid email address followed by the "@" symbol, and then the domain name.');
      return;
    }

    if (!password.match(passwordRegex)) {
      alert('Password must contain at least 8 characters including at least 4 numbers and one special character');
      return;
    }

    if (!phone.match(phoneRegex)) {
      alert('Invalid phone number format');
      return;
    }

    if (!firstname.match(nameRegex) || !lastname.match(nameRegex)) {
      alert('First name and last name should contain only letters');
      return;
    }
    if (!age.match(ageRegex) || parseInt(age) < 16) {
      alert('Age should be a positive integer greater than or equal to 16');
      return;
    }
    if (!city.match(cityRegex)) {
      alert('City name should contain only letters, spaces, hyphens, and apostrophes');
      return;
    }

    const profilePicture = profilePictureFile ? URL.createObjectURL(profilePictureFile) : './defaultprofilepic.webp';

    await createUser(firstname, lastname, password, age, phone, email, city, role, profilePicture);
    navigate('/admin');
  };

  return (
    <div className='CreateUser'>
      {!userData ? (
        <div className='NoToken'>
          The connection has been disconnected. Please{' '}
          <Link to="/">
            <button id="signinButton">Sign in</button>
          </Link>
        </div>
      ) : (
        <form className='CreateUserForm' onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor="email">Email </label>
          <input type="text" name='email' onChange={(e) => setEmail(e.target.value)} placeholder='enter your email'/>
  
          <label htmlFor="password">Password </label>
          <input type="password" name='password' onChange={(e) => setPassword(e.target.value)} placeholder='enter your password'/>
  
          <label htmlFor="firstname">First name </label>
          <input type="text" name='firstname' onChange={(e) => setFirstName(e.target.value)} placeholder='enter your name'/>
  
          <label htmlFor="lastname">Last name </label>
          <input type="text" name='lastname' onChange={(e) => setLastName(e.target.value)} placeholder='enter your last name'/>
  
          <label htmlFor="age">Age </label>
          <input type="number" name='age' onChange={(e) => setAge(e.target.value)} placeholder='enter your age'/>
  
          <label htmlFor="phone">Phone </label>
          <input type="text" name='phone' onChange={(e) => setPhone(e.target.value)} placeholder='enter your phone number'/>
  
          <label htmlFor="city">City </label>
          <input type="text" name='city' onChange={(e) => setCity(e.target.value)} placeholder='enter your city'/>
  
          <label htmlFor="options">Select a role: </label>
          <select id="options" name="option" onChange={(e) => setRole(e.target.value)}>
            <option value="">Select</option>
            <option value="user">Trainee</option>
            <option value="trainer">Trainer</option>
          </select>
  
          <label htmlFor="imageUpload">Upload an Image: </label>
          <input type="file" id="imageUpload" name="image" accept="image/*" onChange={(e) => setProfilePictureFile(e.target.files[0])} />
  
          {profilePictureFile && (
            <img src={URL.createObjectURL(profilePictureFile)} alt="Profile" />
          )}
  
          <button type='submit'>Create</button>
        </form>
      )}
    </div>
  );
          }  