import { Router } from 'express';
import UserService from './userService';

const router = Router();

router.post('/login', new UserService().createUser);
export default router;