/* eslint-disable indent */
import useFetch from '@/components/Utils/logic/useFetch';

const PRODUCTION = process.env.NODE_ENV;

export async function insertData(PARAM) {
  const URL = (PRODUCTION === 'production')
            ? 'https://muserfly.herokuapp.com/data/create'
            : 'http://localhost:5000/data/create';

  try {
    const response = await useFetch(URL, 'POST', PARAM);
    return response;
  } catch (err) {
    return err;
  }
}

export async function getAllData() {
  const URL = (PRODUCTION === 'production')
            ? 'https://muserfly.herokuapp.com/data/get/all'
            : 'http://localhost:5000/data/get/all';

  try {
    const response = await useFetch(URL, 'GET');
    return response;
  } catch (err) {
    return err;
  }
}
