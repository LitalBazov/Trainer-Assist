import React, { useEffect, useState, useContext } from 'react';
import { getTrainerTrainingsList, getTrainerByID, changeStatusTrainingRequest, getTrainerTrainingListByStatus } from '../../services/TrainingRequestService';
import { getProfilebyID } from '../../services/profileService';
import { AuthContext } from '../../context/authContex';
import { Link } from 'react-router-dom';

export default function WatchTrainingReqest() {
  const { userData } = useContext(AuthContext);
  const [training, setTraining] = useState(null);
  const [traineeDetailsMap, setTraineeDetailsMap] = useState({});
  const [traineeDetailsLoading, setTraineeDetailsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const fetchTrainerTrainings = async () => {
      try {
        if (userData && userData.id) {
          const trainerIdpro = await getTrainerByID(userData.id);
          const trainerIdz = trainerIdpro.data.trainer._id;
          const response = await getTrainerTrainingsList(trainerIdz);
          const trainersArray = response.data.data;
          setTraining(trainersArray);
        }
      } catch (error) {
        console.error('Error fetching trainer trainings:', error);
      }
    };

    fetchTrainerTrainings();
  }, [userData]);

  useEffect(() => {
    const fetchTraineeDetails = async (traineeId) => {
      try {
        const response = await getProfilebyID(traineeId);
        const traineeDetails = response.data; 
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
    const newSelectedStatus = event.target.value;
    setSelectedStatus(newSelectedStatus);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      if (userData && userData.id) {
        try {
          const trainerIdpro = await getTrainerByID(userData.id);
          const trainerIdz = trainerIdpro.data.trainer._id;
  
          if (selectedStatus === '') {
            const response = await getTrainerTrainingsList(trainerIdz);
            const trainersArray = response.data.data;
            setTraining(trainersArray);
          } else {
            try {
              const response = await getTrainerTrainingListByStatus(trainerIdz, selectedStatus);
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
        } catch (error) {
          console.error('Error fetching trainer ID:', error);
        }
      }
    };
  
    fetchData(); // Call the asynchronous function immediately
  }, [selectedStatus, userData]);
  

  return (
    <div className='container mt-4'>
      {!userData ? (
        <div className='alert alert-danger'>
          The connection has been disconnected. Please{' '}
          <Link to="/">
            <button className="btn btn-primary">Sign in</button>
          </Link>
        </div>
      ) : (
        <div className='card p-4'>
          <div className='mb-4'>
            <label htmlFor='status'>Select Status:</label>
            <select
              className='form-control'
              id='status'
              value={selectedStatus}
              onChange={handleStatusSelect}
            >
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
                  <table className='table table-striped'>
                    <thead>
                      <tr>
                        <th>Trainee</th>
                        <th>Date and Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {training.map(train => {
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
                              <button className='btn btn-success' onClick={() => handleStatusChange(train._id, 'approved')}>
                                Approve
                              </button>
                              <button className='btn btn-danger' onClick={() => handleStatusChange(train._id, 'disapproved')}>
                                Disapprove
                              </button>
                              <button className='btn btn-warning' onClick={() => handleStatusChange(train._id, 'pending')}>
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
      )}
    </div>
  );
}