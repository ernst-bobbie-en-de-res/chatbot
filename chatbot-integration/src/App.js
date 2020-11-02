import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => window.addEventListener("message", handleIframeEvents, false), []);

  function handleIframeEvents(e) {
    console.log('new message');
    if (e.data === "close")
      setShowChatbot(false);
  };

  return (
    <div>
      {
        showChatbot
          ? <div className="iframe__wrapper">
            <iframe src="http://localhost:3001" title="Dorés" />
          </div>
          : <button className="chatbot__help" onClick={() => setShowChatbot(true)}>?</button>
      }
    </div>
  );
};