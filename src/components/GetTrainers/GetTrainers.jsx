
import React, { useEffect, useState } from 'react'
import { getAllTrainers } from '../../services/TrainingRequestService';
import { Link } from 'react-router-dom';

export default function AllTrainers() {

  const [trainers,setTrainers] = useState(null);

  useEffect(() => {
    const fetchAllTrainers = async () => {
      const response = await getAllTrainers();
      const trainersArray = response.data.data;
      setTrainers(trainersArray);
    };
    fetchAllTrainers();
  },[])

  
  return (
    <div className='AllTrainers'>
    {!trainers ? (
      <div>Loading profile data, Please wait...</div>
    ) : <React.Fragment>
      <ul>
        {trainers.map((trainer) => (
          <div key={trainer._id}>
            <div>Name: {trainer.trainer.firstName} {trainer.trainer.lastName}</div>
            <div>Specialties:
              {trainer.specialties.map((specialty, index) => (
                <p key={index}>{specialty}</p>
              ))}</div>
            <div>Age: {trainer.trainer.age}</div>
            <div>Phone: {trainer.trainer.phone}</div>
            <div>City: {trainer.trainer.city}</div>
            <br/>
              <Link key={trainer} to={`/trainingRequest/trainee/${trainer.trainer.id}`}>
              <button>Set a training session</button>
              </Link>
          </div>
        ))}
      </ul>
      </React.Fragment>
    }
  </div>
);
}