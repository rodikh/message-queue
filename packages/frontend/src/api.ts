import {
  PostMessageRequest,
  PostMessageResponse,
  GetMessageResponse,
  ApiErrorResponse,
  DEFAULT_TIMEOUT_MS,
} from '@message-queue/shared';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function postMessage(
  queueName: string,
  data: Record<string, unknown>
): Promise<PostMessageResponse> {
  const response = await fetch(`${API_BASE}/${queueName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data } as PostMessageRequest),
  });

  if (!response.ok) {
    const error = await response.json() as ApiErrorResponse;
    throw new Error(error.error || 'Failed to post message');
  }

  return response.json() as Promise<PostMessageResponse>;
}

export async function consumeMessage(
  queueName: string,
  timeout: number = DEFAULT_TIMEOUT_MS
): Promise<GetMessageResponse | null> {
  const response = await fetch(`${API_BASE}/${queueName}?timeout=${timeout}`, {
    method: 'GET',
  });

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    const error = await response.json() as ApiErrorResponse;
    throw new Error(error.error || 'Failed to consume message');
  }

  return response.json() as Promise<GetMessageResponse>;
}

