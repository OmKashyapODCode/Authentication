
const TryCatch = (handler) => {
    return async(req,res,next)=> {
        try{
            await handler(req,res,next);
        }
        catch(e){
            res.status(500).json({
                success:false,
                message: e.message,
            })
        }
    }
}

export default TryCatch;