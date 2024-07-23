import React, { useState, useEffect, useContext, ReactNode } from 'react';
import { auth } from '../../utils/firebaseAuthUtils';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import firebase from "firebase/app";
import { getUserFromDatabase } from '../../utils/userUtils'

type User = FirebaseUser | null;
type ContextState = { 
  currentUser: User, 
  userLoggedIn: boolean,
  userData: any 
};

const AuthContext = React.createContext<ContextState | undefined>(undefined); 

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
}

interface AuthContextProviderProps {
  children: ReactNode;
}


export default function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [currentUser, setCurrentUser] = useState<User>(null);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData ] = useState(null);

  

  useEffect(() => {
    const fetchUserData = async (firebaseUID: string) => {
        try {
          const user = await getUserFromDatabase(firebaseUID);
          setUserData(user)
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setUserLoggedIn(true);
        await fetchUserData(user.uid);
      } else {
        setCurrentUser(null);
        setUserLoggedIn(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userLoggedIn,
    userData
  };

  if (loading) {
    return <div>Loading...</div>; // or a spinner/loading component
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
