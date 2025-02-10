import prisma from "../lib/prisma.js"
import bcrypt from "bcrypt"

export const getUsers = async (req , res) => {
    try {
       const users = await prisma.user.findMany();

       res.status(200).json(users)
        
    } catch (error) { 
        console.log(error)
        res.status(500).json({"error":"Failed to fetch users"}) 
        
    }
}

export const getUser = async (req , res) => {
    const id =  req.params.id
    try {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })

       res.status(200).json(user)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({"error":"Failed to fetch user single user"}) 
        
    }
}

export const updateUser = async (req , res) => {

    const id =  req.params.id;
    const {password ,avatar, ...inputs} = req.body 
    const tokenUserId = req.userId;

    if(id !== tokenUserId){
        res.status(403).json({message:"You are not authorized to update this user"})
    }
    let updatedPassword;
    
    try {

        if(password){
            updatedPassword = await bcrypt.hash(password , 10)
        }

        const upatedUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                ...inputs,
                ...(updatedPassword && {password: updatedPassword}),
                ...(avatar && {avatar})
            }
        })

        const {password : userpassword , ...rest} = upatedUser

       res.status(200).json(rest)
        
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Failed to update users"}) 
        
    }
}

export const deleteUser = async (req , res) => {

    const id =  req.params.id;
    const tokenUserId = req.userId;

    if(id !== tokenUserId){
        res.status(403).json({message:"You are not authorized to update this user"})
    }
    try {
        await prisma.user.delete({
            where: {
                id
            }
        })
        res.status(200).json({message:"User deleted successfully"})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({"error":"Failed to delete users"}) 
        
    }
}

export const savePost = async (req, res) => {
    const postId = req.body.postId;
    const tokenUserId = req.userId;

    console.log("Post ID:", postId, "User ID:", tokenUserId);

    if (!tokenUserId) {
        return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }

    try {
        const savedPost = await prisma.savedPost.findUnique({
            where: {
                userId_postId: {
                    userId: tokenUserId,
                    postId,
                },
            },
        });

        console.log("Existing Saved Post:", savedPost);

        if (savedPost) {
            await prisma.savedPost.delete({
                where: {
                    id: savedPost.id,
                },
            });
            console.log('Post removed from saved list');

            return res.status(200).json({ message: "Post removed from saved list" });
        } else {
            const newSavedPost = await prisma.savedPost.create({
                data: {
                    userId: tokenUserId,
                    postId,
                },
            });

            console.log("New Saved Post:", newSavedPost);
            return res.status(200).json({ message: "Post saved" });
        }
    } catch (err) {
        console.error("Error in savePost:", err);
        return res.status(500).json({ message: "Failed to save or remove post!", error: err.message });
    }
};

  export const profilePosts = async (req, res) => {
    const tokenUserId = req.userId;
    // console.log(tokenUserId)
    try {
      const userPosts = await prisma.post.findMany({
        where: { userId: tokenUserId },
      });
      const saved = await prisma.savedPost.findMany({
        where: { userId: tokenUserId },
        include: {
          post: true,
        },
      });
  
      const savedPosts = saved.map((item) => item.post);
      res.status(200).json({ userPosts, savedPosts });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to get profile posts!" });
    }
  };

  export const getNotificationNumber = async (req, res) => {
    const tokenUserId = req.userId;
    try {
      const number = await prisma.chat.count({
        where: {
          userIDs: {
            hasSome: [tokenUserId],
          },
          NOT: {
            seenBy: {
              hasSome: [tokenUserId],
            },
          },
        },
      });
      res.status(200).json(number);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to get profile posts!" });
    }
  };