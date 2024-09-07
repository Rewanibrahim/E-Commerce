import express from "express";
import * as PC from "./product.controller.js";
import * as PV from "./productValidation.js"
import reviewRouter from "../review/review.routes.js";
import wishListRouter from "../wishList/wishList.routes.js";
import { SystemRoles } from "../../utils/systemRoles.js";
const productRouter = express.Router();

productRouter.use("/:productId/reviews", reviewRouter)
productRouter.use("/:productId/wishList", wishListRouter)


productRouter.post("/",
    multerHost(validExtension.image).fields([
      {name:"image", maxCount:1},
      {name:"coverImages", maxCount:3}
    ]),
    validation(PV.createProduct),
    auth(SystemRoles.admin),
    PC.createProduct);

productRouter.put("/:id",
      multerHost(validExtension.image).fields([
        {name:"image", maxCount:1},
        {name:"coverImages", maxCount:3}
      ]),
      validation(PV.updateProduct),
      auth(SystemRoles.admin),
      PC.updateProduct);



export default productRouter;