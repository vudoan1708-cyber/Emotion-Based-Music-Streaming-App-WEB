/* eslint-disable no-console */
export default async function userFetch(URL) {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': '*',
      'Access-Control-Allow-Origin': '*',
    },
  };

  const request = await fetch(URL, options);
  const response = await request.json();
  return response;
}
