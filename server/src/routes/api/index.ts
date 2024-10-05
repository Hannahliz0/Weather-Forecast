import { Router } from 'express';
const router = Router();

// import weatherRoutes from './weatherRoutes.js';

// router.use('/weather', weatherRoutes);


router.get('/', (_, res) => {

    res.send('Weather data');
  
  });

export default router;
