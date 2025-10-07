import { loginSchema, registerSchema } from "../config/zod.js";
import { redisClient } from "../index.js";
import TryCatch from "../middlewares/tryCatch.js";
import sanitize from "mongo-sanitize";//-> to prevent from NoSQL injection attacks
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import crypto, { verify } from "crypto";
import sendMail from "../config/sendMail.js";
import { getOtpHtml, getVerifyEmailHtml } from "../config/html.js";
import { generateToken } from "../config/generateToken.js";

// Register user controller
export const registerUser = TryCatch(async(req,res) =>{
    const sanitizedBody = sanitize(req.body);
    const validation = registerSchema.safeParse(sanitizedBody);

    if(!validation.success){
        const zodError = validation.error;

        let firstErrorMessage = "Validation Error";
        let allErrors = [];

        if(zodError?.issues && Array.isArray(zodError.issues)){

            allErrors = zodError.issues.map((issue)=> ({
                field: issue.path?issue.path.join(".") : "unKnown field",
                message : issue.message || "Validation error",
                code: issue.code,
            }));

            firstErrorMessage = allErrors[0]?.message || "Validation error"
        }
        return res.status(400).json({
            success:false,
            message: firstErrorMessage,
            errors:allErrors,
        })
    }

    const {name,email,password} = validation.data;

    const rateLimitKey = `register-rate-limit:${req.ip}:${email}`

    if(await redisClient.get(rateLimitKey)){
        return res.status(429).json({
            message : " Too many requests ,please try again after some time"
        })
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            message: "User already exists with this email"
        });
    }

    const hashPassword = await bcrypt.hash(password,10);

    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyKey = `verify:${verifyToken}`;

    const dataToStore = JSON.stringify({
        name,email,password:hashPassword,
    });

    await redisClient.set(verifyKey,dataToStore,{EX : 300});

    const subject = "verify your email for account creation ";
    const html = getVerifyEmailHtml({ email, token: verifyToken });

    await sendMail({
        email,subject,html
    });

    await redisClient.set(rateLimitKey,"true",{EX:60*5});


    res.json({
        message:"User registered successfully , please verify your email to activate your account.A verification link has been send.It will expire in 5 minutes"
    })
});

// Verify user controller
export const verifyUser = TryCatch(async(req,res)=>{
    const {token} = req.params;
    if(!token){
        return res.status(400).json({
            message:"verification token is required",
        });
    }

    const verifyKey = `verify:${token}`;
    const userDataJson = await redisClient.get(verifyKey);

    if(!userDataJson){
        return res.status(400).json({
            message:"Invalid or expired token"
        })
    }

    await redisClient.del(verifyKey);
    const userData = JSON.parse(userDataJson);
    const existingUser= await User.findOne({
        email: userData.email
    })
    if(existingUser){
        return res.status(400).json({
            message: "User already exists with this email"
        });
    }

    const newUser = await User.create({
        name :userData.name,
        email: userData.email,
        password: userData.password,
    });
    res.status(201).json({
        message: "Email verified successfully , account created",
        User:{
            _id : newUser._id,
            name:newUser.name,
            email:newUser.email,
            password:newUser.password,
        }
    })
})

// Login user controller
export const loginUser = TryCatch(async(req,res)=>{
    const sanitizedBody = sanitize(req.body);
    const validation = loginSchema.safeParse(sanitizedBody);

    if(!validation.success){
        const zodError = validation.error;
        let firstErrorMessage = "Validation Error";
        let allErrors = [];

        if(zodError?.issues && Array.isArray(zodError.issues)){
            allErrors = zodError.issues.map((issue)=> ({
                field: issue.path?issue.path.join(".") : "unKnown field",
                message : issue.message || "Validation error",
                code: issue.code,
            }));
            firstErrorMessage = allErrors[0]?.message || "Validation error"
        }
        return res.status(400).json({
            success:false,
            message: firstErrorMessage,
            errors:allErrors,
        })
    }

    const {email,password} = validation.data;

    const rateLimitKey  = `login-rate-limit:${req.ip}:${email}`;
    if(await redisClient.get(rateLimitKey)){
        return res.status(429).json({
            message : " Too many requests ,please try again after some time"
        })
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const comparePassword = await bcrypt.compare(password,user.password);
    if(!comparePassword){
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    //generate a otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `otp:${email}`;

    await redisClient.set(otpKey,JSON.stringify({otp}),{EX:300});

    const subject = "Your OTP for Login is here ";
    const html = getOtpHtml({email,otp});

    await sendMail({email,subject,html});
    await redisClient.set(rateLimitKey,"true",{EX:60});

    res.json({
        message:"OTP has been sent to your email.It will expire in 5 minutes"
    })
})

// Verify OTP 
export const verifyOtp = TryCatch(async(req,res)=>{
    const {email,otp} = req.body;
    if(!email || !otp){
        return res.status(400).json({
            message:"email and otp are required",
        })
    }
    
    const otpKey = `otp:${email}`;
    const otpDataJson = await redisClient.get(otpKey);
    if(!otpDataJson){
        return res.status(400).json({
            message:"Invalid or expired OTP",
        })
    }
    const otpData  = JSON.parse(otpDataJson);
    if(otpData.otp !== otp){
        return res.status(400).json({
            message:"Invalid OTP"
        })
    }
    await redisClient.del(otpKey);
    let  user = await User.findOne({email});
    
    const tokenData = await generateToken(user._id,res);

    res.status(200).json({
        message: `welcome ${user.name} , you have logged in successfully`,
        user,
    })
})
