import { Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, Stack, FormLabel, Input, Select, RadioGroup, Grid, Radio, ModalFooter, HStack, Button, VStack } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

interface DescriptionModalProps {
    isDescriptionModalOpen: boolean;
    onDescriptionModalClose: () => void;
    clubName: string;
}

export function DescriptionModal({isDescriptionModalOpen, onDescriptionModalClose, clubName} : DescriptionModalProps) {
    const { club_name } = useParams();
    const [formData, setFormData] = useState({
        club_name: club_name,
        club_type: "Sports",
        club_size: "Small",
        photos: [],
    });

    const handleChange = (e: { target: { name: string; value: unknown; }; }) => {
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


      //TODO fix this so it replaces the current SQL entry isntead of add to it
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/clubs/`, formData);
            console.log(response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setFormData({
            ...formData,
            photos: [...formData.photos, ...files],
          });
        console.log(formData);
    }

    return(
    <Modal isOpen={isDescriptionModalOpen} onClose={onDescriptionModalClose} >
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Edit Club Description</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <FormControl isRequired>
                    <Stack>
                        <FormLabel>Club Name</FormLabel>
                        <Input value={clubName} disabled/>
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
                        <Stack my='5'>
                            <FormLabel>Club Size</FormLabel>
                            <RadioGroup name='clubSize' onChange={handleSizeChange} value={formData.club_size}>
                                <Grid gap='4'>
                                    <Radio value='Small'>Small Size (1-15 Members)</Radio>
                                    <Radio value='Medium'>Medium Size (15-40 Members)</Radio>
                                    <Radio value='Large'>Large Size (40+ Members)</Radio>
                                </Grid>
                            </RadioGroup>
                        </Stack>
                    </Stack>
                    <Stack>
                        
                    </Stack>
                    <Stack>
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