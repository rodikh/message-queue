// Message types for the queue system

export interface QueueMessage {
  id: string;
  data: Record<string, unknown>;
  timestamp: number;
  queueName: string;
}

export interface PostMessageRequest {
  data: Record<string, unknown>;
}

export interface PostMessageResponse {
  success: boolean;
  message: QueueMessage;
}

export interface GetMessageResponse {
  success: boolean;
  message: QueueMessage | null;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T> = T | ApiErrorResponse;

// API route constants
export const API_ROUTES = {
  queue: (queueName: string) => `/api/${queueName}`,
} as const;

// Default timeout for long polling (in milliseconds)
export const DEFAULT_TIMEOUT_MS = 10000;

// Validation helpers
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

export function isValidQueueName(name: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(name) && name.length > 0 && name.length <= 64;
}

