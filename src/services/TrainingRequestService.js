import http from './httpService';

export async function getAllTrainers() {
  const response = http.get(`/trainer/`);
  return response;
}

  export async function SearchTrainerBySpecialty(speciality) {
    const response = http.get(`/search/${speciality}`);
    return response;
  }

  export async function getTrainerByID(trainerId) {
    const response = http.get(`/trainer/gettrainer/${trainerId}`);
    return response;
  }

  export const CreateTrainingSession = async (trainerId,traineeId ,dateTime,status) => {
    const response = await http.post(`/trainingRequest/trainee/${trainerId}`, { traineeId, dateTime, status }, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    return response.data;
  }

  export async function getTrainerTrainingsList(trainerId) {
        const response = http.get(`/trainingRequest/trainer/${trainerId}`);
    return response;
  }

  
  export const changeStatusTrainingRequest = async (reqId, newStatus) => {
    const response = await http.put(`/trainingRequest/trainer/${reqId}`, { newStatus });
    return response.data;
  };

  export const getTrainerTrainingListByStatus = async (trainerId , status) => {
    const response = await http.get (`/trainingRequest/trainer/${trainerId}/${status.trim()}`)
    return response
  }
  export const getTrainerTrainingListBySpeciallity = async (specialty) => {
    const response = await http.get (`/trainer/search`, {params: {specialty}})
    return response
  }


  export async function getTraineeTrainingsList(traineeId) {
    const response = http.get(`/trainingRequest/trainee/${traineeId}`);

return response;
}