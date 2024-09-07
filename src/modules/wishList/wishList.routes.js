import express from "express";
import * as WC from "./wishList.controller.js";
import * as WV from "./wishList.validation.js"
import {validation} from '../../middleware/validation.js';
import {auth} from '../../middleware/auth.js';
import {SystemRoles} from "../../utils/systemRoles.js"
const wishListRouter = express.Router({mergeParams:true});

wishListRouter.post("/",
    validation(WV.createWishList),
    auth(SystemRoles.admin),
    WC.createWishList);


export default wishListRouter;