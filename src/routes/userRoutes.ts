import express from 'express';
import { createUser, deleteUser, loginUser } from '../Controllers/usersControllers';

const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser);
router.delete('/delete', deleteUser);

export default router;