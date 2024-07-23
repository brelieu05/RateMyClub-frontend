import {
  Flex,
  Button,
  HStack,
} from '@chakra-ui/react'

import { Link, useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../contexts/authContext/authContext';
import { logout } from '../utils/firebaseAuthUtils'
import Search from './Search';

export default function Navbar(){
    const location = useLocation();
    const navigate = useNavigate();
    const { userLoggedIn, userData } = useAuth();

    const handleLogout = () => {
        logout('/', navigate);
        window.location.reload();
    }

    return (
        <>
                <Flex justifyContent='space-between' p='5' mx='5'>
                    <HStack>
                        <Button variant='nav' onClick={() => {
                            navigate('/');
                            window.location.reload();
                        }}>Rate My Club</Button>
                    </HStack>

                    <HStack>
                        {location.pathname !== '/' 
                            && 
                            <Search width={undefined}/>
                        }
                        <Button ><Link to='/Browse'>Browse</Link></Button>
                            { userData?.role === "admin" ? 
                                (<Button variant='nav'><Link to='/Reports'>Reports</Link></Button>) : <></>
                            }
                    {userLoggedIn ? (
                        <HStack>
                            <Button variant='nav' onClick={handleLogout}>
                                <Link to='/'>Logout</Link>
                            </Button>
                        </HStack>
                    ) : (
                        <HStack>
                            {location.pathname !== '/SignUp' && (
                                <Button variant='nav'>
                                    <Link to='/SignUp'>Sign Up</Link>
                                </Button>
                            )}
                            {location.pathname !== '/Login' && (
                                <Button variant='nav'>
                                    <Link to='/Login'>Login</Link>
                                </Button>
                            )}
                        </HStack>
                    )}
                    </HStack>

                    
                </Flex>
                
        </>
    );
}