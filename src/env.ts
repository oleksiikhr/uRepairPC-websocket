import { removeListSingleSlash } from './helper/utils';

export const isProd: boolean = !['dev', 'development'].includes(process.env.NODE_ENV || 'production');

export const laravelServer: string = removeListSingleSlash(process.env.LARAVEL_SERVER) || 'http://localhost';

export const hostName: string|undefined = process.env.APP_HOSTNAME;

export const port: number = typeof process.env.APP_PORT === 'undefined' ? 3000 : +process.env.APP_PORT;
