import React, { useEffect, useState, useContext } from 'react';
import { getProfilebyID } from '../../services/profileService';
import { AuthContext } from '../../context/authContex';
import { Link } from 'react-router-dom';
import './profile.css';

export default function ProfilePage() {
    const [profile, setProfile] = useState();
    const { userData } = useContext(AuthContext);

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

            fetchProfile(); // Call fetchProfile only when userData.id is available
        }
    }, [userData]);

    
    return (
        <div className='ProfileDetails'>
            {!profile ? (
                <div>Loading profile data, Please wait...</div>
            ) : (
                <div className='ProfileCard'>
                    {profile.profilePicture ? (
                        <img src={profile.profilePicture} alt="Profile" />
                    ) : (
                        <div>No profile picture available</div>
                    )}
                    <div>Name: {profile.firstName} {profile.lastName}</div>
                    <div>Email: {profile.email} </div>
                    <div>Age: {profile.age} </div>
                    <div>Phone: {profile.phone}</div>
                    <div>Role: {profile.role}</div>
                    <div>City: {profile.city}</div>
                    <br />
                    <Link to="/user/edit"><button id="editButton">Edit</button></Link>
                </div>
            )}
        </div>
    );
}
