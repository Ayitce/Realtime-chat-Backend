import { Request, Response } from "express";
import { initiateChatWithOtherUsersService, postMessage, getChatRoomByRoomIdService, getConversationByRoomIdService, joinChatRoomService, initiateChatService, exitChatRoomService, getAllChatRoomsService, getAllChatRoomCreatedByUserService, getInviteLinkService, joinRoomWithInviteLinkService } from "../services/chatRoom.service";
import '../configs/passport';
import { getUserByIdsService } from "../services/auth.service";

export const initiateChatRoom = async (req: Request, res: Response) => {
    try {
        const newRoom = await initiateChatService(req.body.roomName, req.body.loggedUser._id);
        res.status(200).json(newRoom);
    }

    catch (error: unknown) {
        res.status(500).json({ message: (error as Error).message });
    }
}
export const initiateChatRoomWithOtherUsers = async (req: Request, res: Response) => {
    try {
        const { isNew, message, chatRoomId } = await initiateChatWithOtherUsersService(req.body.userIds, req.body.loggedUser._id);
        res.status(200).json({ isNew, message, chatRoomId });

    } catch (error: unknown) {
        res.status(500).json({ message: (error as Error).message });
    }
}

export const postMessageInChatRoom = async (req: Request, res: Response) => {
    try {

        console.log("from middleware: " + req.body.loggedUser._id)
        const { roomId } = req.params
        const post = await postMessage(roomId, req.body.loggedUser._id, req.body.messageText);
        res.status(200).json(post);
    } catch (err) {
        return res.status(500).json({ message: (err as Error).message });
    }
}

export const getConversationByRoomId = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params
        const room = await getChatRoomByRoomIdService(roomId)
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        const user = await getUserByIdsService(room.userIds)
        const conservation = await getConversationByRoomIdService(roomId)
        return res.status(200).json({
            conversation: conservation,
            users: user
        })
    } catch (err) {
        return res.status(500).json({ message: (err as Error).message });
    }
}

export const joinChatRoom = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params

        await joinChatRoomService(roomId, req.body.loggedUser._id)
        return res.status(200).json({ message: "join room successfully" })
    } catch (err) {
        return res.status(500).json({ message: (err as Error).message });
    }
}

export const exitChatRoom = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params
        await exitChatRoomService(roomId, req.body.loggedUser._id)
        return res.status(200).json({ message: "exit room successfully" })
    } catch (err) {
        return res.status(500).json({ message: (err as Error).message });
    }
}

export const getAllChatRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await getAllChatRoomsService();
        return res.status(200).json(rooms)
    } catch (err) {
        return res.status(500).json({ message: (err as Error).message });
    }
}

export const getAllChatRoomCreatedByUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const rooms = await getAllChatRoomCreatedByUserService(userId);
        return res.status(200).json(rooms)
    } catch (err) {
        return res.status(500).json({ message: (err as Error).message });
    }
}

export const getInviteLink = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params
        const link = await getInviteLinkService(roomId)
        return res.status(200).json({ link })
    } catch (err) {
        return res.status(500).json({ message: (err as Error).message });
    }
}

export const joinRoomWithInviteLink = async (req: Request, res: Response) => {
    try {
        const { encryptedRoomId } = req.body
        const room = await joinRoomWithInviteLinkService(encryptedRoomId, req.body.loggedUser._id)
        const roomId = room._id
        return res.status(200).json({ message: "join room successfully", room: roomId })
    } catch (err) {
        return res.status(500).json({ message: (err as Error).message });
    }
}