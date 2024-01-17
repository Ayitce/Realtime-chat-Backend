import mongoose from "mongoose";

const ChatRoom = new mongoose.Schema(
    {
        userIds: {
            type: Array
        },
        chatInitiator: {
            type: String
        },
        isAvailable: {
            type: Boolean
        },
        roomName: {
            type: String
        }
    },
    {
        timestamps: true,
    }
)

export default mongoose.model('ChatRoom', ChatRoom)

export const initiateChat = async (userIds, chatInitiator) => {
    try {
        const availableRoom = await mongoose.model('ChatRoom').findOne({
            userIds: {
                $size: userIds.length,
                $all: [...userIds],
            }
        });
        if (availableRoom) {
            return {
                isNew: false,
                message: 'retrieving an old chat room',
                chatRoomId: availableRoom._id,
            }
        }

        const newRoom = await mongoose.model('ChatRoom').create({
            userIds: userIds,
            chatInitiator: chatInitiator
        })
        return {
            isNew: true,
            message: 'created a new chat room',
            chatRoomId: newRoom._id,
        }
    } catch (error) {
        console.log('error on start chat method', error);
        throw error;
    }
}

export const getChatRoomByRoomId = async (roomId: string) => {
    try {
        const room = await mongoose.model('ChatRoom').findOne({ _id: roomId });
        return room
    } catch (err) {
        throw new Error((err as Error).message);
    }
}

export const joinChatRoom = async (roomId: string, userId: string) => {
    try {
        const room = await mongoose.model('ChatRoom').findOneAndUpdate({ _id: roomId }, { $push: { userIds: userId } });
        return room
    } catch (err) {
        throw new Error((err as Error).message);
    }
}