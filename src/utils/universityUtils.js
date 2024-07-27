import Backend from "./utils";


const getUniversities = async () => {
    const response = await Backend.get('/universities');
    return response.data;
}

const getUniversityClubs= async university => {
    const response = await Backend.get(`/universities/${university}/`);
    return response.data;
}

const getUniversityClubNames = async university => {
    const response = await Backend.get(`/universities/${university}/clubs`);
    return response.data;
}


export {
    getUniversities,
    getUniversityClubs,
    getUniversityClubNames
};