// -Path: "PokeRotom/client/src/screen/hud/ChatOverlay.tsx"
'use client';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '$/stores/gameStore';
import { useRef, useState, useEffect } from 'react';
import { useSocketStore } from '$/stores/socketStore';

export default function ChatOverlay() {
    const { t } = useTranslation();
    const [message, setMessage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { isChatOpen, setChatOpen, toggleChatOpen, setChatFocused } =
        useGameStore();
    const { socket, chatMessages, sendChatMessage } = useSocketStore();
    const [unreadCount, setUnreadCount] = useState(0);
    const prevMessagesLength = useRef(chatMessages.length);

    useEffect(() => {
        if (!isChatOpen) {
            const diff = chatMessages.length - prevMessagesLength.current;
            if (diff > 0) {
                // Filter out messages that were sent by our own client
                const newMessages = chatMessages.slice(
                    prevMessagesLength.current,
                );
                const unreadFromOthers = newMessages.filter(
                    (msg) => msg.sender !== socket?.id,
                ).length;
                if (unreadFromOthers > 0)
                    setUnreadCount((prev) => prev + unreadFromOthers);
            }
        } else {
            setUnreadCount(0);
        }
        prevMessagesLength.current = chatMessages.length;
    }, [chatMessages, isChatOpen, socket?.id]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Enter' && !isChatOpen) {
                setChatOpen(true);
                event.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isChatOpen, setChatOpen]);

    useEffect(() => {
        if (isChatOpen && inputRef.current) {
            inputRef.current.focus();
            setChatFocused(true);
        } else setChatFocused(false);
    }, [isChatOpen, setChatFocused]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (
                overlayRef.current &&
                !overlayRef.current.contains(event.target as Node)
            ) {
                setChatOpen(false);
            }
        };

        if (isChatOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside, {
                passive: true,
            });
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isChatOpen, setChatOpen]);

    const handleSend = () => {
        if (!message.trim()) return;
        sendChatMessage(message.trim(), socket?.id || 'Player');
        setMessage('');
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') handleSend();
        if (event.key === 'Escape') {
            setChatOpen(false);
            setChatFocused(false);
        }
        event.stopPropagation();
    };

    return (
        <div
            ref={overlayRef}
            className="absolute bottom-4 left-4 w-[calc(100%-2rem)] max-w-[360px] pointer-events-none flex flex-col-reverse items-start gap-2"
            style={{ zIndex: 50 }}
        >
            {/* Toggle Button */}
            <button
                onClick={() => toggleChatOpen()}
                className="pointer-events-auto relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
                style={{
                    background: isChatOpen
                        ? 'var(--primary)'
                        : 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '1.25rem',
                }}
            >
                💬
                {unreadCount > 0 && !isChatOpen && (
                    <span className="absolute top-0 right-0 flex h-3.5 w-3.5 translate-x-[-10%] translate-y-[10%]">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border border-[rgba(0,0,0,0.5)] shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                    </span>
                )}
            </button>

            {/* Chat Content */}
            <div
                className={`rounded-2xl pointer-events-auto w-full flex-col transition-all duration-300 origin-bottom overflow-hidden border-[rgba(255,255,255,0.05)] ${isChatOpen ? 'flex scale-y-100 opacity-100' : 'hidden scale-y-0 opacity-0'}`}
            >
                {/* Messages */}
                <div
                    className={`overflow-y-auto overflow-x-hidden px-4 py-3 flex flex-col gap-1.5 max-h-[30vh] ${
                        chatMessages.length === 0 ? 'justify-center' : ''
                    }`}
                    style={{
                        backdropFilter: 'blur(12px)',
                        background: 'rgba(0,0,0,0.6)',
                        border: '1px solid rgba(255,255,255,0.05)',
                    }}
                >
                    {chatMessages.length === 0 && (
                        <div
                            className="text-xs text-center py-2 italic font-medium"
                            style={{ color: '#94a3b8' }}
                        >
                            {t('chat.placeholder')}
                        </div>
                    )}
                    {chatMessages.map((msg, index) => (
                        <div
                            key={index}
                            className="text-xs leading-relaxed wrap-break-word whitespace-pre-wrap"
                            style={{
                                color: msg.system ? '#fbbf24' : '#f8fafc',
                                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                            }}
                        >
                            {!msg.system && (
                                <span
                                    className="font-bold mr-1.5"
                                    style={{ color: 'var(--primary-400)' }}
                                >
                                    {msg.sender}:
                                </span>
                            )}
                            {msg.message}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                {isChatOpen && (
                    <div
                        className="flex overflow-hidden shadow-xl border border-t-0 border-[rgba(255,255,255,0.05)]"
                        style={{
                            background: 'rgba(0,0,0,0.8)',
                            backdropFilter: 'blur(16px)',
                        }}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={message}
                            maxLength={255}
                            onKeyDown={handleKeyDown}
                            onChange={(event) => setMessage(event.target.value)}
                            className="flex-1 px-4 py-3 text-[16px] md:text-sm bg-transparent outline-none text-white placeholder-slate-400"
                            placeholder={t('chat.placeholder')}
                        />
                        <button
                            onClick={handleSend}
                            className="px-5 py-3 text-sm font-black uppercase tracking-wider transition-colors cursor-pointer hover:bg-primary-600 bg-primary text-white"
                        >
                            {t('chat.send')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
