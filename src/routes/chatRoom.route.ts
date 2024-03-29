import express from 'express';
import { joinChatRoom, getConversationByRoomId, initiateChatRoomWithOtherUsers, postMessageInChatRoom, initiateChatRoom, exitChatRoom, getAllChatRooms, getAllChatRoomCreatedByUser, getInviteLink, joinRoomWithInviteLink } from '../controllers/chatRoom.controller';
import { getUser } from '../middlewares/auth.middleware';
const router = express.Router();

router.post("/initiate", getUser, initiateChatRoom)
router.post("/initiate-with-users", getUser, initiateChatRoomWithOtherUsers)
router.post("/:roomId/message", getUser, postMessageInChatRoom)
router.get("/:roomId", getConversationByRoomId)
router.put("/:roomId", getUser, joinChatRoom)
router.put("/:roomId/exit", getUser, exitChatRoom)
router.get("/", getAllChatRooms)
router.get("/user/:userId", getAllChatRoomCreatedByUser)
router.get("/invite/:roomId", getInviteLink)
router.post("/join", getUser, joinRoomWithInviteLink)
export default router;
