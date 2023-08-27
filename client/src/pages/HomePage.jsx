import './Page.css';
import { useContext } from 'react';
import { AuthContext } from '../context/authContex';

export default function HomePage() {
  const { userData } = useContext(AuthContext);
  console.log(userData);

  return (
    <div className="Main">
      <main>
        <section className="hero">
          <img src="./homecove.jpg" alt="Fitness" className="hero-image" />
          <img src={userData.profilePicture} alt='profilepic' />
          <h1>Welcome {userData.firstName} to Trainers and Trainees App</h1>
          <p>Connect with trainers and kick-start your fitness journey.</p>
        </section>
        <section className="features">
          {userData && userData.role === 'user' && (
            <div className="feature">
              <p>Find the perfect trainer to guide you on your fitness goals.</p>
              <p>Schedule training sessions with your chosen trainers.</p>
            </div>
          )}
          {userData && userData.role === 'trainer' && (
            <div className="feature">
              <p>Showcase your expertise and connect with trainees.</p>
              <p>Offer personalized training sessions to trainees.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
