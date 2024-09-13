import Backend from './utils'
import { getClub } from './clubsUtils';

interface ReviewPostData {
    club_id : number; 
    description : string;
    rating : number;
    review_date: string;
    university: string;
}


interface Review {
    club_id : number;
    review_date: string;
    rating: number;
    description: string;
    num_reports: number;
    review_id : number;
}

const getReviews = async () => {
    const response = await Backend.get('/reviews');
    return response.data;
}

const postReview = async (formData : ReviewPostData) => {
    const response = await Backend.post('/reviews', formData);
    return response.data;
}

const getClubReviews = async (club_id : number) => {
    try {
        const response = await Backend.get(`/reviews/${club_id}/`);
        const reviews = response.data;

        const reviewsWithClubData = await Promise.all(reviews.map(async (review : Review) => {
            try {
                const club = await getClub(review.club_id);
                return { ...review, club };
            } catch (clubError) {
                console.error('Error fetching club data:', clubError);
                return { ...review, club: null };  // Return review even if club fetch fails
            }
        }));

        return reviewsWithClubData;
    } catch (error) {
        console.error('Error fetching club reviews:', error);
        return []; // Return an empty array if there’s an error
    }
}

const deleteReview = async (review_id : number) => {
    const response = await Backend.delete(`/reviews/${review_id}/`);
    return response;
}

const getReviewById = async (reviewId : number) => {
    const response = await Backend.get(`/reviews/id/${reviewId}`);
    return response.data;
}

const resetNumReports = async (reviewId : number) => {
    const body = {review_id : reviewId} 
    const response = await Backend.post('/reviews/resetNumReports', body);
    return response.data;
}


export {
    getReviews,
    postReview,
    getClubReviews,
    deleteReview,
    getReviewById,
    resetNumReports
};