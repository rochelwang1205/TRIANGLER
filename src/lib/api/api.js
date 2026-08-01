import { serverApi } from './serverApi';
import { staticApi } from './staticApi';

const API_MODE = import.meta.env.VITE_API_MODE ?? (import.meta.env.PROD ? 'static' : 'static');

export const api = API_MODE === 'server' ? serverApi : staticApi;
