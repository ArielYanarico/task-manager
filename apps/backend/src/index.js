import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config'; 

import {connectDb} from './dataAccessLayer/dbConnection.js';
import Task from './routes/task.js';

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/tasks', Task);

connectDb()
  .then(async () => {
    app.listen(process.env.PORT, () =>
      console.log(`Backend app listening on port ${process.env.PORT}`),
    );
  }).catch((err) => {
    console.error('Failed to connect to the database. Server shutting down.', err);
    process.exit(1);
  });
