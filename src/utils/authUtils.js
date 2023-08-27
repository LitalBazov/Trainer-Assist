// used to retrieve user data from a JWT (JSON Web Token) stored in a cookie. 

import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

export const loadUserDataFromCookie = async () => {
  const tokenCookie = Cookies.get('token');
  if (tokenCookie) {
    const userData = await jwtDecode(tokenCookie);
    return { userData, isAuthenticated: false };
  }
  return { userData: null, isAuthenticated: false };
};