import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// TODO: Define route to serve index.html
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

fs.readFile(path.join(__dirname, '../../public/index.html'), 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
    });

export default router;
