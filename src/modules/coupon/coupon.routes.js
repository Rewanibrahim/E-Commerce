import express from "express";
import * as CC from "./coupon.controller.js";
import * as PV from "./couponValidation.js"
import { SystemRoles } from "../../utils/systemRoles.js";
const couponRouter = express.Router();

couponRouter.post("/",
    validation(PV.createCoupon),
    auth(SystemRoles.admin),
    CC.createCoupon);

couponRouter.put("/",
      validation(PV.updateCoupon),
      auth(SystemRoles.admin),
      CC.updateCoupon);
export default couponRouter;