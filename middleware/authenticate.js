const jwt = require("jsonwebtoken");
const userdb = require("../schemas/registration");



const authenticate = async(req,res,next)=>{

    try {
        const token = req.headers.authorization;
       
        const verifytoken = jwt.verify(token,'thisisthesecreattokenkey');
        
        // const rootUser = await userdb.findOne({_id:verifytoken._id});
        const rootUser = await userdb.findOne({email:verifytoken.email});

        if(!rootUser) {throw new Error("user not found")}

        req.token = token
        req.rootUser = rootUser
        req.id = rootUser._id

        next();

    } catch (error) {
        res.status(401).json({status:401,message:"Unauthorized no token provide"})
    }
}


module.exports = authenticate