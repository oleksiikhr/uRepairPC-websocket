import dotenv from 'dotenv'

dotenv.config();

export const hostName: string|undefined = process.env.APP_HOSTNAME;

export const port: number = typeof process.env.APP_PORT === 'undefined' ? 3000 : +process.env.APP_PORT;
