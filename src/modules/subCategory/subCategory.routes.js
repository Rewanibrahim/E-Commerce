import express from "express";
import * as CC from "./subCategory.controller.js";
import * as CV from "./subCategoryvalidation.js"
import { SystemRoles } from "../../utils/systemRoles.js";
const subCategoryRouter = express.Router();

categoryRouter.post("/",
    multerHost(validExtension.image).single("image"),
    validation(CV.createCategory),
    auth(SystemRoles.admin),
    CC.createCategory
);

categoryRouter.put("/:id",
    multerHost(validExtension.image).single("image"),
    validation(CV.updateCategory),
    auth(SystemRoles.admin),
    CC.updateCategory
);
export default subCategoryRouter;