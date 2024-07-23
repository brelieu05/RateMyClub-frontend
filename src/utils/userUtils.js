import Backend from './utils'

export const createUserInDatabase = async (formData) => {
    const response = await Backend.post('/user', formData);
    return response.data;
}

export const getUserFromDatabase = async (firebaseUID) => {
    const response = await Backend.get(`/user/${firebaseUID}`);
    return response.data;
}