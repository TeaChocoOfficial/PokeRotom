// -Path: "PokeRotom/client/src/types/dialogue.ts"

export interface DialogueChoice {
    text: string;
    nextDialogueId: string;
    condition?: (player: any) => boolean;
    action?: (player: any) => void;
}

export interface DialogueNode {
    id: string;
    text: string;
    choices?: DialogueChoice[];
    emotion?: 'neutral' | 'happy' | 'sad' | 'angry';
    autoAdvance?: boolean;
    autoAdvanceDelay?: number;
}

export interface DialogueTree {
    id: string;
    startNodeId: string;
    nodes: Map<string, DialogueNode>;
    onComplete?: (player: any) => void;
}
