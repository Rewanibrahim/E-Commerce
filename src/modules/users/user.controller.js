import userModel from "../../../db/models/user.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/classError.js";


//<<<<<<<<<<<<<<<<<<<<<<<<<<<< SignUp>>>>>>>>>>>>>>>>>>>>>>
export const signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password, age, phone, address } = req.body;

  const userExist = await userModel.findOne({ email: email.toLowerCase() });
  userExist && next(new AppError("user already exist", 409));

  const token = jwt.sign({ email }, "generateTokenSecret", { expiresIn: 60 * 2 });
  const link = `http://localhost:3000/users/verifyEmail/${token}`;

  const rfToken =jwt.sign({ email }, "generateTokenSecretRefresh");
  const rflink = `http://localhost:3000/users/refreshToken/${rfToken}`;

  await sendEmail(email, "verify your email", `<a href="${link}">click here</a> <br> 
    <a href="${rflink}">click here to resend the link`);

  const hash = bcrypt .hashSync(password ,10)

  const user=new userModel({name, email, password:hash, age, phone, address})
  const newUser = await user.save()

  newUser ?res.status(201).json({msg:"done",user:newUser}) :next(new AppError("user not created",500))

})



//<<<<<<<<<<<<<<<<<<<<<<<<<<<< Verify email >>>>>>>>>>>>>>>>>>>>>>
export const verifyEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const decoded = jwt.verify(token, "generateTokenSecret");
    if (!decoded?.email) return next(new AppError("invalid token", 400))
    const user = await userModel.findOneAndUpdate(
      { email: decoded.email, confirmed: false },
      { confirmed: true }
    );
    user? 
      res.status(201).json({ msg: "done" })
      : next(new AppError("user not exist or already confirmed", 400));
  });
  


  // ======================== refreshToken ========================
export const refreshToken = asyncHandler(async (req, res, next) => {
    const { rfToken } = req.params;
    const decoded = jwt.verify(rfToken, "generateTokenSecretRefresh");
    if (!decoded?.email) return next(new AppError("invalid token", 400));
    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmed: true });
    if(user){
        return next(new AppError("user already confirmed", 400));
    }
    const token = jwt.sign({ email:decoded.email }, "generateTokenSecret", { expiresIn: 10 });
    const link = `http://localhost:3000/users/verifyEmail/${token}`;

    await sendEmail(decoded.email, "verify your email", `<a href="${link}">click here</a>`);
    res.status(201).json({ msg: "done" })

  });

  //------------------------ forget password ------------------------------
  export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
  
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return next(new AppError("user not exist", 404));
    }
  
    const code = customAlphabet("0123456789", 5);
    const newCode = code();
  
    await sendEmail(email, "code for reset password", `<h1> your code is ${newCode}</h1>`);
    await userModel.updateOne({ email }, { code: newCode });
  
    res.status(200).json({ msg: "done" });
  });
  

    //------------------------ reset password ------------------------------
    export const resetPassword = asyncHandler(async (req, res, next) => {
      const { email, code, password } = req.body;
    
      const user = await userModel.findOne({ email: email.toLowerCase() });
      if (!user) {
        return next(new AppError("user not exist", 404));
      }
    
      if (user.code !== code || code =="") {
        return next(new AppError("invalid code", 400));
      }
    
      const hash = bcrypt.hashSync(password, +process.env.saltRounds);
    
      await userModel.updateOne({ email }, { password: hash, code: "", passwordChangeAt:Date.now() });
    
      res.status(200).json({ msg: "done" });
    });
    

    //------------------------ signIn------------------------------
    export const signIn = asyncHandler(async (req, res, next) => {
      const { email, password } = req.body;
    
      const user = await userModel.findOne({ email: email.toLowerCase(), confirmed: true });
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return next(new AppError("user not exist or invalid password", 404));
      }
    
      const token = jwt.sign({ email, role: user.role }, process.env.signatureKey);
    
      await userModel.updateOne({ email }, { loggedIn: true });
    
      res.status(200).json({ msg: "done", token });
    });
    
