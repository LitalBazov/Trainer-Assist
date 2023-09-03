import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/authContex';
import { uploadProfilePhoto } from '../../services/profileService';
import "./UploadPhoto.css";

export default function UploadPhoto({ selectedImage, setSelectedImage }) {
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const { userData } = useContext(AuthContext);

  useEffect(() => {
  }, [profilePicture]);

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setProfilePicture(selectedImage);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!profilePicture) {
      setUploadMessage('Please select an image to upload.');
      return;
    }

    try {
      const profileId = userData.id;
      const formData = new FormData();
      formData.append('profilePicture', profilePicture);

      await uploadProfilePhoto(profileId, formData);
      setUploadMessage('Profile picture uploaded successfully');
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      setUploadMessage('Failed to upload profile picture. Please try again.');
    }
  };
  return (
    <div className="UploadPhoto">
      <div className="file-input">
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <div className="button-container">
        <button
          type="button"
          onClick={handleSubmit}
          className="upload-button"
        >
          Upload Photo
        </button>
      </div>
      <div className="image-preview">
        {profilePicture && (
          <img src={URL.createObjectURL(profilePicture)} alt="Selected" />
        )}
      </div>
      <div className="upload-message">
        <p>{uploadMessage}</p>
      </div>
    </div>
  );
  
  
}
