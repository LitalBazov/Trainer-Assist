import http from "./httpService";

export async function getProfilebyID(profileId) {
    // get and return a movie by id from our server
    const response = http.get(`/users/${profileId}`);
    return response;
  }


  export const editProfile = async (profileId,firstName, lastName, age , phone , email , city , role , profilePicture) => {
    const response = await http.put(`/users/${profileId}`, { firstName, lastName, age , phone , email , city , role , profilePicture });
    return response.data;
  };


  export const editSpecialty = async (trainerId,specialties) => {
    const response = await http.post(`/trainer/${trainerId}`, {specialties });
    return response.data;
  };
  export const deleteSpecialty = async (trainerId, specialty) => {
    const response = await http.delete(`/trainer/${trainerId}`, { data: { specialties: specialty } });
    return response.data;
  };
  