import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import ApiRoutes from './Routes/index.js';
import Config from './Config/serverConfig.js';
import errorMiddleware from './Middlewares/errorMiddleware.js';
import connectToDB from './Config/db.js';
import setupSwagger from './docs/swagger.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('short'));
 
Config.RateLimiter(app);

connectToDB();

app.use('/api', ApiRoutes);

setupSwagger(app);

app.all("*", (req, res) => {
  res.status(200).send("<div>OOPS! 404 page not found</div>");
});

app.use(errorMiddleware);

export default app;
