import bcrypt from 'bcrypt'
import prisma from '../lib/prisma.js'
import jwt from 'jsonwebtoken';


export const register = async(req , res) => {
    console.log(req.body)

    try {
        const {username , email , password} = req.body
     
    const hashedPassword = await bcrypt.hash(password , 10)
    // console.log(hashedPassword)
    // console.log(req.body)

    const newUser = await prisma.user.create({
        data: {
        username,
        email,
        password: hashedPassword,
        },
        });
    // console.log(newUser)
    res.status(201).json(newUser)
    } 
    catch (error) {
        console.log(error)
        res.status(500).json({"error":"Failed to create user"})
    }
    
}

export const login = async(req , res) => {
    const {username , password} = req.body

    try {
        // if the user Exist
        const user = await prisma.user.findUnique({
            where: {
                username
            }
        })
        if(!user)   {
            return res.status(401).json({"error":"Invlaid Credentials"})
        }

        // compatre the password 
        const isPasswordvalid = await bcrypt.compare(password , user.password)
        if(!isPasswordvalid) {
            return res.status(401).json({"error":"Invlaid Credentials"})
        }

        // send the token
        const age = 1000 * 60 * 60 * 24 * 7

        const token = jwt.sign({
            
            id: user.id,
            isAdmin : false
        } , process.env.JWT_SECRECT_KEY , {expiresIn:age})

        const {password : userPassword , ...userInfo} = user
        res.cookie('token' , token  , {
            httpOnly: true,
            maxAge: age,
            // secure: true,
        }).json(userInfo)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({"error":"Failed to login user"})
    }
    //db operaation 
}

export const logout = (req , res) => {

    res.clearCookie('token').status(200).json({message: "Logged Out Successfully"})

}