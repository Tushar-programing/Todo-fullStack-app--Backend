import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT =  asyncHandler( async(req, _, next) => {
    try {
        // console.log("1");

        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        // console.log("1.1");
        if (!token) {
            throw new ApiError(400, "Unauthorized request")
        }
        // console.log("1.2");
      
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // console.log("1.3");

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        // console.log("1.4");

        if (!user) {
            throw new ApiError(400, "Invalid access token")
        }
        // console.log("1.5");

        req.user = user
        // console.log("1.6");

        next()

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})