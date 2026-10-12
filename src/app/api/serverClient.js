import 'server-only';
import { createApiClient } from './client';

const API_BASE_URL = process.env.BACKEND_API_URL;

if (!API_BASE_URL) {
    throw new Error('BACKEND_API_URL is missing from .env.local');
}

const serverClient = createApiClient(API_BASE_URL);

export default serverClient;