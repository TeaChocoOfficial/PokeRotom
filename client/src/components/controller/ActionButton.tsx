// -Path: "PokeRotom/client/src/screen/components/ActionButton.tsx"

interface ActionButtonProps {
    icon: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
    onPointerDown?: () => void;
    onPointerUp?: () => void;
    className?: string;
}

export default function ActionButton({
    icon,
    active = false,
    onClick,
    onPointerDown,
    onPointerUp,
    className = '',
}: ActionButtonProps) {
    return (
        <button
            className={`pointer-events-auto flex items-center justify-center w-16 h-16 rounded-full shadow-xl transition-all active:scale-95 cursor-pointer backdrop-blur-md ${
                active ? 'scale-105' : ''
            } ${className}`}
            style={{
                background: active ? 'var(--primary)' : 'rgba(0,0,0,0.5)',
                color: '#fff',
                boxShadow: active
                    ? '0 0 20px rgba(0,0,0,0.5), inset 0 0 10px rgba(255,255,255,0.2)'
                    : '0 4px 12px rgba(0,0,0,0.3)',
                border: '2px solid rgba(255,255,255,0.1)',
                fontSize: '1.75rem',
            }}
            onClick={onClick}
            onPointerDown={(e) => {
                if (onPointerDown) {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    onPointerDown();
                }
            }}
            onPointerUp={(e) => {
                if (onPointerUp) {
                    e.currentTarget.releasePointerCapture(e.pointerId);
                    onPointerUp();
                }
            }}
            onPointerCancel={(e) => {
                if (onPointerUp) {
                    e.currentTarget.releasePointerCapture(e.pointerId);
                    onPointerUp();
                }
            }}
        >
            {icon}
        </button>
    );
}
