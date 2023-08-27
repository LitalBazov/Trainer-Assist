import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Profile from "../pages/Profile";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import HomePage from "../pages/HomePage";
import EditProfile from "../pages/EditProfile";
import TrainingRequest from "../pages/TrainingRequest";
import TrainingSession from "../pages/TrainingSession";
import WatchTrainingRequest from "../pages/WatchTrainingRequest";
import AdminPage from "../pages/AdminPage";
import SpeciallityPage from "../pages/SpeciallityPage";
import EditSpecialty from "../pages/EditSpecialty"; 
import TrainingSessionsTrainee from "../pages/TrainingSessionsTrainee"
import AdminEditPage from "../pages/AdminEditPage"

export default function Main() {
  const location = useLocation();
  const isSignInRoute = location.pathname === "/";

  return (
    <div className="Main">
      {!isSignInRoute && <Header />}

      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user/edit" element={<EditProfile />} />
        <Route path="watchTrainingRequest" element={<WatchTrainingRequest />} />
        <Route path="/trainingRequest/trainee/:trainerId" element={<TrainingSession />} />
        <Route path="/trainingRequest" element={<TrainingRequest />} />
        <Route path="/trainer/search" element={<SpeciallityPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/users/admin/:id" element={<AdminEditPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/TraineeTrainingSession" element={<TrainingSessionsTrainee />} />
        <Route path="/insert/specialty" element={<EditSpecialty />} />
      </Routes>

      {!isSignInRoute && <Footer />}
    </div>
  );
}
