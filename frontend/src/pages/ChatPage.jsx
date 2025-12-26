import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContextDefinition"
import { subscribeToMessages, subscribeToUserChats, sendMessage } from "../services/chatService"

const ChatPage = () => {
    const { user } = useAuth()
    const { chatId } = useParams()
    const navigate = useNavigate()

    // State
    const [chats, setChats] = useState([])
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [activeChat, setActiveChat] = useState(null)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    // Load user's chat list
    useEffect(() => {
        if (!user) return
        const unsubscribe = subscribeToUserChats(user.uid, (chatList) => {
            setChats(chatList)
            if (chatId) {
                const current = chatList.find(c => c.id === chatId)
                if (current) setActiveChat(current)
            }
        })
        return () => unsubscribe()
    }, [user, chatId])

    // Load messages for active chat
    useEffect(() => {
        if (!chatId) return
        const unsubscribe = subscribeToMessages(chatId, (msgs) => {
            setMessages(msgs)
            scrollToBottom()
        })
        return () => unsubscribe()
    }, [chatId])



    const handleSend = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || !chatId) return

        try {
            await sendMessage(chatId, user.uid, newMessage)
            setNewMessage("")
        } catch (error) {
            console.error("Message send failed", error)
        }
    }

    const handleChatSelect = (id) => {
        navigate(`/chat/${id}`)
    }

    return (
        <div className="flex h-[calc(100vh-80px)] bg-slate-50 max-w-7xl mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-sm m-4">
            {/* Sidebar - Chat List */}
            <div className={`w-full md:w-80 bg-white border-r border-slate-200 flex flex-col ${chatId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {chats.length === 0 ? (
                        <div className="p-4 text-center text-slate-400 text-sm">No conversations yet</div>
                    ) : (
                        chats.map(chat => (
                            <div
                                key={chat.id}
                                onClick={() => handleChatSelect(chat.id)}
                                className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${chat.id === chatId ? 'bg-slate-50' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                                        {chat.otherUser.profilePic ? (
                                            <img src={chat.otherUser.profilePic} alt={chat.otherUser.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">
                                                {chat.otherUser.name?.[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 truncate">{chat.otherUser.name}</h3>
                                        <p className="text-sm text-slate-500 truncate">{chat.lastMessage || "Started a chat"}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col bg-white ${!chatId ? 'hidden md:flex' : 'flex'}`}>
                {chatId ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                            <button onClick={() => navigate('/chat')} className="md:hidden text-slate-500">
                                ← Back
                            </button>
                            {activeChat && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                                        {activeChat.otherUser.profilePic ? (
                                            <img src={activeChat.otherUser.profilePic} alt="avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-500">
                                                {activeChat.otherUser.name?.[0]}
                                            </div>
                                        )}
                                    </div>
                                    <span className="font-bold text-slate-900">{activeChat.otherUser.name}</span>
                                </div>
                            )}
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                            {messages.map(msg => {
                                const isMe = msg.senderId === user.uid
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${isMe
                                            ? 'bg-black text-white rounded-tr-none'
                                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white">
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black/5"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-black text-white px-6 py-2 rounded-xl font-semibold disabled:opacity-50 hover:bg-slate-800 transition-colors"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-2xl">💬</div>
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatPage
