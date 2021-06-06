import { Router } from 'express';
import indexCtrl from '../controller/IndexController'

const router = Router();
router.get('/', indexCtrl.ProductsCtrl.findAll);
router.post('/', indexCtrl.UploadDownloadCtrl.uploadMultipart, indexCtrl.ProductsCtrl.create, indexCtrl.ProductsCtrl.findAll);
router.put('/:id', indexCtrl.UploadDownloadCtrl.uploadMultipart, indexCtrl.ProductsCtrl.update, indexCtrl.ProductsCtrl.findOne);
router.get('/:id', indexCtrl.ProductsCtrl.findOne);
router.delete('/:id', indexCtrl.ProductsCtrl.Delete);

export default router;