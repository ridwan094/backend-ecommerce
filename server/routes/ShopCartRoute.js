import { Router } from 'express';
import indexCtrl from '../controller/IndexController'

const router = Router();
router.get('/', indexCtrl.ShopCartCtrl.findAll);
router.get('/:id', indexCtrl.ShopCartCtrl.findOne);
export default router;