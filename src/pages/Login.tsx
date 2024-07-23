import { Container, FormLabel, Input, FormControl, Button, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logInWithEmailAndPassword } from '../utils/firebaseAuthUtils'
import { useAuth } from "../contexts/authContext/authContext";

export function Login(){
    const { userLoggedIn } = useAuth();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        "email" : "",
        "password" : "",
    });
    const navigate = useNavigate();
    
    const onSubmit = async () => {
        const { email, password} = formData;  
        
        await logInWithEmailAndPassword(email, password, '/', navigate)
            .catch( (err) => (
            setError(err.message)
            )
        );
    
    };

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        
        setFormData({
        ...formData,
            [name]: value
        });
    };
    
    useEffect(() => {
        if (userLoggedIn) {
          navigate('/');
        }
      }, [userLoggedIn, navigate]);

    return(
        <>
            <Container>
                <FormControl>
                    <FormLabel>Sign Up</FormLabel>
                    <Input placeholder='Email' name='email' value={formData.email} onChange={handleChange}/>

                    <FormLabel>Password</FormLabel>
                    <Input type='password'placeholder='Password' name='password' value={formData.password} onChange={handleChange}/>
                    
                    <Button onClick={onSubmit}>Login</Button>
                    <Text color="red">{error}</Text>
                </FormControl>
            </Container>
        </>
    );
}