import { db } from "../config/firebase.js";

// Initialize Chat
export const initiateChat = async (req, res) => {
  try {
    const { otherUserId, technicianId } = req.body; // Expecting ID of the *other* person
    const currentUserId = req.user.uid;

    if (!otherUserId) {
      return res.status(400).json({ message: "Other User ID is required" });
    }

    const chatsRef = db.collection("chats");
    
    // Check for existing chat
    // Firestore Admin doesn't support "array-contains" + filtering easily without index sometimes, 
    // but usually it's fine. 
    // Optimization: Store a deterministic ID like `min(uid1, uid2)_max(uid1, uid2)`?
    // Current frontend logic searches by participants array.

    // Let's try deterministic query for existing chat
    const snapshot = await chatsRef
      .where("participants", "array-contains", currentUserId)
      .get();

    let existingChat = null;
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.participants.includes(otherUserId)) {
        existingChat = { id: doc.id, ...data };
      }
    });

    if (existingChat) {
      return res.json({ chatId: existingChat.id });
    }

    // Create New
    const newChatData = {
      participants: [currentUserId, otherUserId],
      technicianId: technicianId || null,
      createdAt: new Date(), // Admin SDK uses native Date usually, or Firestore Timestamp
      lastMessage: "",
      lastMessageTimestamp: new Date(),
      startedBy: currentUserId
    };

    const newChatRef = await chatsRef.add(newChatData);
    res.status(201).json({ chatId: newChatRef.id });

  } catch (error) {
    console.error("Init Chat Error:", error);
    res.status(500).json({ message: "Failed to initiate chat" });
  }
};

// Send Message
export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;
    const senderId = req.user.uid;

    if (!text) return res.status(400).json({ message: "Text is required" });

    const chatRef = db.collection("chats").doc(chatId);
    
    // Authorization check
    const chatSnap = await chatRef.get();
    if (!chatSnap.exists) return res.status(404).json({ message: "Chat not found" });
    
    const chatData = chatSnap.data();
    if (!chatData.participants.includes(senderId)) {
      return res.status(403).json({ message: "Not a participant" });
    }

    const messageData = {
      senderId,
      text,
      createdAt: new Date(),
      read: false
    };

    await chatRef.collection("messages").add(messageData);

    // Update parent
    const receiverId = chatData.participants.find(p => p !== senderId);
    const updateData = {
      lastMessage: text,
      lastMessageTimestamp: new Date()
    };
    
    if (receiverId) {
      // Note: Dot notation for nested fields in Update
      // unreadCount.userId is the key
      updateData[`unreadCount.${receiverId}`] = (chatData.unreadCount?.[receiverId] || 0) + 1;
    }

    await chatRef.update(updateData);

    res.json({ message: "Sent" });
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

// Get User Chats
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.uid;
    const chatsRef = db.collection("chats");
    const snapshot = await chatsRef
        .where("participants", "array-contains", userId)
        // .orderBy("lastMessageTimestamp", "desc") // Might need index. Do in-memory sort if fails.
        .get();

    const chats = [];
    
    // Parallel fetching of other user details
    const promises = snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const otherUserId = data.participants.find(id => id !== userId);
        
        // Fetch other user
        let otherUser = { name: "Unknown", id: otherUserId };
        if (otherUserId) {
           const userSnap = await db.collection("users").doc(otherUserId).get();
           if (userSnap.exists) {
               const uData = userSnap.data();
               otherUser = {
                   id: otherUserId,
                   name: uData.name,
                   profilePic: uData.profilePic || ""
               };
           }
        }

        return {
            id: docSnap.id,
            ...data,
            otherUser
        };
    });

    const results = await Promise.all(promises);
    
    // In-memory sort
    results.sort((a, b) => {
        const tA =  a.lastMessageTimestamp?.toDate ? a.lastMessageTimestamp.toDate() : new Date(a.lastMessageTimestamp || 0);
        const tB =  b.lastMessageTimestamp?.toDate ? b.lastMessageTimestamp.toDate() : new Date(b.lastMessageTimestamp || 0);
        return tB - tA; // DESC
    });

    res.json(results);
  } catch (error) {
    console.error("Get Chats Error:", error);
    res.status(500).json({ message: "Failed to fetch chats" });
  }
};

// Get Messages
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.uid;

    const chatRef = db.collection("chats").doc(chatId);
    const chatSnap = await chatRef.get();
    
    if (!chatSnap.exists) return res.status(404).json({ message: "Chat not found" });
    if (!chatSnap.data().participants.includes(userId)) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    // Reset unread count for this user
    try {
        await chatRef.update({
            [`unreadCount.${userId}`]: 0
        });
    } catch (e) { /* ignore */ }

    const msgsSnap = await chatRef.collection("messages").orderBy("createdAt", "asc").get();
    
    const messages = [];
    msgsSnap.forEach(doc => {
        messages.push({
            id: doc.id,
            ...doc.data(),
            // Ensure dates are serializable
            createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt
        });
    });

    res.json(messages);

  } catch (error) {
     console.error("Get Messages Error:", error);
     res.status(500).json({ message: "Failed to get messages" });
  }
};
