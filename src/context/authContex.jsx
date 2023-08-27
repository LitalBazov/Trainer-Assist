import { useState, useEffect, createContext } from "react";
import { signIn, signOut, signUp } from '../services/authService';
import { loadUserDataFromCookie } from '../utils/authUtils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      const { userData, isAuthenticated } = await loadUserDataFromCookie();
      setUserData(userData);
      setIsAuthenticated(isAuthenticated);
    };
    initializeUser();
  }, []);

  const handleSignIn = async (email, password) => {
    try {
      const data = await signIn(email, password);
      setUserData(data);
      setIsAuthenticated(true);
     
    } catch (error) {
      throw error
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserData(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.log('handleSignOut error:', error);
      // TODO: Handle errors (display error message to the user)
    }
  };

  const handleSignUp = async (firstname, lastname, password, age , phone , email , city , role , profilePicture) => {
    age = parseInt(age)
    try {
      const data = await signUp(firstname, lastname, password, age , phone , email , city , role , profilePicture);
      setUserData(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.log('handleSignUp error:', error);
      // TODO: Handle errors (display error message to the user)
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        isAuthenticated,
        signIn: handleSignIn,
        signOut: handleSignOut,
        signUp: handleSignUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};