import React, { useEffect, useState, useContext } from 'react';
import { getProfilebyID , GetPhoto } from '../../services/profileService';
import { AuthContext } from '../../context/authContex';
import { Link } from 'react-router-dom';
import './profile.css';
import { getTrainerByID } from '../../services/TrainingRequestService';

export default function ProfilePage() {
  const [profile, setProfile] = useState();
  const { userData } = useContext(AuthContext);
  const [trainer, setTrainer] = useState();
  const [profilePicture, setProfilePicture] = useState();

  useEffect(() => {
    if (userData && userData.id) {
      async function fetchProfile() {
        try {
          const response = await getProfilebyID(userData.id);
          const fetchedProfile = response.data.data;
          setProfile(fetchedProfile);

        } catch (error) {
          if (error.response) {
            console.log('We have an error:', error.response.data);
          } else {
            console.log('We have an error:', error.message);
          }
        }
      }

      fetchProfile(); 
    }
  }, [userData]);

  useEffect(() => {
    if (userData && userData.id && (userData.role === 'trainer')) {
      async function fetchTrainer() {
        try {
          const response = await getTrainerByID(userData.id);
          const fetchedTrainer = response.data;
          setTrainer(fetchedTrainer);
        } catch (error) {
          
        }
      }

      fetchTrainer(); 
    }
  }, [userData]);

  return (
    <div className='ProfileDetails'>
      {!userData ? (
        <div className='NoToken'>
          The connection has been disconnected. Please{' '}
          <Link to='/'>
            <button id='signinButton'>Sign in</button>
          </Link>
        </div>
      ) : (
        <div>
          {!profile ? (
            <div>Loading profile data, Please wait...</div>
          ) : (
            <div className='ProfileCard'>
              {profile.profilePicture ? (
                <img src={`/uploads/${profile.profilePicture}`} alt="Profile" />

              ) : (
                <div>No profile picture available</div>
              )}
              <div>Name: {profile.firstName} {profile.lastName}</div>
              <div>Email: {profile.email} </div>
              <div>Age: {profile.age} </div>
              <div>Phone: {profile.phone}</div>
              <div>Role: {profile.role}</div>
              <div>City: {profile.city}</div>
              {profile.role === 'trainer' && trainer && (
                <div>Score: {trainer.averageRating || 'N/A'}</div>
              )}
              <br />
              <Link to='/user/editProfile'><button id='editButton'>Edit</button></Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
