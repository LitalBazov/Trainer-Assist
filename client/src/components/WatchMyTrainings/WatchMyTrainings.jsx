import React, { useEffect, useState , useContext } from 'react';
import { getTraineeTrainingsList } from '../../services/TrainingRequestService';
import { getProfilebyID } from '../../services/profileService';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../../context/authContex';
import { Link } from 'react-router-dom';
import './WatchMyTrainings.css'


export default function TraineeDashboard() {
  const { userData } = useContext(AuthContext);
  const [training, setTraining] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (userData && userData.id) {
      fetchTraineeTrainings(userData.id);
    }
  }, [userData]);

  const fetchTraineeTrainings = async (traineeId) => {
    const response = await getTraineeTrainingsList(traineeId);
    const trainingsArray = response.data.data;

    // Fetch profiles for trainers
    const fetchProfilePromises = trainingsArray.map(async training => {
      const trainerId = training.trainer;
      const trainerProfileResponse = await getProfilebyID(trainerId);
      const trainerProfile = trainerProfileResponse.data; 
      return {
        ...training,
        trainer: {
          ...training.trainer,
          firstName: trainerProfile.data.firstName,
          lastName: trainerProfile.data.lastName
        }
      };
    });

    const updatedTrainingsArray = await Promise.all(fetchProfilePromises);

    setTraining(updatedTrainingsArray);
  };
  
  const formatDateTime = (dateTime) => {
    const dateObject = new Date(dateTime);
    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getFullYear();
    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleStatusSelect = async (event) => {
    const newSelectedStatus = event.target.value;
  setSelectedStatus(newSelectedStatus); 
  const traineeId = userData.id;

  if (newSelectedStatus === '') {
    const response = await getTraineeTrainingsList(traineeId);
    const trainingsArray = response.data.data;
    const fetchProfilePromises = trainingsArray.map(async (training) => {
      const trainerId = training.trainer;
      const trainerProfileResponse = await getProfilebyID(trainerId);
      const trainerProfile = trainerProfileResponse.data; 
      return {
        ...training,
        trainer: {
          ...training.trainer,
          firstName: trainerProfile.data.firstName,
          lastName: trainerProfile.data.lastName,
        },
      };
    });

    const updatedTrainingsArray = await Promise.all(fetchProfilePromises);

    setTraining(updatedTrainingsArray);
  } 
};
  return (
    <div className='container'>
      {!userData ? (
        <div className='NoToken'>
          The connection has been disconnected. Please{' '}
          <Link to="/">
            <button id="signinButton">Sign in</button>
          </Link>
        </div>
      ) : (
        <div className='TraineeDashboard'>
          <div className='status-filter form-group'>
            <label htmlFor='status'>Select Status:</label>
            <select id='status' className='form-control' value={selectedStatus} onChange={handleStatusSelect}>
              <option value=''>All</option>
              <option value='approved'>Approved</option>
              <option value='disapproved'>Disapproved</option>
              <option value='pending'>Pending</option>
            </select>
          </div>
          {training && Array.isArray(training) ? (
            training.length === 0 ? (
              <div className='alert alert-info'>No training requests found</div>
            ) : (
              <table className='table'>
                <thead>
                  <tr>
                    <th>Trainer</th>
                    <th>Date and Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {training
                    .filter(train => selectedStatus === '' || train.status === selectedStatus)
                    .map(train => (
                      <tr key={train._id}>
                        <td>{`${train.trainer.firstName} ${train.trainer.lastName}`}</td>
                        <td>{formatDateTime(train.dateTime)}</td>
                        <td>{train.status}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )
          ) : (
            <div className='alert alert-info'>Loading training data...</div>
          )}

          {selectedStatus && training && !training.some(train => train.status === selectedStatus) && (
            <div className='alert alert-warning'>There are no trainings with this status...</div>
          )}

          {!training && <div className='alert alert-info'>No training requests found</div>}
        </div>
      )}
    </div>
  );
}
