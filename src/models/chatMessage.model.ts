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
        /* 
                const aggregate = await mongoose.model('ChatMessage').aggregate([
                    { $match: { _id: post._id } },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'postedByUser',
                            foreignField: '_id',
                            as: 'postedByUser'
                        }
                    },
                    { $unwind: "$postedByUser" },
                    {
                        $lookup: {
                            from: 'chatrooms',
                            localField: 'chatRoomId',
                            foreignField: '_id',
                            as: 'chatRoomInfo'
                        }
                    },
                    { $unwind: "$chatRoomInfo" },
                    { $unwind: "$chatRoomInfo.userIds" },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'chatRoomInfo.userIds',
                            foreignField: '_id',
                            as: 'chatRoomInfo.userProfile'
                        }
                    },
                    { $unwind: "$chatRoomInfo.userProfile" },
                    {
                        $group: {
                            _id: '$chatRoomInfo._id',
                            postId: { $last: '$_id' },
                            chatRoomId: { $last: 'chatRoomInfo._id' },
                            message: { $last: '$message' },
                            postedByUser: { $last: '$postedByUser' },
                            chatRoomInfo: { $addToSet: '$chatRoomInfo.userProfile' },
                            createdAt: { $last: '$createdAt' },
                            updatedAt: { $last: '$updatedAt' },
                        }
                    }
                ]) */
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
            /* {
                $lookup: {
                    from: 'users',
                    localField: 'postedByUser',
                    foreignField: '_id',
                    as: 'postedByUser'
                }
            },
            { $unwind: "$postedByUser" }, */

        ])
    } catch (err) {
        throw new Error((err as Error).message)
    }
}