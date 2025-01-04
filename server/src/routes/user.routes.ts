import express from 'express';
import { validateRequest } from '../middlewares/validate';
import { userController } from '../controllers/user.controller';
import { userValidation } from '../validations/user.validation';
import auth from '../middlewares/auth';

const router = express.Router();

router
  .route('/')
  .post(
    // auth('manageUsers'),
    validateRequest(userValidation.createUser),
    userController.createUser
  )
  .get(
    // auth('getUsers'), 
    validateRequest(userValidation.getUsers),
    userController.getUsers
  );

router
  .route('/:userId')
  .get(
    auth('getUsers'),
    validateRequest(userValidation.getUser),
    userController.getUser
  )
  .patch(
    auth('manageUsers'),
    validateRequest(userValidation.updateUser),
    userController.updateUser
  )
  .delete(
    auth('manageUsers'),
    validateRequest(userValidation.deleteUser),
    userController.deleteUser
  );

export default router;