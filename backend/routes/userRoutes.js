import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/userController.js';

const router = express.Router();

router.use(protect);

router.get('/profile',  getProfile);
router.put('/profile',  updateProfile);

const addressValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name required'),
  body('phone').trim().notEmpty().withMessage('Phone required'),
  body('addressLine').trim().notEmpty().withMessage('Address line required'),
  body('city').trim().notEmpty().withMessage('City required'),
  body('state').trim().notEmpty().withMessage('State required'),
  body('pincode').trim().notEmpty().withMessage('Pincode required'),
];

router.post('/addresses',            addressValidation, validate, addAddress);
router.put('/addresses/:id',         addAddress);   // partial update — no full validation needed
router.delete('/addresses/:id',      deleteAddress);
router.put('/addresses/:id/default', setDefaultAddress);

export default router;
