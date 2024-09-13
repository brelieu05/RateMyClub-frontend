import Backend from './utils'
import { getReviewById, deleteReview, resetNumReports } from './reviewsUtils.ts';


interface ReportPostData {
    review_id : number;
    report_description : string;
}

interface Report {
    report_id : number;
    review_id : number;
    report_description: string;
    report_date : Date;
}

const getAllReports = async () => {
    const response = await Backend.get('/reports');
    return response.data;
}

const postReport = async (reportData : ReportPostData) => {
    const response = await Backend.post('/reports', reportData);
    return response.data;
}

const getAllReportsWithReview = async () => {
    const response = await Backend.get('/reports');
    const reports = response.data;

    // Fetch the review details for each report and merge the data
    const reportsWithReviews = await Promise.all(reports.map(async (report : Report ) => {
        console.log(report);
        const review = await getReviewById(report.review_id);
        return { ...report, review };
    }));

    return reportsWithReviews;
};

const deleteReport = async (report_id : number) => {
    const response = await Backend.delete(`/reports/${report_id}`);
    return response.data;
}

const deleteReviewAndReport = async (review_id: number, report_id : number) => {
    try {
        const [reportResponse, reviewResponse] = await Promise.all([
            deleteReport(report_id),
            deleteReview(review_id)
        ]);
        return { reportResponse, reviewResponse };
    } catch (error) {
        console.error("Error deleting review and report:", error);
        throw error;
    }
};

const deleteReportAndResetNumReports = async (review_id : number, report_id : number) => {
    try {
        const [reportResponse, reviewResponse] = await Promise.all([
            deleteReport(report_id),
            resetNumReports(review_id)
        ]);
        return { reportResponse, reviewResponse };
    } catch (error) {
        console.error("Error deleting review and report:", error);
        throw error;
    }
};


export {
    getAllReports,
    postReport,
    getAllReportsWithReview,
    deleteReport,
    deleteReviewAndReport,
    deleteReportAndResetNumReports
};