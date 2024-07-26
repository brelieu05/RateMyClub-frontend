import { 
    Input, 
    Grid, 
    Stack,
    Button,
    Modal, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalFooter, 
    ModalBody, 
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Radio,
    RadioGroup,
    HStack,
    Textarea,
    Select,
    Box,
    List,
    ListItem, 
    Flex,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
 } from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUniversities, getUniversityClubNames } from '../utils/universityUtils'
import { postReview } from '../utils/reviewsUtils'
import { postClub } from '../utils/clubsUtils'

interface ClubData {
    club_name: string;
    university: string;
}

interface UniversityData {
    university : string;
    uni_abbr : string;
}

function Search({width}) {
    const [query, setQuery] = useState('');
    const [clubs, setClubs] = useState<ClubData[]>([]);
    const [userRating, setUserRating] = useState(0);
    const { onOpen, isOpen, onClose } = useDisclosure();
    const [universities, setUniversities] = useState<UniversityData[]>([])
    const [university, setUniversity] = useState('');
    const [userClubSize, setUserClubSize] = useState('Small');

    const { isOpen : isDropdownOpen, onOpen: openDropdown, onClose : onDropdownClose } = useDisclosure();

    const [reviewData, setReviewData] = useState({
        club_name: "",
        university: "",
        rating: 0,
        description: ""
    }); 

    const [clubData, setClubData] = useState({
        club_name: "",
        club_type: "Social",
        club_size: "Small",
        university: "",
        uni_abbr : "",
    })

    const navigate = useNavigate();

    const handleSubmit = async () => {
        const updatedClubData = {
            ...clubData,
            club_size : userClubSize,
        }
        try{
            const clubResponse = await postClub(updatedClubData);
            
            const updatedReviewData = {
                ...reviewData,
                rating : Number(userRating),
                club_id : clubResponse.club_id,
            };

            await postReview(updatedReviewData);
            onClose();
            navigate(`/${reviewData.university}/${reviewData.club_name}`);
        }
        catch (err){
            console.log(err);
        }
    };


    
    const fetchClubs = async (uni: UniversityData) => {
        try {
            const response = await getUniversityClubNames(uni.university);
            setClubs(response);
        }
        catch (err) {
            console.log(err)   
        }
    }
    
    useEffect(() => {
        const fetchUniversity = async () => {
            const response = await getUniversities();
            setUniversities(response);
        }
        fetchUniversity();
    }, [])

    // useEffect(() => {
    //     function handleClickOutside(event) {
    //     if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
    //         onDropdownClose();
    //     }
    //     }

    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //     document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [onDropdownClose]);

    // useEffect(() => {
    //     function handleClickOutside(event: MouseEvent) {
    //       if (
    //         (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) &&
    //         (modalDropdownRef.current && !modalDropdownRef.current.contains(event.target))
    //       ) {
    //         onDropdownClose();
    //       }
    //     }
    
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //       document.removeEventListener("mousedown", handleClickOutside);
    //     };
    //   }, [onDropdownClose]);
    
    const handleReviewChange = (e: { target: { name: string; value: unknown; }; }) => {
        const { name, value } = e.target;
        setReviewData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'club_name' || name === 'university') {
            setClubData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
        
    };

    const handleClubChange = (e: { target: { name: string; value: unknown; }; } ) => {
        const { name, value } = e.target;
        setClubData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'club_name' || name === 'university') {
            setReviewData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSearchChange = (e) => {
        setQuery(e.target.value);
        if (e.target.value) {
            openDropdown();
        } else {
            onDropdownClose();
        }
      };

      const handleUniversityClick = (uni) => {
        setUniversity(uni);
        fetchClubs(uni);
        setQuery('');
        onDropdownClose();
      };
    
      const handleClubClick = (club) => {
        navigate(`/${university.university}/${club}`);
        setUniversity('');
        setQuery('');
        onDropdownClose();
      };
    
    const isSubmitDisabled = userRating === 0 || reviewData.description.trim() === '' || reviewData.club_name.trim() === '';
    

    return(
        <>
        <Modal isOpen={isOpen} onClose={onClose} size='xl' >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add a Review</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired>
                            <Stack>
                                <FormLabel>Club Name</FormLabel>
                                <Input name='club_name' value={reviewData.club_name} onChange={handleReviewChange} placeholder="Oozma Kappa (OK)"/>
                            </Stack>
                            <Flex mt='3'>
                                <Stack flexGrow='1' pr='2'>
                                    <FormLabel>School Name</FormLabel>
                                    {/* <Input name='university' placeholder="Monsters University" onChange={handleReviewChange} value={reviewData.university} /> */}

                                    <Popover closeOnBlur={true}>
                                        <PopoverTrigger>
                                        <Input name='university' placeholder="Monsters University" onChange={handleReviewChange} value={reviewData.university} />
                                        </PopoverTrigger>
                                        <PopoverContent w='250px'>
                                            <PopoverBody>
                                                <List>
                                                    {universities
                                                        .filter(uni => uni.university.toLowerCase().includes(reviewData.university.toLowerCase()))
                                                        .map((uni, index) => (
                                                            <ListItem
                                                                key={"University " + index}
                                                                onClick={() => {
                                                                    setClubData({
                                                                        ...clubData,
                                                                        university: uni.university,
                                                                        uni_abbr: uni.uni_abbr
                                                                    });
                                                                    setReviewData({
                                                                        ...reviewData,
                                                                        university: uni.university,
                                                                    });
                                                                }}
                                                                    cursor='pointer'
                                                                    _hover={{ bg: 'gray.100' }}
                                                                    borderRadius='md'
                                                                    fontSize='sm'
                                                                >
                                                            {uni.university}
                                                            </ListItem>
                                                        ))
                                                    }
                                                </List>
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                </Stack>
                                <Stack flexGrow='1' pl='2'>
                                    <FormLabel>School Abbreviation</FormLabel>
                                    {/* <Input name='uni_abbr' placeholder="MU" onChange={handleClubChange} value={clubData.uni_abbr}/> */}

                                    <Popover closeOnBlur={true}>
                                        <PopoverTrigger>
                                            <Input
                                                name='uni_abbr'
                                                placeholder="MU"
                                                onChange={handleClubChange}
                                                value={clubData.uni_abbr}
                                            />
                                        </PopoverTrigger>
                                        <PopoverContent w='250px'>
                                            <PopoverBody>
                                                <List>
                                                    {universities
                                                        .filter(uni => uni.uni_abbr.toLowerCase().includes(clubData.uni_abbr.toLowerCase()))
                                                        .map((uni, index) => (
                                                            <ListItem
                                                                key={index}
                                                                onClick={() => {
                                                                    setClubData({
                                                                        ...clubData,
                                                                        university: uni.university,
                                                                        uni_abbr: uni.uni_abbr
                                                                    });
                                                                    setReviewData({
                                                                        ...reviewData,
                                                                        university: uni.university
                                                                    })
                                                                }}
                                                                cursor='pointer'
                                                                _hover={{ bg: 'gray.100' }}
                                                                borderRadius='md'
                                                                fontSize='sm'
                                                            >
                                                                {uni.uni_abbr}
                                                            </ListItem>
                                                        ))
                                                    }
                                                </List>
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                </Stack>
                            </Flex>
                        <Stack my='5'>
                            <FormLabel>Club Type</FormLabel>
                                <Select name='club_type' value={clubData.club_type} onChange={handleClubChange}>
                                    <option value='Sports'>Sports Club</option>
                                    <option value='Social'>Social Club</option>
                                    <option value='Hobby/Special/Interest'>Hobby/Special Interest Club</option>
                                    <option value='Academic/Professional'>Academic/Professional Club</option>
                                    <option value='Community Service'>Community Service Club</option>
                                    <option value='Cultural'>Cultural Club</option>
                                    <option value='Arts/Music/Performance'>Arts/Music/Performance Club</option>
                                    <option value='Political/Activism'>Political and Activism Club</option>
                                    <option value='Other'>Other</option>
                                </Select>
                                <Stack my='3'>
                                    <FormLabel>Club Size</FormLabel>
                                    <RadioGroup name='club_size' value={userClubSize} onChange={(value) => setUserClubSize(value)}>
                                        <Grid gap='3'>
                                            <Radio value='Small (1-15)'>Small Size (1-15 Members)</Radio>
                                            <Radio value='Medium (15-40)'>Medium Size (15-40 Members)</Radio>
                                            <Radio value='Large (40+)'>Large Size (40+ Members)</Radio>
                                        </Grid>
                                    </RadioGroup>
                                </Stack>
                        </Stack>
                        <Stack>
                            <FormLabel>Rating</FormLabel>
                            <RadioGroup onChange={(value) => setUserRating(value)} name='rating' value={userRating}>
                                <HStack justifyContent='space-evenly'>
                                    <Radio value='1'>1</Radio>
                                    <Radio value='2'>2</Radio>
                                    <Radio value='3'>3</Radio>
                                    <Radio value='4'>4</Radio>
                                    <Radio value='5'>5</Radio>
                                </HStack>
                            </RadioGroup>
                        </Stack>
                        <Stack mt='5'>
                            <FormLabel>Write a Review</FormLabel>
                            <Textarea minHeight='200px' size='lg' name='description' value={reviewData.description} onChange={handleReviewChange} placeholder='Oozma Kappa is a mess. The house is cluttered, the members are odd misfits, and their "scare training" is a joke. Social events are awful with bad music and terrible snacks. Save yourself the disappointment and find a club that actually has their act together.'/>
                        </Stack>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <HStack spacing='4'>
                            <Button onClick={handleSubmit} isDisabled={isSubmitDisabled}>Submit</Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>


        <Box alignSelf='center'>
            <Input
                placeholder={university ? `Find a club at ${university.university}` : 'Search your university'}
                value={query}
                onChange={handleSearchChange}
                w={width || 'sm'}
            />
            {isDropdownOpen && (
            <Box position="absolute"  bg="white" borderRadius="md" boxShadow="md" zIndex="1" mt="2">
                <List spacing={2} w='md'>
                {university === '' ? (
                    (Array.isArray(universities) ? universities : [])
                        .filter(uni => query.toLowerCase() === '' || uni.university.toLowerCase().includes(query.toLowerCase()))
                        .map((uni, index) => (
                            <ListItem
                                key={"University " + index}
                                onClick={() => handleUniversityClick(uni)}
                                cursor='pointer'
                                _hover={{ bg: 'gray.100' }}
                                p={2}
                                borderRadius='md'
                            >
                                {uni.university}
                            </ListItem>
                        ))
                ) : (
                    (Array.isArray(clubs) ? clubs : [])
                        .filter(club => query.toLowerCase() === '' || club.toLowerCase().includes(query.toLowerCase()))
                        .map((club, index) => (
                            <ListItem
                                key={"Club " + index}
                                onClick={() => handleClubClick(club)}
                                cursor='pointer'
                                _hover={{ bg: 'gray.100' }}
                                p={2}
                                borderRadius='md'
                            >
                                {club}
                            </ListItem>
                        ))
                )}

                    {query  && (
                    <ListItem
                        onClick={onOpen}
                        cursor='pointer'
                        _hover={{ bg: 'gray.100' }}
                        p={2}
                        borderRadius='md'
                    >
                        {"Don't see your club? Add a Review"}
                    </ListItem>
                    )}
                </List>
            </Box> 
        )}
        </Box>
    </>
    );
}

export default Search;