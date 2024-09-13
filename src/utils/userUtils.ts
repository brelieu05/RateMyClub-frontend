import Backend from './utils'
import { auth, getIdTokenFromUser  } from './firebaseAuthUtils';

interface UserFormData {
  email : string;
  role : string;
  firebase_uid : string;
  password : string;
  confirmPassword : string;
}

export const createUserInDatabase = async (formData : UserFormData) => {
    const response = await Backend.post('/user', formData);
    return response.data;
}

export const getUserFromDatabase = async (firebaseUID : string) => {
    const response = await Backend.get(`/user/${firebaseUID}`);
    return response.data;
}

export const apiRequest = async (endpoint: string, method = 'GET', data = null) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No user is currently signed in.");
      }
      
      const token = await getIdTokenFromUser(user);
  
      const response = await Backend({
        url: endpoint,
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        data
      });
      
      return response.data;
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  };