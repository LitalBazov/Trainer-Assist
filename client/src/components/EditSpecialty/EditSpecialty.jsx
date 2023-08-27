import React, { useEffect, useState } from 'react';
import { getTrainerByID } from '../../services/TrainingRequestService';
import { editSpecialty, deleteSpecialty } from '../../services/profileService';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContex';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const [specialties, setSpecialties] = useState([]);
  const [newSpecialty, setNewSpecialty] = useState(''); // Use array format
  const { userData } = useContext(AuthContext);
  const [trainerId, setTrainerId] = useState([]);

  const fetchSpecialties = async () => { // Declare the fetchSpecialties function
    try {
      if (userData && userData.id) {
        const response = await getTrainerByID(userData.id);
        const fetchedSpecialties = response.data.specialties;
        setSpecialties(fetchedSpecialties);
        setTrainerId(response.data._id);
      }
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  useEffect(() => {
    fetchSpecialties(); // Call fetchSpecialties here
  }, [userData]);

  const handleAddSpecialty = async () => {
    if (newSpecialty.trim() === '') {
      return;
    }

    const lowercaseSpecialty = newSpecialty.toLowerCase(); // Convert to lowercase
    try {
      const response = await editSpecialty(trainerId, [lowercaseSpecialty]);
      setNewSpecialty('');
      fetchSpecialties(); // Fetch updated specialties
    } catch (error) {
      console.error('Error adding specialty:', error);
    }
  };

  const handleDeleteSpecialty = async (specialty) => {
    try {
      const response = await deleteSpecialty(trainerId, [specialty]);
      fetchSpecialties(); // Fetch updated specialties
    } catch (error) {
      console.error('Error deleting specialty:', error);
    }
  };

  return (
    <div className='ProfileDetails'>
      {!specialties.length ? (
        <div>Loading profile data, Please wait...</div>
      ) : (
        <div className='ProfileCard'>
          <h2>Specialties:</h2>
          <ul>
            {specialties.map((specialty, index) => (
              <li key={index}>
                {specialty}
                <button onClick={() => handleDeleteSpecialty(specialty)}>Delete</button>
              </li>
            ))}
          </ul>
          <div>
            <input
              type='text'
              placeholder='Type a new specialty'
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
            />
            <button onClick={handleAddSpecialty}>Add Specialty</button>
          </div>
        </div>
      )}
    </div>
  );
}
