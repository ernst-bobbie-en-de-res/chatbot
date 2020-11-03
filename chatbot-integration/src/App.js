import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [showChatbot, setShowChatbot] = useState(false);
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