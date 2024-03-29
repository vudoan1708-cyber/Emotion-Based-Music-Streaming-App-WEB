/* eslint-disable no-console */
export default async function useFetch(URL, methodType, data = {}) {
  let options;

  // if method is GET
  if (methodType === 'GET') {
    options = {
      method: methodType,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

  // otherwise, if it is POST or PUT
  } else {
    options = {
      method: methodType,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  }

  try {
    const request = await fetch(URL, options);
    const response = await request.json();
    return response;
  } catch (err) {
    if (err.detail) {
      // eslint-disable-next-line
      alert(err.detail);
    }
    return err;
  }
}
