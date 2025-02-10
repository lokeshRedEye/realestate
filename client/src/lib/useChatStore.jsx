import { create } from "zustand";

const useChatStore = create((set) => ({
    senderId: null,
    senderUsername: "",
    receiverId: null,
    receiverUsername: "",
    
    // Function to set sender and receiver
    setChatUsers: (senderId, senderUsername, receiverId, receiverUsername) =>
        set({ senderId, senderUsername, receiverId, receiverUsername }),
}));

export default useChatStore;
