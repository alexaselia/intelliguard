import { createServer } from 'https';
import express from 'express';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());

// Handle the HLS master playlist and segment requests
app.get('/api/proxy', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });
    response.data.pipe(res);
  } catch (error) {
    res.status(500).send('Error fetching the stream');
  }
});

// Handle direct segment requests
app.get('/api/*', async (req, res) => {
  const segmentUrl = `https://nginx.megaguardiao.com.br/live/hls/${req.params[0]}`;
  try {
    const response = await axios({
      url: segmentUrl,
      method: 'GET',
      responseType: 'stream',
    });
    response.data.pipe(res);
  } catch (error) {
    res.status(500).send('Error fetching the segment');
  }
});

const options = {
  key: fs.readFileSync(path.resolve('localhost-key.pem')),
  cert: fs.readFileSync(path.resolve('localhost.pem')),
};

createServer(options, app).listen(PORT, () => {
  console.log(`Proxy server is running on https://localhost:${PORT}`);
});
