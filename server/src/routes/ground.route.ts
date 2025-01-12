import { Router } from 'express';

import auth from '../middlewares/auth'; // Your RBAC authentication middleware
import { validateRequest } from '../middlewares/validate';
import { groundValidation } from '../validations';
import { groundController } from '../controllers';
const router = Router();
router.post('/create', validateRequest(groundValidation.createGroundSchema), groundController.createGround);
router.post('/add-slots', validateRequest(groundValidation.addSlotsSchema), groundController.addSlotsToGround);
router.put('/:groundId', validateRequest(groundValidation.updateGroundSchema), groundController.updateGround);
router.delete('/:groundId', validateRequest(groundValidation.deleteGroundSchema), groundController.deleteGround);


export default router;