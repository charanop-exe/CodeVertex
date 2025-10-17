import jwt, { decode } from "jsonwebtoken";
import {db} from "../libs/db.js"


const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt

        if (!token){
            return res.status(401).json({
                message:"Unauthorized - No token Found"
            })
        }

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            return res.status(401).json({
                message : "Unauthorized - Invalid Token"
            })
        }

        const user = await db.user.findUnique({
            where : {
                id : decoded.id
            },
            select:{
                id:true,
                email:true,
                name:true,
                role:true,
                image:true
            }
        })

        if (!user){
            return res.status(404).json({
                message : "User Not Found"
            })
        }

        req.user = user;
        next()
    } catch (error) {
        return res.status(500).json({
            error:"Error in Authenticating "
        })
    }
}

const checkAdmin = async (req, res, next) => {
    try {
        const userId = req.user.id
        const user = await db.user.findUnique({
            where:{
                id : userId
            },
            select :{
                role:true
            }
        })

        if  (!user || user.role !== "ADMIN"){
            return res.status(403).json({
                message:"Forbidden - You dont have permission to access this resource."
            })
        }


        next()
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            error:"Somenthing Wrong in checking role"
        })
    }
}

export default authMiddleware
export { checkAdmin }  