import express from "express";
import * as OC from "./order.controller.js";
import * as OV from "./orderValidation.js"
import {auth} from "../../middleware/auth.js"
import { SystemRoles } from "../../utils/systemRoles.js";
import { appendXML } from "pdfkit";
const orderRouter = express.Router();

orderRouter.post("/",
    validation(OV.createOrder),
    auth(SystemRoles.admin),
    OC.createOrder);

orderRouter.put("/",
            validation(OV.cancelOrder),
            auth(SystemRoles.admin),
            OC.cancelOrder); 

orderRouter.post('/webhook', express.raw({type: 'application/json'}),(req,res) =>{
    const sig = request.headers['stripe-signature'];

    let event;
    try{
        event = stripe.webhooks.constructEvent(request.body,sig,endPointSecret);
    }catch(err){
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }


    switch (event.type){
        case 'checkout.session.completed':
            const checkoutSessionCompleted = event.data.object;
            break;
            default:
                console.log(`Unhandled event type ${event.type}`);

    }
});

export default orderRouter;