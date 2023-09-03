import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import EditProfilePage from "../pages/EditProfilePage";
import GetTrainersPage from "../pages/GetTrainersPage";
import CreateTrainingRequestPage from "../pages/CreateTrainingRequestPage";
import WatchMyTrainingsPage from "../pages/WatchMyTrainingsPage";
import SearchSpecialityPage from "../pages/SearchSpecialityPage";
import EditSpecialityPage from "../pages/EditSpecialityPage";
import WatchTrainingRequestPage from "../pages/WatchTrainingRequestPage";
import AdminPage from "../pages/AdminPage";
import AdminEditPage from "../pages/AdminEditPage";
import CreateUserByAdminPage from "../pages/CreateUserByAdminPage";
import AboutPage from "../pages/AboutPage";
import Error404Page from "../pages/Error404Page";


export default function Main() {
  const location = useLocation();
  const isSignInRoute = location.pathname === "/";

  return (
    <div className="Main">
      {!isSignInRoute && <Header />}

      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* user routs */}
        <Route path="/user/editProfile" element={<EditProfilePage />} />
        <Route path="/user/TrainerList" element={<GetTrainersPage />} />
        <Route path="/user/createTrainingRequest/:trainerId" element={<CreateTrainingRequestPage />} />
        <Route path="/user/watchMyTrainings" element={<WatchMyTrainingsPage/>} />
        <Route path="/user/trainer/search" element={<SearchSpecialityPage />} />
        {/* trainer routs */}
        <Route path="/insert/speciality" element={<EditSpecialityPage />} />
        <Route path="/trainer/watchTrainingRequest" element={<WatchTrainingRequestPage />} />
        {/* admin routs */}
        <Route path="/users/admin/:id" element={<AdminEditPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/createuser" element={<CreateUserByAdminPage />} />
        <Route path="*" element={<Error404Page />} />

      </Routes>

      {!isSignInRoute && <Footer />}
    </div>
  );
}
