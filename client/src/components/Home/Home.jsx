import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContex";
import "./Home.css";
import { getProfilebyID } from "../../services/profileService";

export default function Home() {
  const { userData } = useContext(AuthContext);
  const [profile , setProfile] = useState()

  useEffect(() => {
    if (userData && userData.id) {
      async function fetchProfile() {
        try {
          const response = await getProfilebyID(userData.id);
          const fetchedProfile = response.data.data;
          setProfile(fetchedProfile);

        } catch (error) {
          if (error.response) {
          }
        }
      }

      fetchProfile(); 
    }
  }, [userData]);

    return (
    <div className="Home-container">
      {!userData ? (
        <div className="NoToken">
          The connection has been disconnected. Please{" "}
          <Link to="/">
            <button id="signinButton">Sign in</button>
          </Link>
        </div>
      ) : (
        <>
          <main>
            <section className="HomePage-hero">
              <div className="userHeader">
                <h3 className="userName">Welcome {userData.firstName}</h3>
                <div className="profile-pic-container">
                  {profile ? (
                     <img src={`/uploads/${profile.profilePicture}`} alt="Profile" />

                  ) : (
                    <div>No profile picture available</div>
                  )}
                   
                </div>
              </div>
              <div className="coverImg"></div>
              {userData && (
                <div className="HomePage-feature">
                  {userData.role === "user" ? (
                    <>
                      <p>
                        Connect with trainers and kick-start your fitness
                        journey.<br></br>
                        Here we have a list of trainers with their own
                        specialties.<br></br>
                        Find the perfect trainer to guide you on your fitness
                        goals.<br></br>
                        Schedule training sessions with your chosen trainers.
                        <br></br>
                        Trainers will get back to you within 24 hours.
                      </p>
                    </>
                  ) : userData.role === "trainer" ? (
                    <>
                      <p>
                        Here you can appear on our website and be exposed as a
                        trainer to thousands of trainees who want to schedule a
                        training session with you.
                      </p>
                    </>
                  ) : userData.role === "admin" ? (
                    <>
                      <p>Start manage users at your site </p>
                      <p> you can delete and edit and even creat new users</p>
                    </>
                  ) : null}
                </div>
              )}
            </section>
          </main>
        </>
      )}
    </div>
  );
}
