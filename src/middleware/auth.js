import jwt from "jsonwebtoken";
import userModel from "../../db/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";




export const auth = (roles = []) => {
    return asyncHandler(async (req, res, next) => {
        const { token } = req.headers;
        if (!token) {
            return res.status(400).json({ msg: "token not exist" });
        }
        if (!token.startsWith("ahmed__")) {
            return res.status(400).json({ msg: "invalid bearer key" });
        }
        const newToken = token.split("ahmed__")[1];
        if (!newToken) {
            return res.status(400).json({ msg: "invalid token" });
        }
        const decoded = jwt.verify(newToken, "generateTokenSecret");
        if (!decoded?.email) {
            return res.status(400).json({ msg: "invalid token payload" });
        }
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return res.status(400).json({ msg: "user not exist" });
        }
        if (!roles.includes(user.role)) {
                return res.status(401).json({msg: "you din't have permission"})
            }
        req.user = user;
        next()
    });
};

