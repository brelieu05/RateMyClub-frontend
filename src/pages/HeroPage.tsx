import React, { useEffect, useState } from 'react'
import Search from '../assets/Search'
import { Center, HStack, VStack, Text, Flex, Heading, Card, Tag, Image, Box, Badge } from '@chakra-ui/react'
import { getClubs } from '../utils/clubsUtils'
import { getUniversityClubs } from '../utils/universityUtils'
import alexInTheAir from '../assets/images/alex_in_the_air.jpg';
import { useNavigate } from 'react-router-dom'

export default function HeroPage() {

  const [clubs, setClubs] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchClubs = async () => {
      const response = await getUniversityClubs('University of California Irvine');
      setClubs(response);
      console.log(response);
    }
    fetchClubs();

  }, [])

  return (
    <>
      <Flex backgroundColor='#C53C3C' mx='10' mb='6' rounded='10'>
          <VStack my='36' mx='20'>

              <HStack m='4'>
                <Text as='h1' fontSize='3xl' fontWeight='bold' color='white'>Join The Best Club For You.</Text>
              </HStack>
              <Search width={'sm'}/>
          </VStack>
      </Flex>
          <Heading ml='50px'>Top Clubs</Heading>
      <Flex mx='10' >
      {clubs.slice(0, 5).map((club, index) => (
        <Card
          key={index}
          border='2'
          boxSize='300px'
          m='5'
          position='relative'
          overflow='hidden'
          borderRadius='lg'
          onClick={() => navigate(`/${club.university}/${club.club_name}`)}
        >
          <Box
            position='absolute'
            top='0'
            left='0'
            right='0'
            bottom='0'
            backgroundImage={`url(${alexInTheAir})`}
            backgroundSize='cover'
            backgroundPosition='center'
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
            backgroundColor='tomato'
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
      ))}

      </Flex>
    </>
  )
}
