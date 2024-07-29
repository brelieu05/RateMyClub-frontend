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
  import React from 'react';
  import { useAuth } from '../contexts/authContext/authContext';
  import { logout } from '../utils/firebaseAuthUtils'
  import Search from './Search';
  
  export default function Navbar() {
      const location = useLocation();
      const navigate = useNavigate();
      const { userLoggedIn, userData } = useAuth();
      const { isOpen, onOpen, onClose } = useDisclosure();
  
      const handleLogout = () => {
          logout('/', navigate);
          window.location.reload();
      }
  
      return (
          <>
              <Flex justifyContent='space-between' p='5' mx='5' alignItems='center'>
                  <HStack spacing={{ base: '0', md: '5' }}>
                      <Button variant='nav' onClick={() => {
                          navigate('/');
                          window.location.reload();
                      }}>Rate My Club</Button>
                  </HStack>
  
                  <Flex display={{ base: 'none', md: 'flex' }} gap={4} alignItems='center'>
                      {location.pathname !== '/' && <Search width={undefined} />}
                      <Button><Link to='/Browse'>Browse</Link></Button>
                      {userData?.role === "admin" && (
                          <Button variant='nav'><Link to='/Reports'>Reports</Link></Button>
                      )}
                      {userLoggedIn ? (
                          <Button variant='nav' onClick={handleLogout}>
                              <Link to='/'>Logout</Link>
                          </Button>
                      ) : (
                          <>
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
                          </>
                      )}
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
                                  {location.pathname !== '/' && <Search width={'250px'} />}
                                  <Button><Link to='/Browse'>Browse</Link></Button>
                                  {userData?.role === "admin" && (
                                      <Button variant='nav'><Link to='/Reports'>Reports</Link></Button>
                                  )}
                                  {userLoggedIn ? (
                                      <Button variant='nav' onClick={handleLogout}>
                                          <Link to='/'>Logout</Link>
                                      </Button>
                                  ) : (
                                      <>
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
                                      </>
                                  )}
                              </VStack>
                          </DrawerBody>
                      </DrawerContent>
                  </Drawer>
              </Flex>
          </>
      );
  }
  