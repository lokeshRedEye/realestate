import jwt from 'jsonwebtoken'

export const shouldBeLoggedIn = async (req, res) => {
    
    // console.log(req.userId)
     res.status(200).json({message :" you are authorized"})
}

export const shouldBeAdmin = async (req, res) => {


    const token = req.cookies.token

    if(!token) {    
        return res.status(401).json({message :" not authorized"})
    }
   
    jwt.verify(token , process.env.JWT_SECRECT_KEY , async(err , payload) => {
        if(err){
            return res.status(403).json({message :" token is not valid"})
        }
        if(!payload.isAdmin){
            return res.status(403).json({message :" you are not admin   not authorized "})
        }
    
    }
    
    )
        

        res.status(200).json({message :" you are authorized"})
   
}
