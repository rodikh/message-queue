import { useState } from 'react';
import toast from 'react-hot-toast';
import { isValidJson, isValidQueueName } from '@message-queue/shared';
import { postMessage } from '../api';
import './MessageProducer.css';

function MessageProducer() {
  const [queueName, setQueueName] = useState('');
  const [jsonMessage, setJsonMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate queue name
    if (!queueName.trim()) {
      toast.error('Please enter a queue name');
      return;
    }

    if (!isValidQueueName(queueName)) {
      toast.error('Queue name can only contain letters, numbers, hyphens, and underscores');
      return;
    }

    // Validate JSON
    if (!jsonMessage.trim()) {
      toast.error('Please enter a JSON message');
      return;
    }

    if (!isValidJson(jsonMessage)) {
      toast.error('Invalid JSON format');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = JSON.parse(jsonMessage);
      await postMessage(queueName, data);
      
      toast.success(`Message sent to "${queueName}"`);
      setQueueName('');
      setJsonMessage('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send message';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatJson = () => {
    if (!jsonMessage.trim()) return;
    
    try {
      const parsed = JSON.parse(jsonMessage);
      setJsonMessage(JSON.stringify(parsed, null, 2));
    } catch {
      toast.error('Cannot format: Invalid JSON');
    }
  };

  return (
    <div className="card producer-card">
      <div className="card-header">
        <div className="card-icon producer-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7-7 7 7" />
          </svg>
        </div>
        <div>
          <h2 className="card-title">Producer</h2>
          <p className="card-subtitle">Add messages to a queue</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="producer-form">
        <div className="form-group">
          <label htmlFor="queueName">Queue Name</label>
          <input
            type="text"
            id="queueName"
            value={queueName}
            onChange={(e) => setQueueName(e.target.value)}
            placeholder="my-queue"
            className="input mono"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <div className="label-row">
            <label htmlFor="jsonMessage">JSON Message</label>
            <button
              type="button"
              onClick={formatJson}
              className="format-btn"
              disabled={isSubmitting}
            >
              Format
            </button>
          </div>
          <textarea
            id="jsonMessage"
            value={jsonMessage}
            onChange={(e) => setJsonMessage(e.target.value)}
            placeholder='{"key": "value", "count": 42}'
            className="textarea mono"
            rows={6}
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner" />
              Sending...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default MessageProducer;

