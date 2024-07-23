import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Textarea, ModalFooter, HStack, Button, Text} from "@chakra-ui/react";
import { useState } from "react";

interface ReportModalProps {
    isReportModalOpen: boolean;
    onReportModalClose: () => void;
    reportDescription: string;
    reportData : any | null;
}

export function ReportModal({isReportModalOpen, onReportModalClose, reportDescription, reportData} : ReportModalProps){

    const [formData, setFormData] = useState({
        description : reportData.description,
        review_date : (new Date()).toISOString().split('T')[0],
        club_name : reportData.club_name,
        rating : reportData.rating,
        university : reportData.university, 
        class_year : reportData.class_year,
        report_description : "",
    }); 

    const handleChange = (e: { target: { name: string; value: unknown; }; }) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    return(
        <Modal isOpen={isReportModalOpen} onClose={onReportModalClose} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Report Review</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Reported Review</FormLabel>
                        <Text>{reportDescription}</Text>

                        <FormLabel mt='5'>Reason for Report</FormLabel>
                        <Textarea name='report_description' value={formData.report_description} onChange={handleChange}/>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <HStack spacing='4'>
                        <Button onClick={() => console.log(formData)}>Submit</Button>
                        <Button onClick={onReportModalClose}>Cancel</Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}