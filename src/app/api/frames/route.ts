// pages/api/frames.ts
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const directoryPath = path.resolve('./public/frame');

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to scan directory' });
    }

    const jpgFiles = files.filter(file => file.endsWith('.jpg'));
    res.status(200).json(jpgFiles);
  });
}
