import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
// import { JsonWebTokenError } from "jsonwebtoken";
import jwt from "jsonwebtoken"

console.log("its working 2")

const generateAccessAndRefreshTokens = async(userid) => {
    try {
        // console.log( "userid in", userid);
        const user = await User.findById(userid)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        // console.log("tokens", accessToken);
        // console.log("tokens in", refreshToken);

        return {accessToken, refreshToken}
    } catch (error) {
        
    }
}

const register = asyncHandler(async(req, res) => {
    // console.log("register is working")
    const {fullName, email, password} = req.body;

    console.log(fullName, email, password);

    if (!fullName || !email || !password) {
        throw new ApiError(400, "all Fields are required")
    }

    const existedUser = await User.findOne({
        email,
    })

    if (existedUser) {
        throw new ApiError(400, "User already exist")
    }

    const user =  await User.create({
        fullName,
        email,
        password
    })

    if (!user) {
        throw new ApiError(400, "unable to create user")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, user, "succesfully created the user"))

})

const login = asyncHandler(async(req, res) => {
    console.log("login is working");
    const {email, password} = req.body;

    console.log(email, password);

    if (!email || !password) {
        throw new ApiError(400, "all fields are required")
    }
    console.log("1");
    const user = await User.findOne({
        email,
    })
    console.log("2.1");
    if (!user) {
        throw new ApiError(400, "user does not exist")
    }
    console.log("3");
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    console.log("4");
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Incorrect Password");
    }
    console.log("4");
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
    console.log("5");
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    console.log("5.1");
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    }
    console.log("6");
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in succesfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.userId,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logout successfully"))
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(400, "Unauthorized request");
    }

    // console.log("incomingrefreshToken", incomingRefreshToken);

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        // console.log("decodedToken", decodedToken);

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(400, "Invalid access Token")
        }
        // console.log(user?.refreshToken);

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        }
        console.log(user?._id);

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user?._id);
        console.log("refreshToken", refreshToken);

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken},
                "access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(400, error?.message || "Invalid Access token")
    }
})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body;
    
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "all feilds are required");
    }

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "old password is incorrect")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "password update successfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "user fetched succesfully"))
})

const updateName = asyncHandler(async(req, res) => {
    const {newName} = req.body

    if (!newName) {
        throw new ApiError(400, "new name is required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName: newName,
            }
        },
        {new: true}
    ).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(400, "Failed to update the name")
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200, user, "name updated succesfully"))
})


export {
    register,
    login,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateName,
}