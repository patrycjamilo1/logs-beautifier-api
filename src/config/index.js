import { config } from 'dotenv';
config();

const { PORT } = process.env

export const port = PORT || 3000;