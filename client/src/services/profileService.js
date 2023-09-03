import http from "./httpService";

export async function getProfilebyID(profileId) {
    const response = http.get(`/users/${profileId}`);
    return response;
  }


  export const editProfile = async (profileId,firstName, lastName, age , phone , email , city , role , profilePicture) => {
    if (role === 'admin'){
      const response = await http.put(`/users/admin/${profileId}`, { firstName, lastName, age , phone , email , city , role , profilePicture });
      return response.data;
    }
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
  
  export const uploadProfilePhoto = async (profileId,formData) => {
    const response = await http.put(`/uploadphoto/user/${profileId}`, formData);
    return response.data;
  };
