import jwt from "jsonwebtoken"
import dotenv from "dotenv";

import {UserDetailsmodel} from "../models/userloginsignupmodels.js";
import { asyncHandler } from "./asyncHandler.js";
import {ApiError} from "./ApiError.js"

dotenv.config();

const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken

   
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await UserDetailsmodel.findOne({email:decodedToken.email})

        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})

export default verifyJWT