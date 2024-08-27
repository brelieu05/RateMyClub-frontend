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
    InputGroup,
    InputRightElement,
    Text,
    Heading,
    Tag,
    TagLabel,
    TagCloseButton
 } from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUniversities, getUniversityClubNames, getUniversityClubs } from '../utils/universityUtils'
import { postReview } from '../utils/reviewsUtils'
import { postClub } from '../utils/clubsUtils'
import { SearchIcon } from "@chakra-ui/icons";

interface ClubData {
    club_name: string;
    university: string;
    tag: string[]
}

interface UniversityData {
    university : string;
    uni_abbr : string;
}

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

  const clubTags = [
    "Computer Science",
    "Community Service",
    "Dance",
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

  ]

function Search({width, height}) {
    const [query, setQuery] = useState('');
    const [clubs, setClubs] = useState<ClubData[]>([]);
    const [userRating, setUserRating] = useState(0);
    const { onOpen, isOpen, onClose } = useDisclosure();
    const [universities, setUniversities] = useState<UniversityData[]>([])
    const [university, setUniversity] = useState('');
    const [userClubSize, setUserClubSize] = useState('Small');
    const { isOpen : isDropdownOpen, onOpen: openDropdown, onClose : onDropdownClose } = useDisclosure();

    const [tagSearch, setTagSearch] = useState('');

    const schoolAbbrInputRef = useRef();
    const clubTagsInputRef = useRef();
    const schoolNameInputRef = useRef();

    const searchInputRef = useRef();

    const [reviewData, setReviewData] = useState({
        university: "",
        rating: 0,
        description: ""
    }); 

    const [clubData, setClubData] = useState({
        club_name: "",
        university: "",
        uni_abbr : "",
        tags : [],
    })

    const navigate = useNavigate();

    const handleSubmit = async () => {
        const updatedClubData = {
            ...clubData,
            tags : [...clubData.tags, userClubSize],
        }
        try{
            // console.log(updatedClubData)
            const clubResponse = await postClub(updatedClubData);
            
            const updatedReviewData = {
                ...reviewData,
                rating : Number(userRating),
                club_id : clubResponse.club_id,
            };

            // console.log(updatedReviewData)


            await postReview(updatedReviewData);
            onClose();

            navigate(`/${clubResponse.club_id}`);
        }
        catch (err){
            console.log(err);
        }
    };


    
    const fetchClubs = async (uni: UniversityData) => {
        try {
            const response = await getUniversityClubs(uni.university);
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
        navigate(`/${club.club_id}`)
        setUniversity('');
        setQuery('');
        onDropdownClose();
      };
    
    const isSubmitDisabled = userRating === 0 || reviewData.description.trim() === '' || clubData.club_name.trim() === '' || reviewData.description.length > 255;
    

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
                                <Input name='club_name' value={reviewData.club_name} onChange={handleReviewChange} placeholder="Oozma Kappa (OK)" autoComplete="off"/>
                            </Stack>
                            <Flex mt='3'>
                                <Stack flexGrow='1'>
                                    <FormLabel>School Name</FormLabel>
                                    {/* <Input name='university' placeholder="Monsters University" onChange={handleReviewChange} value={reviewData.university} /> */}

                                    <Popover trigger='hover' matchWidth={true}>
                                        <PopoverTrigger >
                                        <Input name='university' placeholder="Monsters University" onChange={handleReviewChange} value={reviewData.university} ref={schoolNameInputRef} autoComplete="off"/>
                                        </PopoverTrigger>
                                        <PopoverContent w={schoolNameInputRef.current?.offsetWidth} >
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
                                        
                                    <Popover trigger='hover' matchWidth={true}>
                                        <PopoverTrigger>
                                            <Input
                                                name='uni_abbr'
                                                placeholder="MU"
                                                onChange={handleClubChange}
                                                value={clubData.uni_abbr}
                                                ref={schoolAbbrInputRef}
                                                autoComplete="off"
                                            />
                                        </PopoverTrigger>
                                        <PopoverContent w={schoolAbbrInputRef.current?.offsetWidth || 'auto'}>
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
                        <Stack my='4'>
                            <FormLabel>Club Tags</FormLabel>
                                <Flex columnGap='2' flexWrap='wrap' rowGap='2' mx='2'>
                                    {clubData.tags.map((tag, index) => (
                                        <Tag key={index} colorScheme={getClubTypeColor(tag)}>
                                            <TagCloseButton ml='-1' mr='1' onClick={() => {
                                                setClubData(prevState => ({
                                                    ...prevState,
                                                    tags: prevState.tags.filter((_, i) => i !== index)
                                                }));
                                            }} />
                                            <TagLabel as='b'>
                                                {tag}
                                            </TagLabel>
                                        </Tag>
                                    ))}
                                </Flex>
                                {/* <Select name='club_type' value={clubData.club_type} onChange={(e) => {tags.push(e.target.value)}}>
                                    <option value='Sports'>Sports Club</option>
                                    <option value='Social'>Social Club</option>
                                    <option value='Hobby/Special/Interest'>Hobby/Special Interest Club</option>
                                    <option value='Academic/Professional'>Academic/Professional Club</option>
                                    <option value='Community Service'>Community Service Club</option>
                                    <option value='Cultural'>Cultural Club</option>
                                    <option value='Arts/Music/Performance'>Arts/Music/Performance Club</option>
                                    <option value='Political/Activism'>Political and Activism Club</option>
                                    <option value='Other'>Other</option>
                                </Select> */}

                                <Popover trigger='hover' placement='bottom' matchWidth={true}>
                                        <PopoverTrigger>
                                            <Input
                                                onChange={(e) => {setTagSearch(e.target.value)}}
                                                value={tagSearch}
                                                ref={clubTagsInputRef}
                                                placeholder="Select up to 5 club tags"
                                                autoComplete="off"
                                            />
                                        </PopoverTrigger>
                                        <PopoverContent w={clubTagsInputRef.current?.offsetWidth || 'auto'}>
                                            <PopoverBody>
                                                <Flex flexWrap='wrap' gap='2'>
                                                    {clubTags
                                                        .filter(tag => tag.toLowerCase().includes(tagSearch.toLowerCase()))
                                                        .map((tag, index) => (
                                                            <Tag
                                                                key={index}
                                                                colorScheme={getClubTypeColor(tag)}
                                                                onClick={() => {
                                                                    //will still do up to 5, but it will always be one update behind
                                                                    if (!clubData.tags.includes(tag) && clubData.tags.length < 5) {
                                                                        setClubData(prevState => ({
                                                                            ...prevState,
                                                                            tags: [...prevState.tags, tag]
                                                                        }));
                                                                    } else {
                                                                        setClubData(prevState => ({
                                                                            ...prevState,
                                                                            tags: prevState.tags.filter(t => t !== tag) 
                                                                        }));
                                                                    }
                                                                }}
                                                                cursor='pointer'
                                                                borderRadius='md'
                                                                fontSize='sm'
                                                            >
                                                                <TagLabel as='b'>
                                                                    {tag}
                                                                </TagLabel>
                                                            </Tag>
                                                        ))
                                                    }
                                                </Flex>
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                
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
                            <Text textAlign='right'>{reviewData.description.length}/255</Text>
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


        <Box w={width} >

            <Popover trigger='click' gutter='0'>
                <PopoverTrigger>
                    <InputGroup justifyContent='center'>
                        <Input
                            placeholder={university ? `Find a club at ${university.university}` : 'Search your university'}
                            value={query}
                            onChange={handleSearchChange}
                            backgroundColor='white'
                            h={height || "auto"}
                            ref={searchInputRef}
                            />
                        <InputRightElement h='50px' color='gray'>
                            <SearchIcon/>
                        </InputRightElement>
                    </InputGroup>
                </PopoverTrigger>
                <PopoverContent w={clubTagsInputRef.current?.offsetWidth || 'auto'} >

                <List
                    spacing={2}
                    w={width}
                    maxH="140px"
                    >
                {university === '' ? (
                    (Array.isArray(universities) ? universities : [])
                    .filter(uni => uni.university.toLowerCase().includes(query.toLowerCase()))
                        .slice(0,3)
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
                    .filter(club => query.toLowerCase() === '' || club.club_name.toLowerCase().includes(query.toLowerCase()))
                        .slice(0,3)
                        .map((club, index) => (
                            <ListItem
                                key={"Club " + index}
                                onClick={() => handleClubClick(club)}
                                cursor='pointer'
                                _hover={{ bg: 'gray.100' }}
                                p={2}
                                borderRadius='md'
                                >
                                {club.club_name}
                            </ListItem>
                        ))
                    )}

                </List>
                    <Box
                        onClick={onOpen}
                        cursor='pointer'
                        _hover={{ bg: 'gray.100' }}
                        p={2}
                        borderRadius='md'
                        zIndex='2'
                        >
                        <Heading as='h6' size='p'>Don't see your club? Add a Review</Heading>
                    </Box>
                </PopoverContent>
            </Popover> 
        </Box>
    </>
    );
}

export default Search;