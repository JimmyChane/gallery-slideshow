import axios from 'axios';

import { ENV_BACKEND_API_HOST } from '@/config/env';

export const API = axios.create({ baseURL: ENV_BACKEND_API_HOST });
