import orderModel from "../../../db/models//order.model.js";
import couponModel from "../../../db/models/coupon.model.js";
import productModel from "../../../db/models//product.model.js";
import cartModel from "../../../db/models//cart.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/classError.js";
import { sendEmail } from "../../service/sendEmail.js";


// ===============================    createOrder    ===============================
export const createOrder = asyncHandler(async (req, res, next) => {
    const { productId, quantity, couponCode, address, phone, paymentMethod } = req.body;

    if (couponCode) {
        const coupon = await couponModel.findOne({ code: couponCode.toLowerCase() });

        if (!coupon || coupon.toDate < Date.now()) {
            return next(new AppError("coupon not exist or expired", 404));
        }

        req.body.coupon = coupon;
    }
    let products = [];
    let flag = false;

    if (productId) {
        products = [productId, quantity];
    } else {
        const cart = await cartModel.findOne({ user: req.user._id });

        if (!cart.products.length) {
            return next(new AppError("cart is empty, please select product", 404));
        }

        products = cart.products;
        flag = true;
    }

    for (const product of products) {
        const checkProduct = await productId.findOne({ _id: product.productId, stock: { $gte: product.quantity } });

        if (!checkProduct) {
            return next(new AppError("product not exist or out of stock", 404));
        }

        if (flag) {
            product = product.toObject();
        }

        product.title = checkProduct.title;
        product.price = checkProduct.price;
        product.finalPrice = checkProduct.subPrice;

        finalProducts.push(product)
    }
    const order = await orderModel.create({
        user: req.user._id,
        products: finalProducts,
        subPrice,
        couponId: req.body?.coupon?.id,
        totalPrice: subPrice - subPrice * ((req.body?.coupon?.amount || 0) / 100),
        paymentMethod,
        status: paymentMethod === "cash" ? "placed" : "waitPayment",
        phone,
        address
    });
    
    if (req.body?.coupon){
        await couponModel.updateOne({_id:req.body._id},{
            $push: {usedBy: req.user._id}
        })
    }
    for (const product of finalProducts){
        await productModel.findByIdAndUpdate({_id:product.productId},{
            $inc: {stock:-product.quantity}
        })
    }
    if(flag){
        await cartModel.updateOne({user:req.user._id},{products: []})
    }

    const invoice = {
        shipping: {
          name: req.user.name,
          address: req.user.address,
          city: "Egypt",
          state: "cairo",
          country: "cairo",
          postalCode: 94111
        },
        items: order.products,
        subtotal: subPrice,
        paid: order.totalPrice,
        invoice_nr: order._id,
        date: order.createdAt,
        coupon: req.body?.coupon?.amount ||0
      };
      
      await createInvoice(invoice, "invoice.pdf");

      await sendEmail(req.user.email,"Order placed","Your order has been placed successfully",[
        {
        path:"invoice.pdf",
        contentType: "application/pdf",
        }
      ])

      await payment({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: req.user.email,
        metadata: {
            orderId: order._id.toString(), // Assuming you have an order ID generation mechanism
          },
          success_url: `${req.protocol}://${req.headers.host}/orders/success/${order._id}`,
          cancel_url: `${req.protocol}://${req.headers.host}/orders/cancel/${order._id}`,
          line_items: products.map((product) =>{
            return{
                price_data: {
                    currency: 'egp',
                    product_data: {
                      name: product.title,
                    },
                    unit_amount: product.price * 100,
                  },
                  quantity: product.quantity,
            }
          }),
          discounts: coupon ? { coupon: req.body.couponId } : [],
        });


        res.status(201).json({ msg: "done",url:session.url, order }); 
}
);
//===================== webhook ====================================
export const webhook = asyncHandler(async (req, res, next) => {
    const stripe = new Stripe(process.env.stripe_secret);
    const sig = req.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
    const orderId = event.data.object.metadata.orderId;
  
    if (event.type === 'checkout.session.completed') {
      if (event.data.object.metadata.status === 'ordered') {
        await orderModel.updateOne({ _id: orderId }, { status: 'rejected' });
        return res.status(400).json({ msg: 'fail' });
      }
  
      await orderModel.updateOne({ _id: orderId }, { status: 'placed' });
      return res.status(200).json({ msg: 'done' });
    }
  });

