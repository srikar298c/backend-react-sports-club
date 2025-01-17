import express from 'express';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
   
  },

];

defaultRoutes.forEach((route) => {
  router.use(route.path, );
});

export default router;
