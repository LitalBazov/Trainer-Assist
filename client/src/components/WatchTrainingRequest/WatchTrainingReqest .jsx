import React, { useEffect, useState } from 'react';
import { getTrainerTrainingsList, getTrainerByID, changeStatusTrainingRequest, getTrainerTrainingListByStatus } from '../../services/TrainingRequestService';
import { getProfilebyID } from '../../services/profileService';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

export default function AllTrainers() {
  const tokenCookie = Cookies.get('token');
  const userData = jwtDecode(tokenCookie);
  const [training, setTraining] = useState(null);

  const [traineeDetailsMap, setTraineeDetailsMap] = useState({});
  const [traineeDetailsLoading, setTraineeDetailsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(''); // Default: empty

  useEffect(() => {
    const fetchTrainer = async () => {
      const trainerIdpro = await getTrainerByID(userData.id);
      const trainerIdz = trainerIdpro.data.trainer._id;
      const response = await getTrainerTrainingsList(trainerIdz);
      const trainersArray = response.data.data;
      setTraining(trainersArray);
    };

    fetchTrainer();
  }, []);

  useEffect(() => {
    const fetchTraineeDetails = async (traineeId) => {
      try {
        const response = await getProfilebyID(traineeId);
        const traineeDetails = response.data; // Assuming your API response contains the trainee's details
        setTraineeDetailsMap((prevMap) => ({
          ...prevMap,
          [traineeId]: traineeDetails,
        }));
      } catch (error) {
        console.error('Error fetching trainee details:', error);
      }
    };

    if (training) {
      const traineeIdsToFetch = training
        .filter((train) => !traineeDetailsMap[train.trainee])
        .map((train) => train.trainee);

      if (traineeIdsToFetch.length > 0) {
        Promise.all(traineeIdsToFetch.map(fetchTraineeDetails))
          .then(() => setTraineeDetailsLoading(false))
          .catch((error) => console.error('Error fetching trainee details:', error));
      } else {
        setTraineeDetailsLoading(false);
      }
    }
  }, [training, traineeDetailsMap]);

  const formatDateTime = (dateTime) => {
    const dateObject = new Date(dateTime);
    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = dateObject.getFullYear();
    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours - 3}:${minutes}`;
  };
  
  const handleStatusChange = async (trainingId, newStatus) => {
    try {
      await changeStatusTrainingRequest(trainingId, newStatus);
      // Update the state to reflect the new status
      setTraining((prevTraining) =>
        prevTraining.map((train) =>
          train._id === trainingId ? { ...train, status: newStatus } : train
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  
  const handleStatusSelect = async (event) => {
    const selectedStatus = event.target.value;
    setSelectedStatus(selectedStatus);
  
    const trainerIdpro = await getTrainerByID(userData.id);
    const trainerIdz = trainerIdpro.data.trainer._id;
  
    if (selectedStatus === '') {
      const response = await getTrainerTrainingsList(trainerIdz);
      const trainersArray = response.data.data;
      setTraining(trainersArray);
    } else {
      try {
        const response = await getTrainerTrainingListByStatus(trainerIdz, selectedStatus);  
        console.log(response.data)
        if (response.data.length === 0) {
          // Handle the case where no training requests were found
          setTraining([]);
        } else {
          const filteredTraining = response.data;
          setTraining(filteredTraining);
        }
      } catch (error) {
        console.error('Error fetching training data by status:', error);
      }
    }
  };
  
  
  

  return (
    <div className='AllTrainers'>
      <div className='status-filter'>
        <label htmlFor='status'>Select Status:</label>
        <select id='status' value={selectedStatus} onChange={handleStatusSelect}>
          <option value=''>All</option>
          <option value='approved'>Approved</option>
          <option value='disapproved'>Disapproved</option>
          <option value='pending'>Pending</option>
        </select>
      </div>
      {traineeDetailsLoading ? (
        <div>Loading profile data, Please wait...</div>
      ) : (
        <div>
          {training && Array.isArray(training) ? (
            training.length === 0 ? (
              <div>No training requests found</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Trainee</th>
                    <th>Date and Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {training.map((train) => {
                    const traineeDetails = traineeDetailsMap[train.trainee];
                    if (!traineeDetails) {
                      return null; // Skip rendering until trainee details are fetched
                    }
                    return (
                      <tr key={train._id}>
                        <td>
                          {`${traineeDetails.data.firstName} ${traineeDetails.data.lastName}`}
                        </td>
                        <td>{formatDateTime(train.dateTime)}</td>
                        <td>{train.status}</td>
                        <td>
                          <button onClick={() => handleStatusChange(train._id, 'approved')}>
                            Approve
                          </button>
                          <button onClick={() => handleStatusChange(train._id, 'disapproved')}>
                            Disapprove
                          </button>
                          <button onClick={() => handleStatusChange(train._id, 'pending')}>
                            Pending
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )
          ) : (
            <div>Loading training data...</div>
          )}
        </div>
      )}
    </div>
  );
          }  