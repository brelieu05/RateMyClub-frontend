import { initializeApp } from "firebase/app"
import { 
    createUserWithEmailAndPassword, 
    getAuth,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,    
} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCgvQgTzOAEnRcGLfkFc14brlR0QLIPT-A",
  authDomain: "ratemyclub-b6939.firebaseapp.com",
  projectId: "ratemyclub-b6939",
  storageBucket: "ratemyclub-b6939.appspot.com",
  messagingSenderId: "584298031204",
  appId: "1:584298031204:web:59837e8a0b0b5ab7d79771",
  measurementId: "G-ZR07TVJG5E"
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
export const createUserInFirebase = async (email, password, redirect, navigate) => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      navigate(redirect);
  
      return user.user;
    } catch (error) {
      console.log(`${error.code}: ${error.message}`);
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
  export const logInWithEmailAndPassword = async (email, password, redirect, navigate) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      // navigate(redirect);
      return user.user
    } catch (error) {
      console.log(`${error.code}: ${error.message}`);
      throw error;
    }
  };
  
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
  export const logout = async (redirect, navigate) => {
    signOut(auth)
      .then(() => {
        navigate(redirect);
      })
      .catch(error => {
        console.log(`${error.code}: ${error.message}`);
      });
  };
  
  export const sendResetPasswordPrompt = async email => {
    // Success will return null, and falure will raise an error that should
    // be caught by UI layer.
    await sendPasswordResetEmail(auth, email);
  };

  
  export { auth, app };