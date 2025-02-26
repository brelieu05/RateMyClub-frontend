import {  Box, Card, Divider, Flex,  Grid,  Heading, HStack, Input, Select, SimpleGrid, Stack, Tag, Text, Image, Container, InputGroup, InputRightElement, Button, TagLabel, Badge, IconButton, TagCloseButton } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { getUniversities, getUniversityClubs } from '../utils/universityUtils';
import { getUniversityClubs } from '../utils/universityUtils';
import { useUniversities } from "../contexts/universitiesContext";
import bookStack from '../assets/images/book-icon-150.png';
import { ChevronLeftIcon, SearchIcon } from "@chakra-ui/icons";
import school from '../assets/images/school-house-icon-14383.png'

const universityLogos = new Map([
    ['University of California Irvine', 'https://www.logolynx.com/images/logolynx/83/83ab2bc19c486a4e1162ecca410c13ec.png'],
    ['University of California Berkeley', 'https://www.popupgelato.com/wp-content/uploads/2014/05/500px-University_of_California_Berkeley_athletic_logo.svg_1.png'],
    ['San Jose State University', 'https://clipground.com/images/san-jose-state-university-logo-png.png']
  ]);

  const clubTags = [
    "Small (1-15)",
    "Medium (15-40)",
    "Large (40+)",
    "Computer Science",
    "Community Service",
    "Dance",
    "Engineering",
    "KPOP",
    "Competition",
    "Sports",
    "Social",
    "Hobby/Special Interest",
    "Academic/Professional",
    "Cultural",
    "Art",
    "Music",
    "Performance",
    "Political",
    "Activism",
    "Fraternity",
    "Sorority",
    "Religious"
  ]
  
