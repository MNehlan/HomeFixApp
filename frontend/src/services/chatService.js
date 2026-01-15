import api from "./api"; // Ensure api service is imported correctly

/**
 * Initialize or get existing chat between two users
 */
export const initiateChat = async (currentUserId, otherUserId, technicianId) => {
    try {
        const response = await api.post("/chat", {
            otherUserId,
            technicianId
        });
        return response.data.chatId;
    } catch (error) {
        console.error("Initiate chat error:", error);
        throw error;
    }
}

/**
 * Send a message
 */
export const sendMessage = async (chatId, senderId, text) => {
    try {
        await api.post(`/chat/${chatId}/messages`, { text });
    } catch (error) {
        console.error("Send message error:", error);
        throw error;
    }
}

/**
 * Subscribe to chat messages (Polling)
 */
export const subscribeToMessages = (chatId, callback) => {
    let isActive = true;

    const fetchMessages = async () => {
        if (!isActive) return;
        try {
            const response = await api.get(`/chat/${chatId}/messages`);
            callback(response.data);
        } catch (error) {
           console.error("Error fetching messages:", error);
        }
    }

    // Initial fetch
    fetchMessages();

    // Poll every 3 seconds
    const intervalId = setInterval(fetchMessages, 3000);

    return () => {
        isActive = false;
        clearInterval(intervalId);
    }
}

/**
 * Subscribe to user's chat list (Polling)
 */
export const subscribeToUserChats = (userId, callback) => {
    let isActive = true;

    const fetchChats = async () => {
        if (!isActive) return;
        try {
            const response = await api.get("/chat");
            callback(response.data);
        } catch (error) {
            console.error("Error fetching user chats:", error);
        }
    }

    // Initial fetch
    fetchChats();

    // Poll every 5 seconds
    const intervalId = setInterval(fetchChats, 5000);

    return () => {
        isActive = false;
        clearInterval(intervalId);
    }
}
