import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import crypto from 'crypto';

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());

// Function to compute MD5 hash
const md5Hash = (str) => {
  return crypto.createHash('md5').update(str).digest('hex');
};

// Add proxy middleware for MP4 video requests
app.use('/api/playback', createProxyMiddleware({
  target: 'https://nginx.megaguardiao.com.br',
  changeOrigin: true,
  pathRewrite: {
    '^/api/playback': '/play', // Rewrite URL to match the target server's path
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy encountered an error');
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxying request:', req.url);
    console.log('Request headers:', req.headers);

    // If authentication is needed, add it here
    // proxyReq.setHeader('Authorization', 'Bearer YOUR_TOKEN');
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('Received response from target:', proxyRes.statusCode);
    console.log('Response headers:', proxyRes.headers);
  }
}));

app.get('/api/filelist/:cameraId', async (req, res) => {
  const { cameraId } = req.params;

  // Compute the MD5 hash of the cameraId
  const cameraIdHash = md5Hash(cameraId);

  const fileListUrl = `https://nginx.megaguardiao.com.br/api/${cameraIdHash}.json`;

  try {
    const response = await axios.get(fileListUrl, {
      headers: {
        // If authentication is needed, add it here
        // 'Authorization': 'Bearer YOUR_TOKEN',
      }
    });

    const fileList = response.data; // Assuming the response contains the list of files
    const filteredFiles = fileList.filter(file => file.startsWith(cameraIdHash) && file.endsWith('.mp4'));

    if (filteredFiles.length === 0) {
      return res.status(404).json({ error: 'No files found' });
    }

    // Construct the full URLs for the video files
    const videoUrls = filteredFiles.map(file => `https://nginx.megaguardiao.com.br/play/${cameraIdHash}/${file}`);

    return res.json(videoUrls);
  } catch (error) {
    console.error('Error fetching the file list:', error);
    return res.status(500).json({ error: 'Error fetching the file list' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
