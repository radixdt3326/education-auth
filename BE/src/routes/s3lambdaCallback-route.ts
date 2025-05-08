import express from "express";
import {isS3URlUsed} from '../Controllers/userController'

const router = express.Router();

router.post("/s3-upload-callback", (req : express.Request,res: express.Response)=>isS3URlUsed(req,res ) )

export default router;