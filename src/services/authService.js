import http from './httpService';
import Cookies from 'js-cookie';

export const signIn = async (email, password) => {
  const response = await http.post('/auth/signin', { email, password });
  return response.data;
};

export const signOut = async () => {
  Cookies.remove('token');
};

export const signUp = async (firstName, lastName, password, age , phone , email , city , role , profilePicture) => {
  const response = await http.post('/auth/signup', { firstName, lastName, password, age , phone , email , city , role , profilePicture });
  return response.data;
};

