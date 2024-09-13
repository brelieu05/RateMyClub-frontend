import { initializeApp } from "firebase/app"
import { 
    getAuth,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,    
    signInAnonymously,
    EmailAuthProvider,
    linkWithCredential,
    getIdToken,
    User,
    AuthError
} from "firebase/auth";
// import dotenv from 'dotenv';
// dotenv.config(); // Load .env file

//TODO PUT THIS INTO DOTENV
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDING_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 *
 * @param {string} email Email for creating account
 * @param {string} password Password for creating account
 * @param {string} redirect Link to redirect to after successful login
 * @param {hook} navigate useNavigate hook
 */
export const createUserInFirebase = async (email : string, password : string, redirect : string, navigate: (arg0: string) => void) => {
    try {
      const credential = await EmailAuthProvider.credential(email, password);
      
      if(auth.currentUser){
        linkWithCredential(auth.currentUser, credential)
        .then((usercred) => {
          const user = usercred.user;
          console.log("Anonymous account successfully upgraded", user);
        }).catch((error) => {
          console.log("Error upgrading anonymous account", error);
        });
    }

      navigate(redirect);
    } catch (error) {
      console.log(`${(error as AuthError).code}: ${(error as AuthError).message}`);
      throw error;
    }
  };
  
  /**
   *
   * @param {string} email Email for login
   * @param {string} password Password for login
   * @param {string} redirect Link to redirect to after successful login
   * @param {hook} navigate useNavigate hook
   */
  export const logInWithEmailAndPassword = async (email : string, password : string, redirect : string, navigate: (arg0: string) => void) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      navigate(redirect);
      return user.user
    } catch (error : unknown) {
      console.log(`${(error as AuthError).code}: ${(error as AuthError).message}`);
      throw error;
    }
  };

  // export const logInWithGoogle = async (email, password, redirect, navigate) => {
  //   try {
  //     const credential = GoogleAuthProvider.credential(
  //       googleUser.getAuthResponse().id_token);
  //     linkWithCredential(auth.currentUser, credential)
  //     .then((usercred) => {
  //       const user = usercred.user;
  //       console.log("Anonymous account successfully upgraded", user);
  //     }).catch((error) => {
  //       console.log("Error upgrading anonymous account", error);
  //     });

  //     navigate(redirect);
  //   }
  //   catch (err) {
  //     console.log(err);
  //   }
  // }
  
  /**
   * Returns details about the currently logged in user, or null if the user is not logged in.
   * @see https://firebase.google.com/docs/auth/web/manage-users for more info
   * @see https://firebase.google.com/docs/reference/js/auth.user for returned user type properties
   * @returns {null|Object} The logged-in user's details (represented by Firebase object), or null if not logged in
   */
  export const getLoginDetails = async () => {
    // Get current user - https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#currentuser
    const user = auth.currentUser;
  
    if (user !== null) {
      // User will be of type https://firebase.google.com/docs/reference/js/auth.user
      return user;
    }
  
    // No user is logged in
    return null;
  };
  
  /**
   * Logs out the current user, optionally taking a redirect path to redirect to upon successful logout
   * @param {string} redirect Link to redirect to after successful logou
   * @param {hook} navigate useNavigate hook
   * @see https://firebase.google.com/docs/auth/web/password-auth
   */
  export const logout = async (redirect : string, navigate: (arg0: string) => void) => {
    signOut(auth)
      .then(() => {
        navigate(redirect);
      })
      .catch(error => {
        console.log(`${error.code}: ${error.message}`);
      });
  };
  
  export const sendResetPasswordPrompt = async (email : string) => {
    // Success will return null, and falure will raise an error that should
    // be caught by UI layer.
    await sendPasswordResetEmail(auth, email);
  };

  export const anonymousSignIn = async () => {
    try{
      await signInAnonymously(auth);
    }
    catch(error : unknown) {
      console.log(`${(error as AuthError).code}: ${(error as AuthError).message}`);
    }
  }

  export const getIdTokenFromUser = async (user: User) => {
    if (!user) {
      throw new Error("No user is currently signed in.");
    }
  
    const token = await getIdToken(user);
    return token;
  };

  
  export { auth, app };