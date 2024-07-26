import { Image, IconButton, Box, Modal, Text, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, Stack, FormLabel, Input, Select, RadioGroup, Grid, Radio, ModalFooter, HStack, Button, VStack } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { updateClub } from '../utils/clubsUtils';

interface DescriptionModalProps {
    isDescriptionModalOpen: boolean;
    onDescriptionModalClose: () => void;
    clubName: string;
    clubId: string; // Added clubId to the props interface
}

export function DescriptionModal({ isDescriptionModalOpen, onDescriptionModalClose, clubName, clubId }: DescriptionModalProps) {
    const [meetingDays, setMeetingDays] = useState([{ day: '', time1: '', time2: '' }]);
    const [formData, setFormData] = useState({
        club_type: "Sports",
        club_size: "Small",
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSizeChange = (value: string) => {
        setFormData({
            ...formData,
            club_size: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedFormData = {
                ...formData,
                meeting_days: changeMeetingDays(),
            }
            const response = await updateClub(clubId, updatedFormData);
            window.location.reload();
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setFormData({
            ...formData,
            photos: [...formData.photos, ...files],
        });
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
                            <FormLabel>Club Type</FormLabel>
                            <Select name='club_type' onChange={handleChange} value={formData.club_type}>
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
                        </Stack>
                        <Stack my='5'>
                            <FormLabel>Club Size</FormLabel>
                            <RadioGroup name='club_size' onChange={handleSizeChange} value={formData.club_size}>
                                <Grid gap='4'>
                                    <Radio value='Small'>Small Size (1-15 Members)</Radio>
                                    <Radio value='Medium'>Medium Size (15-40 Members)</Radio>
                                    <Radio value='Large'>Large Size (40+ Members)</Radio>
                                </Grid>
                            </RadioGroup>
                        </Stack>
                    <FormControl>
                        <HStack>
                            <Stack ml='2' mr='7'>
                                <Text>Meeting Day</Text>
                            </Stack>
                            <Stack mr='19'>
                                <Text>Start Time</Text>
                            </Stack>
                            <Stack ml='50px'>
                                <Text>End Time</Text>
                            </Stack>
                        </HStack>
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
                        <Input type="file" onChange={handleFileChange} />
                        {formData.photos.length > 0 && (
                            <VStack mt={4} spacing={4}>
                                {formData.photos.map((file, index) => (
                                    <Image
                                        key={index}
                                        src={URL.createObjectURL(file)}
                                        objectFit="cover"
                                    />
                                ))}
                            </VStack>
                        )}
                    </Stack>
                </FormControl>
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
