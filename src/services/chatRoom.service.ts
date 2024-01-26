import { initiateChatWithOtherUsers, getChatRoomByRoomId, joinChatRoom, initiateChat, exitRoom, getAllChatRooms, getAllChatRoomCreatedByUser } from "../models/chatRoom.model";
import { createPostInChatRoom, getConversationByRoomId } from "../models/chatMessage.model";
import { io } from 'socket.io-client'

const socket = io('http://localhost:8080');

export const initiateChatService = async (roomName, chatInitiator) => {
    try {
        const chatRoom = await initiateChat(roomName, chatInitiator);
        return chatRoom;
    } catch (err) {
        throw new Error((err as Error).message);
    }
}
export const initiateChatWithOtherUsersService = async (userIds, chatInitiator) => {
    try {
        const alluserIds = [...userIds, chatInitiator];
        const chatRoom = await initiateChatWithOtherUsers(alluserIds, chatInitiator);
        return chatRoom;
    } catch (err) {
        throw new Error((err as Error).message);
    }
}

export const postMessage = async (id: string, userId, messageText) => {
    try {
        const roomId = id
        const messagePayload = {
            messageText: messageText
        }
        const currentLoggedUser = userId
        const post = await createPostInChatRoom(roomId, messagePayload, currentLoggedUser);
        console.log(post)
        // In various parts of your application
        socket.emit('new-message', { post: post, roomId: roomId });
        return post
    } catch (err) {
        throw new Error((err as Error).message);
    }
}

export const getChatRoomByRoomIdService = async (roomId: string) => {
    try {
        const room = await getChatRoomByRoomId(roomId);
        return room
    } catch (err) {
        throw new Error((err as Error).message);
    }
}

export const getConversationByRoomIdService = async (roomId: string) => {
    try {
        const conversation = await getConversationByRoomId(roomId);
        return conversation
    } catch (err) {
        throw new Error((err as Error).message);
    }
}

export const joinChatRoomService = async (roomId: string, userId: string) => {
    try {
        const room = await joinChatRoom(roomId, userId);
        return room
    } catch (err) {
        throw new Error((err as Error).message);
    }
}

export const exitChatRoomService = async (roomId: string, userId: string) => {
    try {
        const room = await exitRoom(roomId, userId);
        return room
    } catch (err) {
        throw new Error((err as Error).message);
    }
}

export const getAllChatRoomsService = async () => {
    try {
        const rooms = await getAllChatRooms();
        return rooms
    } catch (err) {
        throw new Error((err as Error).message);
    }
}

export const getAllChatRoomCreatedByUserService = async (userId: string) => {
    try {
        const rooms = await getAllChatRoomCreatedByUser(userId);
        return rooms
    } catch (err) {
        throw new Error((err as Error).message);
    }
}