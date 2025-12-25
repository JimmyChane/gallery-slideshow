import axios from 'axios';

import { BACKEND_API_HOST } from '@/config/env';

export const API = axios.create({ baseURL: BACKEND_API_HOST });
