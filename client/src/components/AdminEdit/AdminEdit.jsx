
import React, { useEffect, useState } from "react";
import { getProfilebyID } from "../../services/profileService";
import { Link, useLocation, useParams } from "react-router-dom";
import {editUserByAdmin} from "../../services/adminService";
import './AdminEdit.css'



export default function AdminEdit() {
  const id  = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const callback = queryParams.get('callback');

  const userId = id.id
  const [profile, setProfile] = useState();
  const [email, setEmail] = useState();
  const [firstname, setFirstName] = useState();
  const [lastname, setLastName] = useState();
  const [age, setAge] = useState();
  const [phone, setPhone] = useState();
  const [city, setCity] = useState();
  const [role, setRole] = useState();
  const [password, setPassword] = useState("")

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneRegex = /^[+]?\d{8,}$/;
  const nameRegex = /^[a-zA-Z\s]+$/;
  const ageRegex = /^\d+$/;

  useEffect(() => {
    if (userId) {
      async function fetchProfile() {
        try {
          const response = await getProfilebyID(userId);
          const fetchedProfile = response.data.data;
          setProfile(fetchedProfile);
          setPassword(fetchedProfile.password);
          setFirstName(fetchedProfile.firstName); 
          setLastName(fetchedProfile.lastName);
          setEmail(fetchedProfile.email);
          setAge(fetchedProfile.age);
          setPhone(fetchedProfile.phone);
          setRole(fetchedProfile.role);
          setCity(fetchedProfile.city);
        } catch (error) {
          if (error.response) {
            console.log("We have an error:", error.response.data);
          } else {
            console.log("We have an error:", error.message);
          }
        }
      }

      fetchProfile();
    }
  }, [userId]);

  const [editableProfile, setEditableProfile] = useState({});
  const [isEditing, setIsEditing] = useState(true);
  useEffect(() => {
    if (profile) {
      setEditableProfile(profile);
    }
  }, [profile]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditableProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
 
    // Applying regex validation for specific fields
    if (name === 'firstName'){ 
       if (!nameRegex.test(value)) {
        alert('First name should contain only letters');
      }
       else{
        setFirstName(value);
       }
      }
  
    if (name === 'lastName') {
      if (!nameRegex.test(value)) {
        alert('First name and should contain only letters');
      }
     else{
      setLastName(value);
     }
    }
  
    if (name === 'city') {
      if (!nameRegex.test(value)) {
        alert('City name should contain only letters, spaces, hyphens, and apostrophes');
      }
     else{
      setCity(value);

      }
    }
  
    if (name === 'age') {
      if (!ageRegex.test(value)){
        alert('Age should be a positive integer greater than or equal to 16');
      }
      else {
      setAge(value);
      }
      };
  
  
    if (name === 'phone') {
      if ( !phoneRegex.test(value)){
        alert('Invalid phone number format');
      }
      else{
      setPhone(value);
      }
    }

    if (name === 'email') {
      if (!emailRegex.test(value)){
        alert('Please enter a valid email address followed by the "@" symbol, and then the domain name.');
      }
      setEmail(value);
    }
   
    if (name === 'role') {
      setRole(value)
    }


    setEditableProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSaveClick =async () => {
    await editUserByAdmin(
      userId,
      firstname,
      lastname,
      age,
      phone,
      email,
      city,
      role,
      
    );
    if (callback && window[callback] && typeof window[callback] === 'function') {
      window[callback]();
    }
    setIsEditing(false);
  };

  return (
    <div className="ProfileDetailsAdmin">
      {!profile ? (
        <div>Loading profile data, Please wait...</div>
      ) : (
        <React.Fragment>
          <form className="formAdmin">
            <div className="input-field">
              <label>Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={editableProfile.firstName}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{profile.firstName}</span>
              )}
            </div>
            <div className="input-field">
              <label>Last Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={editableProfile.lastName}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{profile.lastName}</span>
              )}
            </div>
            <div className="input-field">
              <label>Email:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="email"
                  value={editableProfile.email}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{profile.email}</span>
              )}
            </div>
            <div className="input-field">
              <label>Age:</label>
              {isEditing ? (
                <input
                  type="number"
                  name="age"
                  value={editableProfile.age}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{profile.age}</span>
              )}
            </div>
            <div className="input-field">
              <label>Phone:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={editableProfile.phone}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{profile.phone}</span>
              )}
            </div>
            <div className="input-field">
              <label>Role:</label>
              {isEditing ? (
                 <select id="options" name="option" onChange={(e) => setRole(e.target.value)}>
                 <option value="">Select</option>
                 <option value="user">Trainee</option>
                 <option value="trainer">Trainer</option>
               </select>
              ) : (
                <span>{profile.role}</span>
              )}
            </div>
            <div className="input-field">
              <label>City:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={editableProfile.city}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{profile.city}</span>
              )}
            </div>
            <br />
            {isEditing ? (
              <Link to="/admin">
                <button className="save-button" onClick={handleSaveClick}>
                  Save
                </button>
              </Link>
            ) : (
              <button className="edit-button" onClick={handleEditClick}>
                Edit
              </button>
            )}
          </form>
        </React.Fragment>
      )}
    </div>
  );
}
