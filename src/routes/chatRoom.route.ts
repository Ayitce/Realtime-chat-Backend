import express from 'express';
import { joinChatRoom, getConversationByRoomId, initiateChatRoomWithOtherUsers, postMessageInChatRoom, initiateChatRoom, exitChatRoom, getAllChatRooms, getAllChatRoomCreatedByUser } from '../controllers/chatRoom.controller';
import { getUser } from '../middlewares/auth.middleware';
const router = express.Router();

router.post("/initiate", initiateChatRoom)
router.post("/initiate-with-users", initiateChatRoomWithOtherUsers)
router.post("/:roomId/message", postMessageInChatRoom)
router.get("/:roomId", getConversationByRoomId)
router.put("/:roomId", joinChatRoom)
router.put("/:roomId/exit", exitChatRoom)
router.get("/", getAllChatRooms)
router.get("/user/:userId", getAllChatRoomCreatedByUser)
export default router;
