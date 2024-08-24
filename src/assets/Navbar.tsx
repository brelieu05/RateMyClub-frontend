import {
    Flex,
    Button,
    HStack,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Box,
    IconButton,
    VStack
  } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/authContext/authContext';
import { anonymousSignIn } from '../utils/firebaseAuthUtils';
import { logout } from '../utils/firebaseAuthUtils'
import Search from './Search';
import { getIdToken } from 'firebase/auth';
  
  export default function Navbar() {
      const location = useLocation();
      const navigate = useNavigate();
      const { userLoggedIn, userData, currentUser } = useAuth();
      const { isOpen, onOpen, onClose } = useDisclosure();


    useEffect(() => {
        const signIn = async () => {
            await anonymousSignIn();
        };
        if(!userData){
            signIn();
        }
    }, [userData]);


      const handleLogout = () => {
          logout('/', navigate);
          window.location.reload();
      }
  
      return (
          <Box borderBottom='2px' borderColor='#D9D9D9'>
              <Flex justifyContent='space-between' p='5' alignItems='center'>
                  <HStack spacing={{ base: '0', md: '5' }}>
                      <Button variant='nav' as='b' fontSize={{lg:'2xl'}} cursor='pointer' onClick={() => {
                          navigate('/');
                          window.location.reload();
                      }}>RateMyClub</Button>
                  </HStack>
  
                <Flex display={{ base: 'none', md: 'flex' }} gap={4} alignItems='center'>
                    {location.pathname !== '/' && <Search width={'sm'} height='40px' />}
                        <Button variant='none' fontWeight='400' fontSize='16px'>
                            <Link to='/Browse'>Browse</Link>
                        </Button>
                      {userData?.role === "admin" && (
                          <Button variant='nav'><Link to='/Reports'>Reports</Link></Button>
                      )}
                      {!(currentUser?.isAnonymous) ? (
                        <>
                        <Button variant='nav'>
                            <Link to='/'>Account</Link>
                        </Button>
                            <Button variant='nav' onClick={handleLogout}>
                                <Link to='/'>Logout</Link>
                        </Button>
                        </>
                        ) : (
                            <>
                                {location.pathname === '/Login' && (
                                    <Button variant='nav'>
                                        <Link to='/SignUp'>Sign Up</Link>
                                    </Button>
                                )}
                                {location.pathname !== '/Login' && (
                                    <Button variant='nav' backgroundColor='#2C2C2C' color='#F5F5F5' fontSize='16px' fontWeight='400' px='10'>
                                        {/* <Link to='/Login'> */}
                                            Club Owner?
                                        {/* </Link> */}
                                    </Button>
                                )}
                            </>
                        )
                    }
                </Flex>
  
                  <IconButton
                      display={{ base: 'flex', md: 'none' }}
                      icon={<HamburgerIcon />}
                      onClick={onOpen}
                      variant='outline'
                      aria-label='Open Menu'
                  />
  
                  <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
                      <DrawerOverlay />
                      <DrawerContent>
                          <DrawerCloseButton />
                          <DrawerHeader>Menu</DrawerHeader>
                          <DrawerBody>
                              <VStack spacing='24px'>
                                  <Button variant='nav' onClick={() => {
                                      navigate('/');
                                      window.location.reload();
                                  }}>Rate My Club</Button>

                                  {location.pathname !== '/' && <Search width={'250px'} height='50px'/>}

                                  <Button variant='none' fontWeight='400' fontSize='16px'>
                                    <Link to='/Browse'>Browse</Link>
                                </Button>
                                  {userData?.role === "admin" && 
                                    (
                                        <Button variant='nav'>
                                            <Link to='/Reports'>Reports</Link>
                                        </Button>
                                    )
                                  }

                                    {!(currentUser?.isAnonymous) ? (
                                        <>
                                        <Button variant='nav'>
                                            <Link to='/'>Account</Link>
                                        </Button>
                                            <Button variant='nav' onClick={handleLogout}>
                                                <Link to='/'>Logout</Link>
                                        </Button>
                                        </>
                                        ) : (
                                            <>
                                                {location.pathname === '/Login' && (
                                                    <Button variant='nav'>
                                                        <Link to='/SignUp'>Sign Up</Link>
                                                    </Button>
                                                )}
                                                {location.pathname !== '/Login' && (
                                                    <Button variant='nav' backgroundColor='#2C2C2C' color='#F5F5F5' fontSize='16px' fontWeight='400' px='10'>
                                                        {/* <Link to='/Login'> */}
                                                            Club Owner?
                                                        {/* </Link> */}
                                                    </Button>
                                                )}
                                            </>
                                        )
                                    }
                              </VStack>
                          </DrawerBody>
                      </DrawerContent>
                  </Drawer>
              </Flex>
          </Box>
      );
  }
  