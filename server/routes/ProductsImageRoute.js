import { Router } from 'express'
import indexCtrl from '../controller/IndexController';

const router = Router();

router.post('/upload', indexCtrl.UploadDownloadCtrl.uploadMultipart, indexCtrl.ProductsImageCtrl.create, indexCtrl.ProductsImageCtrl.findAll);
router.get('/', indexCtrl.ProductsImageCtrl.findAll);
router.get('/:filename', indexCtrl.UploadDownloadCtrl.download);
router.delete('/:id', indexCtrl.ProductsImageCtrl.remove);

export default router;