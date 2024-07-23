import { Container, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { createUserInFirebase } from '../utils/firebaseAuthUtils.js'
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { createUserInDatabase } from '../utils/userUtils'
import { useAuth } from "../contexts/authContext/authContext.js";

export function SignUp(){
    const { userLoggedIn } = useAuth();
    const [formData, setFormData] = useState({
        email : "",
        role : "club",
        firebase_uid : "",
        password : "",
        confirmPassword : "",
    });
    
    const navigate = useNavigate();

    useEffect(() => {
        if (userLoggedIn) {
          navigate('/');
        }
      }, [userLoggedIn, navigate]);

    const onSubmit = async () => {
        const { email, password, confirmPassword } = formData;  
        
        try {
            if(password === confirmPassword){
                const newUser = await createUserInFirebase(email, password, '/', navigate);
                
                const updatedFormData = {
                    ...formData,
                    firebase_uid : newUser.uid,
                };

                await createUserInDatabase(updatedFormData);

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
            </Container>
        </>
    );
}