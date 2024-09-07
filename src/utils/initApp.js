import connectionDB from "../../db/connection.js";
import * as routers from "../utils/index.routes.js";
import { GlobalErrorHandler } from "./asyncHandler.js";
import { deleteFromCloudinary } from "./deleteFromCloudinary.js";
import { deleteFromDb } from "./deleteFromDb.js";



export const initApp = (app,express) =>{
    const port = 3000
    
app.use(express.json());

app.use("/users", routers.userRouter)
app.use("/categories",routers.categoryRouter)
app.use("/subCategories",routers.subCategoryRouter)
app.use("/products",routers.productRouter)
app.use("/coupons",routers.couponRouter)
app.use("/carts",routers.cartRouter)
app.use("/orders",routers.orderRouter)
app.use("/reviews",routers.reviewRouter)

connectionDB();
app.use((req,res,next) => {
    if(req.originalUrl =="/orders/webhook"){
        next()
    } else{
        express.json()(req,res,next)
    }
});

app.use("*",(req, res, next) => {
next (new AppError(`inValid url ${req.originalUrl}`))
})
app.use(GlobalErrorHandler,deleteFromCloudinary,deleteFromDb)

app.listen(port, () =>{
    console. log(`server is running on port ${port}`);
})

}