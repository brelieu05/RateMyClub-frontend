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
    ['University of California Irvine', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-world.net%2Fwp-content%2Fuploads%2F2025%2F01%2FUniversity-of-California-Irvine-the-Seal-Logo-500x281.png&f=1&nofb=1&ipt=0d34303d64889de52780a419f6adfb189324273efd25bb68e00525c29e82bb93'],
    ['University of California, Berkeley', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-world.net%2Fwp-content%2Fuploads%2F2022%2F02%2FUC-Berkeley-Seal-Logo.png&f=1&nofb=1&ipt=915312ff9cace3a4102b510c41bdf04acd359a90fb79368c79f69a991dd10443'],
    ['San Jose State University', 'https://clipground.com/images/san-jose-state-university-logo-png.png'],
    ['Harvard University', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-world.net%2Fwp-content%2Fuploads%2F2020%2F12%2FHarvard-Logo.png&f=1&nofb=1&ipt=468d44f399d8f0183109270919b62e7fa3b5ab15b6249ed8339b7782b5756d80'],
    ['Stanford University', 'https://identity.stanford.edu/wp-content/uploads/sites/3/2020/07/block-s-right.png'],
    ['University of California, Los Angeles', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.freebiesupply.com%2Fimages%2Flarge%2F2x%2Fucla-logo-png-transparent.png&f=1&nofb=1&ipt=4f3b4acfc3f48938c0eb9ebd60a8c63c26d43953408ed0562864d70565376eb9'],
    ['University of California, San Diego', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-world.net%2Fwp-content%2Fuploads%2F2022%2F12%2FUCSD-Seal-Logo.png&f=1&nofb=1&ipt=b473467b2d8c38f0b261f49b016311f013cf068bd87a65fe8576886d75665797'],
    ['University of Southern California', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-world.net%2Fwp-content%2Fuploads%2F2021%2F11%2FUSC-Logo-Seal.png&f=1&nofb=1&ipt=e337a5668bf60978a512f4b38689e932ed9f2fab41b5206736458e7a483ea030'],
    ['University of Texas', 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.clipartbest.com%2Fcliparts%2FRid%2F6xa%2FRid6xaxpT.png&f=1&nofb=1&ipt=ea3603c73ccc9cc66f746115eb98918b2afdffd81a062aea2cf4ccce62e751dd'],
    // Add abbreviations for better matching
    ['UCI', 'https://socialecology.uci.edu/sites/default/files/users/katdiaz/uci_logo.png'],
    ['UCB', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-world.net%2Fwp-content%2Fuploads%2F2022%2F02%2FUC-Berkeley-Seal-Logo.png&f=1&nofb=1&ipt=915312ff9cace3a4102b510c41bdf04acd359a90fb79368c79f69a991dd10443'],
    ['SJSU', 'https://clipground.com/images/san-jose-state-university-logo-png.png'],
    ['Harvard', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-world.net%2Fwp-content%2Fuploads%2F2020%2F12%2FHarvard-Logo.png&f=1&nofb=1&ipt=468d44f399d8f0183109270919b62e7fa3b5ab15b6249ed8339b7782b5756d80'],
    ['Stanford', 'https://identity.stanford.edu/wp-content/uploads/sites/3/2020/07/block-s-right.png'],
    ['UCLA', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.freebiesupply.com%2Fimages%2Flarge%2F2x%2Fucla-logo-png-transparent.png&f=1&nofb=1&ipt=4f3b4acfc3f48938c0eb9ebd60a8c63c26d43953408ed0562864d70565376eb9'],
    ['UCSD', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-world.net%2Fwp-content%2Fuploads%2F2022%2F12%2FUCSD-Seal-Logo.png&f=1&nofb=1&ipt=b473467b2d8c38f0b261f49b016311f013cf068bd87a65fe8576886d75665797'],
    ['USC', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.liblogo.com%2Fimg-logo%2Fus6281ud06-usc-logo-usc-logo.png&f=1&nofb=1&ipt=31ca7175b72726701a185c7bcc42b32ac80d4807e706d5e97832e85d286daa14'],
    ['University of Texas at Austin', 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.clipartbest.com%2Fcliparts%2FRid%2F6xa%2FRid6xaxpT.png&f=1&nofb=1&ipt=ea3603c73ccc9cc66f746115eb98918b2afdffd81a062aea2cf4ccce62e751dd'],
    ['Cornell University', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.Uk41Cmx_g2XOat5U4PPqXgHaHa%3Fcb%3D12%26pid%3DApi&f=1&ipt=6d13d60a807135f811a1131e94215cddc93d23d007d826ba775cb67ef7d05baf'],
    ['Massachusetts Institute of Technology', 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fdownload.logo.wine%2Flogo%2FMassachusetts_Institute_of_Technology%2FMassachusetts_Institute_of_Technology-Logo.wine.png&f=1&nofb=1&ipt=f8355c44959a116100bc14f9480f473a207e3e23cbdd594992cfca863e0fbd9b']
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
                                                                    ? club.club_name.split(' ').map(word => word.charAt(0)).join('')
                                                                    : club.club_name}
                                                                </Heading>
                                                                <Text textAlign="center" color="gray.600">
                                                                {club.club_name.length > 17
                                                                    ? club.club_name
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
                            {Array.isArray(universities) && universities?.filter(uni => uni.university.toLowerCase().includes(query.toLowerCase()) || uni.uni_abbr.toLowerCase().includes(query.toLowerCase()))
                                .sort((a, b) => a.club_id - b.club_id) // Sort by club_id in descending order
                                .map((uni, index) => (
                                <Box key={index} cursor='pointer' borderWidth="1px" borderRadius="sm" overflow="hidden" backgroundColor='#FFFFFF' py='12' px='8' onClick={() => setSelectedUniversity(uni.university)}>
                                    <Flex justifyContent="space-between">
                                        <Stack alignSelf="center" mx='4'>
                                            <Image 
                                                src={universityLogos.get(uni.university) || school} 
                                                alt={uni.uni_abbr} 
                                                boxSize={{base: "90px", md: "162px" }}
                                                objectFit="cover" 
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
