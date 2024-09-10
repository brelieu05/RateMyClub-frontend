import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUniversities } from '../utils/universityUtils';

const UniversitiesContext = createContext([]);

export const useUniversities = () => useContext(UniversitiesContext);

export const UniversitiesProvider = ({ children }) => {
    const [universities, setUniversities] = useState([]);

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await getUniversities();
                setUniversities(response);
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchUniversities();
    }, []);

    return (
        <UniversitiesContext.Provider value={universities}>
            {children}
        </UniversitiesContext.Provider>
    );
};