import http from "./httpService";

export async function getAllUsers() {
    // get and return a movie by id from our server
    const response = http.get(`/users/admin`);
    return response;
  }

  export async function deleteUser(userId) {
    // get and return a movie by id from our server
    const response = http.get(`/users/admin/${userId}`);
    return response;
  }
  export const editUserByAdmin = async (profileId,firstName, lastName, age , phone , email , city , role , profilePicture) => {
    const response = await http.put(`/users/admin/${profileId}`, { firstName, lastName, age , phone , email , city , role , profilePicture });
    return response.data;
  };