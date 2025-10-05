import { registerSchema } from "../config/zod.js";
import TryCatch from "../middlewares/tryCatch.js";
import sanitize from "mongo-sanitize";//-> to prevent NoSQL injection attacks

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


    res.json({
        name,email,password,
    })
})