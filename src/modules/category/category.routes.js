import express from "express";
import * as CC from "./category.controller.js";
import * as CV from "./category.validation.js"
import { SystemRoles } from "../../utils/systemRoles.js";
const categoryRouter = express.Router();

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
export default categoryRouter;