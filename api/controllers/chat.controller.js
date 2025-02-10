import prisma from "../lib/prisma.js"

export const getChats = async (req, res) => {
    const tokenUserId = req.userId;
    // console.log(tokenUserId)
  
    try {
      const chats = await prisma.chat.findMany({
        where: {
          userIDs: {
            hasSome: [tokenUserId],
          },
        },
      });
  
      for (const chat of chats) {
        // console.log("Chat userIDs:", chat.userIDs);
      
        const receiverId = chat.userIDs.find((id) => id !== tokenUserId);
        // console.log("Receiver ID:", receiverId);
      
        if (!receiverId) {
          // console.warn(`No receiver found for chat ID: ${chat.id}`);
          continue; // Skip this chat if no receiver found
        }
      
        const receiver = await prisma.user.findUnique({
          where: {
            id: receiverId,
          },
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        });
      
        chat.receiver = receiver;
      }
      
  
      res.status(200).json(chats);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to get chats!" });
    }
  };

export const getChat = async (req, res) => {
    const tokenUserId = req.userId
    const chatId = req.params.id
    try {
        const chat = await prisma.chat.findUnique({
            where: {
                id: chatId,
                userIDs: {
                    hasSome: [tokenUserId],
                }
            },
            include:{
                messages:{
                    orderBy:{
                        createdAt:"asc"
                    }
                }
            }
        });

        await prisma.chat.update({
            where: {
                id: chatId,
            },
            data: {
              seenBy:{
                push: tokenUserId
              }
            },
        })

        res.status(200).json(chat)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Failed to get a chat"})
    }
}

export const addChat = async (req, res) => {
    const tokenUserId = req.userId


    try {
        const newChat = await prisma.chat.create({
            data:{
                userIDs:[tokenUserId , req.body.receiverId]
            }
        })
        res.status(200).json(newChat)
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Failed to add chats"})
    }
}

export const readChat = async (req, res) => {
    const tokenUserId = req.userId
    try {

        const chat = await prisma.chat.update({
            where:{
                id: req.params.id,
                userIDs : {
                    hasSome: [tokenUserId]
                }
            },
            data:{
                seenBy: {
                    push: tokenUserId
                }
            }
        })

        res.status(200).json(chat)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Failed to read a  chats"})
    }
}