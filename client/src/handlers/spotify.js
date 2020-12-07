/* eslint-disable no-console */
export default async function LoginHandlers() {
  try {
    window.location.href = '/api/login';
  } catch (e) {
    window.location.href = '/';
    console.log(e);
  }
}
