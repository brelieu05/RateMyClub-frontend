import { Box, Card, Divider, Flex, Grid, Heading, HStack, Select, SimpleGrid, Tag, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUniversities, getUniversityClubs } from '../utils/universityUtils'
import {getClubs } from '../utils/clubsUtils'

export function Browse(){
    const [clubs, setClubs] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [clubType, setClubType] = useState('');
    const [clubSize, setClubSize] = useState('');
    const [clubJson, setClubJson] = useState([]);
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
            setClubs(data.map((club: { club_name: string; }) => club.club_name));
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
            <Heading>Browse</Heading>
            {selectedUniversity ? (
                <Flex justifyContent='end' mx='24'>
                    <Select onChange={(e) => setClubType(e.target.value)} w='sm'>
                        <option value=''>All Club Types</option>
                        <option disabled>---Club Types---</option>
                        <option value='Sports'>Sports Club</option>
                        <option value='Social'>Social Club</option>
                        <option value='HobbySpecialInterest'>Hobby/Special Interest Club</option>
                        <option value='AcademicProfessional'>Academic/Professional Club</option>
                        <option value='Community Service'>Community Service Club</option>
                        <option value='Cultural'>Cultural Club</option>
                        <option value='ArtsMusicPerformance'>Arts/Music/Performance Club</option>
                        <option value='PoliticalActivism'>Political and Activism Club</option>
                        <option value='Other'>Other</option>
                    </Select>
                    <Select onChange={(e) => {setClubSize(e.target.value)}} w='sm'>
                        <option value=''>All Sizes</option>
                        <option disabled>---Club Sizes---</option>
                        <option value='Small'>Small (1-15)</option>
                        <option value='Medium'>Medium (15-40)</option>
                        <option value='Large'>Large (40+)</option>
                    </Select>
                </Flex>
            ) 
            : 
            <></>
            }

            <SimpleGrid columns='3' m='24' spacing='24'>
                {selectedUniversity ? (
                    clubJson
                        .filter(filterClubs)
                        .map((club, index) => (
                            <Card p='4' onClick={() => {navigate(`/${selectedUniversity}/${club.club_name}`)}}>
                                <Heading key={'Club Text ' + index} textAlign='center' size='lg'>
                                        {club.club_name}
                                </Heading>
                                <Divider m='3'/>
                                <Flex justifyContent='center'>
                                    <Tag mx='2'>{club.club_type}</Tag>
                                    <Tag mx='2'>{club.club_size}</Tag>
                                </Flex>
                            </Card>
                        ))
                    )
                    :
                    (universities.map((uni : string, index) => (
                        <Card key={"Card " + index} p='4' onClick={
                            () => {
                                setSelectedUniversity(uni.university);
                            }}>
                            <Heading textAlign='center' size='lg'>{uni.uni_abbr}</Heading>
                            <Divider m='3'/>
                            <Text fontSize='lg' textAlign='center' key={"Text " + index}>{uni.university}</Text>
                        </Card>
                    )))
                }
            </SimpleGrid>
        </>
    );
}