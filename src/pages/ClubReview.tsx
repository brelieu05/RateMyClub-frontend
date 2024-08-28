import { Box, 
        Button, 
        Container, 
        Flex, Heading, 
        HStack, 
        Text, 
        useDisclosure, 
        Stack,
        VStack,
        IconButton,
        FormControl,
        FormLabel,
        Modal,
        ModalBody,
        ModalCloseButton,
        ModalContent,
        ModalFooter,
        ModalHeader,
        ModalOverlay,
        Textarea,
        Spacer,
        Tag,
        TagLabel,
        Popover,
        PopoverArrow,
        PopoverBody,
        PopoverCloseButton,
        PopoverContent,
        PopoverTrigger,
        TagLeftIcon,
        useBreakpointValue,
        PopoverHeader
    } from "@chakra-ui/react";
import { EditIcon, TriangleDownIcon, WarningTwoIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaRegFlag } from "react-icons/fa6";
import { ReviewModal } from "../assets/ReviewModal";
import { DescriptionModal } from "../assets/DescriptionModal";
import { getClubReviews } from '../utils/reviewsUtils'
import { postReport } from '../utils/reportsUtils'
import { useAuth } from "../contexts/authContext/authContext";
import PhotoAlbum from "../assets/PhotoAlbum";
import alexInTheAir from '../assets/images/alex_in_the_air.jpg';

interface ReviewFormData {
    description: string,
    review_date: string;
    rating: number,
    club_id : number,
    university: string | undefined,
}


interface Review {
    club: Club[];
    review_date: string;
    rating: number;
    description: string;
    num_reports: number;
    review_id : number;
}

interface Report {
    review_id : number,
    report_description : string,
}

interface Club{
    club_id : number,
    club_size : string,
    university: string, 
    uni_abbr : string,
    photos : string[],
    meeting_days : string[],
    disclaimer : string,
    club_type : string,
}

const getRandomIndex = (length) => Math.floor(Math.random() * Math.min(3, length));

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
        return 'gray';
    }
  };

