import mongoose from "mongoose";

const ChatMessage = new mongoose.Schema(
    {
        chatRoomId: {
            type: String
        },
        message: {
            type: mongoose.Schema.Types.Mixed
        },
        postedByUser: {
            type: String
        }
    },
    {
        timestamps: true,
    }
)

export default mongoose.model('ChatMessage', ChatMessage)

export const createPostInChatRoom = async (chatRoomId, message, postedByUser:string) => {
    try {
        const postedBy = await mongoose.model('User').findOne({ _id: postedByUser });
        const chatRoomInfo = await mongoose.model('ChatRoom').findOne({ _id: chatRoomId });
        console.log("postby: " + postedByUser)
        console.log("chatinit: " + chatRoomInfo.chatInitiator)
        console.log(chatRoomInfo.chatInitiator != postedByUser)
        if (!chatRoomInfo.userIds.includes(postedByUser) && chatRoomInfo.chatInitiator != postedByUser) {
            throw new Error('user does not belong to the chat room')
        }
        const userProfile = await mongoose.model('User').find({ _id: { $in: chatRoomInfo.userIds } });
        const post = await mongoose.model('ChatMessage').create({
            chatRoomId: chatRoomId,
            message: message,
            postedByUser: postedByUser
        })

        const postObject = {
            _id: post._id,
            postedByUser: postedBy,
            chatRoomInfo: chatRoomInfo,
            userProfile: userProfile,
            message: message,
            chatRoomId: chatRoomId
        }
       
        return postObject
    } catch (err) {
        throw new Error((err as Error).message)
    }
}

export const getConversationByRoomId = async (roomId: string) => {
    try {
        return await mongoose.model('ChatMessage').aggregate([
            { $match: { chatRoomId: roomId } },
            { $sort: { createdAt: -1 } },
        ])
    } catch (err) {
        throw new Error((err as Error).message)
    }
}