import express from 'express';
import { port } from './config/index.js';

const server = express();

server.listen(port, err => {
    if (err) {
      console.log(err);
      return process.exit(1);
    }
    console.log(`Server is running on ${port}`);
  });
  
  export default server