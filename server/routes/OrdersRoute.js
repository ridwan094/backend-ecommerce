import { Router } from 'express';
import indexCtrl from '../controller/IndexController'

const router = Router();
router.get('/', indexCtrl.OrdersCtrl.findAll);
router.get('/:id', indexCtrl.OrdersCtrl.findOne);

export default router;