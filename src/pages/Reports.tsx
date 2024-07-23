import { Button, Card, CardBody, Divider, Heading, HStack, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {getAllReportsWithReview, deleteReviewAndReport, deleteReportAndResetNumReports} from '../utils/reportsUtils'
import { useAuth } from "../contexts/authContext/authContext";
import { useNavigate } from "react-router-dom";


interface Review {
    review_id: number;
    club_name: string;
    class_year: number;
    rating: number;
    review_date: string;
    university: string;
    description: string;
}

interface ReportData {
    report_id: number;
    report_date: string;
    report_description: string;
    review: Review[];
}

export function Reports(){
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
                            <Stack p='5'>
                                <HStack justifyContent='space-evenly'>
                                    <Text key={"Club Name " + index}>{report.review[0].club_name}</Text>
                                    <Text key={"class_year " + index}>{report.review[0].class_year}</Text>
                                    <Text key={"Rating " + index}>{report.review[0].rating}</Text>
                                    <Text key={"Review Date " + index}>{report.review[0].review_date}</Text>
                                    <Text key={"University " + index}>{report.review[0].university}</Text>
                                </HStack>
                                <Text my='4' textAlign='center' key={"Review Description " + index}>{report.review[0].description}</Text>
                            </Stack>
                            <HStack>
                                <Button backgroundColor='lightgreen' onClick={() => {
                                    handleAccept(report.review[0].review_id, report.report_id)
                                    }}>Add Back Review</Button>
                                <Button backgroundColor='tomato' onClick={() => handleReject(report.review[0].review_id, report.report_id)}>Delete Review</Button>
                            </HStack>
                        </CardBody>
                    </Card>
                ))}
            </SimpleGrid>
        </>
    );
}