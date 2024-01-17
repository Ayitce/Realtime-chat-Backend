import { Request, Response } from "express";
import { initiate, postMessage, getChatRoomByRoomIdService, getConversationByRoomIdService, joinChatRoomService } from "../services/chatRoom.service";
import passport from "passport";
import '../configs/passport';
import { TUser } from "../interfaces/user.interface";
import { getUserByIdsService } from "../services/auth.service";

export const initiateChatRoom = async (req: Request, res: Response) => {
    try {
        await new Promise<void>((resolve, reject) => {
            passport.authenticate('jwt', { session: false }, (err: unknown, user: TUser) => {
                if (err || !user) {
                    const error = new Error('Invalid user');
                    reject(error);
                } else {
                    req.body.chatInitiator = user._id;
                    resolve();
                }
            })(req, res);
        });
        const { isNew, message, chatRoomId } = await initiate({ userIds: req.body.userIds, chatInitiator: req.body.chatInitiator.toString() });
        res.status(200).json({ isNew, message, chatRoomId });

    } catch (error: unknown) {
        res.status(500).json({ message: (error as Error).message });
    }
}

export const postMessageInChatRoom = async (req: Request, res: Response) => {
    try {
        await new Promise<void>((resolve, reject) => {
            passport.authenticate('jwt', { session: false }, (err: unknown, user: TUser) => {
                if (err || !user) {
                    const error = new Error('Invalid user');
                    reject(error);
                } else {
                    req.body.userId = user._id;
                    resolve();
                }
            })(req, res);
        });
        const { roomId } = req.params
        const post = await postMessage(roomId, req.body);
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
        await new Promise<void>((resolve, reject) => {
            passport.authenticate('jwt', { session: false }, (err: unknown, user: TUser) => {
                if (err || !user) {
                    const error = new Error('Invalid user');
                    reject(error);
                } else {
                    req.body.userId = user._id.toString();
                    resolve();
                }
            })(req, res);
        });
        await joinChatRoomService(roomId, req.body.userId)
        return res.status(200).json({ message: "join room successfully" })
    } catch (err) {
        return res.status(500).json({ message: (err as Error).message });
    }
}