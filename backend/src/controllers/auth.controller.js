import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { db } from '../libs/db.js';
// The standard import is usually from '@prisma/client', check if this is correct for your setup
import { UserRole } from '../generated/prisma/index.js'; 

const register = async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await db.User.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                error: "User with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.User.create({
            data: {
                email,
                // FIX 1: The variable from the request is 'username', but the database field is 'name'.
                // This correctly maps the 'username' from the request to the 'name' field in the database.
                name: username, 
                password: hashedPassword,
                role: UserRole.USER 
            }
        });

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        });

        res.status(201).json({
            sucess: true,
            message: "User Created Successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                // FIX 2: The object returned by Prisma is 'newUser.name'.
                // This correctly reads the name and sends it back as 'username' in the response.
                username: newUser.name, 
                role: newUser.role,
                image: newUser.image
            }
        });
    } catch (error) {
        console.error("!!! REGISTER ERROR !!!", error);
        return res.status(500).json(
            {
                 message: 'Error creating user. See server logs for details.'
            }
        );
    }
};

// --- Placeholder functions ---
const login = async (req, res) => {
    // Get the user details , decontruct them
    const {email, password} = req.body;

    // Check all are available or not
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }



    try {

        // bring the user email to check the User Email
        const user  = await db.User.findUnique({
            where:{
                email
            }
        })

        // If exists Kick it
        if (!user){
            return res.status(401).json({
                error:"User Not Found"
            })
        }

        // get the user.password from DB and check it with password
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch){
            return res.status(401).json({
                error:"Invaild Credentials"
            })
        }

        //  if good create a JWT token

        const token = jwt.sign({id:user.id}, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        // set the jwt to a cookie

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        });

        res.status(200).json(
            {
                success: true,
                message: "User loggedIn Successfully",
                user: {
                id: user.id,
                email: user.email,
                username: user.name, 
                role: user.role,
                image: user.image
            }
        })
    } catch (error) {
        return res.status(500).json({
            error:"Cannot be Logged In"
        })
    }
};





const logout = async (req, res) => {

    try {
        res.cookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            expires: new Date(0) // Expire the cookie immediately
        }); 

        res.status(200).json(
            {   
                sucess: true,
                message: "User logged out successfully" 
            }
        );
    } catch (error) {
        return res.status(500).json(
            { 
                message: "Error logging out user" 
            });
    }
};

const check = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message:"User Authenticates Succesfully",
            user: req.user
        });
    } catch (error) {
        return res.status(500).json({
            message : "Error in Checking the User"
        })
    }
};

export { register, login, logout, check };

