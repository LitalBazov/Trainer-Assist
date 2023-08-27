
import React, { useEffect, useState } from "react";
import { getProfilebyID } from "../../services/profileService";
import { Link, useLocation, useParams } from "react-router-dom"; // Use useParams
import {editUserByAdmin} from "../../services/adminService"
export default function AdminEdit() {
  const id  = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const callback = queryParams.get('callback');

  const userId = id.id
  console.log(userId)
  const [profile, setProfile] = useState();
  const [email, setEmail] = useState();
  const [firstname, setFirstName] = useState();
  const [lastname, setLastName] = useState();
  const [age, setAge] = useState();
  const [phone, setPhone] = useState();
  const [city, setCity] = useState();
  const [role, setRole] = useState();
  const [profilePicture, setPicture] = useState(""); // Use an empty string as initial state
  const [password, setPassword] = useState("")
  useEffect(() => {
    if (userId) {
      async function fetchProfile() {
        try {
          const response = await getProfilebyID(userId);
          const fetchedProfile = response.data.data;
          setProfile(fetchedProfile);
          setPassword(fetchedProfile.password);
          setFirstName(fetchedProfile.firstName); // Use fetchedProfile.firstName
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
 console.log(profile)
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
    // Update the state based on the input name
    if (name === "firstName") {
      setFirstName(value);
    }
    if (name === "lastName") {
      setLastName(value);
    }
    if (name === "email") {
      setEmail(value);
    }
    if (name === "age") {
      setAge(value);
    }
    if (name === "phone") {
      setPhone(value);
    }
    if (name === "role") {
      setRole(value);
    }
    if (name === "city") {
      setCity(value);
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
  }
  const handleSaveClick =async () => {
    await editUserByAdmin(
      userId, // Use userId here
      firstname,
      lastname,
      age,
      phone,
      email,
      city,
      role,
      profilePicture
    );
    if (callback && window[callback] && typeof window[callback] === 'function') {
      window[callback]();
    }
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
            <Link to="/admin">
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
