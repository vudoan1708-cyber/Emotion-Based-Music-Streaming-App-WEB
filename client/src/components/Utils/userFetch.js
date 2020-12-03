/* eslint-disable no-console */
export default async function userFetch() {
  const request = await fetch();
  const response = await request.json();
  console.log(response);
}
