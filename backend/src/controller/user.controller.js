import { asyncHandler } from '../utils/assynchandler.js';
import { ApiResponse } from '../utils/apiresponse.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/aperror.js';
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, `Error generating tokens: ${error.message}`);
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;

    if ([fullName, email, username, password].some(field => !field || !field.trim())) {
        throw new ApiError(400, "All fields are compulsory");
    }
    

    const existedUser = await User.findOne({ $or: [{ username }, { email }] }); 
    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase()
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "User registration failed");
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { emailorusername, password } = req.body;

    if (!emailorusername) {
        throw new ApiError(400, "Username or email is required");
    }

    const userdetail = await User.findOne({ $or: [{ username: emailorusername }, { email: emailorusername }] });

    if (!userdetail) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await userdetail.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userdetail._id);

    const options = {
        httpOnly: true,
        secure: true
    };

    const loggedinUser = await User.findById(userdetail._id).select("-password -refreshToken");
    // console.log("User logged in successfully", loggedinUser)
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedinUser, accessToken, refreshToken }, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });
    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});



const getCurrentUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(404, "User does not exist");
    }
    return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});



export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
};
