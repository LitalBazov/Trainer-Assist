// About.js
import React from 'react';
import './About.css';

export default function AboutPage() {
  return (
    <div className="About-container">
      <h1 className="title">About Trainer Assist</h1>
      <p className="description">
        Welcome to Trainer Assist, your ultimate platform for connecting fitness enthusiasts with expert trainers.
        Our mission is to make your fitness journey a success by providing you with the tools to achieve your goals.
      </p>
      <h2 className="subtitle">Main Features</h2>
      <ul className="feature-list">
        <li>Sign up as a user or trainer to access personalized fitness services.</li>
        <li>Send training requests to trainers and receive timely responses.</li>
        <li>Edit your profile details and upload a profile picture.</li>
        <li>Trainers can showcase their specialties and expertise on their profiles.</li>
        <li>Discover trainers based on their specialties through our search feature.</li>
      </ul>
      <p className="cta">Join Trainer Assist today and embark on a journey towards a healthier and fitter you!</p>
    </div>
  );
}
