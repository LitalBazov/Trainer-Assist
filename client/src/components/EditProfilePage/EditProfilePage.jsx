import React, { useEffect, useState } from "react";
import { getProfilebyID , editProfile } from "../../services/profileService";
import jwtDecode from "jwt-decode";
import { useContext } from "react";
import { AuthContext } from "../../context/authContex";
import { Link } from "react-router-dom";
import './editProfile.css'

export default function ProfilePage() {
  const [profile, setProfile] = useState();
  const { userData } = useContext(AuthContext);
  const [email, setEmail] = useState();
  const [firstname, setFirstName] = useState();
  const [lastname, setLastName] = useState();
  const [age, setAge] = useState();
  const [phone, setPhone] = useState();
  const [city, setCity] = useState();
  const [role, setRole] = useState();
  const [profilePicture, setPicture] = useState()

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const passwordRegex = /^(?=.*\d{4,})(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  const phoneRegex = /^[+]?\d{8,}$/;
  const nameRegex = /^[a-zA-Z\s]+$/;
  const ageRegex = /^\d+$/;
  const cityRegex = /^[a-zA-Z\s'-]+$/;


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

    // Applying regex validation for specific fields
    if (name === 'firstName' || name === 'lastName' || name === 'city') {
      if (!nameRegex.test(value)) {
        return; // Do not update state if regex validation fails
      }
    }

    if (name === 'age') {
      if (!ageRegex.test(value)) {
        return; // Do not update state if regex validation fails
      }
    }

    if (name === 'phone') {
      if (!phoneRegex.test(value)) {
        return; // Do not update state if regex validation fails
      }
    }

    if (name === 'email') {
      if (!emailRegex.test(value)) {
        return; // Do not update state if regex validation fails
      }
    }


    setEditableProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handlePictureChange = (event) => {
    const profilePictureFile = event.target.files[0];
    setEditableProfile((prevProfile) => ({
      ...prevProfile,
      profilePicture: profilePictureFile,
    }));
  
    const objectURL = URL.createObjectURL(profilePictureFile);
    setPicture(objectURL); // Set the profile picture for display
  };

  const handleSaveClick = () => {
    editProfile(userData.id , firstname, lastname, age , phone , email , city , role , profilePicture)
    setIsEditing(false);
  };

  return (
    <div className="ProfileDetails">
      {!profile ? (
        <div>Loading profile data, Please wait...</div>
      ) : (
        <React.Fragment>
          <form>
          <div>
            <label>Name:</label>
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
          <div>
            <label>Profile Picture:</label>
            {isEditing ? (
            <input
            type="file"
            name="profilePicture"
            onChange={handlePictureChange}
            />
  ) : (
    <img src={profile.profilePicture} alt="Profile" />
  )}
</div>
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
