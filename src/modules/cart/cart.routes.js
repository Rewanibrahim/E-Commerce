import express from "express";
import * as CC from "./cart.controller.js";
import * as PV from "./cartValidation.js"
const cartRouter = express.Router();

cartRouter.post("/",
    validation(PV.createCart),
    auth(Object.values(SystemRoles)),
    CC.createCart);

cartRouter.patch("/",
        validation(PV.removeCart),
        auth(Object.values(SystemRoles)),
        CC.removeCart);
cartRouter.put("/",
            validation(PV.clearCart),
            auth(Object.values(SystemRoles)),
            CC.clearCart); 

export default cartRouter;