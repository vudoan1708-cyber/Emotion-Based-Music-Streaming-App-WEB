/* eslint-disable no-console */
export default async function useFetch(URL, methodType, data) {
  let options;

  // if method is GET
  if (methodType === 'GET') {
    options = {
      method: methodType,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };

  // otherwise, if it is POST or PUT
  } else {
    options = {
      method: methodType,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  }

  try {
    const request = await fetch(URL, options);
    const response = await request.json();
    return response;
  } catch (err) {
    return err;
  }
}
