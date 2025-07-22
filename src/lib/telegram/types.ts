export interface TelegramApiResponse<T> {
  ok: boolean;
  result?: T;
  error_code?: number;
  description?: string;
}

export interface Message {
  message_id: number;
  date: number;
  chat: {
    id: number;
    type: string;
  };
  text?: string;
}

export interface Update {
  update_id: number;
  message?: {
    message_id: number;
    date: number;
    chat: {
      id: number;
      type: string;
    };
    text?: string;
  };
} 