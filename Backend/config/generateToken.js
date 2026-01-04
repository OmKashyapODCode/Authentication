import jwt from 'jsonwebtoken';
import { redisClient } from '../index.js';


export const generateToken= async(id ,res)=> {
    const accessToken = jwt.sign({id},process.env.JWT_SECRET, {expiresIn:'1m'});
    const refreshToken = jwt.sign({id},process.env.REFRESH_SECRET, {expiresIn:'7d'});
    const refreshTokenKey = `refresh-token:${id}`;
    
    await redisClient.setEx(refreshTokenKey,7*24*3600, refreshToken);

    res.cookie("accessToken",accessToken, {
        httpOnly : true,
        // secure   : true,// for https
        sameSite : "strict",//no csrf attack
        maxAge   : 20001*60000 // 1 min
    });

    res.cookie("refreshToken" , refreshToken, {
        httpOnly:true,
        // secure:true,
        sameSite:"none",
        maxAge: 7*24*60*60000 // 7 days
    });
    
    return {accessToken,refreshToken};
}

export const verifyRefreshToken = async(refreshToken)=>{
    try {
        const decode = jwt.verify(refreshToken,process.env.REFRESH_SECRET);
        const storedToken = await redisClient.get(`refresh-token:${decode.id}`);

        if(storedToken===refreshToken){
            return decode;
        }
        return null;
    } catch (error) {
        return null;
    }
}

export const generateAccessToken = (id,res)=>{
    const accessToken = jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'1m'});
     res.cookie("accessToken",accessToken, {
        httpOnly : true,
        // secure   : true,// for https
        sameSite : "strict",//no csrf attack
        maxAge   : 1*60000 // 1 min
    });
}

export const revokedRefreshedToken = async(userId)=>{
    await redisClient.del(`refresh-token:${userId}`);
}