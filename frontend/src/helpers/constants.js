export const PRODUCTION = process.env.NODE_ENV;
export const BUILT_APP_URL = (PRODUCTION === 'production')
  ? 'https://muserfly.vercel.app'
  : 'http://localhost:5000';
export const DEPLOY_APP_URL = 'https://muserfly.vercel.app';
