const express=require("express")
import { SiteSettings, createandupdate,main} from "../controllers/settings";
import {  requireSigin } from "../middleware";
const router=express.Router();
router.get("/",main)
router.put("/updateSettings/:_id",requireSigin,createandupdate);
router.get("/siteSettings",SiteSettings);

module.exports=router;