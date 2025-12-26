import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    updateDoc,
    getDocs,
    getDoc
} from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"

const CHATS_COLLECTION = "chats"

/**
 * Initialize or get existing chat between two users
 */
export const initiateChat = async (currentUserId, otherUserId, technicianId) => {
    // Check for existing chat
    const q = query(
        collection(db, CHATS_COLLECTION),
        where("participants", "array-contains", currentUserId)
    )

    const querySnapshot = await getDocs(q)
    const existingChat = querySnapshot.docs.find(doc =>
        doc.data().participants.includes(otherUserId)
    )

    if (existingChat) {
        return existingChat.id
    }

    // Create new chat
    const newChatRef = await addDoc(collection(db, CHATS_COLLECTION), {
        participants: [currentUserId, otherUserId],
        technicianId, // For easy filtering
        createdAt: serverTimestamp(),
        lastMessage: "",
        lastMessageTimestamp: serverTimestamp(),
        startedBy: currentUserId
    })

    return newChatRef.id
}

/**
 * Send a message
 */
export const sendMessage = async (chatId, senderId, text) => {
    const messagesRef = collection(db, CHATS_COLLECTION, chatId, "messages")
    await addDoc(messagesRef, {
        senderId,
        text,
        createdAt: serverTimestamp(),
        read: false
    })

    const chatRef = doc(db, CHATS_COLLECTION, chatId)

    // We need to know who the other participant is to increment their unread count
    // Fetch the chat doc to get participants
    try {
        const chatSnap = await getDoc(chatRef)
        if (chatSnap.exists()) {
            const data = chatSnap.data()
            const receiverId = data.participants.find(id => id !== senderId)

            if (receiverId) {
                await updateDoc(chatRef, {
                    lastMessage: text,
                    lastMessageTimestamp: serverTimestamp(),
                    [`unreadCount.${receiverId}`]: (data.unreadCount?.[receiverId] || 0) + 1
                })
            }
        }
    } catch (error) {
        console.error("Error updating unread count", error)
    }
}

/**
 * Subscribe to chat messages
 */
export const subscribeToMessages = (chatId, callback) => {
    const q = query(
        collection(db, CHATS_COLLECTION, chatId, "messages"),
        orderBy("createdAt", "asc")
    )

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
        callback(messages)
    }, (error) => {
        console.error("Error fetching messages:", error)
    })
}

/**
 * Subscribe to user's chat list
 */
export const subscribeToUserChats = (userId, callback) => {
    const q = query(
        collection(db, CHATS_COLLECTION),
        where("participants", "array-contains", userId),
        orderBy("lastMessageTimestamp", "desc")
    )

    return onSnapshot(q, async (snapshot) => {
        const chats = await Promise.all(snapshot.docs.map(async chatDoc => {
            const data = chatDoc.data()
            const otherUserId = data.participants.find(id => id !== userId)

            // Fetch other user's basic info
            let otherUser = { name: "User" }
            try {
                const userDoc = await getDoc(doc(db, "users", otherUserId))
                if (userDoc.exists()) otherUser = userDoc.data()
            } catch (e) { console.error("Error fetching chat user", e) }

            return {
                id: chatDoc.id,
                ...data,
                otherUser: {
                    id: otherUserId,
                    name: otherUser.name,
                    profilePic: otherUser.profilePic
                }
            }
        }))
        callback(chats)
    }, (error) => {
        console.error("Error fetching user chats:", error)
    })
}
