//-Path: "PokeRotom/client/src/components/GameChat.tsx"
import {
    X,
    Send,
    User,
    Globe,
    Users,
    Ghost,
    ChevronDown,
    MessageCircle,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useRoomStore } from '../stores/roomStore';
import { useRef, useState, useEffect } from 'react';
import { useSocketStore } from '../stores/socketStore';

interface ChatMessage {
    text?: string;
    sender?: string;
    senderUid?: number;
    system?: boolean;
    message?: string;
    timestamp?: string;
    targetUid?: number;
}

type ChatTab = 'global' | 'room' | 'wild' | 'private';

export default function GameChat() {
    const { user } = useAuthStore();
    const { room } = useRoomStore();
    const { socket } = useSocketStore();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<ChatTab>('global');
    const [inputMessage, setInputMessage] = useState('');
    const [privateTargetUid, setPrivateTargetUid] = useState<number | null>(
        null,
    );

    // Separate message stores
    const [messages, setMessages] = useState<Record<ChatTab, ChatMessage[]>>({
        global: [],
        room: [],
        wild: [],
        private: [],
    });

    const [unread, setUnread] = useState<Record<ChatTab, number>>({
        global: 0,
        room: 0,
        wild: 0,
        private: 0,
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Register UID with socket for private messaging
    useEffect(() => {
        if (socket && user) {
            socket.emit('registerSocket', { uid: user.uid });
        }
    }, [socket, user]);

    useEffect(() => {
        if (!socket) return;

        const onGlobal = (data: ChatMessage) => {
            setMessages((prev) => ({
                ...prev,
                global: [...prev.global, data],
            }));
            if (!isOpen || activeTab !== 'global')
                setUnread((prev) => ({ ...prev, global: prev.global + 1 }));
        };

        const onRoom = (data: ChatMessage) => {
            setMessages((prev) => ({ ...prev, room: [...prev.room, data] }));
            if (!isOpen || activeTab !== 'room')
                setUnread((prev) => ({ ...prev, room: prev.room + 1 }));
        };

        const onWild = (data: ChatMessage) => {
            setMessages((prev) => ({ ...prev, wild: [...prev.wild, data] }));
            if (!isOpen || activeTab !== 'wild')
                setUnread((prev) => ({ ...prev, wild: prev.wild + 1 }));
        };

        const onPrivate = (data: ChatMessage) => {
            setMessages((prev) => ({
                ...prev,
                private: [...prev.private, data],
            }));
            if (!isOpen || activeTab !== 'private')
                setUnread((prev) => ({ ...prev, private: prev.private + 1 }));
        };

        socket.on('messageGlobal', onGlobal);
        socket.on('messageRoom', onRoom);
        socket.on('messageWild', onWild);
        socket.on('messagePrivate', onPrivate);

        return () => {
            socket.off('messageGlobal');
            socket.off('messageRoom');
            socket.off('messageWild');
            socket.off('messagePrivate');
        };
    }, [socket, isOpen, activeTab]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeTab]);

    useEffect(() => {
        if (isOpen) {
            setUnread((prev) => ({ ...prev, [activeTab]: 0 }));
        }
    }, [isOpen, activeTab]);

    const sendMessage = () => {
        if (!socket || !inputMessage.trim()) return;

        const payload = {
            message: inputMessage,
            sender: user?.name || 'Trainer',
            senderUid: user?.uid,
        };

        switch (activeTab) {
            case 'global':
                socket.emit('sendMessageGlobal', payload);
                break;
            case 'room':
                if (room)
                    socket.emit('sendMessageRoom', {
                        ...payload,
                        roomId: room.id,
                    });
                break;
            case 'wild':
                if (room)
                    socket.emit('submitGuess', {
                        roomId: room.id,
                        guess: inputMessage,
                        username: user?.name,
                    });
                break;
            case 'private':
                if (privateTargetUid) {
                    socket.emit('sendMessagePrivate', {
                        ...payload,
                        targetUid: privateTargetUid,
                    });
                } else {
                    alert(
                        'Please enter a Target User ID for private chat (e.g. type UID in message or use a selector)',
                    );
                }
                break;
        }

        setInputMessage('');
    };

    const tabs: { id: ChatTab; icon: any; label: string; color: string }[] = [
        { id: 'global', icon: Globe, label: 'Global', color: 'text-cyan-400' },
        { id: 'room', icon: Users, label: 'Room', color: 'text-emerald-400' },
        { id: 'wild', icon: Ghost, label: 'Wild', color: 'text-purple-400' },
        {
            id: 'private',
            icon: User,
            label: 'Private',
            color: 'text-orange-400',
        },
    ];

    const currentMessages = messages[activeTab];

    return (
        <div className="fixed bottom-4 left-4 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-3 w-80 sm:w-96 po-section bg-white/95 dark:bg-slate-900/95 flex flex-col overflow-hidden animate-slide-up shadow-2xl shadow-black/10 dark:shadow-black/40">
                    {/* Tabs Header */}
                    <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all relative ${
                                    activeTab === tab.id
                                        ? 'bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white shadow-sm dark:shadow-inner'
                                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                            >
                                <tab.icon
                                    size={16}
                                    className={
                                        activeTab === tab.id ? tab.color : ''
                                    }
                                />
                                <span className="text-[9px] font-bold mt-1 uppercase tracking-tighter">
                                    {tab.label}
                                </span>
                                {unread[tab.id] > 0 && (
                                    <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Channel Info */}
                    <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-700/30 flex justify-between items-center">
                        <span
                            className={`text-[10px] font-black uppercase tracking-widest ${tabs.find((t) => t.id === activeTab)?.color.replace('text-', 'text-opacity-80 text-')}`}
                        >
                            {activeTab} Channel
                        </span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-500 hover:text-white"
                        >
                            <ChevronDown size={14} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="h-72 overflow-y-auto p-4 space-y-3 scrollbar-hide bg-slate-900/40">
                        {activeTab === 'room' && !room && (
                            <div className="h-full flex items-center justify-center text-center text-slate-600 text-xs px-8">
                                ต้องเข้าร่วมห้องก่อนถึงจะคุยใน Room Chat ได้
                            </div>
                        )}
                        {activeTab === 'wild' && !room && (
                            <div className="h-full flex items-center justify-center text-center text-slate-600 text-xs px-8">
                                ต้องเข้าร่วมห้องก่อนถึงจะเล่นทายชื่อโปเกมอนได้
                            </div>
                        )}
                        {currentMessages.length === 0 && (
                            <div className="h-full flex items-center justify-center text-center text-slate-600 text-xs italic">
                                ยังไม่มีข้อความในช่องนี้...
                            </div>
                        )}
                        {currentMessages.map((msg, index) => (
                            <div
                                key={`chat-${activeTab}-${index}`}
                                className={`flex flex-col ${msg.senderUid === user?.uid ? 'items-end' : 'items-start'}`}
                            >
                                {msg.system ? (
                                    <div className="w-full flex items-center gap-2 my-1">
                                        <div className="h-px flex-1 bg-slate-800/50" />
                                        <span className="text-[9px] text-slate-600 font-bold uppercase">
                                            {msg.message || msg.text}
                                        </span>
                                        <div className="h-px flex-1 bg-slate-800/50" />
                                    </div>
                                ) : (
                                    <div className="max-w-[85%]">
                                        <div
                                            className={`text-[9px] font-bold mb-0.5 px-1 truncate ${msg.senderUid === user?.uid ? 'text-right text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}
                                        >
                                            {msg.sender}{' '}
                                            {activeTab === 'private' &&
                                                msg.senderUid === user?.uid &&
                                                ` -> UID:${msg.targetUid}`}
                                        </div>
                                        <div
                                            className={`px-3 py-2 rounded-2xl text-sm ${
                                                msg.senderUid === user?.uid
                                                    ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/20'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700/50'
                                            }`}
                                        >
                                            {msg.message || msg.text}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Tab Specific Inputs / Footer */}
                    {activeTab === 'private' && (
                        <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700/30 flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                                To UID:
                            </span>
                            <input
                                type="number"
                                value={privateTargetUid || ''}
                                onChange={(e) =>
                                    setPrivateTargetUid(
                                        Number(e.target.value) || null,
                                    )
                                }
                                placeholder="Target UID..."
                                className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-orange-600 dark:text-orange-400 outline-none"
                            />
                        </div>
                    )}

                    {/* Main Input */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700/30 flex gap-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && sendMessage()
                            }
                            disabled={
                                (activeTab === 'room' ||
                                    activeTab === 'wild') &&
                                !room
                            }
                            placeholder={
                                activeTab === 'wild'
                                    ? 'ทายชื่อโปเกมอน...'
                                    : activeTab === 'private'
                                      ? 'คุยส่วนตัว...'
                                      : 'พิมพ์ข้อความ...'
                            }
                            className="flex-1 po-input px-4 py-2.5 text-sm disabled:opacity-20"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={
                                !inputMessage.trim() ||
                                ((activeTab === 'room' ||
                                    activeTab === 'wild') &&
                                    !room)
                            }
                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 ${
                    isOpen
                        ? 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/40 dark:shadow-blue-900/40'
                }`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
                {!isOpen && Object.values(unread).some((v) => v > 0) && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 animate-bounce border-2 border-white dark:border-slate-950">
                        {Object.values(unread).reduce((a, b) => a + b, 0)}
                    </span>
                )}
            </button>
        </div>
    );
}
