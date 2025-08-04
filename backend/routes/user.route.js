import { Router } from 'express';
import { getUserList } from '../controllers/user.controller.js';

const router = Router();

router.get('/list', getUserList);

export default router;