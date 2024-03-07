import dotenv from 'dotenv';

dotenv.config();

export default {
    mongoUrl: process.env.MONGO_URL,
    port: process.env.PORT,
    secretKey: process.env.SECRET_KEY,
    email: process.env.EMAIL,
    pass: process.env.PASS
}