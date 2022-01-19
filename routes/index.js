import Router from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';

const router = Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

router.post('/users', UsersController.postNew);
router.get('/users/me', UsersController.getMe);

router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);

export default router;
