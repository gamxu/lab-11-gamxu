import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";
import { checkToken } from "../../../../backendLibs/checkToken";

export default function roomIdMessageRoute(req, res) {
  if (req.method === "GET") {
    //check token
    const username = checkToken(req)
    if(!username){
      return res.status(401).json({ok: false, message: "You dont't have permission to access this api"})
    }

    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();
    const roomIdx = rooms.findIndex(x => x.roomId === roomId) 
    
    //check if roomId exist
    if(roomIdx===-1){
      return res.status(404).json({ok:false,message:"Invalid room id"})      
    }

    //find room and return
    const messages = rooms[roomIdx].messages
    return res.json({ok: true, messages})

  } else if (req.method === "POST") {
    //check token
    const username = checkToken(req)
    if(!username){
      return res.status(401).json({ok: false, message: "You dont't have permission to access this api"})
    }

    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();
    const roomIdx = rooms.findIndex(x => x.roomId === roomId) 

    //check if roomId exist
    if(!username){
      return res.status(401).json({ok: false, message: "You dont't have permission to access this api"})
    }

    //validate body
    if (typeof req.body.text !== "string" || req.body.text.length === 0)
      return res.status(400).json({ ok: false, message: "Invalid text input" });

    //create message
    const message = {
      messageId: uuidv4(),
      text: req.body.text,
      username: username.username
    }
    rooms[roomIdx].messages.push(message)
    writeChatRoomsDB(rooms);
    return res.json({ok: true, message})
  }
}
