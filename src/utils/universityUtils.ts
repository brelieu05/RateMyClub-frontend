import Backend from "./utils";


const getUniversities = async () => {
    try {
        const response = await Backend.get('/universities');
        return response.data;
    } catch (error) {
        console.error('Error fetching universities:', error);
        throw error;
    }
}

const getUniversityClubs= async (university : string) => {
    try {
        const response = await Backend.get(`/universities/${university}/`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching clubs for ${university}:`, error);
        throw error; // Re-throw to let the calling component handle it
    }
}

const getUniversityClubNames = async (university : string) => {
    try {
        const response = await Backend.get(`/universities/${university}/clubs`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching club names for ${university}:`, error);
        throw error;
    }
}


export {
    getUniversities,
    getUniversityClubs,
    getUniversityClubNames
};