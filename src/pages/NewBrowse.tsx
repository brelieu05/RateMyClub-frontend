import {  Box, Card, Divider, Flex,  Grid,  Heading, HStack, Input, Select, SimpleGrid, Stack, Tag, Text, Image, Container, InputGroup, InputRightElement, Button, TagLabel, Badge } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUniversities, getUniversityClubs } from '../utils/universityUtils';
import bookStack from '../assets/images/book-icon-150.png';
import { SearchIcon } from "@chakra-ui/icons";

const universityLogos = new Map([
    ['University of California Irvine', 'https://www.logolynx.com/images/logolynx/83/83ab2bc19c486a4e1162ecca410c13ec.png'],
    ['University of California Berkeley', 'https://www.popupgelato.com/wp-content/uploads/2014/05/500px-University_of_California_Berkeley_athletic_logo.svg_1.png'],
    ['San Jose State University', 'https://clipground.com/images/san-jose-state-university-logo-png.png']
  ]);
  
  
  function getUniversityLogo(universityName) {
    return universityLogos.get(universityName) || bookStack;
  }

export default function NewBrowse() {
    const [universities, setUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [clubType, setClubType] = useState('');
    const [clubSize, setClubSize] = useState('');
    const [clubJson, setClubJson] = useState([]);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await getUniversities();
                console.log(response);
                setUniversities(response);
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchUniversities();
    }, []);

    useEffect(() => {
        const fetchUniversityClubs = async () => {
          if (selectedUniversity) {
            const data = await getUniversityClubs(selectedUniversity);
            setClubJson(data);
          }
        };
        fetchUniversityClubs();
      }, [selectedUniversity]);

      const filterClubs = (club) => {
        if(club.tags.indexOf(clubSize) < 0 && clubSize != "")
            return false;
        if(club.tags.indexOf(clubType) < 0 && clubType != "")
            return false;
        return true;
    };

    const getClubTypeColor = (club_type) => {
        switch (club_type) {
          case 'Sports':
            return 'red';
          case 'Engineering':
            return 'orange';
          case 'Hobby/Special/Interest':
            return 'pink';
          case 'KPOP':
            return 'purple';
          case 'Community Service':
            return 'green';
          case 'Computer Science':
            return 'blue';
          case 'Dance':
            return 'cyan';
          default:
            return 'blackAlpha';
        }
      };

    return (
        <> 
            <Box backgroundColor='#F5F5F5' minHeight="100vh" pb='5'>
                {selectedUniversity ? (
                    <>
                        <Container maxW="container.xl" pt={12}>
                            <InputGroup justifyContent='end' mb='8'>
                                <Input placeholder={selectedUniversity ? "Search for your club" : "Search for your university"} onChange={(e) => setQuery(e.target.value)} value={query} backgroundColor='white' w='40%'/>
                                <InputRightElement>
                                    <SearchIcon color='gray.500' />
                                </InputRightElement>
                            </InputGroup>
                            <Flex justifyContent='space-between'>
                                <Card w='320px' h='420px' p='8' gap='4' >
                                    <Heading  size='md'>Filters</Heading>
                                    <Button variant='link' color='black' fontWeight="normal" alignSelf="flex-start" onClick={() => {
                                        setClubType('');
                                        setClubSize('');
                                    }}> All Results </Button>
                                    <Button variant='link' color='black' fontWeight="normal" alignSelf="flex-start" onClick={() => {
                                        setClubSize('Small (1-15)');
                                    }}>Small (1-15)</Button>
                                    <Button variant='link' color='black' fontWeight="normal" alignSelf="flex-start" onClick={() => {
                                        setClubSize('Medium (15-40)');
                                    }}>Medium (15-40)</Button>
                                    <Button variant='link' color='black' fontWeight="normal" alignSelf="flex-start" onClick={() => {
                                        setClubSize('Large (40+)');
                                    }}>Large (40+)</Button>
                                    <Button variant='link' color='black' fontWeight="normal" alignSelf="flex-start" onClick={() => {setClubType('Sports')}}>Sports</Button>
                                    <Button variant='link' color='black' fontWeight="normal" alignSelf="flex-start" onClick={() => {setClubType('Dance')}}>Dance</Button>
                                    <Button variant='link' color='black' fontWeight="normal" alignSelf="flex-start" onClick={() => {setClubType('Academic/Professional')}}>Academic/Professional</Button>
                                    <Button variant='link' color='black' fontWeight="normal" alignSelf="flex-start" onClick={() => {setClubType('Cultural')}}>Cultural</Button>
                                    <Button variant='link' color='black' fontWeight="normal" alignSelf="flex-start" onClick={() => {setClubType('Social')}}>Social</Button>
                                </Card>
                                <Box w="container.md" gap='12'>
                                    <Stack spacing='12'>
                                    {Array.isArray(clubJson) && clubJson.length > 0 ? (
                                        clubJson
                                        .filter(filterClubs)
                                        .filter(club => query.toLowerCase() === '' || club.club_name.toLowerCase().includes(query.toLowerCase()))
                                        .sort((a, b) => a.club_id - b.club_id ) // Sort by club_id in descending order
                                        .map((club, index) => (
                                                    <Card
                                                        key={'Club ' + index}
                                                        p="4"
                                                        onClick={() => {
                                                            navigate(`/${club.club_id}`);
                                                        }}
                                                    >
                                                        <Flex mx='3'>
                                                            <Stack alignSelf='center'>
                                                                <Image src={club.photos[3] || bookStack} boxSize='120px' objectFit="cover" />
                                                            </Stack>
                                                            <Stack flexGrow='1' alignSelf='center'>
                                                                <Box maxH="60px" overflow="hidden" width="100%">
                                                                    <Heading
                                                                        size="lg"
                                                                        whiteSpace="nowrap"
                                                                        overflow="hidden"
                                                                        textOverflow="ellipsis"
                                                                        textAlign='center'
                                                                    >
                                                                    {club.club_name.length > 17
                                                                        ? club.club_name.substring(
                                                                            club.club_name.indexOf('(') + 1,
                                                                            club.club_name.indexOf(')')
                                                                        )
                                                                        : club.club_name}
                                                                    </Heading>
                                                                    <Text textAlign="center" color="gray.600">
                                                                    {club.club_name.length > 17
                                                                        ? club.club_name.substring(0, club.club_name.indexOf('('))
                                                                        : ""}
                                                                    </Text>
                                                                </Box>
                                                                <Divider m="3" borderColor='blackAlpha' />
                                                                <Flex justifyContent="center" gap='4' flexWrap="wrap" >
                                                                    {club.tags.map((element, index) => (
                                                                        <Tag colorScheme={getClubTypeColor(element)}>
                                                                            <TagLabel as='b'>
                                                                                {element}
                                                                            </TagLabel>
                                                                        </Tag>
                                                                    ))}
                                                                </Flex>
                                                            </Stack>
                                                        </Flex>
                                                    </Card>
                                                ))
                                    ) : (<></>)}
                                    </Stack>
                                </Box>
                            </Flex>
                        </Container>
                        
                    </>
                ): (

                    <Container maxW="container.xl" pt={12}>
                    <InputGroup justifyContent='end' mb='8'>
                        <Input placeholder={selectedUniversity ? "Search for your club" : "Search for your university"} onChange={(e) => setQuery(e.target.value)} value={query} backgroundColor='white' w='40%'/>
                        <InputRightElement>
                            <SearchIcon color='gray.500' />
                        </InputRightElement>
                    </InputGroup>
                    
                    <Grid templateColumns="repeat(2, 1fr)" gap={16} justifyContent='center'>
                        {universities
                            .filter(uni => 
                                query.toLowerCase() === '' || 
                                uni.university.toLowerCase().includes(query.toLowerCase()) || uni.uni_abbr.toLowerCase().includes(query.toLowerCase())
                            )
                            .sort((a, b) => a.club_id - b.club_id) // Sort by club_id in descending order
                            .map((uni, index) => (
                            <Box key={index} borderWidth="1px" borderRadius="sm" overflow="hidden" backgroundColor='#FFFFFF' py='12' px='12' onClick={() => setSelectedUniversity(uni.university)}>
                            <Flex justifyContent="space-between" alignItems="center">
                                <Stack alignSelf="start">
                                <Image 
                                    src={getUniversityLogo(uni.university)} 
                                    alt={uni.uni_abbr} 
                                    boxSize="180px" 
                                    objectFit="contain" 
                                    />
                                </Stack>
                                <Stack alignItems="end">
                                <Heading size="3xl">{uni.uni_abbr}</Heading>
                                <Divider mt="2" borderColor='blackAlpha'/>
                                <Text fontSize="lg">{uni.university}</Text>
                                </Stack>
                            </Flex>
                            </Box>
                        ))}
                    </Grid>
                </Container>
                )}
            </Box>
            </>
    )
}