export default function NewBrowse() {
    // const [universities, setUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [clubJson, setClubJson] = useState([]);
    const [query, setQuery] = useState('');

    const navigate = useNavigate();

    const [tags, setTags] = useState([]);

    // useEffect(() => {
    //     const fetchUniversities = async () => {
    //         try {
    //             const response = await getUniversities();
    //             setUniversities(response);
    //         }
    //         catch (err) {
    //             console.log(err)
    //         }
    //     }
    //     fetchUniversities();
    // }, []);

    const universities = useUniversities();


    useEffect(() => {
        const fetchUniversityClubs = async () => {
          if (selectedUniversity) {
            const data = await getUniversityClubs(selectedUniversity);
            setClubJson(data);
          }
        };
        fetchUniversityClubs();
      }, [selectedUniversity]);

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
        case 'Social':
            return 'teal';
        case 'Competition':
            return 'pink';
        case 'Hobby/Special Interest':
            return 'blue';
        case 'Academic/Professional':
            return 'red';
        case 'Cultural':
            return 'purple';
        case 'Art':
            return 'pink';
        case 'Music':
            return 'cyan'
        case 'Performance':
            return 'purple'
        case 'Political':
            return 'teal'
        case 'Activism':
            return 'green'
        case 'Fraternity':
            return 'red';
        case 'Sorority':
            return 'purple'
        case 'Religious':
            return 'teal'
        default:
            return 'gray';
    }
  };

    return (
        <> 
            <Box backgroundColor='#F5F5F5' minHeight="100vh" pb='5'>
                {selectedUniversity ? <IconButton icon={<ChevronLeftIcon />} aria-label={"Back to university"} onClick={() => {setSelectedUniversity("")}} backgroundColor='transparent' m='4' position='absolute'/> : <></>}
                {selectedUniversity ? (
                    <>
                        <Container maxW="container.xl" pt={12} >

                            <InputGroup justifyContent='end' mb='8' mt='4'>
                                <Input placeholder="Search for your club" onChange={(e) => setQuery(e.target.value)} value={query} backgroundColor='white' w={{base: "100%", lg:'40%'}}/>
                                <InputRightElement>
                                    <SearchIcon color='gray.500' />
                                </InputRightElement>
                            </InputGroup>

                            <Flex gap='2' my='4' justifyContent='end' flexWrap='wrap'>
                                {tags.map((tag) => (
                                    <Tag colorScheme={getClubTypeColor(tag)}>
                                        <TagCloseButton ml='-1' mr='1' onClick={() => {
                                                setTags(prevState => 
                                                    prevState.filter(t => t !== tag)
                                                );
                                            }} />
                                        <TagLabel as='b'>
                                            {tag}
                                        </TagLabel>
                                    </Tag>
                                ))}
                            </Flex>

                            <Flex direction={{ base: 'column', lg: 'row' }} justifyContent='space-between'>
                                <Card  w={{ base: '100%', lg: '25%' }} h='420px' p='8' gap='4' overflowY='scroll' mb='4'>
                                    <Heading size='md'>Filters</Heading>
                                    <Button  variant='link' color='black' fontWeight="normal" alignSelf="flex-start" onClick={() => (setTags([]))}> All Results </Button>
                                    
                                    {clubTags.map((tag, index) => (
                                        <Button
                                            key={index}
                                            variant='link'
                                            color='black'
                                            fontWeight="normal"
                                            alignSelf="flex-start"
                                            onClick={() => {
                                                if (!tags.includes(tag)) {
                                                    setTags(prevState => [
                                                        ...prevState, 
                                                        tag
                                                    ]);
                                                } else {
                                                    setTags(prevState => 
                                                        prevState.filter(t => t !== tag)
                                                    );
                                                }
                                            }}
                                            justifyContent='flex-start'
                                        >
                                            {tag}
                                        </Button>
                                    ))}
                                </Card>
                                
                                <Box w={{base: "100%", lg:"60%"}} gap='12'>
                                    <Stack spacing='12'>
                                        {Array.isArray(clubJson) && clubJson.length > 0 ? (
                                            clubJson
                                            .filter(club => 
                                                tags.length === 0 || // If no tags are specified, return all clubs
                                                tags.every(searchTag => 
                                                    club.tags.map(tag => tag.toLowerCase()).includes(searchTag.toLowerCase())
                                                )
                                            )
                                            .filter(club => query.toLowerCase() === '' || club.club_name.toLowerCase().includes(query.toLowerCase()))
                                            .sort((a, b) => a.club_id - b.club_id ) // Sort by club_id in descending order
                                            .map((club, index) => (
                                                <Card
                                                    key={'Club ' + index}
                                                    p="4"
                                                    onClick={() => {
                                                        navigate(`/${club.club_id}`);
                                                    }}
                                                    cursor='pointer'
                                                >
                                                    <Flex mx='3'>
                                                    <Stack flexShrink={0} alignSelf='center'>
                                                        <Image src={club.photos[3] || bookStack} boxSize={{ base: '100px', md: '120px' }} objectFit="cover" loading="lazy" />
                                                    </Stack>
                                                    <Stack flexGrow={1} alignSelf={{ base: 'center', md: 'flex-start' }} maxW={{ base: '100%', md: 'calc(100% - 140px)' }} ml={{ base: 0, md: 4 }}>
                                                            <Box maxH="60px" overflow="hidden" width="100%">
                                                                <Heading
                                                                    size="lg"

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
                                                                    <Tag colorScheme={getClubTypeColor(element)} key={index}>
                                                                        <TagLabel as='b' key={index}>
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
                            <Input placeholder={selectedUniversity ? "Search for your club" : "Search for your university"} onChange={(e) => setQuery(e.target.value)} value={query} backgroundColor='white' w={{base: "100%",md:'40%'}}/>
                            <InputRightElement>
                                <SearchIcon color='gray.500' />
                            </InputRightElement>
                        </InputGroup>
                        
                        <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}  gap={8} justifyContent='center'>
                            {universities
                                .filter(uni => 
                                    query.toLowerCase() === '' || 
                                    uni.university.toLowerCase().includes(query.toLowerCase()) || uni.uni_abbr.toLowerCase().includes(query.toLowerCase())
                                )
                                .sort((a, b) => a.club_id - b.club_id) // Sort by club_id in descending order
                                .map((uni, index) => (
                                <Box key={index} cursor='pointer' borderWidth="1px" borderRadius="sm" overflow="hidden" backgroundColor='#FFFFFF' py='12' px='8' onClick={() => setSelectedUniversity(uni.university)}>
                                    <Flex justifyContent="space-between">
                                        <Stack alignSelf="center" mx='4'>
                                            <Image 
                                                src={universityLogos.get(uni.university) || school} 
                                                alt={uni.uni_abbr} 
                                                boxSize={{base: "100px", md: "180px" }}
                                                objectFit="contain" 
                                                loading="lazy"
                                                />
                                        </Stack>
                                        <Stack alignItems="end" w='50%' justifyContent='center'>
                                            <Heading size={{base: "2xl", lg: "3xl"}}>{uni.uni_abbr}</Heading>
                                            <Divider mt="2" borderColor='blackAlpha'/>
                                            <Text fontSize={{base: "sm", md: "md", lg: "lg"}} textAlign='end'>{uni.university}</Text>
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
