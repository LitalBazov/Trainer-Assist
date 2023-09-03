import React, { useEffect, useState, useContext } from 'react';
import { getAllTrainers , SendRating} from '../../services/TrainingRequestService';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating'; 
import './GetTrainer.css';
import { AuthContext } from '../../context/authContex';

export default function AllTrainers() {
  const [trainers, setTrainers] = useState(null);
  const { userData } = useContext(AuthContext);

  useEffect(() => {
    const fetchAllTrainers = async () => {
      try {
        const response = await getAllTrainers();
        const trainersArray = response.data.data;
        setTrainers(trainersArray);
      } catch (error) {
        console.error('Error fetching trainers:', error);
      }
    };

    if (userData) {
      fetchAllTrainers();
    }
  }, [userData]);

  const handleRatingChange = async (trainerId, ratingValue) => {
    try {
      const response = await SendRating(trainerId, userData.id, ratingValue);
      if (response.status === 201) {
        alert ('saving added sucssesfuly')
      }
    } catch (error) {
      if (error.response.status === 304)
      {
        alert('You have already rated this trainer');

      }
      else{
      console.error('Error:', error);
      alert('An error occurred');
      }
    }
  };
  
  return (
    <div className="AllTrainers">
      {!userData ? (
        <div className='NoToken'>
          The connection has been disconnected. Please{' '}
          <Link to="/">
            <button id="signinButton">Sign in</button>
          </Link>
        </div>
      ) : (
        trainers ? (
          <React.Fragment>
            <ul>
              {trainers.map((trainer) => (
                <div className="trainer-card" key={trainer._id}>
                  <div className="trainer-name">
                    Name: {trainer.trainer.firstName} {trainer.trainer.lastName}
                  </div>
                  <div className="trainer-specialties">
                    Specialties:
                    {trainer.specialties.map((specialty, index) => (
                      <p key={index}>{specialty}</p>
                    ))}
                  </div>
                  <div className="trainer-age">Age: {trainer.trainer.age}</div>
                  <div className="trainer-phone">Phone: {trainer.trainer.phone}</div>
                  <div className="trainer-city">City: {trainer.trainer.city}</div>
                  <div className="trainer-rating">Rating:
                    <StarRating
                      value={trainer.averageRating} 
                      onChange={(ratingValue) =>
                        handleRatingChange(trainer._id, ratingValue)
                      }
                    />
                  </div>
                  <Link
                    key={trainer._id}
                    to={`/user/createTrainingRequest/${trainer.trainer.id}`}
                  >
                    <button className="training-session-button">
                      Set a training session
                    </button>
                  </Link>
                </div>
              ))}
            </ul>
          </React.Fragment>
        ) : (
          <div>Loading profile data, please wait...</div>
        )
      )}
    </div>
  );
}
