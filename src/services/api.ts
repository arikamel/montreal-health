import axios from 'axios';

const API_BASE_URL = 'https://www.donneesquebec.ca/recherche/api/3/action';
const RESOURCE_ID = '2a5dbf67-d183-4039-a87b-e5f6282bdd34';

export interface HospitalWaitTime {
  hospital_name: string;
  wait_time: number;
  last_updated: string;
  number_of_patients: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

export const getHospitalWaitTimes = async (): Promise<HospitalWaitTime[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/datastore_search`, {
      params: {
        resource_id: RESOURCE_ID,
        limit: 100,
      },
    });

    // Transform the API response into our HospitalWaitTime interface
    return response.data.result.records.map((record: any) => ({
      hospital_name: record.etablissement,
      wait_time: record.temps_attente,
      last_updated: record.date_maj,
      number_of_patients: record.nombre_patients,
      location: {
        latitude: record.latitude,
        longitude: record.longitude,
      },
    }));
  } catch (error) {
    console.error('Error fetching hospital wait times:', error);
    throw error;
  }
};

export const getHospitalDetails = async (hospitalId: string): Promise<HospitalWaitTime> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/datastore_search`, {
      params: {
        resource_id: RESOURCE_ID,
        filters: JSON.stringify({ etablissement: hospitalId }),
        limit: 1,
      },
    });

    const record = response.data.result.records[0];
    return {
      hospital_name: record.etablissement,
      wait_time: record.temps_attente,
      last_updated: record.date_maj,
      number_of_patients: record.nombre_patients,
      location: {
        latitude: record.latitude,
        longitude: record.longitude,
      },
    };
  } catch (error) {
    console.error('Error fetching hospital details:', error);
    throw error;
  }
}; 