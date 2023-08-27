import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  getTrainerTrainingListBySpeciallity,
  getTrainerByID
} from "../../services/TrainingRequestService"; // Import your service

export default function SearchResultsPage() {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search)
    .get("specialty")
    .trim()
    .toLowerCase(); // Convert to lowercase
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    getTrainerTrainingListBySpeciallity(searchQuery)
      .then((response) => {
        const trainersWithInfoPromises = response.data.map((trainer) => {
          return getTrainerByID(trainer.trainer)
            .then((trainerInfoResponse) => {
              return { ...trainer, info: trainerInfoResponse.data };
            })
            .catch((error) => {
              console.error("Error fetching trainer info:", error);
              return trainer; // Return the original trainer if fetching info fails
            });
        });

        Promise.all(trainersWithInfoPromises)
          .then((trainersWithInfo) => {
            setSearchResults(trainersWithInfo);
          })
          .catch((error) => {
            console.error("Error fetching trainer info:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
      });
  }, [searchQuery]);

  return (
    <div>
      <h1>Search Results for "{searchQuery}"</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Profile Photo</th>
            <th>Set Training Session</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((result) => (
            <tr key={result.id}>
              <td>
                {result.info && (
                  <>
                    {result.info.trainer.firstName} {result.info.trainer.lastName}
                  </>
                )}
              </td>
              <td>{result.info && result.info.trainer.age}</td>
              <td>{result.info && result.info.trainer.city}</td>
              <td>{result.info && result.info.trainer.phone}</td>
              <td>{result.info && result.info.trainer.email}</td>
              <td>
                {result.info && (
                  <img
                    src={result.info.trainer.profilePhoto}
                    alt={`Profile of ${result.info.trainer.firstName}`}
                    width="50"
                    height="50"
                  />
                )}
              </td>
              <td>
                <Link key={result.info.trainer.id} to={`/trainingRequest/trainee/${result.info.trainer._id}`}>
                  <button>Set a Training Session</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
