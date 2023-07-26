// types.ts
export interface Conversation {
    id: string;
    title: string;
    date: string;
    excerpt: string;
    prompt: string;
    allMessages: string;
}

export interface NodeData {
    message?: {
      content?: {
        parts?: string[]
      }
    }
  }
  