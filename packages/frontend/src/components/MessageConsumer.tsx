import { useState } from 'react';
import toast from 'react-hot-toast';
import { QueueMessage, isValidQueueName, DEFAULT_TIMEOUT_MS } from '@message-queue/shared';
import { consumeMessage } from '../api';
import './MessageConsumer.css';

function MessageConsumer() {
  const [queueName, setQueueName] = useState('');
  const [timeout, setTimeout] = useState(DEFAULT_TIMEOUT_MS.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [lastMessage, setLastMessage] = useState<QueueMessage | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);

  const handleConsume = async () => {
    // Validate queue name
    if (!queueName.trim()) {
      toast.error('Please enter a queue name');
      return;
    }

    if (!isValidQueueName(queueName)) {
      toast.error('Queue name can only contain letters, numbers, hyphens, and underscores');
      return;
    }

    const timeoutMs = parseInt(timeout, 10);
    if (isNaN(timeoutMs) || timeoutMs < 0) {
      toast.error('Timeout must be a non-negative number');
      return;
    }

    setIsLoading(true);
    setIsEmpty(false);
    setLastMessage(null);

    try {
      const response = await consumeMessage(queueName, timeoutMs);

      if (response === null) {
        setIsEmpty(true);
        toast('Queue is empty', { icon: '📭' });
      } else if (response.message) {
        setLastMessage(response.message);
        toast.success('Message received!');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to consume message';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card consumer-card">
      <div className="card-header">
        <div className="card-icon consumer-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5M5 12l7 7 7-7" />
          </svg>
        </div>
        <div>
          <h2 className="card-title">Consumer</h2>
          <p className="card-subtitle">Retrieve messages from a queue</p>
        </div>
      </div>

      <div className="consumer-form">
        <div className="form-row">
          <div className="form-group flex-grow">
            <label htmlFor="consumerQueueName">Queue Name</label>
            <input
              type="text"
              id="consumerQueueName"
              value={queueName}
              onChange={(e) => setQueueName(e.target.value)}
              placeholder="my-queue"
              className="input mono"
              disabled={isLoading}
            />
          </div>
          <div className="form-group timeout-group">
            <label htmlFor="timeout">Timeout (ms)</label>
            <input
              type="number"
              id="timeout"
              value={timeout}
              onChange={(e) => setTimeout(e.target.value)}
              placeholder="10000"
              className="input mono"
              min="0"
              step="1000"
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleConsume}
          className="btn btn-secondary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner" />
              Waiting for message...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Consume Message
            </>
          )}
        </button>
      </div>

      {/* Result display */}
      <div className="result-container">
        {isLoading && (
          <div className="result-placeholder loading">
            <div className="loading-animation">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>Long-polling... waiting for message</p>
          </div>
        )}

        {!isLoading && isEmpty && (
          <div className="result-placeholder empty">
            <div className="empty-icon">📭</div>
            <p>Queue is empty</p>
            <span className="result-code">204 No Content</span>
          </div>
        )}

        {!isLoading && lastMessage && (
          <div className="result-message">
            <div className="result-header">
              <span className="result-badge">Message Received</span>
              <span className="result-id mono">{lastMessage.id}</span>
            </div>
            <div className="result-meta">
              <span>Queue: {lastMessage.queueName}</span>
              <span>•</span>
              <span>{new Date(lastMessage.timestamp).toLocaleTimeString()}</span>
            </div>
            <pre className="result-data mono">
              {JSON.stringify(lastMessage.data, null, 2)}
            </pre>
          </div>
        )}

        {!isLoading && !isEmpty && !lastMessage && (
          <div className="result-placeholder idle">
            <div className="idle-icon">◇</div>
            <p>Click "Consume Message" to fetch from the queue</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageConsumer;

