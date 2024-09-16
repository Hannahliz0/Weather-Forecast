import { Router } from 'express';
const router = Router();

//import fs from "fs";

import apiRoutes from './api/index.js';
import htmlRoutes from './htmlRoutes.js';

router.use('/api', apiRoutes);
router.use('/', htmlRoutes);

export default router;

