import Backend from './utils'
import { getClub } from './clubsUtils';

const getReviews = async () => {
    const response = await Backend.get('/reviews');
    return response.data;
}

const postReview = async (formData) => {
    const response = await Backend.post('/reviews', formData);
    return response.data;
}

const getClubReviews = async (club_id) => {
    // const response = await Backend.get(`/reviews/${university}/${clubName}/reviews`);
    const response = await Backend.get(`/reviews/${club_id}/`);
    const reviews = response.data;

    const reviewsWithClubData = await Promise.all(reviews.map(async review => {
        const club = await getClub(review.club_id);
        return { ...review, club };
    }));

    return reviewsWithClubData;
}

const deleteReview = async (review_id) => {
    const response = await Backend.delete(`/reviews/${review_id}/`);
    return response;
}

const getReviewById = async (reviewId) => {
    const response = await Backend.get(`/reviews/id/${reviewId}`);
    return response.data;
}

const resetNumReports = async (reviewId) => {
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