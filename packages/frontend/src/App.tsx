import { Toaster } from 'react-hot-toast';
import MessageProducer from './components/MessageProducer';
import MessageConsumer from './components/MessageConsumer';
import './App.css';

function App() {
  return (
    <div className="app">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a25',
            color: '#e8e8ed',
            border: '1px solid #2a2a3a',
            fontFamily: 'Outfit, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#00d4aa',
              secondary: '#1a1a25',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff6b6b',
              secondary: '#1a1a25',
            },
          },
        }}
      />
      
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">◈</span>
            <h1>Message Queue</h1>
          </div>
          <p className="tagline">Real-time message queueing with long-polling support</p>
        </div>
        <div className="header-glow" />
      </header>

      <main className="main">
        <div className="cards-container">
          <MessageProducer />
          <MessageConsumer />
        </div>
      </main>

      <footer className="footer">
        <p>Powered by Upstash Redis • Built with React & Express</p>
      </footer>
    </div>
  );
}

export default App;

