import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import ConnectDB from './src/Db/index.js';
ConnectDB();
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
