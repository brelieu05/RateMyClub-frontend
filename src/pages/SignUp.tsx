import { Container, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { createUserInFirebase } from '../utils/firebaseAuthUtils.js'
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { createUserInDatabase } from '../utils/userUtils'
import { useAuth } from "../contexts/authContext/authContext.js";
import { auth } from "../utils/firebaseAuthUtils.js";
import { getAuth, GoogleAuthProvider, linkWithCredential, signInWithRedirect  } from "firebase/auth";

interface User {
    email : string;
    role : string;
    firebase_uid : string;
    password : string;
    confirmPassword : string;
}
export default function SignUp(){
    const { userData } = useAuth();
    const [formData, setFormData] = useState<User>({
        email : "",
        role : "club",
        firebase_uid : "",
        password : "",
        confirmPassword : "",
    }); 
    
    const navigate = useNavigate();

    useEffect(() => {
        if (userData) {
          navigate('/');
        }
      }, [userData, navigate]);

    const onSubmit = async () => {
        const { email, password, confirmPassword } = formData;  
        
        try {
            if(password === confirmPassword){
                await createUserInFirebase(email, password, '/', navigate);
                if(auth.currentUser){
                    const updatedFormData = {
                        ...formData,
                        firebase_uid : auth.currentUser.uid,
                    };
                    await createUserInDatabase(updatedFormData);
                }

                
            }
            else{
                console.log("Passwords must match")
            }
        }
        catch (err) {
            console.log(err)
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData({
        ...formData,
            [name]: value
        });
    };

    const googleRedirect = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
    
            // Sign in with Google
            const result = await signInWithRedirect(auth, provider);
            const googleUser = result.user;
            
            // Get the credential from the Google user
            const credential = GoogleAuthProvider.credential(
                googleUser.accessToken
            );
    
            // Link the credential to the currently signed-in anonymous user
            const usercred = await linkWithCredential(auth.currentUser, credential);
            const user = usercred.user;
            console.log("Anonymous account successfully upgraded", user);
        } catch (error) {
            console.error("Error upgrading anonymous account", error);
        }
    };

    return(
        <>
            <Container>
                <FormControl>
                    <FormLabel>Sign Up</FormLabel>
                    <Input placeholder='Email' name='email' value={formData.email} onChange={handleChange}/>

                    <FormLabel>Password</FormLabel>
                    <Input type='password' placeholder='Password' name='password' value={formData.password} onChange={handleChange}/>

                    <FormLabel>Confirm Password</FormLabel>
                    <Input type='password' placeholder='Confirm Password' name='confirmPassword' value={formData.confirmPassword} onChange={handleChange}/>

            <Button type="submit" onClick={onSubmit}> Create Account </Button>
                </FormControl>
                    <Button my='5' onClick={googleRedirect}>Sign Up With Google</Button>
            </Container>
        </>
    );
}