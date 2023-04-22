export const db = {
    database: process.env.DB_NAME || 'car_dealer',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || '123456',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
};