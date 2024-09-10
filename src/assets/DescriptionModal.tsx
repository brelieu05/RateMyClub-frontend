import { Image, IconButton, Box, Modal, Text, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, Stack, FormLabel, Input, Select, RadioGroup, Grid, Radio, ModalFooter, HStack, Button, VStack, Flex, Popover, PopoverBody, PopoverContent, PopoverTrigger, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { updateClub } from '../utils/clubsUtils';
import { UploadButton } from "../assets/uploadButton"

interface DescriptionModalProps {
    isDescriptionModalOpen: boolean;
    onDescriptionModalClose: () => void;
    clubName: string;
    clubId: string; // Added clubId to the props interface
}

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
    "Fraternity",
    "Sorority"
  ]

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
    default:
        return 'blackAlpha';
}
};

export function DescriptionModal({ isDescriptionModalOpen, onDescriptionModalClose, clubName, clubId }: DescriptionModalProps) {
    const [userPhotos, setUserPhotos] = useState([]);
    const [meetingDays, setMeetingDays] = useState([{ day: '', time1: '', time2: '' }]);
    const [tagSearch, setTagSearch] = useState('');
    const clubTagsInputRef = useRef();
    const [clubSize, setClubSize] = useState('')
    const [formData, setFormData] = useState({
        tags: [],
        meeting_days: [],
        photos: [],
    });

    const changeMeetingDays = () => {
        const meetingDayTimeArray = meetingDays.map(element => {
            if (element.time1 === '' || element.time2 === '' || element.day === '') {
                return null;
            }
            let [hours1, minutes1] = element.time1.split(':');
            hours1 = parseInt(hours1, 10);
            const period1 = hours1 >= 12 ? 'PM' : 'AM';
            hours1 = hours1 % 12 || 12;

            let [hours2, minutes2] = element.time2.split(':');
            hours2 = parseInt(hours2, 10);
            const period2 = hours2 >= 12 ? 'PM' : 'AM';
            hours2 = hours2 % 12 || 12;

            return `${element.day} (${hours1}:${minutes1} ${period1} - ${hours2}:${minutes2} ${period2})`;
        }).filter(day => day !== null);

        return meetingDayTimeArray;
    };

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //     const { name, value } = e.target;
    //     setFormData({
    //         ...formData,
    //         [name]: value
    //     });
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Create a copy of formData and add meeting_days
            const updatedFormData = {
                ...formData,
                meeting_days: changeMeetingDays(),
                tags: [...formData.tags, clubSize]
            };
    
            // Conditionally add the photos field if userPhotos is not empty
            if (userPhotos.length > 0) {
                updatedFormData.photos = userPhotos;
            }
    
            const response = await updateClub(clubId, updatedFormData);
            window.location.reload();
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };
    


    const handleAddMeetingDay = () => {
        setMeetingDays([...meetingDays, { day: '', time1: '', time2: '' }]);
    };

    const handleRemoveMeetingDay = (index: number) => {
        const newMeetingDays = meetingDays.filter((_, i) => i !== index);
        setMeetingDays(newMeetingDays);
    };

    const handleDayChange = (index: number, value: string) => {
        const newMeetingDays = [...meetingDays];
        newMeetingDays[index].day = value;
        setMeetingDays(newMeetingDays);
    };

    const handleTimeChange1 = (index: number, value: string) => {
        const newMeetingDays = [...meetingDays];
        newMeetingDays[index].time1 = value;
        setMeetingDays(newMeetingDays);
    };

    const handleTimeChange2 = (index: number, value: string) => {
        const newMeetingDays = [...meetingDays];
        newMeetingDays[index].time2 = value;
        setMeetingDays(newMeetingDays);
    };

    return (
        <Modal isOpen={isDescriptionModalOpen} onClose={onDescriptionModalClose} size='xl'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Club Description</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isRequired>
                        <Stack>
                            <FormLabel>Club Name</FormLabel>
                            <Input value={clubName} disabled />
                        </Stack>
                        <Stack my='5'>
                        <FormLabel>Club Tags</FormLabel>
                                <Flex columnGap='2' flexWrap='wrap' rowGap='2' mx='2'>
                                    {formData.tags.map((tag, index) => (
                                        <Tag key={index} colorScheme={getClubTypeColor(tag)}>
                                            <TagCloseButton ml='-1' mr='1' onClick={() => {
                                                setFormData(prevState => ({
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
                                                                    if (!formData.tags.includes(tag) && formData.tags.length < 6) {
                                                                        setFormData(prevState => ({
                                                                            ...prevState,
                                                                            tags: [...prevState.tags, tag]
                                                                        }));
                                                                    } else {
                                                                        setFormData(prevState => ({
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
                        </Stack>
                        <Stack my='5'>
                            <FormLabel>Club Size</FormLabel>
                            <RadioGroup onChange={setClubSize} value={clubSize}>
                                <Grid gap='4'>
                                    <Radio value='Small (1-15)'>Small Size (1-15 Members)</Radio>
                                    <Radio value='Medium (15-40)'>Medium Size (15-40 Members)</Radio>
                                    <Radio value='Large (40+)'>Large Size (40+ Members)</Radio>
                                </Grid>
                            </RadioGroup>
                        </Stack>
                        <HStack my='2'>
                            <Stack ml='2' mr='7'>
                                <Text>Meeting Day</Text>
                            </Stack>
                            <Stack ml='30px'>
                                <Text>Start Time</Text>
                            </Stack>
                            <Stack ml='83px'>
                                <Text>End Time</Text>
                            </Stack>
                        </HStack>
                        <Stack my='2'>

                        {meetingDays.map((meetingDay, index) => (
                            <HStack key={index} mb={2}>
                                <Stack flexGrow='1'>
                                    <Select
                                        placeholder="Select day"
                                        value={meetingDay.day}
                                        onChange={(e) => handleDayChange(index, e.target.value)}
                                        >
                                        <option value="Sunday">Sunday</option>
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">Wednesday</option>
                                        <option value="Thursday">Thursday</option>
                                        <option value="Friday">Friday</option>
                                        <option value="Saturday">Saturday</option>
                                    </Select>
                                </Stack>
                                <Stack flexGrow='1'>
                                    <Input
                                        type='time'
                                        value={meetingDay.time1}
                                        onChange={(e) => handleTimeChange1(index, e.target.value)}
                                        />
                                </Stack>
                                <Stack flexGrow='1'>
                                    <Input
                                        type='time'
                                        value={meetingDay.time2}
                                        onChange={(e) => handleTimeChange2(index, e.target.value)}
                                        />
                                </Stack>
                                <Stack>
                                    <IconButton
                                        aria-label='Remove meeting day/time'
                                        icon={<MinusIcon />}
                                        onClick={() => handleRemoveMeetingDay(index)}
                                    />
                                </Stack>
                            </HStack>
                        ))}
                        </Stack>
                        <Box>
                            <IconButton
                                aria-label='Add a meeting day/time'
                                icon={<AddIcon />}
                                onClick={handleAddMeetingDay}
                            />
                        </Box>
                        </FormControl>
                    <Stack my='5'>
                        <FormLabel>Insert Up To 3 Photos</FormLabel>
                        
                        {userPhotos.length === 0 &&
                        <UploadButton
                            endpoint="imageUploader"
                            skipPolling
                            onClientUploadComplete={(file) => {
                                const urls = file.map((f) => f.url);
                                console.log("uploaded", urls);
                                setUserPhotos(urls);
                            }}
                            onUploadError={(error) => {
                                console.error(error, error.cause);
                                alert("Upload failed");
                              }}
                            appearance={{
                                container: {
                                  display: 'grid',
                                  padding: '5px',
                                  gap: '10px'
                                },
                              }}
                        />}

                    <HStack spacing={4} mt={4}>
                            {userPhotos.map((file, index) => (
                            <Box key={index} boxSize="150px">
                                <Image
                                src={file}
                                alt={`preview-${index}`}
                                boxSize="100%"
                                objectFit="contain" // Use "contain" to keep aspect ratio
                                />
                            </Box>
                            ))}
                        </HStack>

                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <HStack spacing='4'>
                        <Button onClick={handleSubmit}>Submit</Button>
                        <Button onClick={onDescriptionModalClose}>Cancel</Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
