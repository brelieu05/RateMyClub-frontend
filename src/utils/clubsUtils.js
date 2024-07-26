import Backend from './utils'

const getClubs = async () => {
    const response = await Backend.get('/clubs');
    return response.data;
}

const postClub = async (formData) => {
    const response = await Backend.post('/clubs', formData);
    return response.data;
}

const getClub = async (club_id) => {
    const response = await Backend.get(`/clubs/${club_id}`);
    return response.data;
}

const updateClub = async (club_id, formData) => {
    const response = await Backend.patch(`/clubs/${club_id}`, formData);
    return response.data;
}


export {
    getClubs,
    postClub,
    getClub,
    updateClub
};