import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const Messages = props => {
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start"
    });
  }, [props.botMessages, props.userMessages]);

  var uCount = 0, bCount = 0;
  var length = props.botMessages.length + props.userMessages.length;
  var html = [];

  for (var i = 0; i < length; i++) {
    if (i % 2 === 0) {
      html.push(<div key={props.botMessages[bCount][0] + i + bCount} className="message bot"><p>{props.botMessages[bCount]}</p></div>);
      bCount++;
    } else {
      html.push(<div key={props.userMessages[uCount][0] + i + uCount} className="message user"><p>{props.userMessages[uCount]}</p></div>);
      uCount++;
    }
  }
  return <div className="messages">
    {html.map(x => { return x; })}
    <div ref={messagesEndRef} />
  </div>
}

export default function App() {
  const [botMessages, setBotMessages] = useState(['Stel uw vraag hieronder om te beginnen!']);
  const [userMessages, setUserMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  function submitForm(e) {
    e.preventDefault();

    if (currentMessage !== "" || currentMessage.match(/^ *$/) === null)
      setUserMessages([...userMessages, currentMessage]);
    else
      return;

    setCurrentMessage("");
    fetch('http://localhost:5000/api/v1/message?message=' + currentMessage, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => setBotMessages([...botMessages, data]))
      .catch(err => console.log(err));
  };

  return (
    <div className="chatbot">
      <div className="header">
        <h1>Dorés</h1>
      </div>
      <div className="chatbot__inner">
        <Messages
          botMessages={botMessages !== undefined ? botMessages : []}
          userMessages={userMessages !== undefined ? userMessages : []}
        />
      </div>
      <form onSubmit={e => submitForm(e)} style={{
        padding: "0 1.5rem",
        background: "white",
        display: "flex",
      }}>
        <input
          className="chat__input"
          type="text"
          placeholder="Ik wil graag meer weten over..."
          value={currentMessage}
          onChange={e => setCurrentMessage(e.target.value)}
        />
        <button type="submit" className="chat__submit">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>
    </div>
  );
};