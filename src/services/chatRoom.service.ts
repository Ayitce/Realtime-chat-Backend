import { initiateChatWithOtherUsers, getChatRoomByRoomId, joinChatRoom, initiateChat, exitRoom, getAllChatRooms, getAllChatRoomCreatedByUser } from "../models/chatRoom.model";
import { createPostInChatRoom, getConversationByRoomId } from "../models/chatMessage.model";
import { io } from 'socket.io-client'
import * as dotenv from "dotenv";
dotenv.config();
const { FRONTEND_BASE_URL } = process.env;

const socket = io('http://localhost:8080');

import crypto from 'crypto';
const key = crypto.randomBytes(32);
const algorithm = 'aes-256-cbc';
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);

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

export const getInviteLinkService = async (roomId: string) => {
    try {
        const expiredAt = new Date();
        expiredAt.setHours(expiredAt.getHours() + 24);
        const roomIdWithExpireDate = `${roomId}/${expiredAt}`;

        let encrypted = cipher.update(roomIdWithExpireDate, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const link = `${FRONTEND_BASE_URL}/${encrypted}`;

        // const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
        // let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        // decrypted += decipher.final('utf8');

        // console.log(`Original: ${roomIdWithExpireDate}`);
        // console.log(`Decrypted: ${decrypted}`);

        return link;
    } catch (err) {
        console.log(err);
        throw new Error((err as Error).message);
    }
}

export const joinRoomWithInviteLinkService = async (encryptedRoomId: string, userId: string) => {
    try {
        console.log(`Original: ${encryptedRoomId}`);
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedRoomId, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        console.log(`Decrypted: ${decrypted}`);
        const splitedDecrypted = decrypted.split("/");
        const roomId = splitedDecrypted[0];
        const expiredAt = new Date(splitedDecrypted[1]);
        if (expiredAt < new Date()) {
            throw new Error("the link expired");
        }
        const room = await joinChatRoom(roomId, userId);
        return room
    } catch (err) {
        console.log(err)
        throw new Error((err as Error).message);
    }
}