/* eslint-disable indent */
import useFetch from '@/components/Utils/logic/useFetch';

const PRODUCTION = process.env.NODE_ENV;

export async function insertData(PARAM, NUM) {
  const URL = (PRODUCTION === 'production')
            ? `https://muserfly.herokuapp.com/data/create/?num=${NUM}`
            : `http://localhost:5000/data/create/?num=${NUM}`;

  try {
    const response = await useFetch(URL, 'POST', PARAM);
    return response;
  } catch (err) {
    return err;
  }
}

export async function updateData(ID, PARAM, NUM) {
  const URL = (PRODUCTION === 'production')
            ? `https://muserfly.herokuapp.com/data/update/?id=${ID}&num=${NUM}`
            : `http://localhost:5000/data/update/?id=${ID}&num=${NUM}`;

  try {
    const response = await useFetch(URL, 'PUT', PARAM);
    return response;
  } catch (err) {
    return err;
  }
}

export async function getAllData(NUM) {
  const URL = (PRODUCTION === 'production')
            ? `https://muserfly.herokuapp.com/data/get/all/?num=${NUM}`
            : `http://localhost:5000/data/get/all/?num=${NUM}`;

  try {
    const response = await useFetch(URL, 'GET');
    return response;
  } catch (err) {
    return err;
  }
}
