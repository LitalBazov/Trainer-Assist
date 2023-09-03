import UploadPhoto from "../UploadPhoto/UploadPhoto";
import React, { useEffect, useState } from "react";
import { getProfilebyID , editProfile } from "../../services/profileService";
import { useContext } from "react";
import { AuthContext } from "../../context/authContex";
import { Link } from "react-router-dom";
import './EditProfile.css'


export default function EditProfile() {
   const [profile, setProfile] = useState();
  const { userData } = useContext(AuthContext);
  const [email, setEmail] = useState();
  const [firstname, setFirstName] = useState();
  const [lastname, setLastName] = useState();
  const [age, setAge] = useState();
  const [phone, setPhone] = useState();
  const [city, setCity] = useState();
  const [role, setRole] = useState();
  //--------------------------------------------------
  
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneRegex = /^[+]?\d{8,}$/;
  const nameRegex = /^[a-zA-Z\s]+$/;
  const ageRegex = /^\d+$/;
  //--------------------------------------------------


  useEffect(() => {
    if (userData && userData.id) {
      async function fetchProfile() {
        try {
          const response = await getProfilebyID(userData.id);
          const fetchedProfile = response.data.data;
          setProfile(fetchedProfile);
          setFirstName(userData.firstName)
          setLastName(userData.lastName)
          setEmail(fetchedProfile.email)
          setAge(userData.age)
          setPhone(userData.phone)
          setRole(userData.role)
          setCity(userData.city)
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
  }, [userData]);
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
  
  };

  const handleSaveClick = () => {
    editProfile(userData.id , firstname, lastname, age , phone , email , city , role )
    setIsEditing(false);
  };

  return (
    <div className="ProfileDetails">
      {!profile ? (
        <div>Loading profile data, Please wait...</div>
      ) : (
        <React.Fragment>
          <form className="formEdit">
          <div>
            <label>Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={editableProfile.firstName || ''}
                onChange={handleInputChange}
              />
            ) : (
              <span>{profile.firstName}</span>
            )}
          </div>
          <div>
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
          <div>
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
          <div>
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
          <div>
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
          <div>
            <label>Role:</label>
            {isEditing ? (
              <input
                type="text"
                name="role"
                value={editableProfile.role}
                onChange={handleInputChange}
              />
            ) : (
              <span>{profile.role}</span>
            )}
          </div>
          <div>
            <label>City:</label>
            {isEditing ? (
              <select id="options" name="option" onChange={(e) => setRole(e.target.value)}>
              <option value="">Select</option>
              <option value="user">Trainee</option>
              <option value="trainer">Trainer</option>
            </select>
            ) : (
              <span>{profile.city}</span>
            )}
          </div>
          
          <UploadPhoto>
           </UploadPhoto>
         
          <br />
          {isEditing ? (
            <Link to="/profile">
            <button id="saveButton" onClick={handleSaveClick}>
              Save
            </button>
            </Link>
          ) : (
            <button id="editButton" onClick={handleEditClick}>
              Edit
            </button>
          )}
          </form>
        </React.Fragment>
      )}
    </div>
  );


          }
