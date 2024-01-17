import express from 'express';
import { joinChatRoom, getConversationByRoomId, initiateChatRoom, postMessageInChatRoom } from '../controllers/chatRoom.controller';
import { getUser } from '../middlewares/auth.middleware';
const router = express.Router();

router.post("/initiate", initiateChatRoom)
router.post("/:roomId/message", postMessageInChatRoom)
router.get("/:roomId", getConversationByRoomId)
router.put("/:roomId", joinChatRoom)
export default router;