export function ClubReview(){
    const { club_id } = useParams();
    
    // const decodedUniversity = university?.replace(/-/g, ' ');
    // const decodedClub = club_name?.replace(/-/g, ' ');
    
    const [allClubReviews, setallClubReviews] = useState<Review[]>([]);
    const [clubName, setClubName] = useState('');
    const [userRating, setUserRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [reportDescription, setReportDescription] = useState('');

    const [club, setClub] = useState(null);
    
    const { isOpen : isReviewModalOpen, onOpen : onReviewModalOpen, onClose : onReviewModalClose } = useDisclosure();
    const { isOpen : isDescriptionModalOpen, onOpen : onDescriptionModalOpen, onClose : onDescriptionModalClose} = useDisclosure();
    const { isOpen : isReportModalOpen, onOpen : onReportModalOpen, onClose : onReportModalClose} = useDisclosure();

    const {userLoggedIn, userData} = useAuth();

    const [randomPhoto, setRandomPhoto] = useState(``);


    const [formData, setFormData] = useState<ReviewFormData>({
        description: "",
        rating: 0,
        university: "",
        club_id: 0,
        review_date : "",
        
    });

    const [reportData, setReportData] = useState<Report>({
        review_id : 0,
        report_description : "",
    }); 

    useEffect(() => {
        const fetchClubReviews = async () => {
            try {
                const response = await getClubReviews(club_id);
                setallClubReviews(response);
                setClub(response[0].club[0]);
                setClubName(response[0].club[0].club_name);
                setRandomPhoto(response[0].club[0].photos[getRandomIndex(response[0].club[0].photos.length)]);
            } catch (error) {
                console.error('Error fetching club reviews:', error);
            }
        };
        
        fetchClubReviews();
    }, [club_id]);

    
    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            club_id: allClubReviews[0]?.club[0]?.club_id,
        }));

        getAverageRating();
    }, [allClubReviews]);


    const getAverageRating = () => {
        let sum = 0;
        let count = 0;
        allClubReviews.filter(club => club.num_reports < 3).forEach(club => {
            sum += club.rating;
            count += 1;
        });
        setAverageRating(Number((sum / count).toFixed(1)));
    }

    const getTier = () => {
        if(averageRating >= 4.5 && averageRating <= 5){
            return("S‑Tier");
        }
        else if (averageRating >= 4 && averageRating < 4.5){
            return("A‑Tier");
        }
        else if (averageRating >= 3.5 && averageRating < 4){
            return("B‑Tier");
        }
        else if (averageRating >= 3.0 && averageRating < 3.5){
            return("C‑Tier");
        }
        else if (averageRating >= 2.0 && averageRating < 3.0){
            return("D‑Tier");
        }
        else{
            return("F‑Tier");
        }
    }  

    const handleReportDescription = (item: Review) => {
        setReportDescription(item.description);
        onReportModalOpen();
        setReportData({
            review_id : item.review_id,
            report_description : "",
        })
    }

    const handleReportSubmit = async () => {
        try {
            await postReport(reportData);
            onReportModalClose();
        } catch (error) {
            console.error("Error submitting report:", error);
        }
    };

    const isSubmitDisabled = reportData.report_description.trim() === '';

    return(
        <Box >
           <ReviewModal isReviewModalOpen={isReviewModalOpen} onReviewModalClose={onReviewModalClose} clubName={clubName} setUserRating={setUserRating} formData={formData} setFormData={setFormData} userRating={userRating} setallClubReviews={setallClubReviews} />

            <DescriptionModal isDescriptionModalOpen={isDescriptionModalOpen} onDescriptionModalClose={onDescriptionModalClose} clubName={clubName} clubId={allClubReviews[0]?.club[0]?.club_id} />

            <Modal isOpen={isReportModalOpen} onClose={onReportModalClose} >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Report Review</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Reported Review</FormLabel>
                            <Text>{reportDescription}</Text>
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel mt='5'>Reason for Report</FormLabel>
                            <Textarea name='report_description' value={reportData.report_description} 
                                onChange={(e) => 
                                setReportData({
                                    ...reportData,
                                    report_description : e.target.value,
                                })
                            }/>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <HStack spacing='4'>
                            <Button onClick={handleReportSubmit} isDisabled={isSubmitDisabled}>Submit</Button>
                            <Button onClick={onReportModalClose} >Cancel</Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Stack position="relative" backgroundImage={`url(${randomPhoto})`} backgroundSize='cover' backgroundPosition='center'>
            <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                background={allClubReviews[0]?.club[0]?.photos.length > 0 
                    ? "rgba(255, 255, 255, 0.6)" 
                    : "#F5F5F5"
                }
                zIndex="1" // Ensure this is on top of the background image
                />
            <Box zIndex='2'>
            <Flex m={{base: '12', md: '14', lg: '20'}} justifyContent='space-between' gap='4'>
                <Box>
                    <Heading size={{ base: 'lg', sm: '2xl', md: '2xl', lg: '4xl' }} maxW="500px" wordBreak="break-word" >{clubName ? clubName : "Loading..."}</Heading>
                    <VStack spacing='2' my='2' alignItems='start'>           
                            {/* <Text color='white'>{allClubReviews[0]?.club[0]?.club_size}, {allClubReviews[0]?.club[0]?.club_type} Club at {university}</Text>  */}
                            
                            

                            {useBreakpointValue({ base: true, md: false }) ? (
                                <Popover>
                                    <PopoverTrigger>
                                        <IconButton aria-label={"Tags Button"} icon={<TriangleDownIcon />} backgroundColor='transparent' _hover={{ backgroundColor: 'transparent' }} _active={{ backgroundColor: 'transparent' }} maxW='max-content' />
                                    </PopoverTrigger>
                                    <PopoverContent p={4}>
                                        <PopoverHeader fontWeight='bold' border='0' textAlign='center' mt='-2'>Tags</PopoverHeader>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <Flex gap='2' flexWrap='wrap' maxW='550px'>
                                            <Tag maxW='max-content'> 
                                                <TagLabel as='b'>
                                                    {club?.university}
                                                </TagLabel>
                                            </Tag>
                                            {club?.tags.map((element, index) => (
                                                <Tag key={index} maxW='max-content' colorScheme={getClubTypeColor(element)}> 
                                                    <TagLabel as='b'>
                                                        {element}
                                                    </TagLabel>
                                                </Tag>
                                            ))}
                                            {allClubReviews[0]?.club[0]?.meeting_days?.map((day, index) => (
                                                <Tag key={"Tag " + index} maxW='max-content'> 
                                                    <TagLabel as='b'>
                                                        {day}
                                                    </TagLabel>
                                                </Tag>
                                            ))}
                                        </Flex>
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <Flex gap='2' flexWrap='wrap' maxW='550px' direction={{ base: "column", md: "row" }}>
                                    <Tag maxW='max-content' > 
                                        <TagLabel as='b'>
                                            {club?.university}
                                        </TagLabel>
                                    </Tag>
                                    {club?.tags.map((element, index) => (
                                        <Tag key={index} colorScheme={getClubTypeColor(element)} > 
                                            <TagLabel as='b'>
                                                {element}
                                            </TagLabel>
                                        </Tag>
                                    ))}
                                    {allClubReviews[0]?.club[0]?.meeting_days?.map((day, index) => (
                                        <Tag key={"Tag " + index} maxW='max-content'> 
                                            <TagLabel as='b'>
                                                {day}
                                            </TagLabel>
                                        </Tag>
                                    ))}
                                </Flex>
                            )}


                            {/* <HStack>
                                {allClubReviews[0]?.club[0]?.meeting_days?.map((day, index) => (
                                    <Tag colorScheme='red' key={"Tag " + index}>
                                        <TagLabel as='b' key={"TagLabel " + index}>
                                            {day}
                                        </TagLabel>
                                    </Tag>
                                ))
                                }
                            </HStack> */}
                    { userData?.role === "club" && userLoggedIn && userData?.club_id === allClubReviews[0]?.club[0]?.club_id || userData?.role === "admin" ?  <Button color='white' variant='link' rightIcon={<EditIcon/>} onClick={onDescriptionModalOpen}>Edit Description</Button> : <></>}
                        <Button backgroundColor='black' color='white' w='auto' onClick={onReviewModalOpen}>Add a Review</Button>
                    </VStack>
                    
                    {allClubReviews[0]?.club[0].disclaimer && (
                    <Popover>
                        <PopoverTrigger>
                            <Tag w='auto' position='absolute' right='1' mx='16' size='lg' colorScheme="red">
                                <TagLeftIcon as={WarningTwoIcon}/>
                                <TagLabel>Disclaimer</TagLabel>
                            </Tag>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverBody>{allClubReviews[0]?.club[0]?.disclaimer}</PopoverBody>
                        </PopoverContent>
                    </Popover>
                    )}
                </Box>
                <Box>
                    <Heading size={{ base: 'xl', md: '2xl', lg: '4xl'}}>{getTier()}</Heading>
                    <HStack justifyContent='flex-end'>
                        <Heading whiteSpace='nowrap' noOfLines={1} size={{ base: 'xl', md: '2xl', lg: '4xl' }}>{String(averageRating) === "NaN" || String(averageRating) === "0" ? "" : String(averageRating)}</Heading>
                        <Heading size={{ base: 'md', md: 'lg', lg: 'xl'}} >/5</Heading>
                        
                    </HStack>
                </Box>
            </Flex>
            </Box>
                
            </Stack>
            <Box >
                <Heading  textAlign='center' my='8'>Reviews</Heading>
                <Container maxW='container.md'>
                    {/* Give it a proper JSON type */}
                {allClubReviews.length > 0 && allClubReviews.filter(item => item.num_reports < 3).sort((a, b) => new Date(b.review_date).getTime() - new Date(a.review_date).getTime()).map((item, index) => (
                        <Stack 
                                my='10' 
                                p='5' 
                                key={"Stack" + index} 
                                // backgroundColor='#EFF3FF' 
                                backgroundColor='#F5F5F5'
                                minH='200px' 
                                borderRadius="lg" // Add this line for rounded corners
                            >
                            <HStack key={"HStack" + index} justifyContent='space-between'>
                                <Heading size='lg' key={"Item Rating" + index}>{item.rating}</Heading>
                                <Heading size='lg' key={"Item Review Date" + index}>{item.review_date.substring(0,10)}</Heading>

                            </HStack>
                            <Text>{item.description}</Text>
                            <Spacer/>
                            <HStack justifyContent='end'>
                                <IconButton aria-label="Report Review" icon={<FaRegFlag />} variant='nav' onClick={() => handleReportDescription(item)}/>
                            </HStack>
                        </Stack>
                ))}
                </Container>  

        
            </Box>
        </Box>
    );
}