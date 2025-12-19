
import express from 'express';
import { connectToMongoDB } from './config/mongoDBconnection.js';
import dotenv from 'dotenv';
import allRoutes from './routes/allRoutes.js';
import cors from 'cors';


dotenv.config();
const app = express();
app.set('trust proxy', true);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const port = process.env.SERVER_PORT;

app.use(express.json());
app.use('/', allRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectToMongoDB();
}); 