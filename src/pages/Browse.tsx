import {  Box, Card, Divider, Flex,  Grid,  Heading, Input, Select, SimpleGrid, Tag, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUniversities, getUniversityClubs } from '../utils/universityUtils'

export function Browse(){
    // const [clubs, setClubs] = useState([]);
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
            // setClubs(data.map((club: { club_name: string; }) => club.club_name));
          }
        };
        fetchUniversityClubs();
      }, [selectedUniversity]);

      const filterClubs = (club) => {
        if (clubType && clubType !== '' && club.club_type !== clubType) {
            return false;
        }
        if (clubSize && clubSize !== '' && club.club_size !== clubSize) {
            return false;
        }
        return true;
    };

    return(
        <>
            {selectedUniversity ? (
                <Flex 
                justifyContent={{ base: 'start', md: 'end' }} 
                flexDirection={{ base: 'column', md: 'row' }} 
                alignItems="center" 
                gap={4} 
                m="5"
              >
                <Box w={{ base: '100%', md: 'auto' }} flex={{ base: '1', md: 'none' }} minW={{ md: '300px' }}>
                  <Input type="search" placeholder="Search for a club" w="100%" onChange={(e) => setQuery(e.target.value)} value={query}/>
                </Box>
                <Box w={{ base: '100%', md: 'auto' }} flex={{ base: '1', md: 'none' }} minW={{ md: '300px' }}>
                  <Select onChange={(e) => setClubType(e.target.value)} w="100%">
                    <option value="">All Club Types</option>
                    <option disabled>---Club Types---</option>
                    <option value="Sports">Sports Club</option>
                    <option value="Social">Social Club</option>
                    <option value="Hobby/Special/Interest">Hobby/Special Interest Club</option>
                    <option value="Academic/Professional">Academic/Professional Club</option>
                    <option value="Community Service">Community Service Club</option>
                    <option value="Cultural">Cultural Club</option>
                    <option value="Arts/Music/Performance">Arts/Music/Performance Club</option>
                    <option value="Political/Activism">Political and Activism Club</option>
                    <option value="Other">Other</option>
                  </Select>
                </Box>
                <Box w={{ base: '100%', md: 'auto' }} flex={{ base: '1', md: 'none' }} minW={{ md: '300px' }}>
                  <Select onChange={(e) => setClubSize(e.target.value)} w="100%">
                    <option value="">All Sizes</option>
                    <option disabled>---Club Sizes---</option>
                    <option value="Small (1-15)">Small (1-15)</option>
                    <option value="Medium (15-40)">Medium (15-40)</option>
                    <option value="Large (40+)">Large (40+)</option>
                  </Select>
                </Box>
              </Flex>
              
            ) 
            : 
            <></>
            }

            <Grid
                    templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' , xl: 'repeat(4, 1fr)'}}
                    gap={24}
                    m='10'
                    >
            {selectedUniversity ? (
                Array.isArray(clubJson) && clubJson.length > 0 ? (
                    clubJson
                        .filter(filterClubs)
                        .filter(club => query.toLowerCase() === '' || club.club_name.toLowerCase().includes(query.toLowerCase()))
                        .map((club, index) => (
                            <Card key={'Club ' + index} p='4' onClick={() => navigate(`/${selectedUniversity}/${club.club_name}`)}>
                                <Heading textAlign='center' size='lg'>
                                    {club.club_name}
                                </Heading>
                                <Divider m='3'/>
                                <Flex justifyContent='center'>
                                    <Tag mx='2'>{club.club_type}</Tag>
                                    <Tag mx='2'>{club.club_size}</Tag>
                                </Flex>
                            </Card>
                        ))
            ) : (
                <Text textAlign='center'>No clubs available</Text>
            )
        ) : (
        Array.isArray(universities) && universities.length > 0 ? (
            universities.map((uni, index) => (
                <Card key={"Card " + index} p='4' onClick={() => setSelectedUniversity(uni.university)}>
                    <Heading textAlign='center' size='lg'>{uni.uni_abbr}</Heading>
                    <Divider m='3'/>
                    <Text fontSize='lg' textAlign='center'>{uni.university}</Text>
                </Card>
            ))
        ) : (
        <Text textAlign='center'>No universities available</Text>
        )
    )}

            </Grid>
        </>
    );
}