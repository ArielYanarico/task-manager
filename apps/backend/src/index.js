import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config'; 

import {connectDb} from './dataAccessLayer/dbConnection.js';

const app = express();

app.use(bodyParser.json());
app.use(cors());

connectDb()
  .then(async () => {
    app.listen(process.env.PORT, () =>
      console.log(`Backend app listening on port ${process.env.PORT}`),
    );
  }).catch((err) => {
    console.error('Failed to connect to the database. Server shutting down.', err);
    process.exit(1);
  });
