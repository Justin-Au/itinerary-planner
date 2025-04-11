import { Secret } from 'jsonwebtoken';

export const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your_jwt_secret_key';
export const JWT_EXPIRES_IN = '1d';