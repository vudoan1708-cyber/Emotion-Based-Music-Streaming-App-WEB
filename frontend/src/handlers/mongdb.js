/* eslint-disable indent */
import useFetch from '@/components/Utils/logic/useFetch';
import { BUILT_APP_URL } from '@/helpers/constants';

export async function insertData(PARAM, NUM) {
  const URL = `${BUILT_APP_URL}/data/create/?num=${NUM}`;

  try {
    const response = await useFetch(URL, 'POST', PARAM);
    return response;
  } catch (err) {
    return err;
  }
}

export async function updateData(ID, PARAM, NUM) {
  const URL = `${BUILT_APP_URL}/data/update/?id=${ID}&num=${NUM}`;

  try {
    const response = await useFetch(URL, 'PUT', PARAM);
    return response;
  } catch (err) {
    return err;
  }
}

export async function getAllData(NUM) {
  const URL = `${BUILT_APP_URL}/data/get/all/?num=${NUM}`;

  try {
    const response = await useFetch(URL, 'GET');
    return response;
  } catch (err) {
    return err;
  }
}
