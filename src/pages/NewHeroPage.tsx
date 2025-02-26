import React, { useEffect, useState } from 'react'
import { Badge, Box, Card, Flex, Grid, Heading, Stack, Text } from "@chakra-ui/react";
import Search from '../assets/Search';
import { useNavigate } from 'react-router-dom';
import { getUniversityClubs } from '../utils/universityUtils';
import cadc from '../assets/images/cadc.jpg'

const getRandomIndex = (length) => Math.floor(Math.random() * Math.min(3, length));


export default function NewHeroPage() {

    const [clubs, setClubs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClubs = async () => {
        const response = await getUniversityClubs('University of California Irvine');
        setClubs(response);
        };
        fetchClubs();
    }, []);

    const getClubTypeColor = (club_type) => {
        switch (club_type) {
          case 'Sports':
            return 'red';
          case 'Social':
            return 'orange.400';
          case 'Hobby/Special/Interest':
            return 'pink.400';
          case 'Dance':
            return 'purple.600';
          case 'Community Service':
            return 'green.500';
          case 'Computer Science':
            return 'blue.500';
          case 'Political/Activism':
            return 'cyan.500';
          default:
            return 'gray.500';
        }
      };

  return (
    <>
        <Stack position="relative" backgroundImage={cadc} backgroundSize='cover' backgroundPosition='center'>
          <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                background={"rgba(215, 215, 215, 0.75)"}
                zIndex="1" // Ensure this is on top of the background image
                />
          <Flex  h='500px' alignItems='center' justifyContent={{base: 'center', md: 'start'}} zIndex='2'>
              <Stack gap='8' mx={{md:'128px'}}>
                  <Stack gap='4' alignItems={{base: 'center', md: 'start'}}>
                      <Heading size={{base: '2xl', md:'3xl'}}>RateMyClub</Heading>
                      <Heading fontSize={{base: '20px', md:'28px'}} as='h2' fontWeight='400' color='#757575'>Join The Best Club For You.</Heading>
                  </Stack>
                  <Search width={{base: '70vw', lg:'lg'}} height="50px"/>
              </Stack>
          </Flex>
        </Stack>
        

        <Stack>

        
        <Heading fontSize='28px' px='16' py='12'>Featured Clubs</Heading>
        <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap={10}
            mx={{ base: '2', md: '10' }}
            mb='10'
            px='8'
        >
        {clubs
          .sort((a, b) => a.club_id - b.club_id)
          .filter(club => club.club_name === "Taekwondo Club" || club.club_name === "Commit The Change" || club.club_name === "Chinese Association Dance Crew (CADC)")
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
                onClick={() => {
                  navigate(`/${club.club_id}`)
                }}
                cursor='pointer'
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
                //   backgroundColor='rgba(197, 60, 60, 0.3)' 
                    backgroundColor='rgba(255, 255, 255, 0.2)'
                />
                <Badge
                  position='absolute'
                  top='10px'
                  right='10px'
                  backgroundColor={getClubTypeColor(club.tags[0])}
                  color='white'
                  borderRadius='md'
                  px='2'
                  py='1'
                  fontSize='sm'
                >
                  {club.tags[0]}
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
                  <Heading size='md' color='black'>
                    {club.club_name}
                  </Heading>
                  <Text fontSize='sm' color='black'>
                    {club.university}
                  </Text>
                </Box>
              </Card>
            );
          })}
      </Grid>
      </Stack>
    </>
  )
}
