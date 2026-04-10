// -Path: "PokeRotom/client/src/screen/hud/ChatOverlay.tsx"
'use client';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '$/stores/gameStore';
import { useRef, useState, useEffect } from 'react';
import { useSocketStore } from '$/stores/socketStore';

export default function ChatOverlay() {
    const { t } = useTranslation();
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const isChatOpen = useGameStore((state) => state.isChatOpen);
    const setChatOpen = useGameStore((state) => state.setChatOpen);
    const setChatFocused = useGameStore((state) => state.setChatFocused);
    const chatMessages = useSocketStore((state) => state.chatMessages);
    const sendChatMessage = useSocketStore((state) => state.sendChatMessage);

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
        } else {
            setChatFocused(false);
        }
    }, [isChatOpen, setChatFocused]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSend = () => {
        if (!message.trim()) return;
        sendChatMessage(message.trim(), 'Player');
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
            className="absolute bottom-4 right-4 w-80 pointer-events-auto"
            style={{ maxHeight: '40vh' }}
        >
            {/* Messages */}
            <div
                className="rounded-t-xl overflow-y-auto px-3 py-2 flex flex-col gap-1"
                style={{
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(8px)',
                    maxHeight: '200px',
                    opacity: isChatOpen ? 1 : 0.5,
                    transition: 'opacity 0.3s',
                }}
            >
                {chatMessages.length === 0 && (
                    <div
                        className="text-xs text-center py-2"
                        style={{ color: '#64748b' }}
                    >
                        {t('chat.placeholder')}
                    </div>
                )}
                {chatMessages.map((msg, index) => (
                    <div
                        key={index}
                        className="text-xs"
                        style={{
                            color: msg.system ? '#fbbf24' : '#e2e8f0',
                        }}
                    >
                        {!msg.system && (
                            <span
                                className="font-bold mr-1"
                                style={{ color: '#fb923c' }}
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
                    className="flex rounded-b-xl overflow-hidden"
                    style={{
                        background: 'rgba(0,0,0,0.7)',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-3 py-2 text-xs bg-transparent outline-none"
                        style={{ color: '#fff' }}
                        placeholder={t('chat.placeholder')}
                    />
                    <button
                        className="px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
                        style={{
                            background: 'var(--primary)',
                            color: '#fff',
                        }}
                        onClick={handleSend}
                    >
                        {t('chat.send')}
                    </button>
                </div>
            )}
        </div>
    );
}
