/* eslint-disable no-console */
export default async function useFetch(URL, methodType) {
  const options = {
    method: methodType,
    headers: {
      'Content-Type': '*',
      'Access-Control-Allow-Origin': '*',
    },
  };

  const request = await fetch(URL, options);
  const response = await request.json();
  return response;
}
