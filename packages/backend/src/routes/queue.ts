import { Router, Request, Response } from 'express';
import {
  PostMessageRequest,
  PostMessageResponse,
  GetMessageResponse,
  ApiErrorResponse,
  DEFAULT_TIMEOUT_MS,
  isValidQueueName,
} from '@message-queue/shared';
import { pushMessage, popMessageWithTimeout } from '../queue';

const router = Router();

// POST /api/:queueName - Add a message to the queue
router.post('/:queueName', async (req: Request, res: Response) => {
  try {
    const { queueName } = req.params;

    // Validate queue name
    if (!isValidQueueName(queueName)) {
      const error: ApiErrorResponse = {
        success: false,
        error: 'Invalid queue name. Use only alphanumeric characters, hyphens, and underscores.',
      };
      return res.status(400).json(error);
    }

    // Validate request body
    const body = req.body as PostMessageRequest;
    if (!body.data || typeof body.data !== 'object') {
      const error: ApiErrorResponse = {
        success: false,
        error: 'Request body must contain a "data" object.',
      };
      return res.status(400).json(error);
    }

    // Push message to queue
    const message = await pushMessage(queueName, body.data);

    const response: PostMessageResponse = {
      success: true,
      message,
    };

    console.log(`Message added to queue "${queueName}": ${message.id}`);
    return res.status(201).json(response);
  } catch (error) {
    console.error('Error adding message to queue:', error);
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: 'Internal server error',
    };
    return res.status(500).json(errorResponse);
  }
});

// GET /api/:queueName - Retrieve and remove the next message
router.get('/:queueName', async (req: Request, res: Response) => {
  try {
    const { queueName } = req.params;

    // Validate queue name
    if (!isValidQueueName(queueName)) {
      const error: ApiErrorResponse = {
        success: false,
        error: 'Invalid queue name. Use only alphanumeric characters, hyphens, and underscores.',
      };
      return res.status(400).json(error);
    }

    // Parse timeout parameter
    const timeoutParam = req.query.timeout;
    let timeout = DEFAULT_TIMEOUT_MS;

    if (timeoutParam !== undefined) {
      timeout = parseInt(timeoutParam as string, 10);
      if (isNaN(timeout) || timeout < 0) {
        const error: ApiErrorResponse = {
          success: false,
          error: 'Invalid timeout parameter. Must be a non-negative integer.',
        };
        return res.status(400).json(error);
      }
    }

    console.log(`Waiting for message from queue "${queueName}" (timeout: ${timeout}ms)`);

    // Try to get a message with timeout
    const message = await popMessageWithTimeout(queueName, timeout);

    if (!message) {
      console.log(`No message available in queue "${queueName}" after ${timeout}ms`);
      return res.status(204).send();
    }

    const response: GetMessageResponse = {
      success: true,
      message,
    };

    console.log(`Message retrieved from queue "${queueName}": ${message.id}`);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error retrieving message from queue:', error);
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: 'Internal server error',
    };
    return res.status(500).json(errorResponse);
  }
});

export default router;

