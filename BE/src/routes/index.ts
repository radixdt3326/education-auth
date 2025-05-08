import express from 'express';
import admin  from './admin-route';
import user from './user-route';
import auth from './auth-route';
import publicRoute from './public-route'
import s3lambda  from './s3lambdaCallback-route'

const router = express.Router();

/* GET home page. */
router.use('/public',publicRoute );
router.use('/admin',admin );
router.use('/user',user );
router.use('/auth',auth );
router.use('/callback',s3lambda );

export default router;
