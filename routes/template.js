const express=require("express")
import {
  AllTemplates,
  Fetch,
  create,
  deletetemplate,
  SingleTemplate,
  CategoryTemplate,
  update,
  DeleteAllTemplate,
  BulkTemplate,
  UpdateTrendingTemplate,
  SequenceTemplate,
} from "../controllers/Template";
import { requireSigin } from "../middleware";
const router = express.Router();
import formidable from "express-formidable";
router.post("/fetchTemplate", requireSigin, Fetch);
router.post("/template/create", requireSigin, create);
router.put("/template/update/:_id", requireSigin, update);
router.put("/template/TrendingTemplateUpdate", requireSigin, UpdateTrendingTemplate);
router.delete("/template/delete/:_id", requireSigin, deletetemplate);
router.get("/template/AllTemplates", AllTemplates);
router.get("/template/SingleTemplate/:_id", SingleTemplate);
router.get("/template/AllTemplates/:id", CategoryTemplate);
router.get("/template/Sequence/", SequenceTemplate);
router.post("/template/deleteAll",requireSigin, DeleteAllTemplate);
router.post("/template/BulkUpload",formidable({ maxFileSize: 5 * 1024 * 1024 }),
BulkTemplate);

module.exports = router;
