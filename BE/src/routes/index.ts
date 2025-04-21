import express from 'express';
import admin  from './admin-route';
import user from './user-route';
import auth from './auth-route';
import publicRoute from './public-route'

const router = express.Router();

// const dbWrapper = (req,res)=>{
//     return 
// }

/* GET home page. */
router.use('/public',publicRoute );
router.use('/admin',admin );
router.use('/user',user );
router.use('/auth',auth );

export default router;
