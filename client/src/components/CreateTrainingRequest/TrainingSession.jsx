import React, { useEffect, useState } from 'react';
import { getTrainerByID , CreateTrainingSession } from '../../services/TrainingRequestService';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';


export default function CreateSession(props) {
  const tokenCookie = Cookies.get('token');
  const userData =  jwtDecode(tokenCookie);
  const navigate = useNavigate();
  const trainerId = props.trainer;
  const [trainer, setTrainer] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [traineeId,setTrainee] = useState('');
  useEffect(() => {
    const fetchTrainer = async (trainerId) => {
      try {
        setTrainee(userData.id)
        const response = await getTrainerByID(trainerId);
        const fetchedTrainer = response.data;
        setTrainer(fetchedTrainer);
      } catch (error) {
        if (error.response) {
          console.log('We have an error:', error.response.data);
        } else {
          console.log('We have an error:', error.message);
        }
      }
    };
    fetchTrainer(trainerId);
  }, [trainerId]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    const datetimeValue =`${selectedDate}T${selectedTime}:00Z`;
    await CreateTrainingSession(trainerId,traineeId,datetimeValue,'pending');
    alert('Successfully added training request!');
    return navigate('/TraineeTrainingSession');

  };

  const roundHours = Array.from({ length: 17 }, (_, index) => index + 6);
  const currentDateTime = new Date();
  currentDateTime.setHours(currentDateTime.getHours() + 3);
  const currentDateString = currentDateTime.toISOString().substr(0, 10); // Format: "YYYY-MM-DD"
  const currentTimeString = currentDateTime.toISOString().substr(11, 5); // Format: "HH:mm"


  return (
    <div className='CreateSession'>
      {trainer ? (
        <div>
          <h2>Schedule a Training Session with {trainer.trainer.firstName} {trainer.trainer.lastName}</h2>
          <form onSubmit={handleSubmit}>
            <label>Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              required
              min={currentDateString} // Set the minimum allowed date
            />
            <br />
            <label>Time:</label>
            <select value={selectedTime} onChange={handleTimeChange} required>
              <option value='' disabled>
                Select a time
              </option>
              {roundHours.map((hour) => {
                const timeString = `${hour.toString().padStart(2, '0')}:00`;
                if (selectedDate === currentDateString && timeString <= currentTimeString) {
                  // Disable times that have already passed today
                  return null;
                }
                return (
                  <option key={timeString} value={timeString}>
                    {timeString}
                  </option>
                );
              })}
            </select>
            <br />
            <button type="submit">Schedule Session</button>
          </form>
        </div>
      ) : (
        <div>Loading trainer data, Please wait...</div>
      )}
    </div>
  );
}
