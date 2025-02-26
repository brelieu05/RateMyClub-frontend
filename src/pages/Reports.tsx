import { Button, Card, CardBody, Divider, Heading, HStack, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {getAllReportsWithReview, deleteReviewAndReport, deleteReportAndResetNumReports} from '../utils/reportsUtils'
import { useAuth } from "../contexts/authContext/authContext";
import { useNavigate } from "react-router-dom";
import { getReviewById } from "../utils/reviewsUtils";


interface Review {
    review_id: number;
    class_year: number;
    rating: number;
    review_date: string;
    description: string;
}

interface ReportData {
    report_id: number;
    report_date: string;
    report_description: string;
    review: Review[];
}

export default function Reports(){
    const [allReports, setAllReports] = useState<ReportData[]>([]);

    const { userData } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchAllReports = async () => {
            if (userData?.role !== 'admin') {
                navigate('/login');
            }
            const response = await getAllReportsWithReview();
            setAllReports(response);
        }
        fetchAllReports();
        
    }, [])


    const handleAccept = async (review_id: number, report_id: number) => {
        await deleteReportAndResetNumReports(review_id, report_id);
        window.location.reload();

    }

    const handleReject = async (reviewId: number, reportId: number) => {
        await deleteReviewAndReport(reviewId, reportId);
        window.location.reload();

    }

    


    return(
        <>
            <Heading>All Reports</Heading>
            <SimpleGrid columns='2' spacing='4' m='20'>
            {allReports.slice().reverse().map((report, index) => (
                <Card key={"Card " + index}>
                    <CardBody>
                        <VStack>
                            <Text key={"Date " + index}>Timestamp Reported: {report.report_date}</Text>
                            <Text>Reason for Report:</Text>
                            <Text key={"Report Description " + index}>{report.report_description}</Text>
                        </VStack>
                        <Divider/>

                        {report.review && report.review[0] ? (
                            <Stack p='5'>
                                <HStack justifyContent='space-evenly'>
                                    <Text key={"Club Name " + index}>{report.review[0].club_name || 'N/A'}</Text>
                                    <Text key={"class_year " + index}>{report.review[0].class_year || 'N/A'}</Text>
                                    <Text key={"Rating " + index}>{report.review[0].rating || 'N/A'}</Text>
                                    <Text key={"Review Date " + index}>{report.review[0].review_date || 'N/A'}</Text>
                                    <Text key={"University " + index}>{report.review[0].university || 'N/A'}</Text>
                                </HStack>
                                <Text my='4' textAlign='center' key={"Review Description " + index}>{report.review[0].description || 'N/A'}</Text>
                            </Stack>
                        ) : (
                            <Text>No review data available</Text>
                        )}

                        {report.review && report.review[0] && (
                            <HStack>
                                <Button backgroundColor='lightgreen' onClick={() => handleAccept(report.review[0].review_id, report.report_id)}>
                                    Add Back Review
                                </Button>
                                <Button backgroundColor='tomato' onClick={() => handleReject(report.review[0].review_id, report.report_id)}>
                                    Delete Review
                                </Button>
                            </HStack>
                        )}
                    </CardBody>
                </Card>
            ))}

            </SimpleGrid>
        </>
    );
}