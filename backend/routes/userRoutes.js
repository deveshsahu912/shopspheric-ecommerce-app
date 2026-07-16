import express from 'express';
import {
  updateUserProfile,
  changePassword,
  getAllUsers,
  deleteUser,
  updateUserRole,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Private profile routes
router.put('/profile', protect, updateUserProfile);
router.put('/password', protect, changePassword);

// Admin-only user management routes
router.route('/')
  .get(protect, admin, getAllUsers);

router.route('/:id')
  .delete(protect, admin, deleteUser);

router.put('/:id/role', protect, admin, updateUserRole);

export default router;
