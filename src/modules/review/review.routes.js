import express from "express";
import * as RC from "./review.controller.js";
import * as RV from "./reviewValidation.js"
import { SystemRoles } from "../../utils/systemRoles.js";
const reviewRouter = express.Router({mergeParams:true});

reviewRouter.post("/",
    validation(RV.createReview),
    auth(SystemRoles.admin),
    RC.createReview);

    reviewRouter.delete("/:id",
        validation(RV.deleteReview),
        auth(SystemRoles.admin),
        RC.deleteReview);

export default reviewRouter;