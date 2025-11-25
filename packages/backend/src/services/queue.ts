import { Redis } from '@upstash/redis';
import { v4 as uuidv4 } from 'uuid';
import { QueueMessage } from '@message-queue/shared';

// Initialize Redis client from environment variables
const redis = Redis.fromEnv()

// Get the Redis key for a queue
function getQueueKey(queueName: string): string {
  return `queue:${queueName}`;
}

// Add a message to the queue
export async function pushMessage(
  queueName: string,
  data: Record<string, unknown>
): Promise<QueueMessage> {
  const message: QueueMessage = {
    id: uuidv4(),
    data,
    timestamp: Date.now(),
    queueName,
  };

  const queueKey = getQueueKey(queueName);
  await redis.lpush(queueKey, JSON.stringify(message));

  return message;
}

// Pop a message from the queue (non-blocking)
export async function popMessage(queueName: string): Promise<QueueMessage | null> {
  const queueKey = getQueueKey(queueName);
  const result = await redis.rpop<QueueMessage>(queueKey);

  if (!result) {
    return null;
  }

  return result;
}

// Pop a message with timeout (long polling)
export async function popMessageWithTimeout(
  queueName: string,
  timeoutMs: number
): Promise<QueueMessage | null> {
  const startTime = Date.now();
  const pollInterval = 100; // Check every 100ms

  while (Date.now() - startTime < timeoutMs) {
    const message = await popMessage(queueName);
    if (message) {
      return message;
    }

    // Wait before polling again
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  // One final check
  return await popMessage(queueName);
}

