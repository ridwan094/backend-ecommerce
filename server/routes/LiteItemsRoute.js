import { Router } from 'express';
import indexCtrl from '../controller/IndexController'

const router = Router();
router.get('/', indexCtrl.LineItemsCtrl.findAll);
router.get('/:id', indexCtrl.LineItemsCtrl.findOne);

export default router;