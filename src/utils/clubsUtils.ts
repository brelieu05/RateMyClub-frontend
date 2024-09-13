import Backend from "./utils";

interface postClubFormData {
    club_name: string;
    university: string;
    uni_abbr: string;
    tags: string[]
}


const getClubs = async () => {
    const response = await Backend.get('/clubs');
    return response.data;
}

const postClub = async (formData : postClubFormData) => {
    const response = await Backend.post('/clubs', formData);
    return response.data;
}

const getClub = async (club_id : number) => {
    const response = await Backend.get(`/clubs/${club_id}`);
    return response.data;
}

const updateClub = async (club_id : number, formData : postClubFormData) => {
    const response = await Backend.patch(`/clubs/${club_id}`, formData);
    return response.data;
}

// const getTopClubs = async () => {
//     const respones = await Backend.get('/clubs/top/');
//     return response.data;
// }


export {
    getClubs,
    postClub,
    getClub,
    updateClub
};