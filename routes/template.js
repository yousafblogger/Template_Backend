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
} from "../controllers/Template";
import { requireSigin } from "../middleware";
const router = express.Router();

router.post("/fetchTemplate", requireSigin, Fetch);
router.post("/template/create", requireSigin, create);
router.put("/template/update/:_id", requireSigin, update);
router.delete("/template/delete/:_id", requireSigin, deletetemplate);
router.get("/template/AllTemplates", AllTemplates);
router.get("/template/SingleTemplate/:_id", SingleTemplate);
router.get("/template/AllTemplates/:id", CategoryTemplate);
router.post("/template/deleteAll",requireSigin, DeleteAllTemplate);

module.exports = router;
