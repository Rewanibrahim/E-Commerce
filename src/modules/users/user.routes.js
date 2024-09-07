import express from "express";
import * as UC from "./user.controller.js";
const userRouter = express.Router();

router.post("/signUp",UC.signUp);
router.get("/verifyEmail/:token",UC.verifyEmail);
router.get("/refereshToken/:rfToken",UC.refreshToken);
router.patch("/sendCode",UC.forgetPassword);
router.patch("/resetPassword",UC.resetPassword);
router.post("/signIn",UC.signIn)
export default userRouter;