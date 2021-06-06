import { Router } from 'express';
import indexCtrl from '../controller/IndexController'


const router = Router();
router.get('/', indexCtrl.UserCtrl.requireSignin,indexCtrl.UserCtrl.findAll);
router.get('/:id', indexCtrl.UserCtrl.findOne)
router.post('/signup',  indexCtrl.UserCtrl.cekEmail,
                        indexCtrl.UserCtrl.signup,
                        indexCtrl.UserCtrl.findAll);
router.post('/signin', indexCtrl.UserCtrl.cekEmail,
                       indexCtrl.UserCtrl.signin);
router.put('/update/:id', indexCtrl.UserCtrl.cekUser,
                          indexCtrl.UserCtrl.cekEmail,
                          indexCtrl.UserCtrl.update);
router.get('/signout', indexCtrl.UserCtrl.signout)
router.delete('/:id',  indexCtrl.UserCtrl.cekUser,
                       indexCtrl.UserCtrl.Delete)

export default router;