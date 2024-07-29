import React, { useEffect, useState } from 'react';
import Search from '../assets/Search';
import { Center, HStack, VStack, Text, Flex, Heading, Card, Tag, Image, Box, Badge, Grid } from '@chakra-ui/react';
import { getUniversityClubs } from '../utils/universityUtils';
import { useNavigate } from 'react-router-dom';

export default function HeroPage() {
  const [clubs, setClubs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubs = async () => {
      const response = await getUniversityClubs('University of California Irvine');
      setClubs(response);
    };
    fetchClubs();
  }, []);

  const getRandomIndex = (max) => {
    return Math.floor(Math.random() * Math.min(max));
  };

  const getClubTypeColor = (club_type) => {
    switch (club_type) {
      case 'Sports':
        return 'red';
      case 'Social':
        return 'orange.400';
      case 'Hobby/Special/Interest':
        return 'pink.400';
      case 'Academic/Professional':
        return 'purple.600';
      case 'Community Service':
        return 'green.500';
      case 'Cultural':
        return 'blue.500';
      case 'Political/Activism':
        return 'cyan.500';
      default:
        return 'gray.500';
    }
  };

  return (
    <>
      <Flex
          backgroundColor='#C53C3C'
          mx={{ base: '4', md: '10' }}
          mb='6'
          rounded='10'
        >
        <VStack my={{ base: '12', md: '36' }} mx={{ base: '5', md: '20' }}>
          <HStack m='4'>
          <Text as='h1' fontSize={{ base: 'xl', md: '3xl' }} fontWeight='bold' color='white'>
              Join The Best Club For You.
            </Text>
          </HStack>
          <Search width={{ base: 'full', md: 'sm' }} />
        </VStack>
      </Flex>
      <Heading ml={{ base: '10px', md: '50px' }} mb='5'>Featured Clubs</Heading>
      <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
          gap={10}
          mx={{ base: '2', md: '10' }}
          mb='10'
        >
        {clubs
          .sort((a, b) => a.club_id - b.club_id)
          .filter(club => club.club_name === "Taekwondo Club" || club.club_name === "Commit The Change" || club.club_name === "Furry Club")
          .slice(0, 5)
          .map((club, index) => {
            const randomIndex = getRandomIndex(club.photos.length);
            const backgroundImageUrl = club.photos[randomIndex] ? `url(${club.photos[randomIndex]})` : '';

            return (
              <Card
                  key={index}
                  border='2'
                  h={{ base: '200px', md: '300px' }}
                  w='full'
                  position='relative'
                  overflow='hidden'
                  borderRadius='lg'
                  onClick={() => navigate(`/${club.university}/${club.club_name}`)}
                >
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  backgroundImage={backgroundImageUrl}
                  backgroundSize="cover"
                  backgroundPosition="center"
                  _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backdropFilter: 'blur(0.4px)', // Adjust the blur intensity as needed
                    zIndex: 1,
                  }}
                />
                <Box
                  position='absolute'
                  top='0'
                  left='0'
                  right='0'
                  bottom='0'
                  backgroundColor='rgba(197, 60, 60, 0.3)' // Adjust opacity as needed
                />
                <Badge
                  position='absolute'
                  top='10px'
                  right='10px'
                  backgroundColor={getClubTypeColor(club.club_type)}
                  color='white'
                  borderRadius='md'
                  px='2'
                  py='1'
                  fontSize='sm'
                >
                  {club.club_type}
                </Badge>
                <Box
                  position='absolute'
                  bottom='10px'
                  left='10px'
                  right='10px'
                  backgroundColor='rgba(255, 255, 255, 0.6)'
                  backdropFilter='blur(10px)'
                  borderRadius='md'
                  p='3'
                >
                  <Text fontSize='sm' color='black'>
                    {club.university}
                  </Text>
                  <Heading size='md' color='black'>
                    {club.club_name}
                  </Heading>
                </Box>
              </Card>
            );
          })}
      </Grid>
    </>
  );
}
