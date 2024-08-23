import { Box, Text, Button, Checkbox, CheckboxGroup, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Select, Stack, Textarea } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { postReview } from "../utils/reviewsUtils";

interface ReviewModalProps {
    isReviewModalOpen: boolean;
    onReviewModalClose: () => void;
    clubName: string;
    setUserRating: React.Dispatch<React.SetStateAction<number>>;
    userRating: number;

    formData: {
        description: string;
        review_date: string;
        rating: number;
        university: string | undefined,
        club_id : number,
    };
    setFormData: React.Dispatch<React.SetStateAction<{
        description: string;
        review_date: string;
        rating: number;
        university: string;
        club_id : number;
    }>>;
    setallClubReviews: (newReview: Review) => void;  
}

export function ReviewModal({isReviewModalOpen, onReviewModalClose, clubName, setUserRating, userRating, formData, setFormData, setallClubReviews} : ReviewModalProps){

    const handleChange = (e: { target: { name: string; value: unknown; }; }) => {
        const { name, value } = e.target;
        setFormData({
            ...formData, 
            [name]: value
        });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const updatedFormData = {
            ...formData,
            rating: userRating,
        };
        try {
            const newReview = await postReview(updatedFormData);
            setallClubReviews((prevReviews) => [
                ...prevReviews,
                {
                    ...newReview,
                    num_reports: 0, // Assuming no reports on new reviews
                },
            ]);
            onReviewModalClose(); // Close the modal after submission
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };




    const isSubmitDisabled = userRating === 0 || formData.description.trim() === '' || formData.description.length > 255;

    return(
            <Modal isOpen={isReviewModalOpen} onClose={onReviewModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add a Review to {clubName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired>
                            <Stack>
                                <FormLabel>Club Name</FormLabel>
                                <Input value={clubName} disabled/>
                            </Stack>
                            <Stack my='5'>
                                <FormLabel>Rating</FormLabel>
                                <RadioGroup onChange={(value) => setUserRating(Number(value))} name='rating' value={String(userRating)}>
                                    <HStack justifyContent='space-evenly'>
                                        <Radio value='1'>1</Radio>
                                        <Radio value='2'>2</Radio>
                                        <Radio value='3'>3</Radio>
                                        <Radio value='4'>4</Radio>
                                        <Radio value='5'>5</Radio>
                                    </HStack>
                                </RadioGroup>
                            </Stack>
                            <Stack my='5'>  
                                <FormLabel>Review Description</FormLabel>
                                <Textarea name='description' value={formData.description} onChange={handleChange}/>
                                <Text textAlign='right'>{formData.description.length}/255</Text>
                            </Stack>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <HStack spacing='4'>
                            <Button onClick={handleSubmit} isDisabled={isSubmitDisabled}>Submit</Button>
                            <Button onClick={onReviewModalClose}>Cancel</Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
    );
}