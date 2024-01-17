import ChatRoom, { initiateChat, getChatRoomByRoomId, joinChatRoom } from "../models/chatRoom.model";
import { createPostInChatRoom, getConversationByRoomId } from "../models/chatMessage.model";
import SocketClient, { io } from 'socket.io-client'

const socket = io('http://localhost:8080');

export const initiate = async (data: any) => {
    try {
        const alluserIds = [...data.userIds, data.chatInitiator];
        const chatRoom = await initiateChat(alluserIds, data.chatInitiator);
        return chatRoom;
    } catch (err) {
        throw new Error((err as Error).message);
    }
}

export const postMessage = async (id: string, data: any) => {
    try {
        const roomId = id
        const messagePayload = {
            messageText: data.messageText
        }
        const currentLoggedUser = data.userId
        const userInRoom = await getChatRoomByRoomId(roomId);
        if (!userInRoom.userIds.includes(currentLoggedUser)) {
            throw new Error("wrong user try to access the room")
        }
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
        const roomBeforeJoin = await getChatRoomByRoomId(roomId);
        if (roomBeforeJoin.userIds.includes(userId)) {
            throw new Error("user already in the room")
        }
        const room = await joinChatRoom(roomId, userId);
        return room
    } catch (err) {
        throw new Error((err as Error).message);
    }
}